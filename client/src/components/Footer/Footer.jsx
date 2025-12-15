import React from 'react';
import {
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
    FaChevronRight,
    FaFacebook,
    FaInstagram,
    FaTelegram,
    FaYoutube,
    FaVk,
    FaWhatsapp,
    FaRegCopyright,
    FaShieldAlt,
    FaCreditCard
} from 'react-icons/fa';
import { MdElectricalServices, MdSupportAgent } from 'react-icons/md';
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
        { label: 'Цены', href: '#services' },
        { label: 'Акции', href: '#home' }
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
        { icon: <FaMapMarkerAlt />, text: 'Москва, ул. Электриков, д. 15', link: 'https://yandex.ru/maps' },
        { icon: <FaClock />, text: 'Пн-Пт: 8:00-20:00, Сб-Вс: 9:00-18:00', link: '#contact' }
    ];

    const socialLinks = [
        { icon: <FaVk />, label: 'ВКонтакте', href: 'https://vk.com/electromaster', color: '#4C75A3' },
        { icon: <FaTelegram />, label: 'Telegram', href: 'https://t.me/electromaster', color: '#0088cc' },
        { icon: <FaWhatsapp />, label: 'WhatsApp', href: 'https://wa.me/79991234567', color: '#25D366' },
        { icon: <FaInstagram />, label: 'Instagram', href: 'https://instagram.com/electromaster', color: '#E4405F' },
        { icon: <FaYoutube />, label: 'YouTube', href: 'https://youtube.com/electromaster', color: '#FF0000' },
        { icon: <FaFacebook />, label: 'Facebook', href: 'https://facebook.com/electromaster', color: '#1877F2' }
    ];

    const paymentMethods = [
        { label: 'Наличные', icon: '💵' },
        { label: 'Банковская карта', icon: '💳' },
        { label: 'Безналичный расчет', icon: '🏦' },
        { label: 'Перевод', icon: '📱' }
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
                        <div className="footer-column about-column">
                            <div className="footer-logo">
                                <MdElectricalServices className="logo-icon" />
                                <div className="logo-text">
                                    <h3 className="logo-title">ЭлектроМастер</h3>
                                    <p className="logo-subtitle">Профессиональные услуги электрика</p>
                                </div>
                            </div>

                            <p className="company-description">
                                Профессиональные электромонтажные работы любой сложности.
                                Более 12 лет опыта, гарантия качества, современное оборудование.
                            </p>

                            <div className="contact-list">
                                {contactInfo.map((contact, index) => (
                                    <a
                                        key={index}
                                        href={contact.link}
                                        className="contact-item"
                                        target={contact.link.startsWith('http') ? '_blank' : '_self'}
                                        rel="noopener noreferrer"
                                    >
                                        <span className="contact-icon">{contact.icon}</span>
                                        <span className="contact-text">{contact.text}</span>
                                    </a>
                                ))}
                            </div>

                            <div className="emergency-call-footer">
                                <div className="emergency-icon">
                                    <MdSupportAgent />
                                </div>
                                <div className="emergency-content">
                                    <h4>Экстренный вызов</h4>
                                    <p>24/7 без выходных</p>
                                    <a href="tel:+79991234567" className="emergency-link">
                                        +7 (999) 123-45-67
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Колонка 2: Быстрые ссылки */}
                        <div className="footer-column links-column">
                            <h4 className="column-title">Быстрые ссылки</h4>
                            <ul className="footer-links">
                                {quickLinks.map((link, index) => (
                                    <li key={index} className="footer-link-item">
                                        <button
                                            className="footer-link"
                                            onClick={() => handleQuickLinkClick(link.href)}
                                        >
                                            <FaChevronRight className="link-icon" />
                                            <span>{link.label}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div className="footer-features">
                                <div className="feature">
                                    <FaShieldAlt className="feature-icon" />
                                    <div className="feature-text">
                                        <span className="feature-title">Гарантия</span>
                                        <span className="feature-desc">до 3 лет</span>
                                    </div>
                                </div>
                                <div className="feature">
                                    <FaCreditCard className="feature-icon" />
                                    <div className="feature-text">
                                        <span className="feature-title">Оплата</span>
                                        <span className="feature-desc">любым способом</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Колонка 3: Услуги */}
                        <div className="footer-column services-column">
                            <h4 className="column-title">Наши услуги</h4>
                            <ul className="footer-links">
                                {services.map((service, index) => (
                                    <li key={index} className="footer-link-item">
                                        <button
                                            className="footer-link"
                                            onClick={() => handleQuickLinkClick(service.href)}
                                        >
                                            <FaChevronRight className="link-icon" />
                                            <span>{service.label}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div className="payment-methods">
                                <h5>Способы оплаты</h5>
                                <div className="payment-icons">
                                    {paymentMethods.map((method, index) => (
                                        <div key={index} className="payment-method">
                                            <span className="payment-icon">{method.icon}</span>
                                            <span className="payment-label">{method.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Колонка 4: Подписка и соцсети */}
                        <div className="footer-column subscription-column">
                            <h4 className="column-title">Подпишитесь на новости</h4>
                            <p className="subscription-desc">
                                Получайте полезные советы по электробезопасности и специальные предложения
                            </p>

                            <form className="subscription-form">
                                <div className="form-group">
                                    <input
                                        type="email"
                                        placeholder="Ваш email"
                                        className="email-input"
                                        required
                                    />
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="small"
                                        className="subscribe-btn"
                                    >
                                        Подписаться
                                    </Button>
                                </div>
                                <p className="form-note">
                                    Подписываясь, вы соглашаетесь с политикой конфиденциальности
                                </p>
                            </form>

                            <div className="social-section">
                                <h5>Мы в социальных сетях</h5>
                                <div className="social-links-grid">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.href}
                                            className="social-link"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ '--social-color': social.color }}
                                            aria-label={social.label}
                                        >
                                            {social.icon}
                                            <span className="social-tooltip">{social.label}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="app-download">
                                <h5>Мобильное приложение</h5>
                                <p>Вызовите электрика в один клик</p>
                                <div className="app-buttons">
                                    <button className="app-button google-play">
                                        <span className="app-label">Доступно в</span>
                                        <span className="app-name">Google Play</span>
                                    </button>
                                    <button className="app-button app-store">
                                        <span className="app-label">Загрузите в</span>
                                        <span className="app-name">App Store</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Нижняя часть футера */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <div className="copyright">
                            <FaRegCopyright className="copyright-icon" />
                            <span>{currentYear} ЭлектроМастер. Все права защищены.</span>
                        </div>

                        <div className="legal-links">
                            <a href="/privacy" className="legal-link">Политика конфиденциальности</a>
                            <a href="/terms" className="legal-link">Пользовательское соглашение</a>
                            <a href="/sitemap" className="legal-link">Карта сайта</a>
                        </div>

                        <div className="developer-info">
                            <span>Разработка сайта:</span>
                            <a href="https://webmaster.ru" className="developer-link" target="_blank" rel="noopener noreferrer">
                                WebMaster Studio
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Кнопка "Наверх" */}
            <button
                className="scroll-to-top"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Наверх"
            >
                <span className="arrow-up">↑</span>
            </button>

            {/* Флоатинг кнопки быстрой связи */}
            <div className="floating-buttons">
                <a
                    href="tel:+79991234567"
                    className="floating-button phone-button"
                    aria-label="Позвонить"
                >
                    <FaPhone />
                </a>
                <a
                    href="https://wa.me/79991234567"
                    className="floating-button whatsapp-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                >
                    <FaWhatsapp />
                </a>
                <button
                    className="floating-button callback-button"
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