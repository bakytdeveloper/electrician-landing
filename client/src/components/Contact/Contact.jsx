import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    FaPhone,
    FaEnvelope,
    FaClock,
    FaPaperPlane,
    FaCheckCircle,
    FaExclamationCircle,
    FaWhatsapp,
    FaTelegram,
    FaVk,
    FaInstagram
} from 'react-icons/fa';
import {
    MdOutlineSupportAgent,
} from 'react-icons/md';
import './Contact.css';
import Button from '../common/Button/Button';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        service: '',
        message: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [formStatus, setFormStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const mapContainerRef = useRef(null);
    const mapIframeRef = useRef(null);
    const [todayHours, setTodayHours] = useState([]);

    const MAP_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31316.225376002167!2d74.70231946796906!3d43.0428249895966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x389ebdd96a23754f%3A0x910c9ee831c61010!2sAk%20zhol%20border%20control%20point!5e0!3m2!1sen!2skg!4v1765603960864!5m2!1sen!2skg";

    const serviceOptions = useMemo(() => [
        { value: '', label: 'Выберите услугу' },
        { value: 'installation', label: 'Монтаж электропроводки' },
        { value: 'repair', label: 'Ремонт проводки' },
        { value: 'equipment', label: 'Установка оборудования' },
        { value: 'maintenance', label: 'Обслуживание' },
        { value: 'consultation', label: 'Консультация' },
        { value: 'other', label: 'Другое' }
    ], []);

    const workingHours = useMemo(() => [
        { day: 'Понедельник', hours: '8:00 - 20:00' },
        { day: 'Вторник', hours: '8:00 - 20:00' },
        { day: 'Среда', hours: '8:00 - 20:00' },
        { day: 'Четверг', hours: '8:00 - 20:00' },
        { day: 'Пятница', hours: '8:00 - 20:00' },
        { day: 'Суббота', hours: '9:00 - 18:00' },
        { day: 'Воскресенье', hours: '9:00 - 18:00' }
    ], []);

    const contactButtons = useMemo(() => [
        { icon: <FaPhone />, label: 'Позвонить', href: 'tel:+79991234567', color: '#27ae60' },
        { icon: <FaWhatsapp />, label: 'WhatsApp', href: 'https://wa.me/79991234567', color: '#25D366' },
        { icon: <FaTelegram />, label: 'Telegram', href: 'https://t.me/electromaster', color: '#0088cc' },
        { icon: <FaEnvelope />, label: 'Email', href: 'mailto:info@electromaster.ru', color: '#EA4335' },
        { icon: <FaVk />, label: 'VK', href: 'https://vk.com/electromaster', color: '#4C75A3' },
        { icon: <FaInstagram />, label: 'Instagram', href: 'https://instagram.com/electromaster', color: '#E4405F' }
    ], []);

    useEffect(() => {
        const loadMap = () => {
            if (mapContainerRef.current) {
                setIsMapLoaded(true);
            }
        };

        const timer = setTimeout(loadMap, 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const today = days[new Date().getDay()];

        const updatedHours = workingHours.map(wh => ({
            ...wh,
            isToday: wh.day === today
        }));

        setTodayHours(updatedHours);
    }, [workingHours]);

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Введите ваше имя';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Имя должно содержать минимум 2 символа';
        }

        if (!formData.phone.trim()) {
            errors.phone = 'Введите номер телефона';
        } else if (!/^[+]?[0-9\s\-()]+$/.test(formData.phone)) {
            errors.phone = 'Введите корректный номер телефона';
        }

        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Введите корректный email';
        }

        if (!formData.service) {
            errors.service = 'Выберите тип услуги';
        }

        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsSubmitting(true);
        setFormStatus(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setFormStatus({
                    type: 'success',
                    message: data.message || 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.'
                });

                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    service: '',
                    message: ''
                });

                setTimeout(() => {
                    setFormStatus(null);
                }, 5000);

            } else {
                throw new Error(data.message || 'Ошибка при отправке формы');
            }

        } catch (error) {
            setFormStatus({
                type: 'error',
                message: error.message || 'Произошла ошибка. Пожалуйста, попробуйте еще раз.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isWorkingNow = () => {
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();

        if (day === 0 || day === 6) {
            return hour >= 9 && hour < 18;
        } else {
            return hour >= 8 && hour < 20;
        }
    };

    const reloadMap = () => {
        setIsMapLoaded(false);
        setTimeout(() => {
            if (mapIframeRef.current) {
                const currentSrc = mapIframeRef.current.src;
                const separator = currentSrc.includes('?') ? '&' : '?';
                mapIframeRef.current.src = currentSrc + separator + 'reload=' + Date.now();
                setIsMapLoaded(true);
            }
        }, 100);
    };

    const handleCopyMapLink = () => {
        navigator.clipboard.writeText('https://maps.google.com/?q=Ak+zhol+border+control+point')
            .then(() => {
                console.log('Ссылка скопирована');
            })
            .catch(err => {
                console.error('Ошибка при копировании: ', err);
            });
    };

    return (
        <section id="contact" className="contact-section">
            <div className="contact-container">
                <div className="contact-section-header">
                    <h2 className="contact-section-title">Контакты</h2>
                    <p className="contact-section-subtitle">
                        Свяжитесь с нами любым удобным способом. Мы всегда готовы помочь с вашими электромонтажными работами.
                    </p>
                </div>

                <div className="contact-main-wrapper">
                    {/* Левая колонка - информация и карта */}
                    <div className="contact-left-column">
                        <div className="contact-info-card">
                            <div className="contact-info-header">
                                <div className="contact-status-wrapper">
                                    <div className={`contact-availability-badge ${isWorkingNow() ? 'contact-online' : 'contact-offline'}`}>
                                        <span className="contact-status-dot"></span>
                                        <span>{isWorkingNow() ? 'График работы' : 'График работы'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="contact-hours-section">
                                {/*<h3>График работы</h3>*/}
                                <div className="contact-hours-table">
                                    {todayHours.map((day, index) => (
                                        <div
                                            key={index}
                                            className={`contact-hours-row ${day.isToday ? 'contact-today' : ''}`}
                                        >
                                            <span className="contact-day-name">{day.day}</span>
                                            <span className="contact-day-hours">{day.hours}</span>
                                            {day.isToday && (
                                                <span className={`contact-day-status ${isWorkingNow() ? 'status-open' : 'status-closed'}`}>
                                                    {isWorkingNow() ? 'Открыто' : 'Закрыто'}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="contact-map-card">
                            <div className="contact-map-header">
                                <div className="contact-map-header-top">
                                    <h3>Мы на карте</h3>
                                    <button
                                        className="contact-map-reload-btn"
                                        onClick={reloadMap}
                                        title="Обновить карту"
                                    >
                                        ⟳
                                    </button>
                                </div>
                                <p>Приезжайте к нам в офис для консультации</p>
                            </div>
                            <div className="contact-map-container" ref={mapContainerRef}>
                                {isMapLoaded ? (
                                    <iframe
                                        ref={mapIframeRef}
                                        src={MAP_URL}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Google Maps - Ak zhol border control point"
                                        className="contact-map-iframe"
                                    />
                                ) : (
                                    <div className="contact-map-loading">
                                        <div className="contact-map-loading-spinner"></div>
                                        <p>Загрузка карты...</p>
                                    </div>
                                )}
                            </div>
                            <div className="contact-map-actions">
                                <a
                                    href="https://www.google.com/maps?q=Ak+zhol+border+control+point"
                                    className="contact-map-action-btn"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Открыть в Google Картах
                                </a>
                                <button
                                    className="contact-map-action-btn contact-secondary"
                                    onClick={handleCopyMapLink}
                                >
                                    Скопировать ссылку
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка - форма */}
                    <div className="contact-right-column">
                        <div className="contact-form-card">
                            <div className="contact-form-header">
                                <div className="contact-form-icon">
                                    <MdOutlineSupportAgent />
                                </div>
                                <h3>Оставьте заявку</h3>
                                <p>Заполните форму и получите бесплатную консультацию</p>
                            </div>

                            <form onSubmit={handleSubmit} className="contact-form" noValidate>
                                <div className="contact-form-grid">
                                    <div className="contact-form-group">
                                        <label htmlFor="name">
                                            Ваше имя *
                                            {formErrors.name && (
                                                <span className="contact-error-message">
                                                    <FaExclamationCircle /> {formErrors.name}
                                                </span>
                                            )}
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Иван Иванов"
                                            className={formErrors.name ? 'contact-error' : ''}
                                            required
                                        />
                                    </div>

                                    <div className="contact-form-group">
                                        <label htmlFor="phone">
                                            Номер телефона *
                                            {formErrors.phone && (
                                                <span className="contact-error-message">
                                                    <FaExclamationCircle /> {formErrors.phone}
                                                </span>
                                            )}
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+7 (999) 123-45-67"
                                            className={formErrors.phone ? 'contact-error' : ''}
                                            required
                                        />
                                    </div>

                                    <div className="contact-form-group">
                                        <label htmlFor="email">
                                            Email
                                            {formErrors.email && (
                                                <span className="contact-error-message">
                                                    <FaExclamationCircle /> {formErrors.email}
                                                </span>
                                            )}
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="example@mail.ru"
                                            className={formErrors.email ? 'contact-error' : ''}
                                        />
                                    </div>

                                    <div className="contact-form-group">
                                        <label htmlFor="service">
                                            Тип услуги *
                                            {formErrors.service && (
                                                <span className="contact-error-message">
                                                    <FaExclamationCircle /> {formErrors.service}
                                                </span>
                                            )}
                                        </label>
                                        <select
                                            id="service"
                                            name="service"
                                            value={formData.service}
                                            onChange={handleChange}
                                            className={formErrors.service ? 'contact-error' : ''}
                                            required
                                        >
                                            {serviceOptions.map((option, index) => (
                                                <option key={index} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="contact-form-group">
                                    <label htmlFor="message">Сообщение</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Опишите вашу проблему или задайте вопрос..."
                                        rows="4"
                                    />
                                </div>

                                {formStatus && (
                                    <div className={`contact-form-status contact-${formStatus.type}`}>
                                        {formStatus.type === 'success' ? (
                                            <FaCheckCircle />
                                        ) : (
                                            <FaExclamationCircle />
                                        )}
                                        <span>{formStatus.message}</span>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="large"
                                    fullWidth
                                    disabled={isSubmitting}
                                    className="contact-submit-button"
                                >
                                    {isSubmitting ? (
                                        'Отправка...'
                                    ) : (
                                        <>
                                            <FaPaperPlane />
                                            Отправить заявку
                                        </>
                                    )}
                                </Button>

                                <p className="contact-form-note">
                                    Мы свяжемся с вами в течение 30 минут.
                                </p>

                                {/* Кнопки быстрой связи */}
                                <div className="contact-quick-buttons">
                                    {contactButtons.map((btn, index) => (
                                        <a
                                            key={index}
                                            href={btn.href}
                                            className="contact-quick-btn"
                                            target={btn.href.startsWith('http') ? '_blank' : '_self'}
                                            rel="noopener noreferrer"
                                            style={{ backgroundColor: btn.color }}
                                            title={btn.label}
                                        >
                                            {btn.icon}
                                        </a>
                                    ))}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;