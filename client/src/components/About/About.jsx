import React, { useState, useEffect, useRef } from 'react';
import {
    FaUser,
    FaAward,
    FaCertificate,
    FaTools,
    FaShieldAlt,
    FaClock,
    FaCheckCircle,
    FaGraduationCap,
    FaBriefcase,
    FaStar,
    FaQuoteLeft,
    FaQuoteRight,
    FaChevronLeft,
    FaChevronRight,
    FaChevronDown,
    FaChevronUp
} from 'react-icons/fa';
import { MdElectricalServices, MdEngineering, MdSupportAgent } from 'react-icons/md';
import './About.css';

// Маппинг иконок
const iconMap = {
    FaUser: FaUser,
    FaAward: FaAward,
    FaCertificate: FaCertificate,
    FaTools: FaTools,
    FaShieldAlt: FaShieldAlt,
    FaClock: FaClock,
    FaCheckCircle: FaCheckCircle,
    FaGraduationCap: FaGraduationCap,
    FaBriefcase: FaBriefcase,
    FaStar: FaStar,
    FaQuoteLeft: FaQuoteLeft,
    MdElectricalServices: MdElectricalServices,
    MdEngineering: MdEngineering,
    MdSupportAgent: MdSupportAgent
};

const About = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    // const [activeTab, setActiveTab] = useState('services');
    const [stats, setStats] = useState({});
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [expandedTestimonials, setExpandedTestimonials] = useState({});
    const testimonialsRef = useRef(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/about/content`);
            const data = await response.json();
            setContent(data);

            // Инициализируем статистику для анимации
            const initialStats = {};
            data.stats.forEach(stat => {
                initialStats[stat.label] = 0;
            });
            setStats(initialStats);
        } catch (error) {
            console.error('Error fetching about content:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!content?.stats) return;

        // Анимация статистики
        const targetStats = {};
        content.stats.forEach(stat => {
            targetStats[stat.label] = stat.value;
        });

        const duration = 2000;
        const steps = 60;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const newStats = {};
            content.stats.forEach(stat => {
                newStats[stat.label] = Math.min(
                    Math.floor((stat.value / steps) * currentStep),
                    stat.value
                );
            });
            setStats(newStats);

            if (currentStep >= steps) {
                clearInterval(timer);
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [content]);

    const scrollTestimonials = (direction) => {
        if (testimonialsRef.current) {
            const scrollAmount = 400;
            const currentScroll = testimonialsRef.current.scrollLeft;
            const newScroll = direction === 'left'
                ? currentScroll - scrollAmount
                : currentScroll + scrollAmount;

            testimonialsRef.current.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
        }
    };

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            scrollTestimonials('right');
        }

        if (isRightSwipe) {
            scrollTestimonials('left');
        }

        setTouchStart(null);
        setTouchEnd(null);
    };

    // Функция для переключения состояния отзыва
    const toggleTestimonial = (index) => {
        setExpandedTestimonials(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Функция для обрезки текста
    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    if (loading) {
        return <div className="about-loading">Загрузка...</div>;
    }

    if (!content) {
        return null;
    }

    // const activeServices = content.services.filter(s => s.active);
    // const activeTimeline = content.timeline.sort((a, b) => a.order - b.order);
    const activeTestimonials = content.testimonials.filter(t => t.active).sort((a, b) => a.order - b.order);

    return (
        <section id="about" className="about-section">
            <div className="about-container">
                {/* Заголовок секции */}
                <div className="about-section-header">
                    <h2 className="about-section-title">{content.sectionTitle}</h2>
                    <p className="about-section-subtitle">{content.sectionSubtitle}</p>
                </div>

                {/* Основная информация */}
                <div className="about-content">
                    {/* Приветствие */}
                    <div className="about-greeting-card">
                        <div className="about-greeting-header">
                            <div className="about-avatar">
                                <FaUser />
                            </div>
                            <div className="about-greeting-text">
                                <h3>{content.greetingTitle}</h3>
                                <p className="about-tagline">{content.greetingTagline}</p>
                            </div>
                        </div>

                        <div className="about-greeting-body">
                            <p>{content.greetingText1}</p>
                            <p>{content.greetingText2}</p>
                        </div>
                    </div>

                    {/* Статистика */}
                    <div className="about-stats-grid">
                        {content.stats.map((stat, index) => {
                            const IconComponent = iconMap[stat.icon] || FaUser;
                            return (
                                <div key={index} className="about-stat-card">
                                    <div className="about-stat-icon">
                                        <IconComponent />
                                    </div>
                                    <div className="about-stat-content">
                                        <div className="about-stat-number">
                                            {stats[stat.label] || 0}{stat.suffix}
                                        </div>
                                        <div className="about-stat-label">{stat.label}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/*/!* Вкладки *!/*/}
                    {/*<div className="about-tabs-section">*/}
                    {/*    <div className="about-tabs-header">*/}
                    {/*        <button*/}
                    {/*            className={`about-tab-button ${activeTab === 'services' ? 'about-active' : ''}`}*/}
                    {/*            onClick={() => setActiveTab('services')}*/}
                    {/*        >*/}
                    {/*            Услуги*/}
                    {/*        </button>*/}
                    {/*        <button*/}
                    {/*            className={`about-tab-button ${activeTab === 'experience' ? 'about-active' : ''}`}*/}
                    {/*            onClick={() => setActiveTab('experience')}*/}
                    {/*        >*/}
                    {/*            Опыт работы*/}
                    {/*        </button>*/}
                    {/*    </div>*/}

                    {/*    <div className="about-tabs-content">*/}
                    {/*        {activeTab === 'experience' && (*/}
                    {/*            <div className="about-timeline">*/}
                    {/*                {activeTimeline.map((item, index) => {*/}
                    {/*                    const IconComponent = iconMap[item.icon] || FaGraduationCap;*/}
                    {/*                    return (*/}
                    {/*                        <div key={index} className="about-timeline-item">*/}
                    {/*                            <div className="about-timeline-year">{item.year}</div>*/}
                    {/*                            <div className="about-timeline-content">*/}
                    {/*                                <div className="about-timeline-icon">*/}
                    {/*                                    <IconComponent />*/}
                    {/*                                </div>*/}
                    {/*                                <div className="about-timeline-text">*/}
                    {/*                                    <h4>{item.title}</h4>*/}
                    {/*                                    <p>{item.description}</p>*/}
                    {/*                                </div>*/}
                    {/*                            </div>*/}
                    {/*                        </div>*/}
                    {/*                    );*/}
                    {/*                })}*/}
                    {/*            </div>*/}
                    {/*        )}*/}

                    {/*        {activeTab === 'services' && (*/}
                    {/*            <div className="about-services-list">*/}
                    {/*                <h4>Полный перечень услуг</h4>*/}
                    {/*                <ul className="about-services-ul">*/}
                    {/*                    {activeServices.map((service, index) => (*/}
                    {/*                        <li key={index} className="about-service-item">*/}
                    {/*                            <FaCheckCircle className="about-check-icon" />*/}
                    {/*                            <span>{service.text}</span>*/}
                    {/*                        </li>*/}
                    {/*                    ))}*/}
                    {/*                </ul>*/}
                    {/*            </div>*/}
                    {/*        )}*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/* Отзывы - горизонтальный скролл с функцией "Читать далее" */}
                    {activeTestimonials.length > 0 && (
                        <div className="about-testimonials-section">
                            <h2 className="about-testimonials-title">Отзывы наших клиентов</h2>

                            <div className="about-testimonials-container-wrapper">
                                <div
                                    className="about-testimonials-container"
                                    ref={testimonialsRef}
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    <div className="about-testimonials-track">
                                        {activeTestimonials.map((testimonial, index) => {
                                            const isExpanded = expandedTestimonials[index];
                                            const displayText = isExpanded
                                                ? testimonial.text
                                                : truncateText(testimonial.text, 50);
                                            const needsTruncation = testimonial.text && testimonial.text.length > 50;

                                            return (
                                                <div key={index} className="about-testimonial-card">
                                                    <div className="about-testimonial-header">
                                                        <div className="about-client-info">
                                                            <div className="about-client-avatar">
                                                                {testimonial.name.charAt(0)}
                                                            </div>
                                                            <div className="about-client-details">
                                                                <h4>{testimonial.name}</h4>
                                                                <p className="about-client-role">{testimonial.role}</p>
                                                                <p className="about-client-project">{testimonial.project}</p>
                                                            </div>
                                                        </div>
                                                        <div className="about-testimonial-rating">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FaStar
                                                                    key={i}
                                                                    className={`about-star ${i < testimonial.rating ? 'about-filled' : ''}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="about-testimonial-body">
                                                        <FaQuoteLeft className="about-quote-left" />
                                                        <p className="about-testimonial-text">{displayText}</p>
                                                        <FaQuoteRight className="about-quote-right" />
                                                    </div>

                                                    <div className="about-testimonial-footer">
                                                        {needsTruncation && (
                                                            <button
                                                                className="about-read-more-btn"
                                                                onClick={() => toggleTestimonial(index)}
                                                                aria-label={isExpanded ? "Свернуть отзыв" : "Развернуть отзыв"}
                                                            >
                                                                {isExpanded ? (
                                                                    <>
                                                                        <FaChevronUp />
                                                                        <span>Свернуть</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <FaChevronDown />
                                                                        <span>Читать далее</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}
                                                        <span className="about-testimonial-date">{testimonial.date}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="about-testimonials-controls">
                                <button
                                    className="about-scroll-button about-scroll-left"
                                    onClick={() => scrollTestimonials('left')}
                                    aria-label="Предыдущие отзывы"
                                >
                                    <FaChevronLeft />
                                </button>
                                <button
                                    className="about-scroll-button about-scroll-right"
                                    onClick={() => scrollTestimonials('right')}
                                    aria-label="Следующие отзывы"
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default About;