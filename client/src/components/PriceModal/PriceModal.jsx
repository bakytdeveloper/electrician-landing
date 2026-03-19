import React, { useState, useEffect } from 'react';
import './PriceModal.css';
import { FaTimes, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const PriceModal = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedSections, setExpandedSections] = useState({});
    const [priceData, setPriceData] = useState([]);

    // Данные из прайс-листа
    useEffect(() => {
        const data = [
            {
                section: 'Подготовительные работы',
                items: [
                    { name: 'Разметка трасс электропроводки', unit: 'объект', price: '5 000 ₸' },
                    { name: 'Штробление стен под кабель', unit: 'м.п.', price: '1 200 ₸' },
                    { name: 'Штробление под подрозетник', unit: 'шт.', price: '1 800 ₸' },
                    { name: 'Сверление отверстий под подрозетник', unit: 'шт.', price: '1 200 ₸' },
                    { name: 'Установка подрозетника', unit: 'шт', price: '900 ₸' }
                ]
            },
            {
                section: 'Прокладка кабеля',
                items: [
                    { name: 'Прокладка кабеля в штробе', unit: 'м.п.', price: '600 ₸' },
                    { name: 'Прокладка кабеля в гофре', unit: 'м.п.', price: '500 ₸' },
                    { name: 'Прокладка кабеля в кабель-канале', unit: 'м.п.', price: '500 ₸' },
                    { name: 'Монтаж кабель-канала', unit: 'м.п.', price: '600 ₸' },
                    { name: 'Прокладка интернет кабеля (LAN)', unit: 'м.п.', price: '400 ₸' },
                    { name: 'Прокладка ТВ кабеля', unit: 'м.п.', price: '400 ₸' }
                ]
            },
            {
                section: 'Установка розеток и выключателей',
                items: [
                    { name: 'Установка розетки', unit: 'шт', price: '1 500 ₸' },
                    { name: 'Установка двойной розетки', unit: 'шт', price: '2 000 ₸' },
                    { name: 'Установка выключателя', unit: 'шт', price: '1 500 ₸' },
                    { name: 'Установка проходного выключателя', unit: 'шт', price: '2 500 ₸' },
                    { name: 'Монтаж интернет-розетки', unit: 'шт', price: '2 000 ₸' },
                    { name: 'Монтаж ТВ-розетки', unit: 'шт', price: '2 000 ₸' }
                ]
            },
            {
                section: 'Монтаж освещения',
                items: [
                    { name: 'Монтаж точечного светильника', unit: 'шт.', price: '2 500 ₸' },
                    { name: 'Установка люстры', unit: 'шт.', price: '4 000 ₸' },
                    { name: 'Установка бра', unit: 'шт.', price: '3 000 ₸' },
                    { name: 'Монтаж светодиодной ленты', unit: 'м.п.', price: '2 500 ₸' },
                    { name: 'Монтаж уличного освещения', unit: 'шт.', price: '4 000 ₸' }
                ]
            },
            {
                section: 'Электрощит и автоматика',
                items: [
                    { name: 'Установка электрического щита', unit: 'шт.', price: '10 000 ₸' },
                    { name: 'Монтаж автоматического выключателя', unit: 'шт.', price: '2 000 ₸' },
                    { name: 'Установка УЗО', unit: 'шт.', price: '3 000 ₸' },
                    { name: 'Монтаж дифавтомата', unit: 'шт.', price: '3 500 ₸' },
                    { name: 'Сборка электрощита', unit: 'шт.', price: '15 000 ₸' },
                    { name: 'Подключение счетчика', unit: 'шт.', price: '7 000 ₸' }
                ]
            },
            {
                section: 'Подключение бытовой техники',
                items: [
                    { name: 'Подключение варочной панели', unit: 'шт.', price: '5 000 ₸' },
                    { name: 'Подключение духового шкафа', unit: 'шт.', price: '4 000 ₸' },
                    { name: 'Подключение стиральной машины', unit: 'шт.', price: '3 000 ₸' },
                    { name: 'Подключение посудомоечной машины', unit: 'шт.', price: '3 000 ₸' },
                    { name: 'Подключение бойлера', unit: 'шт.', price: '4 000 ₸' },
                    { name: 'Подключение кондиционера', unit: 'шт.', price: '6 000 ₸' }
                ]
            },
            {
                section: 'Дополнительные работы',
                items: [
                    { name: 'Перенос розетки', unit: 'шт', price: '3 000 ₸' },
                    { name: 'Перенос выключателя', unit: 'шт', price: '3 000 ₸' },
                    { name: 'Замена проводки', unit: 'м²', price: '4 500 ₸' },
                    { name: 'Монтаж системы заземления', unit: 'точка', price: '15 000 ₸' },
                    { name: 'Диагностика электропроводки', unit: 'объект', price: '10 000 ₸' }
                ]
            },
            {
                section: 'Комплексные услуги',
                items: [
                    { name: 'Электромонтаж квартиры', unit: 'м²', price: 'от 5 000 ₸' },
                    { name: 'Электромонтаж частного дома', unit: 'м²', price: 'от 6 000 ₸' },
                    { name: 'Электромонтаж офиса', unit: 'м²', price: 'от 4 500 ₸' },
                    { name: 'Полная замена проводки', unit: 'м²', price: 'от 5 500 ₸' }
                ]
            }
        ];
        setPriceData(data);

        // По умолчанию все секции раскрыты
        const initialExpanded = {};
        data.forEach((_, index) => {
            initialExpanded[index] = true;
        });
        setExpandedSections(initialExpanded);
    }, []);

    const toggleSection = (index) => {
        setExpandedSections(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const filteredData = priceData.map(section => ({
        ...section,
        items: section.items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.price.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(section => section.items.length > 0);

    if (!isOpen) return null;

    return (
        <div className="price-modal-overlay" onClick={onClose}>
            <div className="price-modal-content" onClick={e => e.stopPropagation()}>
                <div className="price-modal-header">
                    <h2>Прайс-лист на электромонтажные работы</h2>
                    <button className="price-modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="price-modal-search">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Поиск по услугам или цене..."
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
                    <p>* Цены указаны ориентировочно. Точная стоимость зависит от сложности работ.</p>
                    <button className="price-order-btn" onClick={() => {
                        onClose();
                        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                        Заказать расчет
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PriceModal;