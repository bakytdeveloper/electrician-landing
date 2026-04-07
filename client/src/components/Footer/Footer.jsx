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
    const currentYear = new Date().getFullYear();

    // КОНТАКТНЫЕ ДАННЫЕ ДЛЯ АЛМАТЫ (синхронизированы)
    const phoneNumber = '+7 (727) 123-45-67';
    const emailAddress = 'info@electromaster.kz';
    const whatsappNumber = '77071234567';
    const telegramUsername = 'electromaster_almaty';
    const instagramUsername = 'electromaster_almaty';
    const officeAddress = 'г. Алматы, БЦ Нурлы Тау, офис 123';
    const mapLink = 'https://goo.gl/maps/NurlyTauAlmaty';

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

    // ИСПРАВЛЕНО: контактные данные под Алматы
    const contactInfo = [
        { icon: <FaPhone />, text: phoneNumber, link: `tel:${phoneNumber.replace(/\D/g, '')}` },
        { icon: <FaWhatsapp />, text: 'WhatsApp', link: `https://wa.me/${whatsappNumber}` },
        { icon: <FaTelegram />, text: 'Telegram', link: `https://t.me/${telegramUsername}` },
        { icon: <FaInstagram />, text: 'Instagram', link: `https://instagram.com/${instagramUsername}` },
        { icon: <FaEnvelope />, text: emailAddress, link: `mailto:${emailAddress}` },
        { icon: <FaMapMarkerAlt />, text: officeAddress, link: mapLink },
        { icon: <FaClock />, text: 'Пн-Пт: 08:00-20:00, Сб-Вс: 09:00-18:00', link: '#contact' },
        { icon: <FaLock />, text: 'Админ-панель', link: 'admin' }
    ];

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
                                        <div className="footer-logo-title">ЭлектроМастер Алматы</div>
                                        <p className="footer-logo-subtitle">Профессиональные услуги электрика</p>
                                    </div>
                                </div>

                                <div className="footer-contact-list">
                                    {contactInfo.map((contact, index) => (
                                        <a
                                            key={index}
                                            href={contact.link}
                                            className={`footer-contact-item ${contact.text === 'Админ-панель' ? 'admin-link' : ''}`}
                                            target={contact.link.startsWith('http') ? '_blank' : '_self'}
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
                                <span>{currentYear} ЭлектроМастер Алматы. Все права защищены.</span>
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