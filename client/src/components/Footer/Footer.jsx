import React, { useState, useEffect } from 'react';
import {
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
    FaChevronRight,
    FaLock,
    FaRegCopyright
} from 'react-icons/fa';
import { MdElectricalServices } from 'react-icons/md';
import './Footer.css';
import AdminLogin from '../Admin/AdminLogin/AdminLogin';
import AdminPanel from '../Admin/AdminPanel/AdminPanel';

const Footer = () => {
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const currentYear = new Date().getFullYear();

    // Проверяем наличие токена при загрузке компонента
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            // Проверяем валидность токена
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
        { label: 'Контакты', href: '#contact' },
        { label: 'Отзывы', href: '#about' },
        { label: 'Цены', href: '#services' }
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

    const contactInfo = [
        { icon: <FaPhone />, text: '+7 (999) 123-45-67', link: 'tel:+79991234567' },
        { icon: <FaEnvelope />, text: 'info@electromaster.ru', link: 'mailto:info@electromaster.ru' },
        { icon: <FaMapMarkerAlt />, text: 'Кордай, ул.Электриков, д. 15', link: 'https://www.google.com/maps?q=Ak+zhol+border+control+point' },
        { icon: <FaClock />, text: 'Пн-Пт: 8:00-20:00, Сб-Вс: 9:00-18:00', link: '#contact' },
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
                // Если есть токен, сразу открываем админ-панель
                verifyToken(token);
                setIsAdmin(true);
            } else {
                // Если нет токена, показываем окно авторизации
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
                {/* Основной контент футера */}
                <div className="footer-main">
                    <div className="container">
                        <div className="footer-content">
                            {/* Колонка 1: О компании */}
                            <div className="footer-column">
                                <div className="footer-logo">
                                    <MdElectricalServices className="footer-logo-icon" />
                                    <div className="footer-logo-text">
                                        <h3 className="footer-logo-title">ЭлектроМастер</h3>
                                        <p className="footer-logo-subtitle">Профессиональные услуги электрика</p>
                                    </div>
                                </div>

                                {/*<p className="footer-company-description">*/}
                                {/*    Профессиональные электромонтажные работы любой сложности.*/}
                                {/*    Более 12 лет опыта, гарантия качества, современное оборудование.*/}
                                {/*</p>*/}

                                <div className="footer-contact-list">
                                    {contactInfo.map((contact, index) => (
                                        <a
                                            key={index}
                                            href={contact.link}
                                            className={`footer-contact-item ${contact.text === 'Админ-панель' ? 'admin-link' : ''}`}
                                            target={contact.link.startsWith('http') ? '_blank' : '_self'}
                                            rel="noopener noreferrer"
                                            onClick={(e) => handleContactClick(e, contact)}
                                        >
                                            <span className="footer-contact-icon">{contact.icon}</span>
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
                                            >
                                                <FaChevronRight className="footer-link-icon" />
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
                                            >
                                                <FaChevronRight className="footer-link-icon" />
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
                                <FaRegCopyright className="footer-copyright-icon" />
                                <span>{currentYear} ЭлектроМастер. Все права защищены.</span>
                            </div>

                            <div className="footer-developer-info">
                                <span>Разработка сайта:</span>
                                <a href="mailto:bakytdeveloper@gmail.com" className="footer-developer-link" target="_blank" rel="noopener noreferrer">
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
                    aria-label="Наверх"
                >
                    <span className="footer-arrow-up">↑</span>
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