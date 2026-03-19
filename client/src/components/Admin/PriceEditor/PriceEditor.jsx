import React, { useState, useEffect } from 'react';
import './PriceEditor.css';
import {
    FaPlus, FaTrash, FaEdit, FaTimes, FaSave,
    FaArrowUp, FaArrowDown, FaChevronDown, FaChevronUp
} from 'react-icons/fa';

const PriceEditor = () => {
    const [content, setContent] = useState(null);
    const [originalContent, setOriginalContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [expandedSections, setExpandedSections] = useState({});
    const [editingSection, setEditingSection] = useState(null);
    const [showSectionModal, setShowSectionModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [showItemModal, setShowItemModal] = useState(false);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/price/content`);
            const data = await response.json();
            setContent(data);
            setOriginalContent(JSON.parse(JSON.stringify(data)));

            // По умолчанию все секции раскрыты
            const initialExpanded = {};
            data.sections.forEach((_, index) => {
                initialExpanded[index] = true;
            });
            setExpandedSections(initialExpanded);
        } catch (err) {
            console.error('Error fetching content:', err);
            setError('Ошибка загрузки контента');
        } finally {
            setLoading(false);
        }
    };

    const hasChanges = () => {
        return JSON.stringify(content) !== JSON.stringify(originalContent);
    };

    const handleSave = async () => {
        if (!hasChanges()) {
            setSuccess('Нет изменений для сохранения');
            setTimeout(() => setSuccess(''), 3000);
            return;
        }

        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('adminToken');

            // Подготавливаем данные для сохранения
            const saveContent = {
                _id: content._id,
                modalTitle: content.modalTitle,
                searchPlaceholder: content.searchPlaceholder,
                footerNote: content.footerNote,
                orderButtonText: content.orderButtonText,
                sections: content.sections.map(section => {
                    const { _id, ...sectionData } = section;
                    if (sectionData.items) {
                        sectionData.items = sectionData.items.map(item => {
                            const { _id, ...itemData } = item;
                            return itemData;
                        });
                    }
                    return sectionData;
                })
            };

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/price/content`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(saveContent)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка сохранения');
            }

            const updatedContent = await response.json();
            setContent(updatedContent);
            setOriginalContent(JSON.parse(JSON.stringify(updatedContent)));
            setSuccess('Изменения сохранены');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error saving:', err);
            setError('Ошибка при сохранении: ' + err.message);
            setTimeout(() => setError(''), 3000);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (originalContent) {
            setContent(JSON.parse(JSON.stringify(originalContent)));
            setSuccess('Изменения отменены');
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const toggleSection = (index) => {
        setExpandedSections(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Управление секциями
    const handleAddSection = () => {
        setEditingSection({
            section: '',
            items: [],
            order: content.sections.length + 1,
            active: true
        });
        setShowSectionModal(true);
    };

    const handleEditSection = (section, index) => {
        setEditingSection({ ...section, index });
        setShowSectionModal(true);
    };

    const handleDeleteSection = (index) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту секцию? Все позиции в ней также будут удалены.')) return;

        const newSections = content.sections.filter((_, i) => i !== index);
        setContent({ ...content, sections: newSections });
    };

    const handleSaveSection = () => {
        if (!editingSection.section) {
            setError('Введите название секции');
            setTimeout(() => setError(''), 3000);
            return;
        }

        const newSections = [...content.sections];

        if (editingSection.index !== undefined) {
            // Редактирование существующей секции
            newSections[editingSection.index] = {
                ...newSections[editingSection.index],
                section: editingSection.section,
                active: editingSection.active
            };
        } else {
            // Добавление новой секции
            newSections.push({
                section: editingSection.section,
                items: [],
                order: newSections.length + 1,
                active: true
            });
        }

        setContent({ ...content, sections: newSections });
        setShowSectionModal(false);
        setEditingSection(null);
    };

    // Управление элементами в секции
    const handleAddItem = (sectionIndex) => {
        setCurrentSectionIndex(sectionIndex);
        setEditingItem({
            name: '',
            unit: '',
            price: '',
            order: (content.sections[sectionIndex].items?.length || 0) + 1
        });
        setShowItemModal(true);
    };

    const handleEditItem = (sectionIndex, itemIndex) => {
        setCurrentSectionIndex(sectionIndex);
        setEditingItem({
            ...content.sections[sectionIndex].items[itemIndex],
            itemIndex
        });
        setShowItemModal(true);
    };

    const handleDeleteItem = (sectionIndex, itemIndex) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту позицию?')) return;

        const newSections = [...content.sections];
        newSections[sectionIndex].items = newSections[sectionIndex].items.filter((_, i) => i !== itemIndex);
        setContent({ ...content, sections: newSections });
    };

    const handleSaveItem = () => {
        if (!editingItem.name || !editingItem.unit || !editingItem.price) {
            setError('Заполните все поля');
            setTimeout(() => setError(''), 3000);
            return;
        }

        const newSections = [...content.sections];

        if (editingItem.itemIndex !== undefined) {
            // Редактирование существующего элемента
            newSections[currentSectionIndex].items[editingItem.itemIndex] = {
                name: editingItem.name,
                unit: editingItem.unit,
                price: editingItem.price,
                order: editingItem.order
            };
        } else {
            // Добавление нового элемента
            if (!newSections[currentSectionIndex].items) {
                newSections[currentSectionIndex].items = [];
            }
            newSections[currentSectionIndex].items.push({
                name: editingItem.name,
                unit: editingItem.unit,
                price: editingItem.price,
                order: newSections[currentSectionIndex].items.length + 1
            });
        }

        setContent({ ...content, sections: newSections });
        setShowItemModal(false);
        setEditingItem(null);
        setCurrentSectionIndex(null);
    };

    const moveItem = (sectionIndex, itemIndex, direction) => {
        const newSections = [...content.sections];
        const items = newSections[sectionIndex].items;

        if (direction === 'up' && itemIndex > 0) {
            [items[itemIndex], items[itemIndex - 1]] = [items[itemIndex - 1], items[itemIndex]];
        } else if (direction === 'down' && itemIndex < items.length - 1) {
            [items[itemIndex], items[itemIndex + 1]] = [items[itemIndex + 1], items[itemIndex]];
        }

        setContent({ ...content, sections: newSections });
    };

    if (loading) return <div className="editor-loading">Загрузка...</div>;
    if (!content) return <div className="editor-error">Ошибка загрузки</div>;

    return (
        <div className="price-editor">
            <div className="editor-header">
                <h2>Редактирование прайс-листа</h2>
                <div className="header-buttons">
                    {hasChanges() && (
                        <button
                            className="cancel-btn"
                            onClick={handleCancel}
                            disabled={saving}
                        >
                            Отменить изменения
                        </button>
                    )}
                    <button
                        className="save-btn"
                        onClick={handleSave}
                        disabled={saving || !hasChanges()}
                    >
                        {saving ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>
                </div>
            </div>

            {error && <div className="editor-error-message">{error}</div>}
            {success && <div className="editor-success-message">{success}</div>}

            {hasChanges() && (
                <div className="unsaved-changes-warning">
                    ⚠️ Есть несохраненные изменения. Нажмите "Сохранить изменения" чтобы применить их.
                </div>
            )}

            <div className="editor-tabs">
                {/* Общие настройки */}
                <div className="editor-section">
                    <h3>Общие настройки</h3>

                    <div className="form-group">
                        <label>Заголовок модального окна</label>
                        <input
                            type="text"
                            value={content.modalTitle}
                            onChange={(e) => setContent({ ...content, modalTitle: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Текст поиска</label>
                        <input
                            type="text"
                            value={content.searchPlaceholder}
                            onChange={(e) => setContent({ ...content, searchPlaceholder: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Примечание внизу</label>
                        <input
                            type="text"
                            value={content.footerNote}
                            onChange={(e) => setContent({ ...content, footerNote: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Текст кнопки заказа</label>
                        <input
                            type="text"
                            value={content.orderButtonText}
                            onChange={(e) => setContent({ ...content, orderButtonText: e.target.value })}
                        />
                    </div>
                </div>

                {/* Секции прайс-листа */}
                <div className="editor-section">
                    <div className="section-header">
                        <h3>Секции прайс-листа</h3>
                        <button className="add-btn" onClick={handleAddSection}>
                            <FaPlus /> Добавить секцию
                        </button>
                    </div>

                    {content.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="price-section-editor">
                            <div className="price-section-header" onClick={() => toggleSection(sectionIndex)}>
                                <div className="price-section-title">
                                    <h4>{section.section}</h4>
                                    <span className="items-count">{section.items?.length || 0} позиций</span>
                                </div>
                                <div className="price-section-controls">
                                    <button
                                        className="icon-btn edit-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditSection(section, sectionIndex);
                                        }}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="icon-btn delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteSection(sectionIndex);
                                        }}
                                    >
                                        <FaTrash />
                                    </button>
                                    {expandedSections[sectionIndex] ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                            </div>

                            {expandedSections[sectionIndex] && (
                                <div className="price-section-items">
                                    <div className="items-header">
                                        <span>Название работы</span>
                                        <span>Ед. изм.</span>
                                        <span>Цена</span>
                                        <span>Действия</span>
                                    </div>

                                    {section.items?.map((item, itemIndex) => (
                                        <div key={itemIndex} className="price-item-row">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-unit">{item.unit}</span>
                                            <span className="item-price">{item.price}</span>
                                            <div className="item-actions">
                                                <button
                                                    className="icon-btn move-btn"
                                                    onClick={() => moveItem(sectionIndex, itemIndex, 'up')}
                                                    disabled={itemIndex === 0}
                                                >
                                                    <FaArrowUp />
                                                </button>
                                                <button
                                                    className="icon-btn move-btn"
                                                    onClick={() => moveItem(sectionIndex, itemIndex, 'down')}
                                                    disabled={itemIndex === section.items.length - 1}
                                                >
                                                    <FaArrowDown />
                                                </button>
                                                <button
                                                    className="icon-btn edit-btn"
                                                    onClick={() => handleEditItem(sectionIndex, itemIndex)}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="icon-btn delete-btn"
                                                    onClick={() => handleDeleteItem(sectionIndex, itemIndex)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        className="add-item-btn"
                                        onClick={() => handleAddItem(sectionIndex)}
                                    >
                                        <FaPlus /> Добавить позицию
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Модальное окно редактирования секции */}
            {showSectionModal && editingSection && (
                <div className="modal-overlay">
                    <div className="modal-content small">
                        <div className="modal-header">
                            <h3>{editingSection.index !== undefined ? 'Редактирование секции' : 'Новая секция'}</h3>
                            <button className="close-btn" onClick={() => setShowSectionModal(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>Название секции</label>
                                <input
                                    type="text"
                                    value={editingSection.section}
                                    onChange={(e) => setEditingSection({ ...editingSection, section: e.target.value })}
                                    placeholder="Например: Монтажные работы"
                                />
                            </div>

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={editingSection.active !== false}
                                    onChange={(e) => setEditingSection({ ...editingSection, active: e.target.checked })}
                                />
                                Секция активна
                            </label>
                        </div>

                        <div className="modal-footer">
                            <button className="cancel-modal-btn" onClick={() => setShowSectionModal(false)}>
                                Отмена
                            </button>
                            <button className="save-modal-btn" onClick={handleSaveSection}>
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно редактирования позиции */}
            {showItemModal && editingItem && (
                <div className="modal-overlay">
                    <div className="modal-content small">
                        <div className="modal-header">
                            <h3>{editingItem.itemIndex !== undefined ? 'Редактирование позиции' : 'Новая позиция'}</h3>
                            <button className="close-btn" onClick={() => setShowItemModal(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>Название работы</label>
                                <input
                                    type="text"
                                    value={editingItem.name}
                                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                    placeholder="Например: Установка розетки"
                                />
                            </div>

                            <div className="form-group">
                                <label>Единица измерения</label>
                                <input
                                    type="text"
                                    value={editingItem.unit}
                                    onChange={(e) => setEditingItem({ ...editingItem, unit: e.target.value })}
                                    placeholder="Например: шт, м.п., объект"
                                />
                            </div>

                            <div className="form-group">
                                <label>Цена</label>
                                <input
                                    type="text"
                                    value={editingItem.price}
                                    onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                                    placeholder="Например: 1 500 ₸"
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="cancel-modal-btn" onClick={() => setShowItemModal(false)}>
                                Отмена
                            </button>
                            <button className="save-modal-btn" onClick={handleSaveItem}>
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PriceEditor;