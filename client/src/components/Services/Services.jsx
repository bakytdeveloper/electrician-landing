import React, { useState, useEffect } from 'react';
import {
    FaTools,
    FaBolt,
    FaWrench,
    FaCheckCircle,
    FaClock,
    FaTruck,
    FaArrowRight,
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
    FaIndustry
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
    const [expandedServices, setExpandedServices] = useState({});

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

    const handleServiceClick = (serviceId) => {
        setExpandedServices(prev => ({
            ...prev,
            [serviceId]: !prev[serviceId]
        }));
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

                {/* Фильтры категорий - используем оригинальные названия */}
                {categories.length > 0 && (
                    <div className="services-category-filters">
                        <button
                            key="all"
                            className={`services-category-filter ${activeCategory === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('all')}
                        >
                            Все услуги
                        </button>
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`services-category-filter ${activeCategory === category ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}

                {/* Карточки услуг */}
                <div className="services-grid">
                    {filteredServices.map(service => {
                        const IconComponent = iconMap[service.icon] || FaBolt;
                        const isExpanded = expandedServices[service.id];

                        return (
                            <div
                                key={service.id}
                                className={`services-service-card ${isExpanded ? 'expanded' : ''}`}
                                onClick={() => handleServiceClick(service.id)}
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
                                                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className="services-service-order-btn"
                                        >
                                            Заказать услугу
                                        </Button>
                                        <a
                                            href={`tel:${content.cta?.phoneNumber || '+79991234567'}`}
                                            className="services-service-call-link"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Позвонить для уточнения
                                        </a>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Преимущества */}
                {activeBenefits.length > 0 && (
                    <div className="services-benefits-section">
                        <div className="services-benefits-header">
                            <h3>Почему выбирают нас</h3>
                            <p>Мы гарантируем качество и надежность всех выполненных работ</p>
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
                        <h3>{content.cta?.title}</h3>
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
                        <a href={`tel:${content.cta?.phoneNumber}`} className="services-cta-phone">
                            {content.cta?.phoneText}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;