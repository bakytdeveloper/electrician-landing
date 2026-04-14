// client/src/components/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaBars, FaTimes, FaWhatsapp, FaTelegram } from 'react-icons/fa';
import { MdElectricBolt } from 'react-icons/md';
import './Header.css';
import Button from '../common/Button/Button';

// Функция для получения переменных окружения с fallback
const getEnv = (key, fallback = '') => process.env[key] || fallback;

const Header = ({ openModal }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    // eslint-disable-next-line
    const [isMobile, setIsMobile] = useState(false);

    // КОНТАКТНЫЕ ДАННЫЕ ИЗ .env
    const phoneNumber = getEnv('REACT_APP_PHONE_DISPLAY', '+7 (727) 123-45-67');
    const phoneRaw = getEnv('REACT_APP_PHONE_RAW', '+77271234567');
    const emailAddress = getEnv('REACT_APP_EMAIL', 'info@electromaster.kz');
    const whatsappNumber = getEnv('REACT_APP_PHONE_FOR_WHATSAPP', '77071234567');
    const telegramUsername = getEnv('REACT_APP_TELEGRAM_USERNAME', 'electromaster_almaty');
    const companyName = getEnv('REACT_APP_COMPANY_NAME', 'ЭлектроМастер Алматы');
    const city = getEnv('REACT_APP_ADDRESS_CITY', 'Алматы');
    const weekdayHours = getEnv('REACT_APP_WEEKDAY_HOURS', '08:00-20:00');
    const weekendHours = getEnv('REACT_APP_WEEKEND_HOURS', '09:00-18:00');

    // Форматируем часы для отображения
    const weekdayDisplay = weekdayHours.replace('-', ' - ');
    const weekendDisplay = weekendHours.replace('-', ' - ');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (!isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    };

    const handleNavClick = (sectionId) => {
        setIsMenuOpen(false);
        document.body.style.overflow = 'auto';

        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80;
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    };

    const handleCallClick = () => {
        window.location.href = `tel:${phoneRaw.replace(/\D/g, '')}`;
    };

    const navItems = [
        { id: 'services', label: 'Услуги' },
        { id: 'portfolio', label: 'Наши работы' },
        { id: 'about', label: 'О нас' },
        { id: 'contact', label: 'Контакты' },
    ];

    const socialLinks = [
        { icon: <FaWhatsapp />, href: `https://wa.me/${whatsappNumber}`, label: 'WhatsApp' },
        { icon: <FaTelegram />, href: `https://t.me/${telegramUsername}`, label: 'Telegram' },
    ];

    return (
        <>
            {/* Верхняя контактная панель */}
            <div className={`contact-bar ${isScrolled ? 'contact-bar-hidden' : ''}`}>
                <div className="container">
                    <div className="contact-bar-content">
                        <div className="contact-info">
                            <a href={`tel:${phoneRaw.replace(/\D/g, '')}`} className="contact-item" aria-label="Позвонить">
                                <FaPhone className="contact-icon" aria-hidden="true" />
                                <span>{phoneNumber}</span>
                            </a>
                            <a href={`mailto:${emailAddress}`} className="contact-item" aria-label="Написать email">
                                <FaEnvelope className="contact-icon" aria-hidden="true" />
                                <span>{emailAddress}</span>
                            </a>
                            <div className="work-hours">
                                <span>Пн-Пт: {weekdayDisplay}</span>
                                <span className="work-hours-span-slash">/</span>
                                <span>Сб-Вс: {weekendDisplay}</span>
                            </div>
                        </div>

                        <div className="social-links">
                            {socialLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="social-link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={link.label}
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Основной заголовок */}
            <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
                <div className="container">
                    <div className="header-content">
                        {/* Логотип */}
                        <div
                            className="logo"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && window.scrollTo({ top: 0, behavior: 'smooth' })}
                            aria-label="На главную"
                        >
                            <div className="logo-icon-box-md-electric-bolt">
                                <MdElectricBolt className="logo-icon" aria-hidden="true" />
                            </div>
                            <div className="logo-text">
                                <div className="logo-title">{companyName}</div>
                                <p className="logo-subtitle">Профессиональные услуги электрика в {city}</p>
                            </div>
                        </div>

                        {/* Навигация для десктопа */}
                        <nav className="desktop-nav" aria-label="Основная навигация">
                            <ul className="nav-list">
                                {navItems.map((item) => (
                                    <li key={item.id} className="nav-item">
                                        <button
                                            className="nav-link"
                                            onClick={() => handleNavClick(item.id)}
                                            aria-label={`Перейти к разделу ${item.label}`}
                                        >
                                            {item.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Кнопки действий */}
                        <div className="header-actions">
                            <Button
                                variant="outline"
                                size="small"
                                onClick={handleCallClick}
                                className="call-button"
                                aria-label="Позвонить"
                            >
                                <FaPhone aria-hidden="true" />
                                <span>Позвонить</span>
                            </Button>
                        </div>

                        {/* Кнопка меню для мобильных */}
                        <button
                            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
                            onClick={toggleMenu}
                            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
                        </button>
                    </div>
                </div>

                {/* Мобильное меню */}
                <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`} aria-hidden={!isMenuOpen}>
                    <div className="mobile-menu-content">
                        <div className="mobile-menu-header">
                            <div className="mobile-logo">
                                <MdElectricBolt aria-hidden="true" />
                                <span>{companyName}</span>
                            </div>
                            <button
                                className="mobile-menu-close"
                                onClick={toggleMenu}
                                aria-label="Закрыть меню"
                            >
                                <FaTimes aria-hidden="true" />
                            </button>
                        </div>

                        <nav className="mobile-nav" aria-label="Мобильное меню">
                            <ul className="mobile-nav-list">
                                {navItems.map((item) => (
                                    <li key={item.id} className="mobile-nav-item">
                                        <button
                                            className="mobile-nav-link"
                                            onClick={() => handleNavClick(item.id)}
                                        >
                                            {item.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div className="mobile-contact-info">
                            <a href={`tel:${phoneRaw.replace(/\D/g, '')}`} className="mobile-contact-item">
                                <FaPhone aria-hidden="true" />
                                <span>{phoneNumber}</span>
                            </a>
                            <a href={`mailto:${emailAddress}`} className="mobile-contact-item">
                                <FaEnvelope aria-hidden="true" />
                                <span>{emailAddress}</span>
                            </a>
                        </div>

                        <div className="mobile-social-links">
                            {socialLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    className="mobile-social-link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={link.label}
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>

                        <div className="mobile-actions">
                            <Button
                                variant="primary"
                                fullWidth
                                onClick={() => {
                                    openModal('callback');
                                    setIsMenuOpen(false);
                                    document.body.style.overflow = 'auto';
                                }}
                                aria-label="Заказать вызов"
                            >
                                Заказать вызов
                            </Button>

                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => {
                                    handleCallClick();
                                    setIsMenuOpen(false);
                                    document.body.style.overflow = 'auto';
                                }}
                                className="mobile-call-button"
                                aria-label="Позвонить"
                            >
                                <FaPhone aria-hidden="true" />
                                Позвонить
                            </Button>
                        </div>
                    </div>

                    <div className="mobile-menu-overlay" onClick={toggleMenu} aria-hidden="true" />
                </div>
            </header>
        </>
    );
};

export default Header;