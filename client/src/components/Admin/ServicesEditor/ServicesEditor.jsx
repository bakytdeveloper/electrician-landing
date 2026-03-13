import React, { useState, useEffect } from 'react';
import './ServicesEditor.css';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import * as Icons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';

const ServicesEditor = () => {
    const [content, setContent] = useState(null);
    const [originalContent, setOriginalContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [editingService, setEditingService] = useState(null);
    const [showServiceModal, setShowServiceModal] = useState(false);

    // Маппинг иконок
    const iconMap = {
        FaBolt: Icons.FaBolt,
        FaTools: Icons.FaTools,
        FaWrench: Icons.FaWrench,
        FaCheckCircle: Icons.FaCheckCircle,
        FaClock: Icons.FaClock,
        FaTruck: Icons.FaTruck,
        MdOutlineElectricalServices: MdIcons.MdOutlineElectricalServices,
        MdHomeRepairService: MdIcons.MdHomeRepairService,
        MdSecurity: MdIcons.MdSecurity
    };

    useEffect(() => {
        fetchContent();

        return () => {
            // Очистка при размонтировании
        };
    }, []);

    const fetchContent = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/services/content`);
            const data = await response.json();
            setContent(data);
            setOriginalContent(JSON.parse(JSON.stringify(data)));
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/services/content`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(content)
            });

            if (!response.ok) {
                throw new Error('Ошибка сохранения');
            }

            const updatedContent = await response.json();
            setContent(updatedContent);
            setOriginalContent(JSON.parse(JSON.stringify(updatedContent)));
            setSuccess('Изменения сохранены');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error saving:', err);
            setError('Ошибка при сохранении');
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

    // Управление услугами
    const handleServiceChange = (index, field, value) => {
        const newServices = [...content.services];
        newServices[index] = { ...newServices[index], [field]: value };
        setContent({ ...content, services: newServices });
    };

    const handleAddService = () => {
        setEditingService({
            id: Date.now(),
            title: '',
            description: '',
            icon: 'FaBolt',
            category: 'installation',
            features: [''],
            price: '',
            duration: '',
            active: true,
            order: content.services.length + 1,
            isNew: true
        });
        setShowServiceModal(true);
    };

    const handleEditService = (service) => {
        setEditingService({ ...service, features: [...service.features] });
        setShowServiceModal(true);
    };

    const handleDeleteService = async (serviceId) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту услугу?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/services/services/${serviceId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка удаления');
            }

            const data = await response.json();
            setContent({ ...content, services: data.services });
            setSuccess('Услуга удалена');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error deleting service:', err);
            setError('Ошибка при удалении услуги');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleSaveService = async () => {
        if (!editingService.title || !editingService.price || !editingService.duration) {
            setError('Заполните обязательные поля');
            setTimeout(() => setError(''), 3000);
            return;
        }

        // Фильтруем пустые фичи
        editingService.features = editingService.features.filter(f => f.trim() !== '');

        if (editingService.isNew) {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/services/services`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(editingService)
                });

                if (!response.ok) {
                    throw new Error('Ошибка создания');
                }

                const newService = await response.json();
                setContent({ ...content, services: [...content.services, newService] });
                setSuccess('Услуга создана');
            } catch (err) {
                console.error('Error creating service:', err);
                setError('Ошибка при создании услуги');
            }
        } else {
            // Обновляем существующую услугу
            const index = content.services.findIndex(s => s.id === editingService.id);
            if (index !== -1) {
                const newServices = [...content.services];
                newServices[index] = editingService;
                setContent({ ...content, services: newServices });
                setSuccess('Услуга обновлена');
            }
        }

        setTimeout(() => setSuccess(''), 3000);
        setShowServiceModal(false);
        setEditingService(null);
    };

    // Управление преимуществами
    const handleBenefitChange = (index, field, value) => {
        const newBenefits = [...content.benefits];
        newBenefits[index] = { ...newBenefits[index], [field]: value };
        setContent({ ...content, benefits: newBenefits });
    };

    const handleAddBenefit = () => {
        const newBenefit = {
            icon: 'FaCheckCircle',
            title: '',
            description: '',
            active: true
        };
        setContent({ ...content, benefits: [...content.benefits, newBenefit] });
    };

    const handleDeleteBenefit = (index) => {
        const newBenefits = content.benefits.filter((_, i) => i !== index);
        setContent({ ...content, benefits: newBenefits });
    };

    // Управление фичами в модальном окне
    const handleFeatureChange = (index, value) => {
        const newFeatures = [...editingService.features];
        newFeatures[index] = value;
        setEditingService({ ...editingService, features: newFeatures });
    };

    const handleAddFeature = () => {
        setEditingService({ ...editingService, features: [...editingService.features, ''] });
    };

    const handleDeleteFeature = (index) => {
        const newFeatures = editingService.features.filter((_, i) => i !== index);
        setEditingService({ ...editingService, features: newFeatures });
    };

    if (loading) return <div className="editor-loading">Загрузка...</div>;
    if (!content) return <div className="editor-error">Ошибка загрузки</div>;

    const filteredServices = activeCategory === 'all'
        ? content.services
        : content.services.filter(s => s.category === activeCategory);

    return (
        <div className="services-editor">
            <div className="editor-header">
                <h2>Редактирование услуг</h2>
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
                {/* Основная информация секции */}
                <div className="editor-section">
                    <h3>Заголовок секции</h3>

                    <div className="form-group">
                        <label>Заголовок</label>
                        <input
                            type="text"
                            value={content.sectionTitle}
                            onChange={(e) => setContent({ ...content, sectionTitle: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Подзаголовок</label>
                        <textarea
                            value={content.sectionSubtitle}
                            onChange={(e) => setContent({ ...content, sectionSubtitle: e.target.value })}
                            rows="2"
                        />
                    </div>
                </div>

                {/* Категории */}
                <div className="editor-section">
                    <h3>Категории услуг</h3>
                    <div className="categories-list">
                        {content.categories
                            .filter(c => c.id !== 'all')
                            .map((category, index) => (
                                <div key={category.id} className="category-item">
                                    <span className="category-label">{category.label}</span>
                                    <span className="category-id">{category.id}</span>
                                    <button
                                        className="delete-category-btn"
                                        onClick={() => handleDeleteCategory(category.id)}
                                        disabled={category.id === 'all'}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Услуги */}
                <div className="editor-section">
                    <div className="section-header">
                        <h3>Услуги</h3>
                        <button className="add-btn" onClick={handleAddService}>
                            <FaPlus /> Добавить услугу
                        </button>
                    </div>

                    {/* Фильтры категорий */}
                    <div className="category-filters">
                        {content.categories.map(category => (
                            <button
                                key={category.id}
                                className={`category-filter ${activeCategory === category.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category.id)}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>

                    {/* Список услуг */}
                    <div className="services-list">
                        {filteredServices.map((service, index) => {
                            const IconComponent = iconMap[service.icon] || Icons.FaBolt;

                            return (
                                <div key={service.id} className="service-item">
                                    <div className="service-header">
                                        <div className="service-icon">
                                            <IconComponent />
                                        </div>
                                        <div className="service-info">
                                            <h4>{service.title}</h4>
                                            <div className="service-meta">
                                                <span className="service-price">{service.price}</span>
                                                <span className="service-duration">{service.duration}</span>
                                                <span className={`service-status ${service.active ? 'active' : 'inactive'}`}>
                                                    {service.active ? 'Активно' : 'Неактивно'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="service-actions">
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEditService(service)}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteService(service.id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Преимущества */}
                <div className="editor-section">
                    <div className="section-header">
                        <h3>Преимущества</h3>
                        <button className="add-btn" onClick={handleAddBenefit}>
                            <FaPlus /> Добавить преимущество
                        </button>
                    </div>

                    <div className="benefits-list">
                        {content.benefits.map((benefit, index) => {
                            const IconComponent = iconMap[benefit.icon] || Icons.FaCheckCircle;

                            return (
                                <div key={index} className="benefit-item">
                                    <div className="benefit-icon">
                                        <IconComponent />
                                    </div>
                                    <div className="benefit-fields">
                                        <input
                                            type="text"
                                            value={benefit.title}
                                            onChange={(e) => handleBenefitChange(index, 'title', e.target.value)}
                                            placeholder="Заголовок"
                                        />
                                        <input
                                            type="text"
                                            value={benefit.description}
                                            onChange={(e) => handleBenefitChange(index, 'description', e.target.value)}
                                            placeholder="Описание"
                                        />
                                        <select
                                            value={benefit.icon}
                                            onChange={(e) => handleBenefitChange(index, 'icon', e.target.value)}
                                        >
                                            <option value="FaCheckCircle">Галочка</option>
                                            <option value="FaClock">Часы</option>
                                            <option value="FaTruck">Грузовик</option>
                                        </select>
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={benefit.active}
                                                onChange={(e) => handleBenefitChange(index, 'active', e.target.checked)}
                                            />
                                            Активно
                                        </label>
                                    </div>
                                    <button
                                        className="delete-benefit-btn"
                                        onClick={() => handleDeleteBenefit(index)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA блок */}
                <div className="editor-section">
                    <h3>CTA блок</h3>

                    <div className="form-group">
                        <label>Заголовок</label>
                        <input
                            type="text"
                            value={content.cta?.title || ''}
                            onChange={(e) => setContent({
                                ...content,
                                cta: { ...content.cta, title: e.target.value }
                            })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Описание</label>
                        <textarea
                            value={content.cta?.description || ''}
                            onChange={(e) => setContent({
                                ...content,
                                cta: { ...content.cta, description: e.target.value }
                            })}
                            rows="2"
                        />
                    </div>

                    <div className="form-group">
                        <label>Текст кнопки</label>
                        <input
                            type="text"
                            value={content.cta?.buttonText || ''}
                            onChange={(e) => setContent({
                                ...content,
                                cta: { ...content.cta, buttonText: e.target.value }
                            })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Текст телефона</label>
                        <input
                            type="text"
                            value={content.cta?.phoneText || ''}
                            onChange={(e) => setContent({
                                ...content,
                                cta: { ...content.cta, phoneText: e.target.value }
                            })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Номер телефона (для ссылки)</label>
                        <input
                            type="text"
                            value={content.cta?.phoneNumber || ''}
                            onChange={(e) => setContent({
                                ...content,
                                cta: { ...content.cta, phoneNumber: e.target.value }
                            })}
                        />
                    </div>
                </div>
            </div>

            {/* Модальное окно редактирования услуги */}
            {showServiceModal && editingService && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingService.isNew ? 'Новая услуга' : 'Редактирование услуги'}</h3>
                            <button className="close-btn" onClick={() => setShowServiceModal(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>Название услуги *</label>
                                <input
                                    type="text"
                                    value={editingService.title}
                                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Описание</label>
                                <textarea
                                    value={editingService.description}
                                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                                    rows="3"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Цена *</label>
                                    <input
                                        type="text"
                                        value={editingService.price}
                                        onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Длительность *</label>
                                    <input
                                        type="text"
                                        value={editingService.duration}
                                        onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Категория</label>
                                <select
                                    value={editingService.category}
                                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                                >
                                    {content.categories
                                        .filter(c => c.id !== 'all')
                                        .map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.label}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Иконка</label>
                                <select
                                    value={editingService.icon}
                                    onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                                >
                                    <option value="FaBolt">Молния</option>
                                    <option value="FaTools">Инструменты</option>
                                    <option value="FaWrench">Гаечный ключ</option>
                                    <option value="MdOutlineElectricalServices">Электрика</option>
                                    <option value="MdHomeRepairService">Ремонт дома</option>
                                    <option value="MdSecurity">Безопасность</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Что входит:</label>
                                {editingService.features.map((feature, idx) => (
                                    <div key={idx} className="feature-input-group">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => handleFeatureChange(idx, e.target.value)}
                                            placeholder={`Пункт ${idx + 1}`}
                                        />
                                        <button
                                            className="remove-feature-btn"
                                            onClick={() => handleDeleteFeature(idx)}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                                <button className="add-feature-btn" onClick={handleAddFeature}>
                                    <FaPlus /> Добавить пункт
                                </button>
                            </div>

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={editingService.active}
                                    onChange={(e) => setEditingService({ ...editingService, active: e.target.checked })}
                                />
                                Услуга активна
                            </label>
                        </div>

                        <div className="modal-footer">
                            <button className="cancel-modal-btn" onClick={() => setShowServiceModal(false)}>
                                Отмена
                            </button>
                            <button className="save-modal-btn" onClick={handleSaveService}>
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesEditor;