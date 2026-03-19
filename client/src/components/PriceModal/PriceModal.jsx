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
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/price/content`);
            const data = await response.json();
            setContent(data);

            // По умолчанию все секции раскрыты
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
    if (loading) return null;

    return (
        <div className="price-modal-overlay" onClick={onClose}>
            <div className="price-modal-content" onClick={e => e.stopPropagation()}>
                <div className="price-modal-header">
                    <h2>{content.modalTitle}</h2>
                    <button className="price-modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="price-modal-search">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder={content.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="price-modal-body">
                    {filteredData.map((section, index) => (
                        <div key={index} className="price-section">
                            <div
                                className="price-section-header"
                                onClick={() => toggleSection(index)}
                            >
                                <h3>{section.section}</h3>
                                {expandedSections[index] ? <FaChevronUp /> : <FaChevronDown />}
                            </div>

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
                                                <td className="price-value">{item.price}</td>
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
                    <p>{content.footerNote}</p>
                    <button className="price-order-btn" onClick={() => {
                        onClose();
                        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                        {content.orderButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PriceModal;