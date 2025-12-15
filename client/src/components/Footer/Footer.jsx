import React from 'react';
import {
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
    FaChevronRight,
    FaRegCopyright
} from 'react-icons/fa';
import { MdElectricalServices } from 'react-icons/md';
import './Footer.css';
import Button from '../common/Button/Button';

const Footer = () => {
    const currentYear = new Date().getFullYear();

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
        { icon: <FaClock />, text: 'Пн-Пт: 8:00-20:00, Сб-Вс: 9:00-18:00', link: '#contact' }
    ];

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

                            <p className="footer-company-description">
                                Профессиональные электромонтажные работы любой сложности.
                                Более 12 лет опыта, гарантия качества, современное оборудование.
                            </p>

                            <div className="footer-contact-list">
                                {contactInfo.map((contact, index) => (
                                    <a
                                        key={index}
                                        href={contact.link}
                                        className="footer-contact-item"
                                        target={contact.link.startsWith('http') ? '_blank' : '_self'}
                                        rel="noopener noreferrer"
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

                        {/*<div className="footer-legal-links">*/}
                        {/*    <a href="/privacy" className="footer-legal-link">Политика конфиденциальности</a>*/}
                        {/*    <a href="/terms" className="footer-legal-link">Пользовательское соглашение</a>*/}
                        {/*    <a href="/sitemap" className="footer-legal-link">Карта сайта</a>*/}
                        {/*</div>*/}

                        <div className="footer-developer-info">
                            <span>Разработка сайта:</span>
                            <a href="https://webmaster.ru" className="footer-developer-link" target="_blank" rel="noopener noreferrer">
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

            {/* Флоатинг кнопки быстрой связи */}
            <div className="footer-floating-buttons">
                <a
                    href="tel:+79991234567"
                    className="footer-floating-button footer-phone-button"
                    aria-label="Позвонить"
                >
                    <FaPhone />
                </a>
                <a
                    href="https://wa.me/79991234567"
                    className="footer-floating-button footer-whatsapp-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                >
                    <FaEnvelope />
                </a>
                <button
                    className="footer-floating-button footer-callback-button"
                    onClick={() => document.querySelector('.contact')?.scrollIntoView({ behavior: 'smooth' })}
                    aria-label="Заказать звонок"
                >
                    <FaEnvelope />
                </button>
            </div>
        </footer>
    );
};

export default Footer;