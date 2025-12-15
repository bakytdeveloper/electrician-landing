import React, { useState } from 'react';
import {
    FaTools,
    FaBolt,
    FaHome,
    FaWrench,
    FaShieldAlt,
    FaCheckCircle,
    FaClock,
    FaTruck,
    FaArrowRight
} from 'react-icons/fa';
import {
    MdOutlineElectricalServices,
    MdSecurity,
    MdHomeRepairService,
    MdOutlinePrecisionManufacturing
} from 'react-icons/md';
import './Services.css';
import Button from '../common/Button/Button';

const Services = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeService, setActiveService] = useState(null);

    const categories = [
        { id: 'installation', label: 'Монтаж' },
        { id: 'maintenance', label: 'Обслуживание' },
        { id: 'repair', label: 'Ремонт' },
        { id: 'consultation', label: 'Консультации' },
        { id: 'all', label: 'Все услуги' },
    ];

    const services = [
        {
            id: 1,
            title: 'Монтаж электропроводки',
            description: 'Полный комплекс работ по прокладке и замене электропроводки в квартирах, домах и офисах.',
            icon: <FaBolt />,
            category: 'installation',
            features: ['Скрытая проводка', 'Открытая проводка', 'Замена проводки', 'Дизайн-проект'],
            price: 'от 2 500 ₽',
            duration: 'от 4 часов'
        },
        {
            id: 2,
            title: 'Установка электрощитов',
            description: 'Сборка и установка распределительных щитов с автоматическими выключателями и УЗО.',
            icon: <MdOutlineElectricalServices />,
            category: 'installation',
            features: ['Сборка щита', 'Монтаж автоматов', 'Подключение УЗО', 'Маркировка'],
            price: 'от 3 500 ₽',
            duration: 'от 3 часов'
        },
        {
            id: 3,
            title: 'Монтаж розеток и выключателей',
            description: 'Установка и замена розеток, выключателей, диммеров и других электроустановочных изделий.',
            icon: <MdHomeRepairService />,
            category: 'installation',
            features: ['Евро розетки', 'Проходные выключатели', 'Сенсорные панели', 'Влагозащищенные'],
            price: 'от 450 ₽/шт',
            duration: 'от 30 мин'
        },
        {
            id: 4,
            title: 'Обсл.электрооборудования',
            description: 'Регулярное техническое обслуживание электросистем для предотвращения аварийных ситуаций.',
            icon: <FaTools />,
            category: 'maintenance',
            features: ['Диагностика', 'Профилактика', 'Замена изношенных частей', 'Настройка'],
            price: 'от 1 800 ₽',
            duration: 'от 2 часов'
        },
        {
            id: 5,
            title: 'Ремонт бытовой техники',
            description: 'Диагностика и ремонт стиральных машин, холодильников, плит и другой бытовой техники.',
            icon: <FaWrench />,
            category: 'repair',
            features: ['Диагностика', 'Запчасти в наличии', 'Гарантия на ремонт', 'Выезд мастера'],
            price: 'от 1 200 ₽',
            duration: 'от 1 часа'
        },
        {
            id: 6,
            title: 'Аварийные работы',
            description: 'Круглосуточный выезд для устранения аварийных ситуаций и восстановления электроснабжения.',
            icon: <MdSecurity />,
            category: 'maintenance',
            features: ['Круглосуточно', 'Быстрый выезд', 'Экстренный ремонт', 'Выезд в течение часа'],
            price: 'от 3 000 ₽',
            duration: 'от 30 мин'
        },
    ];

    const filteredServices = activeCategory === 'all'
        ? services
        : services.filter(service => service.category === activeCategory);

    const handleServiceClick = (serviceId) => {
        setActiveService(activeService === serviceId ? null : serviceId);
    };

    const benefits = [
        {
            icon: <FaCheckCircle />,
            title: 'Гарантия 3 года',
            description: 'На все виды работ предоставляем официальную гарантию'
        },
        {
            icon: <FaClock />,
            title: 'Работаем быстро',
            description: 'Среднее время выполнения заказа - 2-4 часа'
        },
        {
            icon: <FaTruck />,
            title: 'Бесплатный выезд',
            description: 'Выезд мастера и диагностика - бесплатно'
        },
    ];

    return (
        <section id="services" className="services">
            <div className="container">
                {/* Заголовок секции */}
                <div className="services-section-header">
                    <h2 className="services-section-title">Наши услуги</h2>
                    <p className="services-section-subtitle">
                        Профессиональные услуги электрика любой сложности. Работаем качественно, быстро и с гарантией.
                    </p>
                </div>

                {/* Фильтры категорий */}
                <div className="services-category-filters">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`services-category-filter ${activeCategory === category.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Карточки услуг */}
                <div className="services-grid">
                    {filteredServices.map(service => (
                        <div
                            key={service.id}
                            className={`services-service-card ${activeService === service.id ? 'expanded' : ''}`}
                            onClick={() => handleServiceClick(service.id)}
                        >
                            <div className="services-service-card-header">
                                <div className="services-service-icon">
                                    {service.icon}
                                </div>
                                <div className="services-service-title-wrapper">
                                    <h3 className="services-service-title">{service.title}</h3>
                                    <div className="services-service-meta">
                                        <span className="services-service-price">{service.price}</span>
                                        <span className="services-service-duration">{service.duration}</span>
                                    </div>
                                </div>
                                <div className="services-service-arrow">
                                    <FaArrowRight />
                                </div>
                            </div>

                            <div className="services-service-card-content">
                                <p className="services-service-description">{service.description}</p>

                                <div className="services-service-features">
                                    <h4>Что входит:</h4>
                                    <ul className="services-features-list">
                                        {service.features.map((feature, index) => (
                                            <li key={index} className="services-feature-item">
                                                <FaCheckCircle className="services-feature-check" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="services-service-actions">
                                    <Button
                                        variant="primary"
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            document.querySelector('.contact-form-section')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="services-service-order-btn"
                                    >
                                        Заказать услугу
                                    </Button>
                                    <a
                                        href={`tel:+79991234567`}
                                        className="services-service-call-link"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Позвонить для уточнения
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Преимущества */}
                <div className="services-benefits-section">
                    <div className="services-benefits-header">
                        <h3>Почему выбирают нас</h3>
                        <p>Мы гарантируем качество и надежность всех выполненных работ</p>
                    </div>

                    <div className="services-benefits-grid">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="services-benefit-card">
                                <div className="services-benefit-icon-wrapper">
                                    {benefit.icon}
                                </div>
                                <div className="benefit-content">
                                    <h4>{benefit.title}</h4>
                                    <p>{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA блок */}
                <div className="services-services-cta">
                    <div className="services-cta-content">
                        <h3>Нужна консультация электрика?</h3>
                        <p>Оставьте заявку и получите бесплатную консультацию по вашему вопросу</p>
                    </div>
                    <div className="services-cta-actions">
                        <Button
                            variant="primary"
                            size="large"
                            onClick={() => document.querySelector('.contact-form-section')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Получить консультацию
                        </Button>
                        <a href="tel:+79991234567" className="services-cta-phone">
                            Или позвоните: +7 (999) 123-45-67
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;