// client/src/components/WhatsAppButton/WhatsAppButton.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './WhatsAppButton.css';
import { FaWhatsapp, FaTimes, FaArrowUp } from 'react-icons/fa';

// Функция для получения переменных окружения
const getEnv = (key, fallback = '') => process.env[key] || fallback;

const WhatsAppButton = () => {
    // eslint-disable-next-line
    const [isVisible, setIsVisible] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showBubble, setShowBubble] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // === ДАННЫЕ ИЗ .env ===
    const phoneNumber = `+${getEnv('REACT_APP_PHONE_FOR_WHATSAPP', '77071234567')}`;
    // const companyName = getEnv('REACT_APP_COMPANY_NAME', 'ЭлектроМастер Алматы');
    const city = getEnv('REACT_APP_ADDRESS_CITY', 'Алматы');

    // Быстрые сообщения с использованием города из .env
    const quickMessages = useMemo(() => [
        {
            text: '📞 Хочу консультацию',
            message: `Здравствуйте! Нужна консультация по электромонтажным работам в ${city}.`
        },
        {
            text: '💰 Уточнить стоимость',
            message: `Здравствуйте! Подскажите, пожалуйста, сколько будет стоить монтаж электропроводки в ${city}?`
        },
        {
            text: '🔧 Вызвать мастера',
            message: 'Здравствуйте! Хотел бы вызвать электрика для установки розеток и выключателей.'
        },
        {
            text: '🚨 Срочный ремонт',
            message: 'Здравствуйте! Нужен срочный вызов электрика. Аварийная ситуация.'
        },
        {
            text: '⚡ Замер и проектирование',
            message: `Здравствуйте! Необходимо сделать замеры и проект электропроводки в ${city}.`
        }
    ], [city]);

    // Основной клик по кнопке WhatsApp
    const handleClick = useCallback(() => {
        if (isExpanded) {
            setIsExpanded(false);
        } else {
            const encodedMessage = encodeURIComponent(
                `Здравствуйте! Меня интересуют услуги электрика в ${city}.`
            );
            window.open(
                `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`,
                '_blank'
            );
        }
    }, [isExpanded, phoneNumber, city]);

    // Развернуть/свернуть меню быстрых сообщений
    const handleExpand = useCallback(() => {
        setIsExpanded(prev => !prev);
        setShowBubble(false);
        setHasInteracted(true);
    }, []);

    // Показ всплывающей подсказки при первом визите
    useEffect(() => {
        const hasSeenBubble = localStorage.getItem('hasSeenWhatsAppBubble');

        if (!hasSeenBubble && !hasInteracted) {
            const timeoutId = setTimeout(() => {
                setShowBubble(true);
                localStorage.setItem('hasSeenWhatsAppBubble', 'true');
            }, 3000);

            return () => clearTimeout(timeoutId);
        }
    }, [hasInteracted]);

    // Отправка быстрого сообщения
    const handleQuickMessage = useCallback((message) => {
        const encodedMessage = encodeURIComponent(message);
        window.open(
            `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`,
            '_blank'
        );
        setIsExpanded(false);
        setHasInteracted(true);
    }, [phoneNumber]);

    // Обработчики для подсказки при наведении
    const handleMouseEnter = useCallback(() => {
        if (!isExpanded && !hasInteracted) {
            setShowBubble(true);
        }
    }, [isExpanded, hasInteracted]);

    const handleMouseLeave = useCallback(() => {
        if (!isExpanded) {
            setShowBubble(false);
        }
    }, [isExpanded]);

    // Отслеживание скролла для кнопки "наверх"
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Плавная прокрутка наверх
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!isVisible) return null;

    return (
        <>
            <div className={`whatsapp-button-container ${isExpanded ? 'expanded' : ''}`}>
                {/* Основная кнопка WhatsApp */}
                <button
                    className="whatsapp-main-button"
                    onClick={handleClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    aria-label="Написать в WhatsApp"
                    aria-expanded={isExpanded}
                >
                    <FaWhatsapp className="whatsapp-icon" aria-hidden="true" />
                    <div className="pulse-ring" aria-hidden="true"></div>
                </button>

                {/* Всплывающая подсказка */}
                {showBubble && !isExpanded && (
                    <div className="whatsapp-bubble" role="tooltip">
                        <div className="bubble-content">
                            <p>📱 Написать в WhatsApp</p>
                            <button
                                className="bubble-close"
                                onClick={() => setShowBubble(false)}
                                aria-label="Закрыть подсказку"
                            >
                                ×
                            </button>
                        </div>
                        <div className="bubble-arrow" aria-hidden="true"></div>
                    </div>
                )}

                {/* Кнопка раскрытия меню быстрых сообщений */}
                <button
                    className="whatsapp-expand-button"
                    onClick={handleExpand}
                    aria-label={isExpanded ? "Свернуть меню" : "Быстрые сообщения"}
                    aria-expanded={isExpanded}
                >
                    {isExpanded ? <FaTimes aria-hidden="true" /> : '+'}
                </button>

                {/* Меню быстрых сообщений */}
                {isExpanded && (
                    <div className="whatsapp-expanded-menu" role="menu">
                        <h4>Быстрые сообщения</h4>
                        <div className="quick-messages">
                            {quickMessages.map((item, index) => (
                                <button
                                    key={index}
                                    className="quick-message-btn"
                                    onClick={() => handleQuickMessage(item.message)}
                                    role="menuitem"
                                >
                                    {item.text}
                                </button>
                            ))}
                        </div>
                        <div className="custom-message">
                            <button
                                className="custom-message-btn"
                                onClick={() => handleQuickMessage(
                                    `Здравствуйте! У меня вопрос по услугам электрика в ${city}.`
                                )}
                                role="menuitem"
                            >
                                ✏️ Написать своё сообщение
                            </button>
                        </div>
                    </div>
                )}

                {/* Кнопка прокрутки наверх */}
                {showScrollTop && (
                    <button
                        className="scroll-top-button"
                        onClick={scrollToTop}
                        aria-label="Вернуться наверх"
                    >
                        <FaArrowUp aria-hidden="true" />
                    </button>
                )}
            </div>
        </>
    );
};

export default React.memo(WhatsAppButton);