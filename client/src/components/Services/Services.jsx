import React, { useState, useEffect } from 'react';
import {
    FaTools,
    FaBolt,
    FaWrench,
    FaCheckCircle,
    FaClock,
    FaTruck,
    FaPlug,
    FaLightbulb,
    FaSolarPanel,
    FaFan,
    FaCog,
    FaShieldAlt,
    FaHammer,
    FaPaintRoller,
    FaHome,
    FaBuilding,
    FaIndustry,
    FaFileInvoice,
} from 'react-icons/fa';
import {
    MdOutlineElectricalServices,
    MdSecurity,
    MdHomeRepairService,
    MdOutlineBolt,
    MdOutlinePower,
    MdOutlineSolarPower,
    MdOutlineConstruction,
    MdOutlineHandyman,
    MdOutlinePlumbing,
    MdOutlineSecurity,
    MdOutlineSurroundSound,
    MdOutlineWifi
} from 'react-icons/md';
import {
    GiElectric,
    GiPowerGenerator,
    GiCircuitry,
    GiSolarPower,
    GiLightBulb,
    GiElectricalResistance,
    GiElectricWhip
} from 'react-icons/gi';
import './Services.css';
import Button from '../common/Button/Button';
import PriceModal from '../PriceModal/PriceModal';
import ServiceModal from './ServiceModal';

// Расширенный маппинг иконок для клиентской части
const iconMap = {
    FaBolt: FaBolt,
    FaTools: FaTools,
    FaWrench: FaWrench,
    FaCheckCircle: FaCheckCircle,
    FaClock: FaClock,
    FaTruck: FaTruck,
    FaPlug: FaPlug,
    FaLightbulb: FaLightbulb,
    FaSolarPanel: FaSolarPanel,
    FaFan: FaFan,
    FaCog: FaCog,
    FaShieldAlt: FaShieldAlt,
    FaHammer: FaHammer,
    FaPaintRoller: FaPaintRoller,
    FaHome: FaHome,
    FaBuilding: FaBuilding,
    FaIndustry: FaIndustry,
    FaFileInvoice: FaFileInvoice,
    MdOutlineElectricalServices: MdOutlineElectricalServices,
    MdSecurity: MdSecurity,
    MdHomeRepairService: MdHomeRepairService,
    MdOutlineBolt: MdOutlineBolt,
    MdOutlinePower: MdOutlinePower,
    MdOutlineSolarPower: MdOutlineSolarPower,
    MdOutlineConstruction: MdOutlineConstruction,
    MdOutlineHandyman: MdOutlineHandyman,
    MdOutlinePlumbing: MdOutlinePlumbing,
    MdOutlineSecurity: MdOutlineSecurity,
    MdOutlineSurroundSound: MdOutlineSurroundSound,
    MdOutlineWifi: MdOutlineWifi,
    GiElectric: GiElectric,
    GiPowerGenerator: GiPowerGenerator,
    GiCircuitry: GiCircuitry,
    GiSolarPower: GiSolarPower,
    GiLightBulb: GiLightBulb,
    GiElectricalResistance: GiElectricalResistance,
    GiElectricWhip: GiElectricWhip
};

const Services = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedService, setSelectedService] = useState(null);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/services/content`);
            const data = await response.json();
            setContent(data);
        } catch (error) {
            console.error('Error fetching services content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleServiceClick = (service) => {
        setSelectedService(service);
        setIsServiceModalOpen(true);
    };

    const closeServiceModal = () => {
        setIsServiceModalOpen(false);
        setSelectedService(null);
    };

    // Получить уникальные категории из услуг (сохраняя оригинальные названия)
    const getUniqueCategories = () => {
        if (!content?.services) return [];
        const categories = content.services
            .map(s => s.category)
            .filter(category => category && category.trim() !== '')
            .filter((value, index, self) => self.indexOf(value) === index);

        return categories.sort((a, b) => a.localeCompare(b, 'ru'));
    };

    // Упрощенная функция для форматирования текста - сохраняет все пробелы, отступы и переносы
    const formatDescription = (description) => {
        if (!description) return null;

        // Просто возвращаем текст с сохранением всех пробелов и переносов
        return (
            <div style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
                {description}
            </div>
        );
    };

    // Обработка скролла для кнопок фильтров
    const handleFilterScroll = (e) => {
        setScrollPosition(e.target.scrollLeft);
    };

    if (loading) {
        return <div className="services-loading">Загрузка...</div>;
    }

    if (!content) {
        return null;
    }

    const categories = getUniqueCategories();
    const filteredServices = activeCategory === 'all'
        ? content.services.filter(s => s.active !== false)
        : content.services.filter(s => s.category === activeCategory && s.active !== false);

    const activeBenefits = content.benefits.filter(b => b.active !== false);

    return (
        <section id="services" className="services">
            <div className="container">
                {/* Заголовок секции */}
                <div className="services-section-header">
                    <h2 className="services-section-title">{content.sectionTitle}</h2>
                    <p className="services-section-subtitle">{content.sectionSubtitle}</p>
                </div>

                {/* Фильтры категорий - с горизонтальным скроллом */}
                {categories.length > 0 && (
                    <div className="services-category-filters-wrapper">
                        <div
                            className="services-category-filters"
                            onScroll={handleFilterScroll}
                        >
                            <button
                                key="all"
                                className={`services-category-filter ${activeCategory === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveCategory('all')}
                                aria-label="Показать все услуги"
                            >
                                Все услуги
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`services-category-filter ${activeCategory === category ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(category)}
                                    aria-label={`Показать услуги категории ${category}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Карточки услуг */}
                <div className="services-grid">
                    {filteredServices.map(service => {
                        const IconComponent = iconMap[service.icon] || FaBolt;

                        return (
                            <div
                                key={service.id}
                                className="services-service-card"
                                onClick={() => handleServiceClick(service)}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => e.key === 'Enter' && handleServiceClick(service)}
                                aria-label={`Подробнее об услуге: ${service.title}`}
                            >
                                <div className="services-service-card-header">
                                    <div className="services-service-icon">
                                        <IconComponent />
                                    </div>
                                    <div className="services-service-title-wrapper">
                                        <h3 className="services-service-title">{service.title}</h3>
                                        <div className="services-service-meta">
                                            <span className="services-service-price">{service.price}</span>
                                            <span className="services-service-duration">{service.duration}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="services-service-card-preview">
                                    <p className="services-service-preview-text">
                                        {service.previewDescription || service.description?.substring(0, 30) + '...'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Преимущества */}
                {activeBenefits.length > 0 && (
                    <div className="services-benefits-section">
                        <div className="services-benefits-header services-section-header">
                            <h2 className="services-section-title">Почему выбирают нас</h2>
                            <p className="services-section-subtitle">Мы гарантируем качество и надежность всех выполненных работ</p>
                        </div>

                        <div className="services-benefits-grid">
                            {activeBenefits.map((benefit, index) => {
                                const IconComponent = iconMap[benefit.icon] || FaCheckCircle;

                                return (
                                    <div key={index} className="services-benefit-card">
                                        <div className="services-benefit-icon-wrapper">
                                            <IconComponent />
                                        </div>
                                        <div className="benefit-content">
                                            <h4>{benefit.title}</h4>
                                            <p>{benefit.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* CTA блок */}
                <div className="services-services-cta">
                    <div className="services-cta-content">
                        <h2>{content.cta?.title}</h2>
                        <p>{content.cta?.description}</p>
                    </div>
                    <div className="services-cta-actions">
                        <Button
                            variant="primary"
                            size="large"
                            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            {content.cta?.buttonText}
                        </Button>
                        <button
                            className="services-cta-phone"
                            onClick={() => setIsPriceModalOpen(true)}
                        >
                            <FaFileInvoice style={{ marginRight: '8px' }} />
                            Посмотреть прайс-лист
                        </button>
                    </div>
                </div>
            </div>

            {/* Модальное окно с деталями услуги */}
            <ServiceModal
                isOpen={isServiceModalOpen}
                onClose={closeServiceModal}
                service={selectedService}
                formatDescription={formatDescription}
                iconMap={iconMap}
            />

            {/* Модальное окно с прайс-листом */}
            <PriceModal
                isOpen={isPriceModalOpen}
                onClose={() => setIsPriceModalOpen(false)}
            />
        </section>
    );
};

export default Services;