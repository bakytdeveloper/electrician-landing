import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './WhatsAppButton.css';
import { FaWhatsapp, FaTimes, FaArrowUp } from 'react-icons/fa';

const WhatsAppButton = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showBubble, setShowBubble] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false); // Новое состояние

    const phoneNumber = '+77780083314';

    const quickMessages = useMemo(() => [
        { text: 'Хочу консультацию', message: 'Здравствуйте! Нужна консультация по электромонтажным работам.' },
        { text: 'Уточнить стоимость', message: 'Здравствуйте! Подскажите, пожалуйста, сколько будет стоить монтаж электропроводки?' },
        { text: 'Вызвать мастера', message: 'Здравствуйте! Хотел бы вызвать электрика для установки розеток и выключателей.' },
        { text: 'Срочный ремонт', message: 'Здравствуйте! Хотел бы узнать, занимаетесь ли вы ремонтом бытовой техними?' }
    ], []);

    const handleClick = useCallback(() => {
        if (isExpanded) {
            setIsExpanded(false);
        } else {
            const encodedMessage = encodeURIComponent('Здравствуйте! Я хочу сделать заказ. Подскажите, пожалуйста.');
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
            let animationFrameId;
            const showBubbleDelayed = () => {
                animationFrameId = requestAnimationFrame(() => {
                    setShowBubble(true);
                    localStorage.setItem('hasSeenWhatsAppBubble', 'true');
                });
            };

            const timeoutId = setTimeout(showBubbleDelayed, 3000);

            return () => {
                clearTimeout(timeoutId);
                cancelAnimationFrame(animationFrameId);
            };
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

    // Новая логика для кнопки "вверх"
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) { // показываем кнопку после прокрутки 300px
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
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
                    <FaWhatsapp className="whatsapp-icon" />
                    <div className="pulse-ring"></div>
                </button>

                {showBubble && !isExpanded && (
                    <div className="whatsapp-bubble">
                        <div className="bubble-content">
                            <p>Написать в WhatsApp</p>
                            <button
                                className="bubble-close"
                                onClick={() => setShowBubble(false)}
                                aria-label="Закрыть подсказку"
                            >
                                ×
                            </button>
                        </div>
                        <div className="bubble-arrow"></div>
                    </div>
                )}

                <button
                    className="whatsapp-expand-button"
                    onClick={handleExpand}
                    aria-label={isExpanded ? "Свернуть меню" : "Быстрые сообщения"}
                    aria-expanded={isExpanded}
                >
                    {isExpanded ? <FaTimes /> : '+'}
                </button>

                {isExpanded && (
                    <div className="whatsapp-expanded-menu">
                        <h4>Быстрые сообщения</h4>
                        <div className="quick-messages">
                            {quickMessages.map((item, index) => (
                                <button
                                    key={index}
                                    className="quick-message-btn"
                                    onClick={() => handleQuickMessage(item.message)}
                                >
                                    {item.text}
                                </button>
                            ))}
                        </div>
                        <div className="custom-message">
                            <button
                                className="custom-message-btn"
                                onClick={() => handleQuickMessage('')}
                            >
                                Написать своё сообщение
                            </button>
                        </div>
                    </div>
                )}

                {/* Новая кнопка "вверх" */}
                {showScrollTop && (
                    <button
                        className="scroll-top-button"
                        onClick={scrollToTop}
                        aria-label="Наверх"
                    >
                        <FaArrowUp />
                    </button>
                )}
            </div>

            <button
                className="whatsapp-hide-button"
                onClick={() => setIsVisible(false)}
                onMouseEnter={() => !hasInteracted && setShowBubble(true)}
                aria-label="Скрыть кнопку WhatsApp"
            >
                ×
            </button>
        </>
    );
};

export default React.memo(WhatsAppButton);
