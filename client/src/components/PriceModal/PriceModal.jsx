// client/src/components/PriceModal/PriceModal.jsx
import React, { useState, useEffect } from 'react';
import './PriceModal.css';
import { FaTimes, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const PriceModal = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedSections, setExpandedSections] = useState({});
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchContent();
        }
    }, [isOpen]);

    const fetchContent = async () => {
        // Защита от react-snap
        if (typeof navigator !== 'undefined' && navigator.userAgent.includes('HeadlessChrome')) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/price/content`);
            const data = await response.json();
            setContent(data);

            const initialExpanded = {};
            data.sections.forEach((_, index) => {
                initialExpanded[index] = true;
            });
            setExpandedSections(initialExpanded);
        } catch (error) {
            console.error('Error fetching price content:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (index) => {
        setExpandedSections(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const filteredData = content?.sections
        .filter(section => section.active !== false)
        .map(section => ({
            ...section,
            items: section.items.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.price.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }))
        .filter(section => section.items.length > 0) || [];

    if (!isOpen) return null;
    if (loading) return (
        <div className="price-modal-overlay" onClick={onClose}>
            <div className="price-modal-content" onClick={e => e.stopPropagation()}>
                <div className="price-modal-header">
                    <h2>Прайс-лист</h2>
                    <button className="price-modal-close" onClick={onClose} aria-label="Закрыть">
                        <FaTimes aria-hidden="true" />
                    </button>
                </div>
                <div className="price-modal-body">
                    <p>Загрузка цен...</p>
                </div>
            </div>
        </div>
    );

    if (!content) return null;

    return (
        <div className="price-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Прайс-лист">
            <div className="price-modal-content" onClick={e => e.stopPropagation()}>
                <div className="price-modal-header">
                    <h2>{content.modalTitle || 'Прайс-лист на услуги'}</h2>
                    <button className="price-modal-close" onClick={onClose} aria-label="Закрыть">
                        <FaTimes aria-hidden="true" />
                    </button>
                </div>

                <div className="price-modal-search">
                    <FaSearch className="search-icon" aria-hidden="true" />
                    <input
                        type="text"
                        placeholder={content.searchPlaceholder || 'Поиск услуг...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Поиск услуг"
                    />
                </div>

                <div className="price-modal-body">
                    {filteredData.map((section, index) => (
                        <div key={index} className="price-section">
                            <button
                                className="price-section-header"
                                onClick={() => toggleSection(index)}
                                aria-expanded={expandedSections[index]}
                                aria-label={`${section.section} - ${expandedSections[index] ? 'свернуть' : 'развернуть'}`}
                            >
                                <h3>{section.section}</h3>
                                {expandedSections[index] ? <FaChevronUp aria-hidden="true" /> : <FaChevronDown aria-hidden="true" />}
                            </button>

                            {expandedSections[index] && (
                                <div className="price-section-body">
                                    <table className="price-table">
                                        <thead>
                                        <tr>
                                            <th>Работа</th>
                                            <th>Ед. изм.</th>
                                            <th>Цена от</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {section.items.map((item, itemIndex) => (
                                            <tr key={itemIndex}>
                                                <td>{item.name}</td>
                                                <td>{item.unit}</td>
                                                <td className="price-value">{item.price} ₸</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}

                    {filteredData.length === 0 && (
                        <div className="price-no-results">
                            <p>Ничего не найдено по запросу "{searchTerm}"</p>
                        </div>
                    )}
                </div>

                <div className="price-modal-footer">
                    <p>{content.footerNote || '* Цены указаны без учета материалов. Точную стоимость уточняйте у мастера.'}</p>
                    <button
                        className="price-order-btn"
                        onClick={() => {
                            onClose();
                            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        aria-label="Заказать услугу"
                    >
                        {content.orderButtonText || 'Заказать услугу'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PriceModal;