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
import { MdApartment, MdZoomIn } from 'react-icons/md';
import './Portfolio.css';

const Portfolio = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);
    const [imageErrors, setImageErrors] = useState({});
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const sliderRef = useRef(null);

    const categories = [
        { id: 'all', label: 'Все работы', icon: <FaSearch /> },
        { id: 'apartments', label: 'Квартиры', icon: <MdApartment /> },
        { id: 'houses', label: 'Частные дома', icon: <FaHome /> },
        { id: 'offices', label: 'Офисы', icon: <FaBuilding /> },
        { id: 'industrial', label: 'Промышленные', icon: <FaIndustry /> },
        { id: 'commercial', label: 'Коммерческие', icon: <FaStore /> },
    ];

    // Примеры изображений
    const portfolioItems = [
        {
            id: 1,
            title: 'Полная замена проводки в квартире',
            description: 'Замена старой алюминиевой проводки на медную, установка современного электрощита с УЗО и автоматами.',
            category: 'apartments',
            images: [
                'https://avatars.mds.yandex.net/i?id=3a3970ebdae3a325bdae846745b94986_l-5236752-images-thumbs&ref=rim&n=13&w=732&h=429',
                'https://decorexpro.com/images/article/orig/2018/05/otoplenie-doma-ekonomnye-sposoby-i-varianty-23.jpg',
                'https://avatars.mds.yandex.net/i?id=ee7c85c3cae7c822c7ce7c4edd74116f_l-9211697-images-thumbs&ref=rim&n=13&w=644&h=429',
            ],
            features: ['Медная проводка', 'Электрощит Legrand', '35 розеток', 'Гарантия 5 лет'],
            date: '15.12.2023',
            area: '85 м²',
            duration: '3 дня',
            altTexts: ['Монтаж проводки в квартире', 'Установленный электрощит']
        },
        {
            id: 2,
            title: 'Электрика в частном доме под ключ',
            description: 'Монтаж проводки с нуля в новом доме, установка уличного освещения и автоматических ворот.',
            category: 'houses',
            images: [
                'https://avatars.mds.yandex.net/get-ydo/4421910/2a0000018d79328effbd0bf54054d36f6154/diploma',
                'https://avatars.mds.yandex.net/i?id=30a4073eca9c7f207b7d54b12b3b62e6_l-4827941-images-thumbs&n=13',
                'https://i.ytimg.com/vi/K9oAuS0ZSrM/maxresdefault.jpg',
                'https://bigfoto.name/photo/uploads/posts/2023-03/1678279224_bigfoto-name-p-zamena-elektroprovodki-71.jpg',
            ],
            features: ['Наружное освещение', 'Автоматические ворота', 'Стабилизатор напряжения', 'Резервный генератор'],
            date: '05.11.2023',
            area: '150 м²',
            duration: '7 дней',
            altTexts: ['Электрика в частном доме', 'Уличное освещение']
        },
        {
            id: 3,
            title: 'Модернизация офисного электрощита',
            description: 'Замена устаревшего электрощита на современный с разделением по группам и установкой УЗИП.',
            category: 'offices',
            images: [
                'https://img.freepik.com/free-photo/male-electrician-working-electrical-panel-male-electrician-overalls_169016-67274.jpg?t=st=1765813868~exp=1765817468~hmac=ca024d8f86938c3abbb4aaa2197a190ac2f3ec2bf9ed0d4be754c9c4e7faeedc&w=2000',
                'https://img.freepik.com/free-photo/male-electrician-working-electrical-panel-male-electrician-overalls_169016-67433.jpg?t=st=1765813920~exp=1765817520~hmac=bd0c0026454fb0fc98cba1113468fe5a7abec82449c92af4312757f7cdd0a709&w=1480'
            ],
            features: ['Щиток ABB', 'УЗИП', 'Групповые автоматы', 'Мониторинг энергопотребления'],
            date: '22.10.2023',
            area: '120 м²',
            duration: '2 дня',
            altTexts: ['Офисный электрощит', 'Монтажные работы']
        },
        {
            id: 4,
            title: 'Промышленная электропроводка в цеху',
            description: 'Прокладка силовых кабелей, установка промышленных розеток и организация освещения.',
            category: 'industrial',
            images: [
                'https://img.freepik.com/premium-photo/electrical-engineers-check-electrical-control-devices-with-multimeter_539854-551.jpg?w=1480'
            ],
            features: ['Силовые кабели', 'Промышленные розетки', 'LED освещение', 'Защита от пыли и влаги'],
            date: '10.09.2023',
            area: '500 м²',
            duration: '14 дней',
            altTexts: ['Промышленная проводка', 'Цеховое освещение']
        },
        {
            id: 5,
            title: 'Ремонт электрощита после замыкания',
            description: 'Аварийный ремонт электрощита с полной заменой поврежденных автоматов и восстановлением питания.',
            category: 'houses',
            images: [
                'https://avatars.mds.yandex.net/i?id=7da152d96abd0a9875600e87168e0179_l-4079990-images-thumbs&n=13',
                'https://avatars.mds.yandex.net/i?id=74a99342a7ac057dcd09b4f27ad2c271_l-10414886-images-thumbs&ref=rim&n=13&w=644&h=429'
            ],
            features: ['Аварийный выезд', 'Замена автоматов', 'Диагностика сети', 'Профилактические работы'],
            date: '03.06.2023',
            area: '90 м²',
            duration: '5 часов',
            altTexts: ['Ремонт электрощита', 'Диагностика электрики']
        },
        {
            id: 6,
            title: 'Освещение в ресторане',
            description: 'Проектирование и монтаж декоративного освещения с зонированием и диммированием.',
            category: 'commercial',
            images: [
                'https://img.freepik.com/premium-photo/full-length-portrait-electrician-stepladder-installs-lighting-ceiling-office_493343-27764.jpg?w=1480',
                'https://img.freepik.com/premium-photo/beautiful-ceiling-with-led-lighting-flat-round_152904-49666.jpg?w=1480'
            ],
            features: ['Декоративное освещение', 'Диммирование', 'Зонирование света', 'Энергоэффективность'],
            date: '20.05.2023',
            area: '200 м²',
            duration: '8 дней',
            altTexts: ['Освещение ресторана', 'Декоративный свет']
        },
    ];

    // Получаем количество элементов в каждой категории
    const getCategoryCount = (categoryId) => {
        if (categoryId === 'all') return portfolioItems.length;
        return portfolioItems.filter(item => item.category === categoryId).length;
    };

    const filteredItems = activeFilter === 'all'
        ? portfolioItems
        : portfolioItems.filter(item => item.category === activeFilter);

    // Проверка возможности прокрутки
    const checkScroll = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px допуска
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
    }, [filteredItems]);

    // Сброс позиции скролла при смене фильтра
    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.scrollLeft = 0;
        }
    }, [activeFilter]);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = 400; // Ширина карточки + отступ
            const newScrollLeft = sliderRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            sliderRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    // Обработка касаний для мобильных устройств
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
        if (Math.abs(swipeDistance) > 50) { // Минимальное расстояние для свайпа
            if (swipeDistance > 0) {
                scroll('left');
            } else {
                scroll('right');
            }
        }
    };

    const handleImageError = (itemId, imgIndex, event) => {
        event.target.style.display = 'none';
        setImageErrors(prev => ({
            ...prev,
            [`${itemId}-${imgIndex}`]: true
        }));
    };

    const getAltText = (item, index) => {
        if (item.altTexts && item.altTexts[index]) {
            return item.altTexts[index];
        }
        return `${item.title} - фото ${index + 1}`;
    };

    const hasImageError = (itemId, imgIndex) => {
        return imageErrors[`${itemId}-${imgIndex}`] === true;
    };

    const ImageWithFallback = ({ src, alt, className, itemId, imgIndex }) => {
        const [isLoading, setIsLoading] = useState(true);
        const [hasError, setHasError] = useState(false);

        useEffect(() => {
            const img = new Image();
            img.onload = () => setIsLoading(false);
            img.onerror = () => {
                setIsLoading(false);
                setHasError(true);
                setImageErrors(prev => ({
                    ...prev,
                    [`${itemId}-${imgIndex}`]: true
                }));
            };
            img.src = src;
        }, [src, itemId, imgIndex]);

        if (isLoading) {
            return (
                <div className={`${className} image-loading`}>
                    <div className="loading-spinner"></div>
                </div>
            );
        }

        if (hasError || hasImageError(itemId, imgIndex)) {
            return (
                <div className={`${className} image-error`}>
                    <div className="error-placeholder">
                        <span>Изображение не загружено</span>
                    </div>
                </div>
            );
        }

        return (
            <img
                src={src}
                alt={alt}
                className={className}
                onError={(e) => handleImageError(itemId, imgIndex, e)}
            />
        );
    };

    const openModal = (item, index) => {
        setSelectedImage(item);
        setCurrentIndex(index);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
        setIsZoomed(false);
        document.body.style.overflow = 'auto';
    };

    const nextImage = () => {
        if (selectedImage && currentIndex < selectedImage.images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevImage = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleKeyDown = (e) => {
        if (!isModalOpen) return;

        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
            case ' ':
                setIsZoomed(!isZoomed);
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
    }, [isModalOpen, currentIndex, isZoomed]);

    return (
        <section id="portfolio" className="portfolio">
            <div className="container">
                {/* Заголовок секции */}
                {/*  <div className="services-section-header">
                    <h2 className="services-section-title">{content.sectionTitle}</h2>
                    <p className="services-section-subtitle">{content.sectionSubtitle}</p>
                </div>
*/}
                <div className="profile-section-header">
                    <h2 className="profile-section-title">Наши работы</h2>
                    <p className="profile-section-subtitle">
                        Посмотрите примеры наших работ. Каждый проект - это индивидуальный подход и гарантия качества.
                    </p>
                </div>

                {/* Фильтры */}
                <div className="portfolio-filters">
                    <div className="filter-buttons">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`filter-button ${activeFilter === category.id ? 'active' : ''}`}
                                onClick={() => setActiveFilter(category.id)}
                            >
                                <span className="filter-icon">{category.icon}</span>
                                <span className="filter-label">{category.label}</span>
                                <span className="filter-count">{getCategoryCount(category.id)}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Слайдер */}
                <div className="portfolio-slider-container">
                    {/* Кнопки навигации для десктопа */}
                    {canScrollLeft && (
                        <button
                            className="slider-nav-button prev"
                            onClick={() => scroll('left')}
                            aria-label="Предыдущие работы"
                        >
                            <FaArrowLeft />
                        </button>
                    )}

                    {canScrollRight && (
                        <button
                            className="slider-nav-button next"
                            onClick={() => scroll('right')}
                            aria-label="Следующие работы"
                        >
                            <FaArrowRight />
                        </button>
                    )}

                    {/* Горизонтальный скролл контейнер */}
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
                                    {item.images[0] && !hasImageError(item.id, 0) ? (
                                        <div className="portfolio-image-wrapper">
                                            <ImageWithFallback
                                                src={item.images[0]}
                                                alt={getAltText(item, 0)}
                                                className="portfolio-image"
                                                itemId={item.id}
                                                imgIndex={0}
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
                                        {item.images.length} фото
                                    </div>
                                </div>

                                <div className="portfolio-content">
                                    <h3 className="portfolio-title">{item.title}</h3>
                                    <p className="portfolio-description">{item.description}</p>

                                    <div className="portfolio-features">
                                        {item.features.slice(0, 2).map((feature, idx) => (
                                            <span key={idx} className="feature-tag">{feature}</span>
                                        ))}
                                        {item.features.length > 2 && (
                                            <span className="feature-tag more">+{item.features.length - 2} еще</span>
                                        )}
                                    </div>

                                    <div className="portfolio-meta">
                                        <div className="meta-item">
                                            <span className="meta-label">Площадь:</span>
                                            <span className="meta-value">{item.area}</span>
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
                                <button
                                    className="nav-button prev-button"
                                    onClick={prevImage}
                                    disabled={currentIndex === 0}
                                >
                                    <FaArrowLeft />
                                </button>

                                <div
                                    className={`modal-image-container ${isZoomed ? 'zoomed' : ''}`}
                                    onClick={() => setIsZoomed(!isZoomed)}
                                >
                                    {selectedImage.images[currentIndex] &&
                                    !hasImageError(selectedImage.id, currentIndex) ? (
                                        <img
                                            src={selectedImage.images[currentIndex]}
                                            alt={getAltText(selectedImage, currentIndex)}
                                            className="modal-main-image"
                                            onError={(e) => handleImageError(selectedImage.id, currentIndex, e)}
                                        />
                                    ) : (
                                        <div className="modal-image-placeholder">
                                            <div className="placeholder-text">
                                                {isZoomed ? 'Изображение увеличено' : 'Нажмите для увеличения'}
                                            </div>
                                            <div className="image-counter">
                                                {currentIndex + 1} / {selectedImage.images.length}
                                            </div>
                                        </div>
                                    )}

                                    <button className="zoom-button">
                                        <MdZoomIn />
                                    </button>
                                </div>

                                <button
                                    className="nav-button next-button"
                                    onClick={nextImage}
                                    disabled={currentIndex === selectedImage.images.length - 1}
                                >
                                    <FaArrowRight />
                                </button>
                            </div>

                            <div className="modal-sidebar">
                                <div className="project-details">
                                    <h4>Детали проекта</h4>

                                    <div className="detail-item">
                                        <span className="detail-label">Категория:</span>
                                        <span className="detail-value">
                                            {categories.find(c => c.id === selectedImage.category)?.label}
                                        </span>
                                    </div>

                                    <div className="detail-item">
                                        <span className="detail-label">Площадь:</span>
                                        <span className="detail-value">{selectedImage.area}</span>
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
                                        {selectedImage.features.map((feature, index) => (
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
                                        {selectedImage.images.map((img, index) => (
                                            <button
                                                key={index}
                                                className={`thumbnail ${currentIndex === index ? 'active' : ''}`}
                                                onClick={() => setCurrentIndex(index)}
                                            >
                                                {img && !hasImageError(selectedImage.id, index) ? (
                                                    <img
                                                        src={img}
                                                        alt={getAltText(selectedImage, index)}
                                                        className="thumbnail-image"
                                                        onError={(e) => handleImageError(selectedImage.id, index, e)}
                                                    />
                                                ) : (
                                                    <div className="thumbnail-number">{index + 1}</div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

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
                    </div>

                    <div className="modal-overlay" onClick={closeModal} />
                </div>
            )}
        </section>
    );
};

export default Portfolio;