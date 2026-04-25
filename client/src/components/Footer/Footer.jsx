// client/src/components/Footer/Footer.jsx
import React, { useState, useEffect } from 'react';
import {
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
    FaChevronRight,
    FaLock,
    FaRegCopyright,
    FaWhatsapp,
    FaTelegram,
    FaInstagram
} from 'react-icons/fa';
import { MdElectricalServices } from 'react-icons/md';
import './Footer.css';
import AdminLogin from '../Admin/AdminLogin/AdminLogin';
import AdminPanel from '../Admin/AdminPanel/AdminPanel';

const Footer = () => {
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [contactConfig, setContactConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const currentYear = new Date().getFullYear();

    // Загрузка конфигурации контактов из БД
    useEffect(() => {
        fetchContactConfig();
    }, []);

    const fetchContactConfig = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contacts/config`);
            if (response.ok) {
                const data = await response.json();
                setContactConfig(data);
            }
        } catch (err) {
            console.error('Ошибка загрузки контактов:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            verifyToken(token);
        }
    }, []);

    const verifyToken = async (token) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setIsAdmin(true);
            } else {
                localStorage.removeItem('adminToken');
                setIsAdmin(false);
            }
        } catch (err) {
            localStorage.removeItem('adminToken');
            setIsAdmin(false);
        }
    };

    const quickLinks = [
        { label: 'Главная', href: '#home' },
        { label: 'Услуги', href: '#services' },
        { label: 'Наши работы', href: '#portfolio' },
        { label: 'О нас', href: '#about' },
        { label: 'Контакты', href: '#contact' }
    ];

    const services = [
        { label: 'Монтаж электропроводки', href: '#services' },
        { label: 'Замена проводки', href: '#services' },
        { label: 'Установка электрощитов', href: '#services' },
        { label: 'Ремонт бытовой техники', href: '#services' },
        { label: 'Обслуживание электрооборудования', href: '#services' },
        { label: 'Аварийные работы', href: '#services' },
        { label: 'Проектирование электроснабжения', href: '#services' },
        { label: 'Установка систем защиты', href: '#services' }
    ];

    // Функция для построения списка контактов из данных БД
// Функция для построения списка контактов из данных БД
    const buildContactInfo = () => {
        if (!contactConfig) return [];

        const contacts = [];

        // Телефон (показываем только если есть значение)
        if (contactConfig.phoneDisplay) {
            contacts.push({
                icon: <FaPhone />,
                text: contactConfig.phoneDisplay,
                link: `tel:${contactConfig.phoneRaw || contactConfig.phoneDisplay.replace(/\D/g, '')}`
            });
        }

        // WhatsApp (только если есть номер)
        if (contactConfig.phoneForWhatsapp) {
            contacts.push({
                icon: <FaWhatsapp />,
                text: 'WhatsApp',
                link: `https://wa.me/${contactConfig.phoneForWhatsapp}`
            });
        }

        // Telegram (только если есть username)
        if (contactConfig.telegramUsername) {
            contacts.push({
                icon: <FaTelegram />,
                text: 'Telegram',
                link: `https://t.me/${contactConfig.telegramUsername}`
            });
        }

        // Instagram (только если есть username)
        if (contactConfig.instagramUsername) {
            contacts.push({
                icon: <FaInstagram />,
                text: 'Instagram',
                link: `https://instagram.com/${contactConfig.instagramUsername}`
            });
        }

        // Email (только если есть)
        if (contactConfig.email) {
            contacts.push({
                icon: <FaEnvelope />,
                text: contactConfig.email,
                link: `mailto:${contactConfig.email}`
            });
        }

        // Адрес (только если есть)
        if (contactConfig.officeDescription) {
            contacts.push({
                icon: <FaMapMarkerAlt />,
                text: contactConfig.officeDescription,
                link: contactConfig.googleMapUrl || '#contact'
            });
        }

        // Часы работы - форматируем как в шапке сайта
        const getWorkingHoursDisplay = () => {
            // Определяем, работают ли выходные дни
            const saturdayIsWorking = contactConfig.saturdayHours &&
                contactConfig.saturdayHours.toLowerCase() !== 'выходной' &&
                contactConfig.saturdayHours.trim() !== '';
            const sundayIsWorking = contactConfig.sundayHours &&
                contactConfig.sundayHours.toLowerCase() !== 'выходной' &&
                contactConfig.sundayHours.trim() !== '';

            // Форматируем будние дни (берем понедельник как основу)
            let weekdayHours = contactConfig.mondayHours || '08:00 - 20:00';

            // Проверяем, что будни не выходные и есть значение
            const weekdayIsWorking = contactConfig.mondayHours &&
                contactConfig.mondayHours.toLowerCase() !== 'выходной' &&
                contactConfig.mondayHours.trim() !== '';

            // Форматируем выходные
            let weekendDisplay = '';

            if (saturdayIsWorking && sundayIsWorking) {
                // Оба дня работают
                if (contactConfig.saturdayHours === contactConfig.sundayHours) {
                    // Если время одинаковое - показываем одно
                    weekendDisplay = `${contactConfig.saturdayHours}`;
                } else {
                    // Если разное - показываем оба дня отдельно
                    weekendDisplay = `Сб: ${contactConfig.saturdayHours}, Вс: ${contactConfig.sundayHours}`;
                }
            } else if (saturdayIsWorking && !sundayIsWorking) {
                // Только суббота работает
                weekendDisplay = `Сб: ${contactConfig.saturdayHours}`;
            } else if (!saturdayIsWorking && sundayIsWorking) {
                // Только воскресенье работает
                weekendDisplay = `Вс: ${contactConfig.sundayHours}`;
            } else if (!weekdayIsWorking && !saturdayIsWorking && !sundayIsWorking) {
                // Если все дни выходные - не показываем часы работы вообще
                return null;
            } else {
                // Оба дня выходные
                weekendDisplay = 'Выходной';
            }

            // Формируем итоговую строку
            if (weekdayIsWorking && weekendDisplay !== 'Выходной') {
                return `Пн-Пт: ${weekdayHours} / ${weekendDisplay}`;
            } else if (weekdayIsWorking && weekendDisplay === 'Выходной') {
                return `Пн-Пт: ${weekdayHours}`;
            } else if (!weekdayIsWorking && weekendDisplay && weekendDisplay !== 'Выходной') {
                return weekendDisplay;
            } else if (!weekdayIsWorking && weekendDisplay === 'Выходной') {
                return null;
            }

            return `Пн-Пт: ${weekdayHours} / ${weekendDisplay}`;
        };

        const workingHoursText = getWorkingHoursDisplay();

        // Показываем часы работы только если есть что показать
        if (workingHoursText) {
            contacts.push({
                icon: <FaClock />,
                text: workingHoursText,
                link: '#contact'
            });
        } else if (contactConfig.responseTime) {
            // Или показываем время ответа как альтернативу
            contacts.push({
                icon: <FaClock />,
                text: `Ответ: ${contactConfig.responseTime}`,
                link: '#contact'
            });
        }

        // Админ-панель (всегда показываем)
        contacts.push({
            icon: <FaLock />,
            text: 'Админ-панель',
            link: 'admin'
        });

        return contacts;
    };

    
    const contactInfo = buildContactInfo();

    const handleAdminLogin = (token) => {
        localStorage.setItem('adminToken', token);
        setIsAdmin(true);
        setShowAdminLogin(false);
    };

    const handleAdminLogout = () => {
        localStorage.removeItem('adminToken');
        setIsAdmin(false);
    };

    const handleContactClick = (e, contact) => {
        if (contact.text === 'Админ-панель') {
            e.preventDefault();
            const token = localStorage.getItem('adminToken');
            if (token) {
                verifyToken(token);
                setIsAdmin(true);
            } else {
                setShowAdminLogin(true);
            }
        } else if (contact.link === '#contact') {
            e.preventDefault();
            const element = document.getElementById('contact');
            if (element) {
                const offset = 80;
                const elementPosition = element.offsetTop - offset;
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }
        }
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId.replace('#', ''));
        if (element) {
            const offset = 80;
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    };

    const handleQuickLinkClick = (href) => {
        if (href.startsWith('#')) {
            scrollToSection(href);
        }
    };

    // Показываем скелетон или ничего пока данные загружаются
    if (loading) {
        return (
            <footer className="footer">
                <div className="footer-main">
                    <div className="container">
                        <div className="footer-content">
                            <div className="footer-column">Загрузка...</div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }

    const companyName = contactConfig?.companyName || 'ЭлектроМастер';

    return (
        <>
            <footer className="footer">
                <div className="footer-main">
                    <div className="container">
                        <div className="footer-content">
                            {/* Колонка 1: О компании */}
                            <div className="footer-column">
                                <div className="footer-logo">
                                    <MdElectricalServices className="footer-logo-icon" aria-hidden="true" />
                                    <div className="footer-logo-text">
                                        <div className="footer-logo-title">{companyName}</div>
                                        <p className="footer-logo-subtitle">
                                            {contactConfig?.companyAlternateName || 'Профессиональные услуги электрика'}
                                        </p>
                                    </div>
                                </div>

                                <div className="footer-contact-list">
                                    {contactInfo.map((contact, index) => (
                                        <a
                                            key={index}
                                            href={contact.link}
                                            className={`footer-contact-item ${contact.text === 'Админ-панель' ? 'admin-link' : ''}`}
                                            target={contact.link.startsWith('http') || contact.link.startsWith('mailto') || contact.link.startsWith('tel') ? '_blank' : '_self'}
                                            rel="noopener noreferrer"
                                            onClick={(e) => handleContactClick(e, contact)}
                                            aria-label={contact.text}
                                        >
                                            <span className="footer-contact-icon" aria-hidden="true">{contact.icon}</span>
                                            <span className="footer-contact-text">{contact.text}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Колонка 2: Быстрые ссылки */}
                            <div className="footer-column">
                                <h4 className="footer-column-title">Быстрые ссылки</h4>
                                <ul className="footer-links">
                                    {quickLinks.map((link, index) => (
                                        <li key={index} className="footer-link-item">
                                            <button
                                                className="footer-link"
                                                onClick={() => handleQuickLinkClick(link.href)}
                                                aria-label={`Перейти к разделу ${link.label}`}
                                            >
                                                <FaChevronRight className="footer-link-icon" aria-hidden="true" />
                                                <span>{link.label}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Колонка 3: Услуги */}
                            <div className="footer-column">
                                <h4 className="footer-column-title">Наши услуги</h4>
                                <ul className="footer-links">
                                    {services.map((service, index) => (
                                        <li key={index} className="footer-link-item">
                                            <button
                                                className="footer-link"
                                                onClick={() => handleQuickLinkClick(service.href)}
                                                aria-label={`Услуга: ${service.label}`}
                                            >
                                                <FaChevronRight className="footer-link-icon" aria-hidden="true" />
                                                <span>{service.label}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Нижняя часть футера */}
                <div className="footer-bottom">
                    <div className="container">
                        <div className="footer-bottom-content">
                            <div className="footer-copyright">
                                <FaRegCopyright className="footer-copyright-icon" aria-hidden="true" />
                                <span>{currentYear} {companyName}. Все права защищены.</span>
                            </div>

                            <div className="footer-developer-info">
                                <span>Разработка сайта:</span>
                                <a
                                    href="mailto:bakytdeveloper@gmail.com"
                                    className="footer-developer-link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Написать разработчику"
                                >
                                    bakytdeveloper
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Кнопка "Наверх" */}
                <button
                    className="footer-scroll-to-top"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    aria-label="Вернуться наверх"
                >
                    <span className="footer-arrow-up" aria-hidden="true">↑</span>
                </button>
            </footer>

            {/* Модальное окно авторизации админа */}
            {showAdminLogin && !isAdmin && (
                <AdminLogin
                    onClose={() => setShowAdminLogin(false)}
                    onLogin={handleAdminLogin}
                />
            )}

            {/* Админ-панель */}
            {isAdmin && (
                <AdminPanel
                    onLogout={handleAdminLogout}
                    onClose={() => setIsAdmin(false)}
                />
            )}
        </>
    );
};

export default Footer;