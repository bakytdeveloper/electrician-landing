import React, { useState, useEffect } from 'react';
import { FaTools, FaShieldAlt, FaClock, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { MdOutlineElectricBolt, MdSafetyDivider } from 'react-icons/md';
import './Hero.css';
import Button from '../common/Button/Button';

const Hero = ({ openModal }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            bgClass: 'slide-1'
        },
        {
            bgClass: 'slide-2'
        },
        {
            bgClass: 'slide-3'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 10000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const handleSlideChange = (index) => {
        setCurrentSlide(index);
    };

    return (
        <section className="hero" id="home">
            {/* Фоновые слайды */}
            <div className="hero-slides">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`hero-slide ${slide.bgClass} ${index === currentSlide ? 'active' : ''}`}
                    />
                ))}
            </div>

            {/* Overlay для затемнения фона */}
            <div className="hero-overlay" />

            <div className="container">
                <div className="hero-content">
                    {/* Основной контент */}
                    <div className="hero-main">

                        <h1 className="hero-title">
                            Профессиональные услуги электрика
                        </h1>

                        <p className="hero-subtitle">
                            Монтаж, обслуживание и ремонт электрооборудования любой сложности.
                            Гарантия качества, доступные цены, оперативный выезд.
                        </p>

                        <div className="hero-features-list">
                            <div className="hero-feature-item">
                                <FaCheckCircle className="feature-icon" />
                                <span>Бесплатный выезд и диагностика</span>
                            </div>
                            <div className="hero-feature-item">
                                <FaCheckCircle className="feature-icon" />
                                <span>Опыт работы более 10 лет</span>
                            </div>
                            <div className="hero-feature-item">
                                <FaCheckCircle className="feature-icon" />
                                <span>Официальная гарантия</span>
                            </div>
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
                                    <p>Ежедневно 8:00 - 22:00</p>
                                    <p className="emergency">Экстренные вызовы - 24/7</p>
                                </div>
                            </div>

                            <div className="contact-info-item">
                                <div className="contact-icon-wrapper">
                                    <MdOutlineElectricBolt />
                                </div>
                                <div className="contact-info-content">
                                    <h4>Срочный вызов</h4>
                                    <a href="tel:+79991234567" className="emergency-phone">
                                        +7 (999) 123-45-67
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
                <div className="slide-indicators">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`slide-indicator ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => handleSlideChange(index)}
                            aria-label={`Перейти к слайду ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;