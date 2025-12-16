import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Modal.css';
import Button from '../Button/Button';

const Modal = ({ isOpen, onClose, type = 'callback' }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
        service: 'consultation'
    });

    const [isLoading, setIsLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSubmitStatus(null);

        try {
            const response = await axios.post('/api/contact', formData);

            setSubmitStatus({
                type: 'success',
                message: response.data.message
            });

            // Очищаем форму при успешной отправке
            setFormData({
                name: '',
                phone: '',
                email: '',
                message: '',
                service: 'consultation'
            });

            // Закрываем модалку через 3 секунды
            setTimeout(() => {
                onClose();
                setSubmitStatus(null);
            }, 3000);

        } catch (error) {
            setSubmitStatus({
                type: 'error',
                message: error.response?.data?.message || 'Ошибка при отправке формы'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const modalTitles = {
        callback: 'Заказать обратный звонок',
        consultation: 'Заказать консультацию',
        service: 'Заказать услугу'
    };

    const serviceOptions = [
        { value: 'installation', label: 'Монтаж электропроводки' },
        { value: 'maintenance', label: 'Обслуживание электрооборудования' },
        { value: 'repair', label: 'Ремонт бытовой техники' },
        { value: 'consultation', label: 'Консультация электрика' },
        { value: 'other', label: 'Другая услуга' }
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modals-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    &times;
                </button>

                <div className="modal-header">
                    <h2>{modalTitles[type] || modalTitles.callback}</h2>
                    <p className="modal-subtitle">
                        Заполните форму и мы свяжемся с вами в течение 15 минут
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="name">Ваше имя *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Иван Иванов"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Номер телефона *</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+7 (999) 999-99-99"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@mail.ru"
                        />
                    </div>

                    {type !== 'callback' && (
                        <>
                            <div className="form-group">
                                <label htmlFor="serviceType">Тип услуги</label>
                                <select
                                    id="serviceType"
                                    name="serviceType"
                                    value={formData.service}
                                    onChange={handleChange}
                                >
                                    {serviceOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Сообщение</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Опишите вашу проблему или задайте вопрос..."
                                />
                            </div>
                        </>
                    )}

                    {submitStatus && (
                        <div className={`alert alert-${submitStatus.type}`}>
                            {submitStatus.message}
                        </div>
                    )}

                    <div className="modal-actions">
                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            fullWidth
                            disabled={isLoading}
                        >
                            {isLoading ? 'Отправка...' : 'Отправить заявку'}
                        </Button>
                    </div>

                    <p className="privacy-notice">
                        Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Modal;