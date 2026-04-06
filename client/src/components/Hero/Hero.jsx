import React, { useState, useEffect } from 'react';
import { FaTools, FaShieldAlt, FaClock, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { MdOutlineElectricBolt } from 'react-icons/md';
import './Hero.css';
import Button from '../common/Button/Button';

const Hero = ({ openModal }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageErrors, setImageErrors] = useState({});

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/hero/content`);
            const data = await response.json();
            console.log('Fetched hero content:', data); // Для отладки
            setContent(data);
        } catch (error) {
            console.error('Error fetching hero content:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!content?.slides) return;

        const activeSlides = content.slides.filter(slide => slide.active !== false);
        if (activeSlides.length === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
        }, 10000);

        return () => clearInterval(interval);
    }, [content?.slides]);

    const handleSlideChange = (index) => {
        setCurrentSlide(index);
    };

    const handleImageError = (slideIndex) => {
        console.log('Image error for slide:', slideIndex);
        setImageErrors(prev => ({ ...prev, [slideIndex]: true }));
    };

    if (loading) {
        return <div className="hero-loading">Загрузка...</div>;
    }

    if (!content) {
        return null;
    }

    const activeSlides = content.slides.filter(slide => slide.active !== false);
    const activeFeatures = content.features.filter(f => f.active);

    return (
        <section className="hero" id="home">
            {/* Фоновые слайды */}
            <div className="hero-slides">
                {activeSlides.map((slide, index) => {
                    const originalIndex = content.slides.findIndex(s => s === slide);
                    const hasError = imageErrors[originalIndex];

                    // Определяем стиль фона
                    let backgroundStyle = {};

                    if (slide.bgType === 'color' || hasError) {
                        backgroundStyle = {
                            background: hasError ? 'linear-gradient(135deg, #6b85fa 0%, #521364 100%)' : slide.bgValue
                        };
                    } else {
                        backgroundStyle = {
                            backgroundImage: `url(${slide.bgValue})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        };
                    }

                    return (
                        <div
                            key={originalIndex}
                            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                            style={backgroundStyle}
                        >
                            {slide.bgType !== 'color' && !hasError && (
                                <img
                                    src={slide.bgValue}
                                    alt={`Слайд ${originalIndex + 1}`}
                                    style={{ display: 'none' }}
                                    onError={() => handleImageError(originalIndex)}
                                    onLoad={() => console.log('Image loaded successfully:', slide.bgValue)}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Overlay для затемнения фона */}
            <div className="hero-overlay" />

            <div className="container">
                <div className="hero-content">
                    {/* Основной контент */}
                    <div className="hero-main">
                        <h1 className="hero-title">
                            {content.title}
                        </h1>

                        <p className="hero-subtitle">
                            {content.subtitle}
                        </p>

                        <div className="hero-features-list">
                            {activeFeatures.map((feature, index) => (
                                <div key={index} className="hero-feature-item">
                                    <FaCheckCircle className="feature-icon" />
                                    <span>{feature.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="hero-actions">
                            <Button
                                variant="primary"
                                size="large"
                                onClick={() => openModal('service')}
                                className="hero-btn"
                            >
                                Заказать услугу
                                <FaArrowRight />
                            </Button>

                            <Button
                                variant="outline"
                                size="large"
                                onClick={() => openModal('callback')}
                                className="hero-btn"
                            >
                                Бесплатная консультация
                            </Button>
                        </div>
                    </div>

                    {/* Контактная карточка */}
                    <div className="hero-contact-card">
                        <div className="contact-card-header">
                            <h3>Свяжитесь с нами</h3>
                            <p>Ответим в течение 5 минут</p>
                        </div>

                        <div className="contact-card-body">
                            <div className="contact-info-item">
                                <div className="contact-icon-wrapper">
                                    <FaClock />
                                </div>
                                <div className="contact-info-content">
                                    <h4>Рабочие часы</h4>
                                    <p>{content.workHours?.daily}</p>
                                    <p className="emergency">{content.workHours?.emergency}</p>
                                </div>
                            </div>

                            <div className="contact-info-item">
                                <div className="contact-icon-wrapper">
                                    <MdOutlineElectricBolt />
                                </div>
                                <div className="contact-info-content">
                                    <h4>Срочный вызов</h4>
                                    <a href={`tel:${content.emergencyPhone?.replace(/\D/g, '')}`} className="emergency-phone">
                                        {content.emergencyPhone}
                                    </a>
                                    <p>Круглосуточно</p>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="primary"
                            fullWidth
                            onClick={() => openModal('callback')}
                            className="contact-card-btn"
                        >
                            Заказать звонок
                        </Button>
                    </div>
                </div>

                {/* Индикаторы слайдов */}
                {activeSlides.length > 1 && (
                    <div className="slide-indicators">
                        {activeSlides.map((_, index) => (
                            <button
                                key={index}
                                className={`slide-indicator ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => handleSlideChange(index)}
                                aria-label={`Перейти к слайду ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Hero;