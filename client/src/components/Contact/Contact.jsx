import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    FaPhone,
    FaEnvelope,
    FaPaperPlane,
    FaCheckCircle,
    FaExclamationCircle,
    FaWhatsapp,
    FaTelegram,
    FaInstagram,
    FaMapMarkerAlt,
    FaRegClock,
    FaSpinner
} from 'react-icons/fa';
import {
    MdOutlineSupportAgent,
    MdLocationOn,
} from 'react-icons/md';
import './Contact.css';
import Button from '../common/Button/Button';

const Contact = () => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
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
    const [todayHours, setTodayHours] = useState([]);

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

    const serviceOptions = useMemo(() => [
        { value: '', label: 'Выберите услугу' },
        { value: 'installation', label: 'Монтаж электропроводки' },
        { value: 'repair', label: 'Ремонт проводки' },
        { value: 'equipment', label: 'Установка оборудования' },
        { value: 'maintenance', label: 'Обслуживание' },
        { value: 'consultation', label: 'Консультация' },
        { value: 'measurement', label: 'Замеры и проектирование' },
        { value: 'emergency', label: 'Аварийный вызов' },
        { value: 'other', label: 'Другое' }
    ], []);

    // Формирование контактных кнопок из конфигурации
    const contactButtons = useMemo(() => {
        if (!config) return [];
        return [
            { icon: <FaPhone />, label: 'Позвонить', href: `tel:${config.phoneRaw?.replace(/\D/g, '') || ''}`, color: '#27ae60' },
            { icon: <FaWhatsapp />, label: 'WhatsApp', href: `https://wa.me/${config.phoneForWhatsapp || ''}`, color: '#25D366' },
            { icon: <FaTelegram />, label: 'Telegram', href: `https://t.me/${config.telegramUsername || ''}`, color: '#0088cc' },
            { icon: <FaEnvelope />, label: 'Email', href: `mailto:${config.email || ''}`, color: '#EA4335' },
            { icon: <FaInstagram />, label: 'Instagram', href: `https://instagram.com/${config.instagramUsername || ''}`, color: '#E4405F' }
        ];
    }, [config]);

    // Формирование часов работы
    const workingHours = useMemo(() => {
        if (!config) return [];
        return [
            { day: 'Понедельник', hours: config.weekdayHours },
            { day: 'Вторник', hours: config.weekdayHours },
            { day: 'Среда', hours: config.weekdayHours },
            { day: 'Четверг', hours: config.weekdayHours },
            { day: 'Пятница', hours: config.weekdayHours },
            { day: 'Суббота', hours: config.weekendHours },
            { day: 'Воскресенье', hours: config.weekendHours }
        ];
    }, [config]);

    // Полный адрес
    const fullAddress = useMemo(() => {
        if (!config) return '';
        return `${config.addressStreet}, ${config.addressCity}, ${config.officeDescription}`;
    }, [config]);

    useEffect(() => {
        if (!workingHours.length) return;
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const today = days[new Date().getDay()];

        const updatedHours = workingHours.map(wh => ({
            ...wh,
            isToday: wh.day === today
        }));

        setTodayHours(updatedHours);
    }, [workingHours]);

    // Проверка работает ли сейчас
    const isWorkingNow = useCallback(() => {
        if (!config) return false;
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTime = hour + minute / 60;

        // Парсим часы
        const parseHours = (hoursStr) => {
            const [start, end] = hoursStr.split('-').map(s => s.trim());
            const startHour = parseInt(start.split(':')[0]);
            const endHour = parseInt(end.split(':')[0]);
            return { startHour, endHour };
        };

        if (day === 0 || day === 6) {
            const { startHour, endHour } = parseHours(config.weekendHours || '09:00 - 18:00');
            return currentTime >= startHour && currentTime < endHour;
        } else {
            const { startHour, endHour } = parseHours(config.weekdayHours || '08:00 - 20:00');
            return currentTime >= startHour && currentTime < endHour;
        }
    }, [config]);

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

        if (typeof navigator !== 'undefined' && navigator.userAgent.includes('HeadlessChrome')) {
            console.log('Сборка статики, пропускаем отправку формы');
            setFormStatus({
                type: 'success',
                message: '✅ Демо-режим: форма не отправлена при сборке сайта'
            });
            setTimeout(() => setFormStatus(null), 3000);
            return;
        }

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsSubmitting(true);
        setFormStatus(null);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contact`, {
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
                    message: data.message || '✅ Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.'
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
                message: error.message || '❌ Произошла ошибка. Пожалуйста, попробуйте еще раз или позвоните нам.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyMapLink = () => {
        if (config?.yandexMapUrl) {
            navigator.clipboard.writeText(config.yandexMapUrl)
                .then(() => {
                    const notification = document.createElement('div');
                    notification.textContent = '📍 Ссылка на карту скопирована';
                    notification.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#27ae60;color:white;padding:10px 20px;border-radius:8px;z-index:9999;font-family:sans-serif;';
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 2000);
                })
                .catch(err => {
                    console.error('Ошибка при копировании: ', err);
                });
        }
    };

    if (loading) {
        return (
            <section id="contact" className="contact-section">
                <div className="contact-container">
                    <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>
                </div>
            </section>
        );
    }

    if (!config) {
        return (
            <section id="contact" className="contact-section">
                <div className="contact-container">
                    <div style={{ textAlign: 'center', padding: '50px' }}>Ошибка загрузки контактов</div>
                </div>
            </section>
        );
    }

    return (
        <section id="contact" className="contact-section" aria-label="Контактная информация">
            <div className="contact-container">
                <div className="contact-section-header">
                    <h2 className="contact-section-title">Контакты в {config.addressCity}</h2>
                    <p className="contact-section-subtitle">
                        {config.companyDescription}
                    </p>
                </div>

                <div className="contact-main-wrapper">
                    {/* Левая колонка - информация и карта */}
                    <div className="contact-left-column">
                        {/* Адрес и контакты */}
                        <div className="contact-info-card">
                            <div className="contact-info-header">
                                <div className="contact-status-wrapper">
                                    <div className={`contact-availability-badge ${isWorkingNow() ? 'contact-online' : 'contact-offline'}`}>
                                        <span className="contact-status-dot"></span>
                                        <span>{isWorkingNow() ? 'Работаем сейчас' : 'Сейчас закрыто'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Адрес */}
                            <div className="contact-address-section">
                                <div className="contact-address-item">
                                    <div className="contact-address-text">
                                        <h4>
                                            <MdLocationOn className="contact-address-icon" />
                                            Наш адрес
                                        </h4>
                                        <a
                                            href={config.map2GisUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="contact-address-link"
                                            aria-label="Открыть адрес на 2GIS"
                                        >
                                            {fullAddress}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Часы работы */}
                            <div className="contact-hours-section">
                                <h3>
                                    <FaRegClock className="section-icon" />
                                    График работы
                                </h3>
                                <div className="contact-hours-table">
                                    {todayHours.map((day, index) => (
                                        <div
                                            key={index}
                                            className={`contact-hours-row ${day.isToday ? 'contact-today' : ''}`}
                                        >
                                            <span className="contact-day-name">
                                                {day.isToday && '🟢 '}{day.day}
                                            </span>
                                            {day.isToday && (
                                                <span className={`contact-day-status ${isWorkingNow() ? 'status-open' : 'status-closed'}`}>
                                                    <span className="contact-day-hours">{day.hours}</span>
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {config.emergencyAvailable && (
                                    <p className="contact-hours-note">
                                        * {config.emergencyText}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Карта */}
                        <div className="contact-map-card">
                            <div className="contact-map-header">
                                <div className="contact-map-header-top">
                                    <h3>
                                        <FaMapMarkerAlt className="section-icon" />
                                        Мы на карте {config.addressCity}
                                    </h3>
                                </div>
                                <p>{fullAddress}</p>
                            </div>
                            <div className="contact-map-container">
                                {config.yandexMapEmbedUrl ? (
                                    <iframe
                                        title={`Карта проезда к офису ${config.companyName} в ${config.addressCity}`}
                                        src={config.yandexMapEmbedUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, borderRadius: '8px' }}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="contact-map-iframe"
                                    />
                                ) : (
                                    <div className="contact-map-error">
                                        <p>⚠️ Карта временно недоступна</p>
                                    </div>
                                )}
                            </div>
                            <div className="contact-map-actions">
                                <a
                                    href={config.yandexMapUrl}
                                    className="contact-map-action-btn"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Открыть в Яндекс.Картах"
                                >
                                    🗺️ Яндекс.Карты
                                </a>
                                <a
                                    href={config.map2GisUrl}
                                    className="contact-map-action-btn"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Открыть на 2GIS"
                                >
                                    🗺️ 2GIS
                                </a>
                                <button
                                    className="contact-map-action-btn contact-secondary"
                                    onClick={handleCopyMapLink}
                                    aria-label="Скопировать ссылку на карту"
                                >
                                    📋 Скопировать
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
                                <p className="contact-response-time">⏱ Ответим в течение {config.responseTime}</p>
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
                                            aria-label="Ваше имя"
                                            aria-invalid={!!formErrors.name}
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
                                            placeholder={config.phoneDisplay}
                                            className={formErrors.phone ? 'contact-error' : ''}
                                            aria-label="Номер телефона"
                                            aria-invalid={!!formErrors.phone}
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
                                            aria-label="Email"
                                            aria-invalid={!!formErrors.email}
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
                                            aria-label="Тип услуги"
                                            aria-invalid={!!formErrors.service}
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
                                        placeholder="Опишите вашу задачу или задайте вопрос..."
                                        rows="4"
                                        aria-label="Сообщение"
                                    />
                                </div>

                                {formStatus && (
                                    <div className={`contact-form-status contact-${formStatus.type}`} role="alert">
                                        {formStatus.type === 'success' ? (
                                            <FaCheckCircle aria-hidden="true" />
                                        ) : (
                                            <FaExclamationCircle aria-hidden="true" />
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
                                    aria-label={isSubmitting ? 'Отправка заявки...' : 'Отправить заявку'}
                                >
                                    {isSubmitting ? (
                                        'Отправка...'
                                    ) : (
                                        <>
                                            <FaPaperPlane aria-hidden="true" />
                                            Отправить заявку
                                        </>
                                    )}
                                </Button>

                                <p className="contact-form-note">
                                    Нажимая на кнопку, вы соглашаетесь с политикой обработки персональных данных
                                </p>

                                <div className="contact-quick-buttons" aria-label="Быстрая связь">
                                    {contactButtons.map((btn, index) => (
                                        <a
                                            key={index}
                                            href={btn.href}
                                            className="contact-quick-btn"
                                            target={btn.href.startsWith('http') ? '_blank' : '_self'}
                                            rel="noopener noreferrer"
                                            style={{ backgroundColor: btn.color }}
                                            title={btn.label}
                                            aria-label={`Связаться через ${btn.label}`}
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