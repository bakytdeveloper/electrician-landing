import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaBars, FaTimes, FaWhatsapp, FaTelegram } from 'react-icons/fa';
import { MdElectricBolt } from 'react-icons/md';
import './Header.css';
import Button from '../common/Button/Button';

const Header = ({ openModal }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    // eslint-disable-next-line
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Проверяем при загрузке
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
        // Блокируем скролл при открытом меню
        if (!isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    };

    const handleNavClick = (sectionId) => {
        setIsMenuOpen(false);
        document.body.style.overflow = 'auto'; // Восстанавливаем скролл

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
        window.location.href = 'tel:+79991234567';
    };

    const navItems = [
        { id: 'services', label: 'Услуги' },
        { id: 'portfolio', label: 'Наши работы' },
        { id: 'about', label: 'О нас' },
        { id: 'contact', label: 'Контакты' },
    ];

    const socialLinks = [
        { icon: <FaWhatsapp />, href: 'https://wa.me/79991234567', label: 'WhatsApp' },
        { icon: <FaTelegram />, href: 'https://t.me/username', label: 'Telegram' },
    ];

    return (
        <>
            {/* Верхняя контактная панель */}
            <div className={`contact-bar ${isScrolled ? 'contact-bar-hidden' : ''}`}>
                <div className="container">
                    <div className="contact-bar-content">
                        <div className="contact-info">
                            <a href="tel:+79991234567" className="contact-item">
                                <FaPhone className="contact-icon" />
                                <span>+7 (999) 123-45-67</span>
                            </a>
                            <a href="mailto:info@electrician.ru" className="contact-item">
                                <FaEnvelope className="contact-icon" />
                                <span>info@electrician.ru</span>
                            </a>
                            <div className="work-hours">
                                <span>Пн-Пт: 8:00-20:00</span>
                                <span className="work-hours-span-slash">/</span>
                                <span>Сб-Вс: 9:00-18:00</span>
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
                        <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <div className="logo-icon-box-md-electric-bolt">
                                <MdElectricBolt className="logo-icon" />
                            </div>
                            <div className="logo-text">
                                <h1 className="logo-title">ЭлектроМастер</h1>
                                <p className="logo-subtitle">Профессиональные услуги электрика</p>
                            </div>
                        </div>

                        {/* Навигация для десктопа */}
                        <nav className="desktop-nav">
                            <ul className="nav-list">
                                {navItems.map((item) => (
                                    <li key={item.id} className="nav-item">
                                        <button
                                            className="nav-link"
                                            onClick={() => handleNavClick(item.id)}
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
                            >
                                <FaPhone />
                                <span>Позвонить</span>
                            </Button>

                            {/*<Button*/}
                            {/*    variant="primary"*/}
                            {/*    size="small"*/}
                            {/*    onClick={() => openModal('callback')}*/}
                            {/*>*/}
                            {/*    Заказать вызов*/}
                            {/*</Button>*/}
                        </div>

                        {/* Кнопка меню для мобильных */}
                        <button
                            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
                            onClick={toggleMenu}
                            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                        >
                            {isMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>

                {/* Мобильное меню */}
                <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                    <div className="mobile-menu-content">
                        {/* Заголовок мобильного меню с кнопкой закрытия */}
                        <div className="mobile-menu-header">
                            <div className="mobile-logo">
                                <MdElectricBolt />
                                <span>ЭлектроМастер</span>
                            </div>
                            <button
                                className="mobile-menu-close"
                                onClick={toggleMenu}
                                aria-label="Закрыть меню"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <nav className="mobile-nav">
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
                            <a href="tel:+79991234567" className="mobile-contact-item">
                                <FaPhone />
                                <span>+7 (999) 123-45-67</span>
                            </a>
                            <a href="mailto:info@electrician.ru" className="mobile-contact-item">
                                <FaEnvelope />
                                <span>info@electrician.ru</span>
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
                            >
                                <FaPhone />
                                Позвонить
                            </Button>
                        </div>
                    </div>

                    <div className="mobile-menu-overlay" onClick={toggleMenu} />
                </div>
            </header>
        </>
    );
};

export default Header;