// client/src/components/Contact/Contact.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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

// Функция для получения переменных окружения с fallback
const getEnv = (key, fallback = '') => process.env[key] || fallback;

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
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState(false);
    const iframeRef = useRef(null);
    const loadTimeoutRef = useRef(null);
    const [todayHours, setTodayHours] = useState([]);

    // === ДАННЫЕ ИЗ .env ===
    const MAP_EMBED_URL = getEnv('REACT_APP_MAP_EMBED_URL', '');
    const MAP_DIRECT_URL = getEnv('REACT_APP_MAP_DIRECT_URL', 'https://maps.google.com/?q=Nurly+Tau+Business+Center+Almaty');
    const MAP_2GIS_URL = getEnv('REACT_APP_2GIS_URL', 'https://2gis.kz/almaty/search/Нурлы%20Тау');
    const MAP_YANDEX_URL = `https://yandex.kz/maps/?text=${encodeURIComponent(getEnv('REACT_APP_OFFICE_DESCRIPTION', 'БЦ Нурлы Тау Алматы'))}`;

    // Координаты для центрирования карты
    const lat = getEnv('REACT_APP_GEO_LAT', '43.2220');
    const lng = getEnv('REACT_APP_GEO_LNG', '76.8512');
    const officeName = encodeURIComponent(getEnv('REACT_APP_OFFICE_DESCRIPTION', 'БЦ Нурлы Тау Алматы'));

    const officeAddress = getEnv('REACT_APP_OFFICE_DESCRIPTION', 'г. Алматы, БЦ Нурлы Тау, офис 123');
    const phoneNumber = getEnv('REACT_APP_PHONE_DISPLAY', '+7 (727) 123-45-67');
    const phoneRaw = getEnv('REACT_APP_PHONE_RAW', '+77271234567');
    const whatsappNumber = getEnv('REACT_APP_PHONE_FOR_WHATSAPP', '77071234567');
    const emailAddress = getEnv('REACT_APP_EMAIL', 'info@electromaster.kz');
    const telegramUsername = getEnv('REACT_APP_TELEGRAM_USERNAME', 'electromaster_almaty');
    const instagramUsername = getEnv('REACT_APP_INSTAGRAM_USERNAME', 'electromaster_almaty');
    const companyName = getEnv('REACT_APP_COMPANY_NAME', 'ЭлектроМастер Алматы');
    const city = getEnv('REACT_APP_ADDRESS_CITY', 'Алматы');
    const weekdayHours = getEnv('REACT_APP_WEEKDAY_HOURS', '08:00 - 20:00');
    const weekendHours = getEnv('REACT_APP_WEEKEND_HOURS', '09:00 - 18:00');

    // Формируем URL для карты с координатами и меткой
    const getMapSrc = useCallback((withTimestamp = false) => {
        // Используем embed URL с параметрами для центрирования на нужном адресе
        // eslint-disable-next-line
        const baseUrl = MAP_EMBED_URL || 'https://www.google.com/maps/embed/v1/place';

        // Если это стандартный embed URL Google Maps
        if (MAP_EMBED_URL.includes('google.com/maps/embed')) {
            // Добавляем параметры для центрирования на месте
            const separator = MAP_EMBED_URL.includes('?') ? '&' : '?';
            let url = `${MAP_EMBED_URL}${separator}hl=ru&z=17`;
            if (withTimestamp) {
                url += `&t=${Date.now()}`;
            }
            return url;
        }

        // Альтернативный вариант: используем place embed
        return `https://www.google.com/maps/embed/v1/place?key=&q=${officeName}&center=${lat},${lng}&zoom=17&hl=ru${withTimestamp ? `&t=${Date.now()}` : ''}`;
    }, [MAP_EMBED_URL, officeName, lat, lng]);

    // Парсим часы для isWorkingNow
    const weekdayStart = parseInt(weekdayHours.split('-')[0].trim().split(':')[0]);
    const weekdayEnd = parseInt(weekdayHours.split('-')[1].trim().split(':')[0]);
    const weekendStart = parseInt(weekendHours.split('-')[0].trim().split(':')[0]);
    const weekendEnd = parseInt(weekendHours.split('-')[1].trim().split(':')[0]);

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

    const workingHours = useMemo(() => [
        { day: 'Понедельник', hours: weekdayHours },
        { day: 'Вторник', hours: weekdayHours },
        { day: 'Среда', hours: weekdayHours },
        { day: 'Четверг', hours: weekdayHours },
        { day: 'Пятница', hours: weekdayHours },
        { day: 'Суббота', hours: weekendHours },
        { day: 'Воскресенье', hours: weekendHours }
    ], [weekdayHours, weekendHours]);

    const contactButtons = useMemo(() => [
        { icon: <FaPhone />, label: 'Позвонить', href: `tel:${phoneRaw.replace(/\D/g, '')}`, color: '#27ae60' },
        { icon: <FaWhatsapp />, label: 'WhatsApp', href: `https://wa.me/${whatsappNumber}`, color: '#25D366' },
        { icon: <FaTelegram />, label: 'Telegram', href: `https://t.me/${telegramUsername}`, color: '#0088cc' },
        { icon: <FaEnvelope />, label: 'Email', href: `mailto:${emailAddress}`, color: '#EA4335' },
        { icon: <FaInstagram />, label: 'Instagram', href: `https://instagram.com/${instagramUsername}`, color: '#E4405F' }
    ], [phoneRaw, whatsappNumber, telegramUsername, emailAddress, instagramUsername]);

    // Функция загрузки карты
    const loadMap = useCallback(() => {
        if (!iframeRef.current) return;

        // Очищаем предыдущий таймаут
        if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
        }

        setMapLoaded(false);
        setMapError(false);

        // Таймаут для определения ошибки загрузки
        loadTimeoutRef.current = setTimeout(() => {
            console.log('Map loading timeout');
            setMapError(true);
        }, 15000);

        const iframe = iframeRef.current;

        // Обработчики событий
        const onLoad = () => {
            if (loadTimeoutRef.current) {
                clearTimeout(loadTimeoutRef.current);
            }
            setMapLoaded(true);
            setMapError(false);
            iframe.removeEventListener('load', onLoad);
            iframe.removeEventListener('error', onError);
        };

        const onError = () => {
            if (loadTimeoutRef.current) {
                clearTimeout(loadTimeoutRef.current);
            }
            setMapError(true);
            iframe.removeEventListener('load', onLoad);
            iframe.removeEventListener('error', onError);
        };

        iframe.addEventListener('load', onLoad);
        iframe.addEventListener('error', onError);

        // Устанавливаем src для загрузки карты с правильным адресом
        iframe.src = getMapSrc(false);
    }, [getMapSrc]);

    // Функция перезагрузки карты (по кнопке)
    const reloadMap = useCallback(() => {
        if (!iframeRef.current) return;

        // Очищаем таймаут
        if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
        }

        setMapLoaded(false);
        setMapError(false);

        const iframe = iframeRef.current;

        // Обработчики событий
        const onLoad = () => {
            if (loadTimeoutRef.current) {
                clearTimeout(loadTimeoutRef.current);
            }
            setMapLoaded(true);
            setMapError(false);
            iframe.removeEventListener('load', onLoad);
            iframe.removeEventListener('error', onError);
        };

        const onError = () => {
            if (loadTimeoutRef.current) {
                clearTimeout(loadTimeoutRef.current);
            }
            setMapError(true);
            iframe.removeEventListener('load', onLoad);
            iframe.removeEventListener('error', onError);
        };

        iframe.addEventListener('load', onLoad);
        iframe.addEventListener('error', onError);

        // Перезагружаем с timestamp для обхода кеша
        iframe.src = getMapSrc(true);

        // Таймаут для определения ошибки загрузки
        loadTimeoutRef.current = setTimeout(() => {
            setMapError(true);
        }, 15000);
    }, [getMapSrc]);

    // Загрузка карты при монтировании компонента (только один раз)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (iframeRef.current && MAP_EMBED_URL) {
                loadMap();
            }
        }, 500);

        return () => {
            clearTimeout(timer);
            if (loadTimeoutRef.current) {
                clearTimeout(loadTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const isWorkingNow = () => {
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTime = hour + minute / 60;

        if (day === 0 || day === 6) {
            return currentTime >= weekendStart && currentTime < weekendEnd;
        } else {
            return currentTime >= weekdayStart && currentTime < weekdayEnd;
        }
    };

    const handleCopyMapLink = () => {
        navigator.clipboard.writeText(MAP_DIRECT_URL)
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
    };

    return (
        <section id="contact" className="contact-section" aria-label="Контактная информация">
            <div className="contact-container">
                <div className="contact-section-header">
                    <h2 className="contact-section-title">Контакты в {city}</h2>
                    <p className="contact-section-subtitle">
                        Свяжитесь с нами любым удобным способом. Мы всегда готовы помочь с вашими электромонтажными работами в {city} и области.
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
                                            href={MAP_2GIS_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="contact-address-link"
                                            aria-label="Открыть адрес на 2GIS"
                                        >
                                            {officeAddress}
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
                                            {/*<span className="contact-day-hours">{day.hours}</span>*/}
                                            {day.isToday && (
                                                <span className={`contact-day-status ${isWorkingNow() ? 'status-open' : 'status-closed'}`}>
                                                    {/*{isWorkingNow() ? 'Открыто' : 'Закрыто'}*/}
                                                    <span className="contact-day-hours">{day.hours}</span>
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <p className="contact-hours-note">
                                    * Аварийный выезд - круглосуточно
                                </p>
                            </div>
                        </div>

                        {/* Карта */}
                        <div className="contact-map-card">
                            <div className="contact-map-header">
                                <div className="contact-map-header-top">
                                    <h3>
                                        <FaMapMarkerAlt className="section-icon" />
                                        Мы на карте {city}
                                    </h3>
                                    <button
                                        className="contact-map-reload-btn"
                                        onClick={reloadMap}
                                        title="Обновить карту"
                                        aria-label="Обновить карту"
                                    >
                                        ⟳
                                    </button>
                                </div>
                                <p>{officeAddress}</p>
                            </div>
                            <div className="contact-map-container">
                                {!mapLoaded && !mapError && (
                                    <div className="contact-map-loading">
                                        <FaSpinner className="contact-map-loading-spinner" />
                                        <p>Загрузка карты...</p>
                                    </div>
                                )}
                                {mapError && (
                                    <div className="contact-map-error">
                                        <p>⚠️ Не удалось загрузить карту</p>
                                        <div className="contact-map-error-buttons">
                                            <button onClick={reloadMap} className="contact-map-retry-btn">
                                                Попробовать снова
                                            </button>
                                            <a
                                                href={MAP_DIRECT_URL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="contact-map-open-btn"
                                            >
                                                Открыть карту
                                            </a>
                                        </div>
                                    </div>
                                )}
                                <iframe
                                    ref={iframeRef}
                                    title={`Карта проезда к офису ${companyName} в ${city}`}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, opacity: mapLoaded && !mapError ? 1 : 0 }}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="contact-map-iframe"
                                    src="about:blank"
                                />
                            </div>
                            <div className="contact-map-actions">
                                <a
                                    href={MAP_DIRECT_URL}
                                    className="contact-map-action-btn"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Открыть в Google Картах"
                                >
                                    📍 Google Карты
                                </a>
                                <a
                                    href={MAP_2GIS_URL}
                                    className="contact-map-action-btn"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Открыть на 2GIS"
                                >
                                    🗺️ 2GIS
                                </a>
                                <a
                                    href={MAP_YANDEX_URL}
                                    className="contact-map-action-btn"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Открыть на Яндекс.Картах"
                                >
                                    🗺️ Яндекс.Карты
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
                                <p className="contact-response-time">⏱ Ответим в течение 15 минут</p>
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
                                            placeholder={phoneNumber}
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