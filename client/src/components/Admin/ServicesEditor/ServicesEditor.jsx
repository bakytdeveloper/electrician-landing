import React, { useState, useEffect } from 'react';
import './ServicesEditor.css';
import {
    FaPlus, FaTrash, FaEdit, FaTimes,
    FaBolt, FaTools, FaWrench, FaCheckCircle, FaClock, FaTruck,
    FaPlug, FaLightbulb, FaSolarPanel, FaFan, FaCog, FaShieldAlt,
    FaHammer, FaPaintRoller, FaHome, FaBuilding, FaIndustry
} from 'react-icons/fa';
import {
    MdOutlineElectricalServices, MdSecurity, MdHomeRepairService,
    MdOutlineBolt, MdOutlinePower, MdOutlineSolarPower,
    MdOutlineConstruction, MdOutlineHandyman, MdOutlinePlumbing,
    MdOutlineSecurity, MdOutlineSurroundSound, MdOutlineWifi
} from 'react-icons/md';
import {
    GiElectric, GiPowerGenerator, GiCircuitry, GiSolarPower,
    GiLightBulb, GiElectricalResistance, GiElectricWhip
} from 'react-icons/gi';

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
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [iconPickerTarget, setIconPickerTarget] = useState(null);

    // Расширенный маппинг иконок
    const iconMap = {
        // Fa иконки
        FaBolt: { component: FaBolt, name: 'Молния', category: 'fa' },
        FaTools: { component: FaTools, name: 'Инструменты', category: 'fa' },
        FaWrench: { component: FaWrench, name: 'Гаечный ключ', category: 'fa' },
        FaCheckCircle: { component: FaCheckCircle, name: 'Галочка', category: 'fa' },
        FaClock: { component: FaClock, name: 'Часы', category: 'fa' },
        FaTruck: { component: FaTruck, name: 'Грузовик', category: 'fa' },
        FaPlug: { component: FaPlug, name: 'Вилка', category: 'fa' },
        FaLightbulb: { component: FaLightbulb, name: 'Лампочка', category: 'fa' },
        FaSolarPanel: { component: FaSolarPanel, name: 'Солнечная панель', category: 'fa' },
        FaFan: { component: FaFan, name: 'Вентилятор', category: 'fa' },
        FaCog: { component: FaCog, name: 'Шестеренка', category: 'fa' },
        FaShieldAlt: { component: FaShieldAlt, name: 'Щит', category: 'fa' },
        FaHammer: { component: FaHammer, name: 'Молоток', category: 'fa' },
        FaPaintRoller: { component: FaPaintRoller, name: 'Валик', category: 'fa' },
        FaHome: { component: FaHome, name: 'Дом', category: 'fa' },
        FaBuilding: { component: FaBuilding, name: 'Здание', category: 'fa' },
        FaIndustry: { component: FaIndustry, name: 'Завод', category: 'fa' },

        // Md иконки
        MdOutlineElectricalServices: { component: MdOutlineElectricalServices, name: 'Электрика', category: 'md' },
        MdSecurity: { component: MdSecurity, name: 'Безопасность', category: 'md' },
        MdHomeRepairService: { component: MdHomeRepairService, name: 'Ремонт дома', category: 'md' },
        MdOutlineBolt: { component: MdOutlineBolt, name: 'Разряд', category: 'md' },
        MdOutlinePower: { component: MdOutlinePower, name: 'Питание', category: 'md' },
        MdOutlineSolarPower: { component: MdOutlineSolarPower, name: 'Солнечная энергия', category: 'md' },
        MdOutlineConstruction: { component: MdOutlineConstruction, name: 'Строительство', category: 'md' },
        MdOutlineHandyman: { component: MdOutlineHandyman, name: 'Мастер', category: 'md' },
        MdOutlinePlumbing: { component: MdOutlinePlumbing, name: 'Сантехника', category: 'md' },
        MdOutlineSecurity: { component: MdOutlineSecurity, name: 'Безопасность', category: 'md' },
        MdOutlineSurroundSound: { component: MdOutlineSurroundSound, name: 'Аудио', category: 'md' },
        MdOutlineWifi: { component: MdOutlineWifi, name: 'Wi-Fi', category: 'md' },

        // Gi иконки
        GiElectric: { component: GiElectric, name: 'Электричество', category: 'gi' },
        GiPowerGenerator: { component: GiPowerGenerator, name: 'Генератор', category: 'gi' },
        GiCircuitry: { component: GiCircuitry, name: 'Схема', category: 'gi' },
        GiSolarPower: { component: GiSolarPower, name: 'Солнечная батарея', category: 'gi' },
        GiLightBulb: { component: GiLightBulb, name: 'Лампочка', category: 'gi' },
        GiElectricalResistance: { component: GiElectricalResistance, name: 'Сопротивление', category: 'gi' },
        GiElectricWhip: { component: GiElectricWhip, name: 'Провод', category: 'gi' }
    };

    useEffect(() => {
        fetchContent();
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

// Найдите функцию handleSave в ServicesEditor.jsx и замените её на эту:

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

            // Подготавливаем данные для сохранения - удаляем _id из вложенных объектов
            const saveContent = {
                _id: content._id, // Сохраняем только ID основного документа
                sectionTitle: content.sectionTitle,
                sectionSubtitle: content.sectionSubtitle,
                services: content.services.map(service => {
                    // Создаем новый объект без _id
                    const { _id, ...serviceData } = service;
                    return {
                        ...serviceData,
                        features: serviceData.features.filter(f => f && f.trim() !== '')
                    };
                }),
                benefits: content.benefits.map(benefit => {
                    const { _id, ...benefitData } = benefit;
                    return {
                        ...benefitData,
                        title: benefitData.title || '',
                        description: benefitData.description || ''
                    };
                }),
                cta: content.cta ? (() => {
                    const { _id, ...ctaData } = content.cta;
                    return ctaData;
                })() : {}
            };

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/services/content`, {
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

    // Управление услугами
    const handleAddService = () => {
        // Получаем список уникальных категорий для предложений
        const existingCategories = [...new Set(content.services.map(s => s.category).filter(Boolean))];

        setEditingService({
            id: Date.now(),
            title: '',
            description: '',
            icon: 'FaBolt',
            category: existingCategories[0] || '',
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
        setEditingService({
            ...service,
            features: service.features && service.features.length ? [...service.features] : ['']
        });
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

            // Если текущая категория стала пустой, переключаемся на 'all'
            if (activeCategory !== 'all') {
                const servicesInCategory = data.services.filter(s => s.category === activeCategory);
                if (servicesInCategory.length === 0) {
                    setActiveCategory('all');
                }
            }
        } catch (err) {
            console.error('Error deleting service:', err);
            setError('Ошибка при удалении услуги');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleSaveService = async () => {
        if (!editingService.title || !editingService.price || !editingService.duration || !editingService.category) {
            setError('Заполните все обязательные поля');
            setTimeout(() => setError(''), 3000);
            return;
        }

        // Сохраняем категорию exactly as entered (без изменений)
        const categoryToSave = editingService.category.trim();

        // Фильтруем пустые фичи
        const featuresToSave = editingService.features.filter(f => f && f.trim() !== '');

        const serviceToSave = {
            id: editingService.id,
            title: editingService.title,
            description: editingService.description || '',
            icon: editingService.icon || 'FaBolt',
            category: categoryToSave,
            features: featuresToSave.length ? featuresToSave : ['Базовая услуга'],
            price: editingService.price,
            duration: editingService.duration,
            active: editingService.active !== undefined ? editingService.active : true,
            order: editingService.order || 0
        };

        if (editingService.isNew) {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/services/services`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(serviceToSave)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка создания');
                }

                const newService = await response.json();
                setContent({ ...content, services: [...content.services, newService] });
                setSuccess('Услуга создана');
                setTimeout(() => setSuccess(''), 3000);
                setShowServiceModal(false);
                setEditingService(null);
            } catch (err) {
                console.error('Error creating service:', err);
                setError('Ошибка при создании услуги: ' + err.message);
                setTimeout(() => setError(''), 3000);
            }
        } else {
            // Обновляем существующую услугу - находим по id (наш числовой ID), не по _id MongoDB
            const index = content.services.findIndex(s => s.id === editingService.id);
            if (index !== -1) {
                const newServices = [...content.services];
                newServices[index] = serviceToSave;
                setContent({ ...content, services: newServices });
                setSuccess('Услуга обновлена');
                setTimeout(() => setSuccess(''), 3000);
                setShowServiceModal(false);
                setEditingService(null);
            }
        }
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

    // Открыть выбор иконки
    const openIconPicker = (target) => {
        setIconPickerTarget(target);
        setShowIconPicker(true);
    };

    // Выбрать иконку
    const selectIcon = (iconKey) => {
        if (iconPickerTarget.type === 'service') {
            setEditingService({ ...editingService, icon: iconKey });
        } else if (iconPickerTarget.type === 'benefit') {
            handleBenefitChange(iconPickerTarget.index, 'icon', iconKey);
        }
        setShowIconPicker(false);
        setIconPickerTarget(null);
    };

    // Получить уникальные категории из услуг
    const getUniqueCategories = () => {
        if (!content?.services) return [];
        const categories = content.services
            .map(s => s.category)
            .filter(category => category && category.trim() !== '')
            .filter((value, index, self) => self.indexOf(value) === index);
        return categories.sort((a, b) => a.localeCompare(b, 'ru'));
    };

    if (loading) return <div className="editor-loading">Загрузка...</div>;
    if (!content) return <div className="editor-error">Ошибка загрузки</div>;

    const categories = getUniqueCategories();
    const filteredServices = activeCategory === 'all'
        ? content.services
        : content.services.filter(s => s.category === activeCategory);

    // Группируем иконки по категориям для отображения
    const iconsByCategory = {
        'fa': { name: 'Font Awesome', icons: [] },
        'md': { name: 'Material Design', icons: [] },
        'gi': { name: 'Game Icons', icons: [] }
    };

    Object.entries(iconMap).forEach(([key, value]) => {
        iconsByCategory[value.category].icons.push({ key, ...value });
    });

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

                {/* Услуги */}
                <div className="editor-section">
                    <div className="section-header">
                        <h3>Услуги</h3>
                        <button className="add-btn" onClick={handleAddService}>
                            <FaPlus /> Добавить услугу
                        </button>
                    </div>

                    {/* Фильтры категорий */}
                    {categories.length > 0 && (
                        <div className="category-filters">
                            <button
                                key="all"
                                className={`category-filter ${activeCategory === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveCategory('all')}
                            >
                                Все услуги
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`category-filter ${activeCategory === category ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Список услуг */}
                    <div className="services-list">
                        {filteredServices.map((service) => {
                            const IconComponent = iconMap[service.icon]?.component || FaBolt;

                            return (
                                <div key={service.id} className="service-item">
                                    <div className="service-header">
                                        <div className="service-icon">
                                            <IconComponent />
                                        </div>
                                        <div className="service-info">
                                            <h4>{service.title}</h4>
                                            <div className="service-meta">
                                                <span className="service-category">{service.category}</span>
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
                            const IconComponent = iconMap[benefit.icon]?.component || FaCheckCircle;

                            return (
                                <div key={index} className="benefit-item">
                                    <div
                                        className="benefit-icon clickable"
                                        onClick={() => openIconPicker({ type: 'benefit', index })}
                                    >
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
                                <label>Категория *</label>
                                <input
                                    type="text"
                                    value={editingService.category}
                                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                                    placeholder="Например: Монтаж, Ремонт, Обслуживание"
                                    list="category-suggestions"
                                />
                                <datalist id="category-suggestions">
                                    {content.services
                                        .map(s => s.category)
                                        .filter((value, index, self) => value && self.indexOf(value) === index)
                                        .map(category => (
                                            <option key={category} value={category} />
                                        ))}
                                </datalist>
                                <small className="form-hint">
                                    Введите название категории. Оно будет использоваться точно как вы написали.
                                </small>
                            </div>

                            <div className="form-group">
                                <label>Иконка</label>
                                <div className="icon-selector">
                                    <div
                                        className="selected-icon"
                                        onClick={() => openIconPicker({ type: 'service' })}
                                    >
                                        {iconMap[editingService.icon] && (
                                            <>
                                                {React.createElement(iconMap[editingService.icon].component, { size: 24 })}
                                                <span>{iconMap[editingService.icon].name}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
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

            {/* Модальное окно выбора иконок */}
            {showIconPicker && (
                <div className="modal-overlay">
                    <div className="modal-content large">
                        <div className="modal-header">
                            <h3>Выберите иконку</h3>
                            <button className="close-btn" onClick={() => setShowIconPicker(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="modal-body icon-picker-body">
                            {Object.entries(iconsByCategory).map(([categoryKey, category]) => (
                                <div key={categoryKey} className="icon-category">
                                    <h4>{category.name}</h4>
                                    <div className="icon-grid">
                                        {category.icons.map(icon => (
                                            <div
                                                key={icon.key}
                                                className={`icon-item ${
                                                    (iconPickerTarget?.type === 'service' && editingService?.icon === icon.key) ||
                                                    (iconPickerTarget?.type === 'benefit' && content.benefits[iconPickerTarget.index]?.icon === icon.key)
                                                        ? 'selected' : ''
                                                }`}
                                                onClick={() => selectIcon(icon.key)}
                                            >
                                                <div className="icon-preview">
                                                    {React.createElement(icon.component, { size: 24 })}
                                                </div>
                                                <span className="icon-name">{icon.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesEditor;