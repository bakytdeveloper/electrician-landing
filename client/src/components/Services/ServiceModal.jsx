import React from 'react';
import { FaTimes, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import Button from '../common/Button/Button';
import './ServiceModal.css';

const ServiceModal = ({ isOpen, onClose, service, formatDescription, iconMap }) => {
    if (!isOpen || !service) return null;

    const IconComponent = iconMap[service.icon] || FaArrowRight;

    return (
        <div className="service-modal-overlay" onClick={onClose}>
            <div className="service-modal-content" onClick={e => e.stopPropagation()}>
                <div className="service-modal-header">
                    <div className="service-modal-header-icon">
                        <IconComponent />
                    </div>
                    <div className="service-modal-header-info">
                        <h2>{service.title}</h2>
                        <div className="service-modal-meta">
                            <span className="service-modal-price">{service.price}</span>
                            <span className="service-modal-duration">{service.duration}</span>
                        </div>
                    </div>
                    <button className="service-modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="service-modal-body">
                    <div className="service-modal-description">
                        {/*<h3>Услуга</h3>*/}
                        <div className="service-description-text">
                            {formatDescription(service.description)}
                        </div>
                    </div>

                    <div className="service-modal-features">
                        <h3>Что входит</h3>
                        <ul className="service-features-list">
                            {service.features.map((feature, index) => (
                                <li key={index} className="service-feature-item">
                                    <FaCheckCircle className="service-feature-check" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="service-modal-footer">
                    <Button
                        variant="primary"
                        size="large"
                        onClick={() => {
                            onClose();
                            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="service-modal-order-btn"
                    >
                        Заказать услугу
                    </Button>
                    <a
                        href="tel:+79991234567"
                        className="service-modal-call-link"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Позвонить для уточнения
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ServiceModal;