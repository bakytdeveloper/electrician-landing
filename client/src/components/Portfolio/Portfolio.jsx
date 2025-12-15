import React, { useState, useEffect } from 'react';
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

    const categories = [
        { id: 'all', label: 'Все работы', icon: <FaSearch /> },
        { id: 'apartments', label: 'Квартиры', icon: <MdApartment /> },
        { id: 'houses', label: 'Частные дома', icon: <FaHome /> },
        { id: 'offices', label: 'Офисы', icon: <FaBuilding /> },
        { id: 'industrial', label: 'Промышленные', icon: <FaIndustry /> },
        { id: 'commercial', label: 'Коммерческие', icon: <FaStore /> },
    ];

    const portfolioItems = [
        {
            id: 1,
            title: 'Полная замена проводки в квартире',
            description: 'Замена старой алюминиевой проводки на медную, установка современного электрощита с УЗО и автоматами.',
            category: 'apartments',
            images: ['/images/works/apartment-1.jpg', '/images/works/apartment-2.jpg'],
            features: ['Медная проводка', 'Электрощит Legrand', '35 розеток', 'Гарантия 5 лет'],
            date: '15.12.2023',
            area: '85 м²',
            duration: '3 дня'
        },
        {
            id: 2,
            title: 'Электрика в частном доме под ключ',
            description: 'Монтаж проводки с нуля в новом доме, установка уличного освещения и автоматических ворот.',
            category: 'houses',
            images: ['/images/works/house-1.jpg', '/images/works/house-2.jpg'],
            features: ['Наружное освещение', 'Автоматические ворота', 'Стабилизатор напряжения', 'Резервный генератор'],
            date: '05.11.2023',
            area: '150 м²',
            duration: '7 дней'
        },
        {
            id: 3,
            title: 'Модернизация офисного электрощита',
            description: 'Замена устаревшего электрощита на современный с разделением по группам и установкой УЗИП.',
            category: 'offices',
            images: ['/images/works/office-1.jpg', '/images/works/office-2.jpg'],
            features: ['Щиток ABB', 'УЗИП', 'Групповые автоматы', 'Мониторинг энергопотребления'],
            date: '22.10.2023',
            area: '120 м²',
            duration: '2 дня'
        },
        {
            id: 4,
            title: 'Промышленная электропроводка в цеху',
            description: 'Прокладка силовых кабелей, установка промышленных розеток и организация освещения.',
            category: 'industrial',
            images: ['/images/works/industrial-1.jpg', '/images/works/industrial-2.jpg'],
            features: ['Силовые кабели', 'Промышленные розетки', 'LED освещение', 'Защита от пыли и влаги'],
            date: '10.09.2023',
            area: '500 м²',
            duration: '14 дней'
        },
        // {
        //     id: 5,
        //     title: 'Электрика в торговом центре',
        //     description: 'Монтаж освещения витрин, установка розеток для торгового оборудования и система резервного питания.',
        //     category: 'commercial',
        //     images: ['/images/works/commercial-1.jpg', '/images/works/commercial-2.jpg'],
        //     features: ['Освещение витрин', 'Резервное питание', 'Система управления', 'Энергосберегающие технологии'],
        //     date: '28.08.2023',
        //     area: '300 м²',
        //     duration: '10 дней'
        // },
        // {
        //     id: 6,
        //     title: 'Умный дом в квартире',
        //     description: 'Интеграция системы умного дома с управлением через смартфон, установка сенсорных выключателей.',
        //     category: 'apartments',
        //     images: ['/images/works/smart-1.jpg', '/images/works/smart-2.jpg'],
        //     features: ['Управление со смартфона', 'Сенсорные выключатели', 'Сценарии освещения', 'Голосовое управление'],
        //     date: '15.07.2023',
        //     area: '65 м²',
        //     duration: '4 дня'
        // },
        {
            id: 5,
            title: 'Ремонт электрощита после замыкания',
            description: 'Аварийный ремонт электрощита с полной заменой поврежденных автоматов и восстановлением питания.',
            category: 'houses',
            images: ['/images/works/repair-1.jpg', '/images/works/repair-2.jpg'],
            features: ['Аварийный выезд', 'Замена автоматов', 'Диагностика сети', 'Профилактические работы'],
            date: '03.06.2023',
            area: '90 м²',
            duration: '5 часов'
        },
        {
            id: 6,
            title: 'Освещение в ресторане',
            description: 'Проектирование и монтаж декоративного освещения с зонированием и диммированием.',
            category: 'commercial',
            images: ['/images/works/restaurant-1.jpg', '/images/works/restaurant-2.jpg'],
            features: ['Декоративное освещение', 'Диммирование', 'Зонирование света', 'Энергоэффективность'],
            date: '20.05.2023',
            area: '200 м²',
            duration: '8 дней'
        },
    ];

    const filteredItems = activeFilter === 'all'
        ? portfolioItems
        : portfolioItems.filter(item => item.category === activeFilter);

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

    const stats = [
        { number: '250+', label: 'Выполненных проектов' },
        { number: '98%', label: 'Довольных клиентов' },
        { number: '5 лет', label: 'Максимальная гарантия' },
        { number: '24/7', label: 'Аварийный выезд' },
    ];

    return (
        <section id="portfolio" className="portfolio">
            <div className="container">
                {/* Заголовок секции */}
                <div className="section-header">
                    <h2 className="section-title">Наши работы</h2>
                    <p className="section-subtitle">
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
                            </button>
                        ))}
                    </div>
                </div>

                {/* Счетчики статистики */}
                <div className="portfolio-stats">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <div className="stat-number">{stat.number}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Галерея */}
                <div className="portfolio-grid">
                    {filteredItems.map((item, index) => (
                        <div
                            key={item.id}
                            className="portfolio-item"
                            onClick={() => openModal(item, 0)}
                        >
                            <div className="portfolio-image-container">
                                {/* Заглушка для изображения - в реальном проекте используйте реальные изображения */}
                                <div className="portfolio-image-placeholder">
                                    <div className="image-number">{index + 1}</div>
                                    <div className="image-category">{item.category}</div>
                                </div>
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
                                        {/* Заглушка для изображения */}
                                        <div className="modal-image-placeholder">
                                            <div className="placeholder-text">
                                                {isZoomed ? 'Изображение увеличено' : 'Нажмите для увеличения'}
                                            </div>
                                            <div className="image-counter">
                                                {currentIndex + 1} / {selectedImage.images.length}
                                            </div>
                                        </div>

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
                                                    <div className="thumbnail-number">{index + 1}</div>
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
                                        document.querySelector('.contact')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    Заказать подобный проект
                                </button>
                            </div>
                        </div>

                        <div className="modal-overlay" onClick={closeModal} />
                    </div>
                )}

                {/* Призыв к действию */}
                <div className="portfolio-cta">
                    <div className="cta-content">
                        <h3>Хотите такой же результат?</h3>
                        <p>Оставьте заявку и получите бесплатную смету на ваш проект</p>
                    </div>
                    <div className="cta-buttons">
                        <button
                            className="cta-btn primary"
                            onClick={() => document.querySelector('.contact')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Получить смету
                        </button>
                        <a href="tel:+79991234567" className="cta-btn secondary">
                            Обсудить по телефону
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Portfolio;