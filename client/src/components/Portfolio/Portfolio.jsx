import React, { useState, useEffect, useRef } from 'react';
import {
    FaSearch,
    FaExpand,
    FaTimes,
    FaArrowLeft,
    FaArrowRight,
    FaHome,
    FaBuilding,
    FaIndustry,
    FaStore
} from 'react-icons/fa';
import { MdApartment, MdZoomIn, MdZoomOut } from 'react-icons/md';
import './Portfolio.css';

// Маппинг иконок для популярных категорий (опционально)
const iconMap = {
    'Квартиры': MdApartment,
    'Частные дома': FaHome,
    'Офисы': FaBuilding,
    'Промышленные': FaIndustry,
    'Коммерческие': FaStore
};

const Portfolio = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [imageErrors, setImageErrors] = useState({});
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Состояния для перетаскивания увеличенного изображения
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

    const sliderRef = useRef(null);
    const dragImageRef = useRef(null);
    const containerRef = useRef(null);
    const wheelHandlerRef = useRef(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/portfolio/content`);
            const data = await response.json();
            setContent(data);
        } catch (error) {
            console.error('Error fetching portfolio content:', error);
        } finally {
            setLoading(false);
        }
    };

    // Получаем уникальные категории из элементов
    const getUniqueCategories = () => {
        if (!content?.items) return [];
        const categories = content.items
            .map(item => item.category)
            .filter(category => category && category.trim() !== '')
            .filter((value, index, self) => self.indexOf(value) === index);
        return categories.sort((a, b) => a.localeCompare(b, 'ru'));
    };

    // Получаем отфильтрованные элементы
    const getFilteredItems = () => {
        if (!content?.items) return [];
        return activeFilter === 'all'
            ? content.items.filter(item => item.active !== false)
            : content.items.filter(item => item.category === activeFilter && item.active !== false);
    };

    // Получаем количество элементов в категории
    const getCategoryCount = (category) => {
        if (!content?.items) return 0;
        if (category === 'all') return content.items.filter(item => item.active !== false).length;
        return content.items.filter(item => item.category === category && item.active !== false).length;
    };

    // Проверка возможности прокрутки
    const checkScroll = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const slider = sliderRef.current;
        if (slider) {
            checkScroll();
            slider.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);

            return () => {
                slider.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            };
        }
    }, [content]);

    // Сброс позиции скролла при смене фильтра
    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.scrollLeft = 0;
        }
    }, [activeFilter]);

    // Обновление размеров при изменении изображения или зуме
    useEffect(() => {
        if (isModalOpen && dragImageRef.current && containerRef.current) {
            updateDimensions();
        }
    }, [isModalOpen, currentIndex, isZoomed]);

    // Добавляем и удаляем обработчик колесика
    useEffect(() => {
        if (isModalOpen && isZoomed && containerRef.current) {
            const container = containerRef.current;

            // Создаем обработчик с опцией { passive: false }
            const wheelHandler = (e) => {
                e.preventDefault();

                // Изменяем позицию изображения при скролле
                const deltaX = e.deltaX * 0.5;
                const deltaY = e.deltaY * 0.5;

                setImagePosition(prev => {
                    const scale = 1.5; // Масштаб при зуме
                    const maxX = Math.max(0, (imageDimensions.width * scale - containerDimensions.width) / 2);
                    const maxY = Math.max(0, (imageDimensions.height * scale - containerDimensions.height) / 2);

                    const newX = Math.min(maxX, Math.max(-maxX, prev.x - deltaX));
                    const newY = Math.min(maxY, Math.max(-maxY, prev.y - deltaY));

                    return { x: newX, y: newY };
                });
            };

            // Сохраняем обработчик в ref для последующего удаления
            wheelHandlerRef.current = wheelHandler;

            // Добавляем обработчик с опцией { passive: false }
            container.addEventListener('wheel', wheelHandler, { passive: false });

            return () => {
                if (container && wheelHandlerRef.current) {
                    container.removeEventListener('wheel', wheelHandlerRef.current);
                }
            };
        }
    }, [isModalOpen, isZoomed, containerDimensions, imageDimensions]);

    const updateDimensions = () => {
        if (dragImageRef.current && containerRef.current) {
            const img = dragImageRef.current;
            const container = containerRef.current;

            setImageDimensions({
                width: img.naturalWidth,
                height: img.naturalHeight
            });

            setContainerDimensions({
                width: container.clientWidth,
                height: container.clientHeight
            });

            // Сброс позиции при смене изображения или выходе из зума
            setImagePosition({ x: 0, y: 0 });
        }
    };

    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = 400;
            const newScrollLeft = sliderRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            sliderRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const swipeDistance = touchEndX.current - touchStartX.current;
        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) {
                scroll('left');
            } else {
                scroll('right');
            }
        }
    };

    const handleImageError = (itemId, imgIndex) => {
        setImageErrors(prev => ({
            ...prev,
            [`${itemId}-${imgIndex}`]: true
        }));
    };

    const getAltText = (item, index) => {
        if (item.images && item.images[index] && item.images[index].altText) {
            return item.images[index].altText;
        }
        return `${item.title} - фото ${index + 1}`;
    };

    const openModal = (item, index) => {
        setSelectedImage(item);
        setCurrentIndex(index);
        setIsModalOpen(true);
        setIsZoomed(false);
        setImagePosition({ x: 0, y: 0 });
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
        setIsZoomed(false);
        setImagePosition({ x: 0, y: 0 });
        document.body.style.overflow = 'auto';
    };

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
        setImagePosition({ x: 0, y: 0 }); // Сброс позиции при переключении зума
    };

    const nextImage = () => {
        if (selectedImage && currentIndex < selectedImage.images.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsZoomed(false);
            setImagePosition({ x: 0, y: 0 });
        }
    };

    const prevImage = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsZoomed(false);
            setImagePosition({ x: 0, y: 0 });
        }
    };

    // Обработчики для перетаскивания увеличенного изображения
    const handleMouseDown = (e) => {
        if (!isZoomed) return;

        e.preventDefault();
        setIsDragging(true);
        setDragStart({
            x: e.clientX - imagePosition.x,
            y: e.clientY - imagePosition.y
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !isZoomed) return;

        e.preventDefault();

        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // Ограничиваем перемещение, чтобы изображение не уходило за пределы контейнера
        const scale = 1.5; // Масштаб при зуме
        const maxX = Math.max(0, (imageDimensions.width * scale - containerDimensions.width) / 2);
        const maxY = Math.max(0, (imageDimensions.height * scale - containerDimensions.height) / 2);

        const boundedX = Math.min(maxX, Math.max(-maxX, newX));
        const boundedY = Math.min(maxY, Math.max(-maxY, newY));

        setImagePosition({ x: boundedX, y: boundedY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleKeyDown = (e) => {
        if (!isModalOpen) return;

        switch(e.key) {
            case 'Escape':
                if (isZoomed) {
                    setIsZoomed(false);
                    setImagePosition({ x: 0, y: 0 });
                } else {
                    closeModal();
                }
                break;
            case 'ArrowLeft':
                if (!isZoomed) prevImage();
                break;
            case 'ArrowRight':
                if (!isZoomed) nextImage();
                break;
            case '+':
            case '=':
                e.preventDefault();
                if (!isZoomed) toggleZoom();
                break;
            case '-':
                e.preventDefault();
                if (isZoomed) toggleZoom();
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isModalOpen, currentIndex, isZoomed, selectedImage]);

    if (loading) {
        return <div className="portfolio-loading">Загрузка...</div>;
    }

    if (!content) {
        return null;
    }

    const categories = getUniqueCategories();
    const filteredItems = getFilteredItems();

    return (
        <section id="portfolio" className="portfolio">
            <div className="container">
                {/* Заголовок секции */}
                <div className="profile-section-header">
                    <h2 className="profile-section-title">{content.sectionTitle}</h2>
                    <p className="profile-section-subtitle">{content.sectionSubtitle}</p>
                </div>

                {/* Фильтры - используем категории из элементов */}
                {categories.length > 0 && (
                    <div className="portfolio-filters">
                        <div className="filter-buttons">
                            <button
                                key="all"
                                className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveFilter('all')}
                            >
                                <span className="filter-icon"><FaSearch /></span>
                                <span className="filter-label">Все работы</span>
                                <span className="filter-count">{getCategoryCount('all')}</span>
                            </button>
                            {categories.map(category => {
                                const IconComponent = iconMap[category] || FaSearch;
                                return (
                                    <button
                                        key={category}
                                        className={`filter-button ${activeFilter === category ? 'active' : ''}`}
                                        onClick={() => setActiveFilter(category)}
                                    >
                                        <span className="filter-icon"><IconComponent /></span>
                                        <span className="filter-label">{category}</span>
                                        <span className="filter-count">{getCategoryCount(category)}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Слайдер */}
                <div className="portfolio-slider-container">
                    {canScrollLeft && (
                        <button
                            className="slider-nav-button prev"
                            onClick={() => scroll('left')}
                            aria-label="Прокрутить портфолио влево"
                        >
                            <FaArrowLeft />
                        </button>
                    )}

                    {canScrollRight && (
                        <button
                            className="slider-nav-button next"
                            onClick={() => scroll('right')}
                            aria-label="Прокрутить портфолио вправо"
                        >
                            <FaArrowRight />
                        </button>
                    )}

                    <div
                        className="portfolio-slider"
                        ref={sliderRef}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {filteredItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="portfolio-item"
                                onClick={() => openModal(item, 0)}
                            >
                                <div className="portfolio-image-container">
                                    {item.images && item.images[0] && !imageErrors[`${item.id}-0`] ? (
                                        <div className="portfolio-image-wrapper">
                                            <img
                                                src={item.images[0].url}
                                                alt={getAltText(item, 0)}
                                                className="portfolio-image"
                                                onError={() => handleImageError(item.id, 0)}
                                                loading="lazy"
                                            />
                                        </div>
                                    ) : (
                                        <div className="portfolio-image-placeholder">
                                            <div className="image-number">{index + 1}</div>
                                            <div className="image-category">{item.category}</div>
                                        </div>
                                    )}
                                    <div className="portfolio-overlay">
                                        <button className="view-button">
                                            <FaExpand />
                                            Посмотреть
                                        </button>
                                    </div>
                                    <div className="portfolio-badge">
                                        {item.images?.length || 0} фото
                                    </div>
                                </div>

                                <div className="portfolio-content">
                                    <h3 className="portfolio-title">{item.title}</h3>
                                    <p className="portfolio-description">{item.description}</p>

                                    <div className="portfolio-features">
                                        <span className="feature-tag">
                                            Выполнено работ: {item.features?.length || 0}
                                        </span>
                                    </div>

                                    <div className="portfolio-meta">
                                        <div className="meta-item">
                                            <span className="meta-label">Площадь:</span>
                                            <span className="meta-value">{item.area}м²</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Срок:</span>
                                            <span className="meta-value">{item.duration}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Дата:</span>
                                            <span className="meta-value">{item.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Индикатор количества карточек */}
                <div className="slider-info">
                    Показано: {filteredItems.length} {filteredItems.length === 1 ? 'работа' :
                    filteredItems.length >= 2 && filteredItems.length <= 4 ? 'работы' : 'работ'}
                </div>
            </div>

            {/* Модальное окно для просмотра */}
            {isModalOpen && selectedImage && (
                <div className="portfolio-modal">
                    <div className={`modal-content ${isZoomed ? 'zoomed' : ''}`}>
                        <button className="modal-close" onClick={closeModal}>
                            <FaTimes />
                        </button>

                        <div className="modal-header">
                            <h3 className="modal-title">{selectedImage.title}</h3>
                            <p className="modal-subtitle">{selectedImage.description}</p>
                        </div>

                        <div className="modal-main">
                            <div className="image-viewer">
                                {!isZoomed && (
                                    <>
                                        <button
                                            className="nav-button prev-button"
                                            onClick={prevImage}
                                            disabled={currentIndex === 0}
                                            aria-label="Прокрутить портфолио влево"
                                        >
                                            <FaArrowLeft />
                                        </button>
                                        <button
                                            className="nav-button next-button"
                                            onClick={nextImage}
                                            aria-label="Прокрутить портфолио вправо"
                                            disabled={!selectedImage.images || currentIndex === selectedImage.images.length - 1}
                                        >
                                            <FaArrowRight />
                                        </button>
                                    </>
                                )}

                                <div
                                    ref={containerRef}
                                    className={`modal-image-container ${isZoomed ? 'zoomed' : ''}`}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={() => {
                                        // Если изображение увеличено, клик по нему уменьшает его
                                        if (isZoomed) {
                                            toggleZoom();
                                        }
                                    }}
                                    style={{ cursor: isZoomed ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
                                >
                                    {selectedImage.images &&
                                    selectedImage.images[currentIndex] &&
                                    !imageErrors[`${selectedImage.id}-${currentIndex}`] ? (
                                        <img
                                            ref={dragImageRef}
                                            src={selectedImage.images[currentIndex].url}
                                            alt={getAltText(selectedImage, currentIndex)}
                                            className="modal-main-image"
                                            style={{
                                                transform: isZoomed ? `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(1.5)` : 'none',
                                                transition: isDragging ? 'none' : 'transform 0.3s ease'
                                            }}
                                            onError={() => handleImageError(selectedImage.id, currentIndex)}
                                            onLoad={updateDimensions}
                                            draggable={false}
                                        />
                                    ) : (
                                        <div className="modal-image-placeholder">
                                            <div className="placeholder-text">
                                                {isZoomed ? 'Кликните для уменьшения' : 'Нажмите для увеличения'}
                                            </div>
                                            <div className="image-counter">
                                                {currentIndex + 1} / {selectedImage.images?.length || 0}
                                            </div>
                                        </div>
                                    )}

                                    {!isZoomed && (
                                        <button className="zoom-button" onClick={(e) => {
                                            e.stopPropagation(); // Предотвращаем всплытие события
                                            toggleZoom();
                                        }}>
                                            <MdZoomIn />
                                        </button>
                                    )}

                                    {isZoomed && (
                                        <button className="zoom-button" onClick={(e) => {
                                            e.stopPropagation(); // Предотвращаем всплытие события
                                            toggleZoom();
                                        }}>
                                            <MdZoomOut />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {!isZoomed && (
                                <div className="modal-sidebar">
                                    <div className="project-details">
                                        <h4>Детали проекта</h4>

                                        <div className="detail-item">
                                            <span className="detail-label">Категория:</span>
                                            <span className="detail-value">{selectedImage.category}</span>
                                        </div>

                                        <div className="detail-item">
                                            <span className="detail-label">Площадь:</span>
                                            <span className="detail-value">{selectedImage.area}м²</span>
                                        </div>

                                        <div className="detail-item">
                                            <span className="detail-label">Срок выполнения:</span>
                                            <span className="detail-value">{selectedImage.duration}</span>
                                        </div>

                                        <div className="detail-item">
                                            <span className="detail-label">Дата выполнения:</span>
                                            <span className="detail-value">{selectedImage.date}</span>
                                        </div>
                                    </div>

                                    <div className="project-features">
                                        <h4>Выполненные работы</h4>
                                        <ul className="features-list">
                                            {selectedImage.features?.map((feature, index) => (
                                                <li key={index} className="feature-item">
                                                    <span className="feature-check">✓</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="image-thumbnails">
                                        <h4>Все фото проекта</h4>
                                        <div className="thumbnails-grid">
                                            {selectedImage.images?.map((img, index) => (
                                                <button
                                                    key={index}
                                                    className={`thumbnail ${currentIndex === index ? 'active' : ''}`}
                                                    onClick={() => setCurrentIndex(index)}
                                                >
                                                    {img && !imageErrors[`${selectedImage.id}-${index}`] ? (
                                                        <img
                                                            src={img.url}
                                                            alt={img.altText || `Фото ${index + 1}`}
                                                            className="thumbnail-image"
                                                            onError={() => handleImageError(selectedImage.id, index)}
                                                        />
                                                    ) : (
                                                        <div className="thumbnail-number">{index + 1}</div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {!isZoomed && (
                            <div className="modal-footer">
                                <button className="modal-action-btn" onClick={closeModal}>
                                    Закрыть
                                </button>
                                <button
                                    className="modal-action-btn primary"
                                    onClick={() => {
                                        closeModal();
                                        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    Заказать подобный проект
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="modal-overlay" onClick={closeModal} />
                </div>
            )}
        </section>
    );
};

export default Portfolio;