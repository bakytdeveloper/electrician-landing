// client/src/components/WhatsAppButton/WhatsAppButton.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './WhatsAppButton.css';
import { FaWhatsapp, FaTimes, FaArrowUp } from 'react-icons/fa';

const WhatsAppButton = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showBubble, setShowBubble] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // ИСПРАВЛЕНО: единый номер для Алматы
    const phoneNumber = '+77071234567';

    const quickMessages = useMemo(() => [
        { text: '📞 Хочу консультацию', message: 'Здравствуйте! Нужна консультация по электромонтажным работам в Алматы.' },
        { text: '💰 Уточнить стоимость', message: 'Здравствуйте! Подскажите, пожалуйста, сколько будет стоить монтаж электропроводки в Алматы?' },
        { text: '🔧 Вызвать мастера', message: 'Здравствуйте! Хотел бы вызвать электрика для установки розеток и выключателей.' },
        { text: '🚨 Срочный ремонт', message: 'Здравствуйте! Нужен срочный вызов электрика. Аварийная ситуация.' }
    ], []);

    const handleClick = useCallback(() => {
        if (isExpanded) {
            setIsExpanded(false);
        } else {
            const encodedMessage = encodeURIComponent('Здравствуйте! Меня интересуют услуги электрика в Алматы.');
            window.open(`https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`, '_blank');
        }
    }, [isExpanded, phoneNumber]);

    const handleExpand = useCallback(() => {
        setIsExpanded(prev => !prev);
        setShowBubble(false);
        setHasInteracted(true);
    }, []);

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

    const handleQuickMessage = useCallback((message) => {
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`, '_blank');
        setIsExpanded(false);
        setHasInteracted(true);
    }, [phoneNumber]);

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

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!isVisible) return null;

    return (
        <>
            <div className={`whatsapp-button-container ${isExpanded ? 'expanded' : ''}`}>
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

                <button
                    className="whatsapp-expand-button"
                    onClick={handleExpand}
                    aria-label={isExpanded ? "Свернуть меню" : "Быстрые сообщения"}
                    aria-expanded={isExpanded}
                >
                    {isExpanded ? <FaTimes aria-hidden="true" /> : '+'}
                </button>

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
                                onClick={() => handleQuickMessage('Здравствуйте! У меня вопрос по услугам электрика.')}
                                role="menuitem"
                            >
                                ✏️ Написать своё сообщение
                            </button>
                        </div>
                    </div>
                )}

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