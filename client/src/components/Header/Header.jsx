// client/src/components/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaBars, FaTimes, FaWhatsapp, FaTelegram, FaChevronRight } from 'react-icons/fa';
import { MdElectricBolt } from 'react-icons/md';
import './Header.css';
import Button from '../common/Button/Button';

const Header = ({ openModal }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    // eslint-disable-next-line
    const [isMobile, setIsMobile] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    // Загрузка конфигурации с сервера
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contacts/config`);
                const data = await response.json();
                setConfig(data);
            } catch (err) {
                console.error('Error fetching contact config:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

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

    // Блокировка скролла при открытом меню
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${window.scrollY}px`;
        } else {
            const scrollY = document.body.style.top;
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        if (isMenuOpen) {
            setIsClosing(true);
            setTimeout(() => {
                setIsMenuOpen(false);
                setIsClosing(false);
            }, 300);
        } else {
            setIsMenuOpen(true);
            setIsClosing(false);
        }
    };

    const closeMenu = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsMenuOpen(false);
            setIsClosing(false);
        }, 300);
    };

    const handleNavClick = (sectionId) => {
        closeMenu();

        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                const offset = 80;
                const elementPosition = element.offsetTop - offset;
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }
        }, 350);
    };

    const handleCallClick = () => {
        if (config?.phoneRaw) {
            window.location.href = `tel:${config.phoneRaw.replace(/\D/g, '')}`;
        }
    };

    // Функция для форматирования часов работы для отображения в хедере
    const getWorkingHoursDisplay = () => {
        if (!config) return { weekday: '08:00 - 20:00', weekend: '09:00 - 18:00', isWeekendWorking: true };

        // Определяем, работают ли выходные дни
        const saturdayIsWorking = config.saturdayHours && config.saturdayHours.toLowerCase() !== 'выходной';
        const sundayIsWorking = config.sundayHours && config.sundayHours.toLowerCase() !== 'выходной';

        // Форматируем будние дни (берем понедельник как основу)
        let weekdayHours = config.mondayHours || '08:00 - 20:00';

        // Форматируем выходные
        let weekendDisplay = '';
        if (saturdayIsWorking && sundayIsWorking) {
            // Оба дня работают
            if (config.saturdayHours === config.sundayHours) {
                // Если время одинаковое - показываем одно
                weekendDisplay = `${config.saturdayHours}`;
            } else {
                // Если разное - показываем оба дня отдельно
                weekendDisplay = `Сб: ${config.saturdayHours}, Вс: ${config.sundayHours}`;
            }
        } else if (saturdayIsWorking && !sundayIsWorking) {
            // Только суббота работает
            weekendDisplay = `Сб: ${config.saturdayHours}`;
        } else if (!saturdayIsWorking && sundayIsWorking) {
            // Только воскресенье работает
            weekendDisplay = `Вс: ${config.sundayHours}`;
        } else {
            // Оба дня выходные
            weekendDisplay = 'Выходной';
        }

        return { weekday: weekdayHours, weekend: weekendDisplay, isWeekendWorking: saturdayIsWorking || sundayIsWorking };
    };

    const navItems = [
        { id: 'services', label: 'Услуги', icon: '🔧' },
        { id: 'portfolio', label: 'Наши работы', icon: '📁' },
        { id: 'about', label: 'О нас', icon: 'ℹ️' },
        { id: 'contact', label: 'Контакты', icon: '📞' },
    ];

    // Социальные ссылки из конфигурации
    const getSocialLinks = () => {
        const links = [];

        if (config?.phoneForWhatsapp) {
            links.push({
                icon: <FaWhatsapp />,
                href: `https://wa.me/${config.phoneForWhatsapp}`,
                label: 'WhatsApp',
                color: '#25D366'
            });
        }

        if (config?.telegramUsername) {
            links.push({
                icon: <FaTelegram />,
                href: `https://t.me/${config.telegramUsername}`,
                label: 'Telegram',
                color: '#26A5E4'
            });
        }

        return links;
    };

    const workingHours = getWorkingHoursDisplay();
    const socialLinks = getSocialLinks();

    if (loading) {
        return (
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <div className="logo">
                            <div className="logo-icon-box-md-electric-bolt">
                                <MdElectricBolt className="logo-icon" />
                            </div>
                            <div className="logo-text">
                                <div className="logo-title">ЭлектроМастер</div>
                                <p className="logo-subtitle">Загрузка...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <>
            {/* Верхняя контактная панель */}
            <div className={`contact-bar ${isScrolled ? 'contact-bar-hidden' : ''}`}>
                <div className="container">
                    <div className="contact-bar-content">
                        <div className="contact-info">
                            {config?.phoneRaw && (
                                <a href={`tel:${config.phoneRaw.replace(/\D/g, '')}`} className="contact-item" aria-label="Позвонить">
                                    <FaPhone className="contact-icon" aria-hidden="true" />
                                    <span>{config.phoneDisplay || config.phoneRaw}</span>
                                </a>
                            )}
                            {config?.email && (
                                <a href={`mailto:${config.email}`} className="contact-item" aria-label="Написать email">
                                    <FaEnvelope className="contact-icon" aria-hidden="true" />
                                    <span>{config.email}</span>
                                </a>
                            )}
                            <div className="work-hours">
                                <span>Пн-Пт: {workingHours.weekday}</span>
                                <span className="work-hours-span-slash">/</span>
                                <span>{workingHours.weekend}</span>
                            </div>
                        </div>

                        {socialLinks.length > 0 && (
                            <div className="social-links">
                                {socialLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.href}
                                        className="social-link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={link.label}
                                        style={{ '--social-color': link.color }}
                                    >
                                        {link.icon}
                                    </a>
                                ))}
                            </div>
                        )}
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
                                <div className="logo-title">{config?.companyName || 'ЭлектроМастер'}</div>
                                <p className="logo-subtitle">
                                    {config?.companyAlternateName || `Профессиональные услуги электрика в ${config?.addressCity || 'Алматы'}`}
                                </p>
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

                {/* Мобильное меню с изолированными классами */}
                <div className={`header-modal-wrapper ${isMenuOpen ? 'active' : ''} ${isClosing ? 'closing' : ''}`}>
                    <div className="header-modal-overlay" onClick={closeMenu} />
                    <div className="header-modal-container">
                        <div className="header-modal-content">
                            <div className="header-modal-header">
                                <div className="header-modal-logo">
                                    <MdElectricBolt />
                                    <span>{config?.companyName || 'ЭлектроМастер'}</span>
                                </div>
                                <button
                                    className="header-modal-close"
                                    onClick={closeMenu}
                                    aria-label="Закрыть меню"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <nav className="header-modal-nav">
                                <ul className="header-modal-nav-list">
                                    {navItems.map((item) => (
                                        <li key={item.id} className="header-modal-nav-item">
                                            <button
                                                className="header-modal-nav-link"
                                                onClick={() => handleNavClick(item.id)}
                                            >
                                                <span className="header-modal-nav-icon">{item.icon}</span>
                                                <span>{item.label}</span>
                                                <FaChevronRight className="header-modal-nav-arrow" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            <div className="header-modal-contact-section">
                                <h4 className="header-modal-section-title">Контакты</h4>
                                <div className="header-modal-contact-info">
                                    {config?.phoneRaw && (
                                        <a href={`tel:${config.phoneRaw.replace(/\D/g, '')}`} className="header-modal-contact-item">
                                            <FaPhone />
                                            <span>{config.phoneDisplay || config.phoneRaw}</span>
                                        </a>
                                    )}
                                    {config?.email && (
                                        <a href={`mailto:${config.email}`} className="header-modal-contact-item">
                                            <FaEnvelope />
                                            <span>{config.email}</span>
                                        </a>
                                    )}
                                </div>
                            </div>

                            {socialLinks.length > 0 && (
                                <div className="header-modal-social-section">
                                    <h4 className="header-modal-section-title">Мы в соцсетях</h4>
                                    <div className="header-modal-social-links">
                                        {socialLinks.map((link, index) => (
                                            <a
                                                key={index}
                                                href={link.href}
                                                className="header-modal-social-link"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={link.label}
                                                style={{ '--social-color': link.color }}
                                            >
                                                {link.icon}
                                                <span className="header-modal-social-label">{link.label}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="header-modal-actions">
                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={() => {
                                        closeMenu();
                                        setTimeout(() => openModal('callback'), 350);
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
                                        closeMenu();
                                    }}
                                    className="header-modal-call-button"
                                    aria-label="Позвонить"
                                >
                                    <FaPhone />
                                    Позвонить
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;