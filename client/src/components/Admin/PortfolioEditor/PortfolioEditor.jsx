import React, { useState, useEffect, useCallback } from 'react';
import './PortfolioEditor.css';
import {
    FaPlus, FaTrash, FaEdit, FaTimes, FaImage, FaLink,
    FaSearch, FaHome, FaBuilding,
    FaIndustry, FaStore, FaEye
} from 'react-icons/fa';
import {
    MdApartment
} from 'react-icons/md';

const PortfolioEditor = () => {
    const [content, setContent] = useState(null);
    const [originalContent, setOriginalContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [editingItem, setEditingItem] = useState(null);
    const [showItemModal, setShowItemModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewItem, setPreviewItem] = useState(null);
    const [pendingUploads, setPendingUploads] = useState([]);

    // Маппинг иконок для категорий (только для отображения в фильтрах)
    const categoryIcons = {
        'Квартиры': MdApartment,
        'Частные дома': FaHome,
        'Офисы': FaBuilding,
        'Промышленные': FaIndustry,
        'Коммерческие': FaStore
    };

    // Функция для создания изображения-заглушки при ошибке
    const getFallbackImage = (width = 100, height = 80, text = 'Нет фото') => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Заливка фона
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Рамка
        ctx.strokeStyle = '#d0d0d0';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Иконка (простая камера)
        ctx.fillStyle = '#999';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2 - 10, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#666';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2 - 10, 8, 0, Math.PI * 2);
        ctx.fill();

        // Текст
        ctx.fillStyle = '#666';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, canvas.width / 2, canvas.height - 15);

        return canvas.toDataURL();
    };

    // Очистка временных загрузок
    const cleanupPendingUploads = useCallback(async () => {
        for (const upload of pendingUploads) {
            try {
                // Если это временная загрузка и элемент не был сохранен, удаляем файл
                if (upload.temp) {
                    // Здесь можно добавить запрос на сервер для удаления временного файла
                    // Но пока просто логируем
                    console.log('Would delete temp file:', upload.filename);
                }
            } catch (err) {
                console.error('Error cleaning up pending upload:', err);
            }
        }
        setPendingUploads([]);
    }, [pendingUploads]);


    useEffect(() => {
        fetchContent();

        return () => {
            if (pendingUploads.length > 0) {
                cleanupPendingUploads();
            }
        };
    }, [cleanupPendingUploads, pendingUploads.length]);

    const fetchContent = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/portfolio/content`);
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

            // Подготавливаем данные для сохранения
            const saveContent = {
                _id: content._id,
                sectionTitle: content.sectionTitle,
                sectionSubtitle: content.sectionSubtitle,
                items: content.items.map(item => {
                    const { _id, ...itemData } = item;

                    // Обрабатываем изображения
                    if (itemData.images) {
                        itemData.images = itemData.images
                            .map(img => {
                                const { _id, ...imgData } = img;
                                // Для файлов оставляем как есть (относительный путь)
                                // Для URL оставляем полный URL
                                if (imgData.type === 'file' && imgData.url && imgData.url.includes('/uploads')) {
                                    // Убеждаемся, что путь относительный
                                    const urlParts = imgData.url.split('/uploads');
                                    if (urlParts.length > 1) {
                                        imgData.url = `/uploads${urlParts[1]}`;
                                    }
                                }
                                // Для URL типа оставляем URL как есть (он может быть внешним)
                                return imgData;
                            })
                            .filter(img => img.url && img.url.trim() !== ''); // Оставляем только с непустым URL
                    }

                    if (itemData.features) {
                        itemData.features = itemData.features.filter(f => f && f.trim() !== '');
                    }
                    return itemData;
                })
            };

            console.log('Saving content:', JSON.stringify(saveContent, null, 2));

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/portfolio/content`, {
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
            setPendingUploads([]);
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
            cleanupPendingUploads();
            setSuccess('Изменения отменены');
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    // Предпросмотр элемента
    const handlePreview = (item) => {
        setPreviewItem(item);
        setShowPreviewModal(true);
    };

    // Управление элементами портфолио
    const handleAddItem = () => {
        // Получаем список существующих категорий для предложений
        const existingCategories = [...new Set(content.items.map(i => i.category).filter(Boolean))];

        setEditingItem({
            id: Date.now(),
            title: '',
            description: '',
            category: existingCategories[0] || '',
            images: [],
            features: [''],
            date: new Date().toLocaleDateString('ru-RU'),
            area: '',
            duration: '',
            active: true,
            order: content.items.length + 1,
            isNew: true
        });
        setShowItemModal(true);
    };

    const handleEditItem = (item) => {
        setEditingItem({
            ...item,
            images: item.images || [],
            features: item.features && item.features.length ? [...item.features] : ['']
        });
        setShowItemModal(true);
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот элемент?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/portfolio/items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка удаления');
            }

            const data = await response.json();
            setContent({ ...content, items: data.items });
            setSuccess('Элемент удален');
            setTimeout(() => setSuccess(''), 3000);

            if (activeCategory !== 'all') {
                const itemsInCategory = data.items.filter(i => i.category === activeCategory);
                if (itemsInCategory.length === 0) {
                    setActiveCategory('all');
                }
            }
        } catch (err) {
            console.error('Error deleting item:', err);
            setError('Ошибка при удалении элемента');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleSaveItem = async () => {
        if (!editingItem.title || !editingItem.category || !editingItem.area || !editingItem.duration) {
            setError('Заполните все обязательные поля');
            setTimeout(() => setError(''), 3000);
            return;
        }

        // Сохраняем категорию как есть
        const categoryToSave = editingItem.category.trim();

        // Фильтруем пустые фичи
        const featuresToSave = editingItem.features.filter(f => f && f.trim() !== '');

        // Фильтруем изображения - оставляем только те, у которых есть URL
        const imagesToSave = (editingItem.images || [])
            .filter(img => img.url && img.url.trim() !== '')
            .map(img => {
                // Для файлов убеждаемся, что путь относительный
                if (img.type === 'file' && img.url && img.url.includes('/uploads')) {
                    const urlParts = img.url.split('/uploads');
                    if (urlParts.length > 1) {
                        return {
                            ...img,
                            url: `/uploads${urlParts[1]}`
                        };
                    }
                }
                return img;
            });

        const itemToSave = {
            id: editingItem.id,
            title: editingItem.title,
            description: editingItem.description || '',
            category: categoryToSave,
            images: imagesToSave,
            features: featuresToSave.length ? featuresToSave : ['Базовая работа'],
            date: editingItem.date,
            area: editingItem.area,
            duration: editingItem.duration,
            active: editingItem.active !== undefined ? editingItem.active : true,
            order: editingItem.order || 0
        };

        if (editingItem.isNew) {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/portfolio/items`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(itemToSave)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Ошибка создания');
                }

                const newItem = await response.json();
                setContent({ ...content, items: [...content.items, newItem] });
                setSuccess('Элемент создан');
                setTimeout(() => setSuccess(''), 3000);
                setShowItemModal(false);
                setEditingItem(null);
            } catch (err) {
                console.error('Error creating item:', err);
                setError('Ошибка при создании элемента: ' + err.message);
                setTimeout(() => setError(''), 3000);
            }
        } else {
            const index = content.items.findIndex(i => i.id === editingItem.id);
            if (index !== -1) {
                const newItems = [...content.items];
                newItems[index] = itemToSave;
                setContent({ ...content, items: newItems });
                setSuccess('Элемент обновлен');
                setTimeout(() => setSuccess(''), 3000);
                setShowItemModal(false);
                setEditingItem(null);
            }
        }
    };

    // Управление изображениями
    const handleAddImage = () => {
        const newImages = [...(editingItem.images || []), {
            url: '',
            type: 'url',
            altText: '',
            order: (editingItem.images || []).length
        }];
        setEditingItem({ ...editingItem, images: newImages });
    };

    const handleImageChange = (index, field, value) => {
        const newImages = [...editingItem.images];
        newImages[index] = { ...newImages[index], [field]: value };
        setEditingItem({ ...editingItem, images: newImages });
    };

    const handleImageTypeChange = (index, type) => {
        const newImages = [...editingItem.images];
        newImages[index] = { ...newImages[index], type, url: '' };
        setEditingItem({ ...editingItem, images: newImages });
    };

    const handleImageUpload = async (index, file) => {
        // Проверяем, является ли элемент новым (временным)
        const isNewItem = editingItem.isNew || typeof editingItem.id === 'string' || editingItem.id.toString().length > 10; // Date.now() дает длинное число

        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('adminToken');

            let response;

            if (isNewItem) {
                // Для нового элемента используем временный endpoint
                response = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/portfolio/items/temp/images`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData
                    }
                );
            } else {
                // Для существующего элемента используем обычный endpoint
                response = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/portfolio/items/${editingItem.id}/images/${index}`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData
                    }
                );
            }

            if (!response.ok) {
                throw new Error('Ошибка загрузки');
            }

            const data = await response.json();

            setPendingUploads(prev => [...prev, {
                itemId: editingItem.id,
                index,
                filename: data.filename,
                url: data.imageUrl,
                temp: isNewItem // Помечаем как временную загрузку
            }]);

            const newImages = [...editingItem.images];
            newImages[index] = {
                ...newImages[index],
                url: data.imageUrl,
                type: 'file'
            };
            setEditingItem({ ...editingItem, images: newImages });

            setSuccess(isNewItem ? 'Изображение временно загружено (сохраните элемент для окончательного размещения)' : 'Изображение загружено');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error uploading image:', err);
            setError('Ошибка загрузки изображения');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteImage = async (index) => {
        if (editingItem.isNew) {
            const newImages = editingItem.images.filter((_, i) => i !== index);
            setEditingItem({ ...editingItem, images: newImages });
            return;
        }

        const image = editingItem.images[index];
        if (image.type === 'file' && image.url) {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/portfolio/items/${editingItem.id}/images/${index}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error('Ошибка удаления');
                }

                const data = await response.json();
                setEditingItem({ ...editingItem, images: data.images });
                setSuccess('Изображение удалено');
            } catch (err) {
                console.error('Error deleting image:', err);
                setError('Ошибка удаления изображения');
            }
        } else {
            const newImages = editingItem.images.filter((_, i) => i !== index);
            setEditingItem({ ...editingItem, images: newImages });
        }

        setTimeout(() => setSuccess(''), 3000);
    };

    // Управление фичами
    const handleFeatureChange = (index, value) => {
        const newFeatures = [...editingItem.features];
        newFeatures[index] = value;
        setEditingItem({ ...editingItem, features: newFeatures });
    };

    const handleAddFeature = () => {
        setEditingItem({ ...editingItem, features: [...editingItem.features, ''] });
    };

    const handleDeleteFeature = (index) => {
        const newFeatures = editingItem.features.filter((_, i) => i !== index);
        setEditingItem({ ...editingItem, features: newFeatures });
    };

    // Получить уникальные категории из элементов
    const getUniqueCategories = () => {
        if (!content?.items) return [];
        const categories = content.items
            .map(i => i.category)
            .filter(category => category && category.trim() !== '')
            .filter((value, index, self) => self.indexOf(value) === index);
        return categories.sort((a, b) => a.localeCompare(b, 'ru'));
    };

    if (loading) return <div className="editor-loading">Загрузка...</div>;
    if (!content) return <div className="editor-error">Ошибка загрузки</div>;

    const categories = getUniqueCategories();
    const filteredItems = activeCategory === 'all'
        ? content.items
        : content.items.filter(i => i.category === activeCategory);
    const fallbackImage = getFallbackImage(100, 80, 'Нет фото');

    return (
        <div className="portfolio-editor">
            <div className="editor-header">
                <h2>Редактирование портфолио</h2>
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

                {/* Элементы портфолио */}
                <div className="editor-section">
                    <div className="section-header">
                        <h3>Элементы портфолио</h3>
                        <button className="add-btn" onClick={handleAddItem}>
                            <FaPlus /> Добавить элемент
                        </button>
                    </div>

                    {/* Фильтры категорий из элементов */}
                    {categories.length > 0 && (
                        <div className="category-filters">
                            <button
                                key="all"
                                className={`category-filter ${activeCategory === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveCategory('all')}
                            >
                                Все
                            </button>
                            {categories.map(category => {
                                const IconComponent = categoryIcons[category] || FaSearch;
                                return (
                                    <button
                                        key={category}
                                        className={`category-filter ${activeCategory === category ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(category)}
                                    >
                                        <IconComponent style={{ marginRight: '5px' }} />
                                        {category}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Список элементов */}
                    <div className="items-list">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="item-card">
                                <div className="item-header">
                                    <div className="item-image-preview">
                                        {item.images && item.images[0] ? (
                                            <img
                                                src={item.images[0].url}
                                                alt={item.title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = fallbackImage;
                                                }}
                                            />
                                        ) : (
                                            <img src={fallbackImage} alt="Нет фото" />
                                        )}
                                    </div>
                                    <div className="item-info">
                                        <h4>{item.title}</h4>
                                        <div className="item-meta">
                                            <span className="item-category">{item.category}</span>
                                            <span className="item-area">{item.area}</span>
                                            <span className="item-duration">{item.duration}</span>
                                            <span className={`item-status ${item.active ? 'active' : 'inactive'}`}>
                                                {item.active ? 'Активно' : 'Неактивно'}
                                            </span>
                                        </div>
                                        <div className="item-images-count">
                                            Фото: {item.images?.length || 0}
                                        </div>
                                    </div>
                                    <div className="item-actions">
                                        <button
                                            className="preview-btn"
                                            onClick={() => handlePreview(item)}
                                            title="Предпросмотр"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEditItem(item)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeleteItem(item.id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Модальное окно редактирования элемента */}
            {showItemModal && editingItem && (
                <div className="modal-overlay">
                    <div className="modal-content large">
                        <div className="modal-header">
                            <h3>{editingItem.isNew ? 'Новый элемент' : 'Редактирование элемента'}</h3>
                            <button className="close-btn" onClick={() => setShowItemModal(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>Название *</label>
                                <input
                                    type="text"
                                    value={editingItem.title}
                                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Описание</label>
                                <textarea
                                    value={editingItem.description}
                                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                    rows="3"
                                />
                            </div>

                            <div className="form-group">
                                <label>Категория *</label>
                                <input
                                    type="text"
                                    value={editingItem.category}
                                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                                    placeholder="Например: Квартиры, Дома, Офисы"
                                    list="category-suggestions"
                                />
                                <datalist id="category-suggestions">
                                    {content.items
                                        .map(i => i.category)
                                        .filter((value, index, self) => value && self.indexOf(value) === index)
                                        .map(category => (
                                            <option key={category} value={category} />
                                        ))}
                                </datalist>
                                <small className="form-hint">
                                    Введите название категории. Оно будет использоваться точно как вы написали.
                                </small>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Дата</label>
                                    <input
                                        type="text"
                                        value={editingItem.date}
                                        onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                                        placeholder="ДД.ММ.ГГГГ"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Площадь *</label>
                                    <input
                                        type="text"
                                        value={editingItem.area}
                                        onChange={(e) => setEditingItem({ ...editingItem, area: e.target.value })}
                                        placeholder="например: 85 м²"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Длительность *</label>
                                <input
                                    type="text"
                                    value={editingItem.duration}
                                    onChange={(e) => setEditingItem({ ...editingItem, duration: e.target.value })}
                                    placeholder="например: 3 дня"
                                />
                            </div>

                            {/* Изображения */}
                            <div className="form-group">
                                <label>Изображения</label>
                                {editingItem.images && editingItem.images.map((image, idx) => (
                                    <div key={idx} className="image-editor">
                                        <div className="image-type-selector">
                                            <button
                                                className={`type-btn ${image.type === 'url' ? 'active' : ''}`}
                                                onClick={() => handleImageTypeChange(idx, 'url')}
                                            >
                                                <FaLink /> URL
                                            </button>
                                            <button
                                                className={`type-btn ${image.type === 'file' ? 'active' : ''}`}
                                                onClick={() => handleImageTypeChange(idx, 'file')}
                                            >
                                                <FaImage /> Файл
                                            </button>
                                        </div>

                                        {image.type === 'url' && (
                                            <div className="image-url-input">
                                                <input
                                                    type="url"
                                                    value={image.url}
                                                    onChange={(e) => handleImageChange(idx, 'url', e.target.value)}
                                                    placeholder="https://example.com/image.jpg"
                                                />
                                                {image.url && (
                                                    <div className="image-preview-small">
                                                        <img
                                                            src={image.url}
                                                            alt={`Предпросмотр ${idx + 1}`}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = getFallbackImage(100, 80, 'Ошибка');
                                                            }}
                                                            style={{ maxWidth: '100px', maxHeight: '80px', marginTop: '10px' }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {image.type === 'file' && (
                                            <div className="image-file-upload">
                                                {image.url && (
                                                    <div className="image-preview">
                                                        <img
                                                            src={image.url}
                                                            alt={`Изображение ${idx + 1}`}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = getFallbackImage(200, 150, 'Ошибка');
                                                            }}
                                                        />
                                                        <button
                                                            className="remove-image-btn"
                                                            onClick={() => handleDeleteImage(idx)}
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="file-input-wrapper">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            if (e.target.files[0]) {
                                                                handleImageUpload(idx, e.target.files[0]);
                                                            }
                                                        }}
                                                        id={`image-upload-${idx}`}
                                                    />
                                                    <label htmlFor={`image-upload-${idx}`} className="file-input-label">
                                                        <FaImage /> {image.url ? 'Заменить файл' : 'Выбрать файл'}
                                                    </label>
                                                </div>
                                            </div>
                                        )}

                                        <div className="image-alt-input">
                                            <input
                                                type="text"
                                                value={image.altText || ''}
                                                onChange={(e) => handleImageChange(idx, 'altText', e.target.value)}
                                                placeholder="Alt текст (для SEO)"
                                            />
                                        </div>

                                        {/*{image.url && image.url.trim() !== '' && (*/}
                                        {/*    <button*/}
                                        {/*        className="remove-image-btn"*/}
                                        {/*        onClick={() => handleDeleteImage(idx)}*/}
                                        {/*        style={{ marginTop: '10px' }}*/}
                                        {/*    >*/}
                                        {/*        <FaTrash /> */}
                                        {/*    </button>*/}
                                        {/*)}*/}
                                    </div>
                                ))}
                                <button className="add-feature-btn" onClick={handleAddImage}>
                                    <FaPlus /> Добавить изображение
                                </button>
                            </div>

                            {/* Выполненные работы */}
                            <div className="form-group">
                                <label>Выполненные работы:</label>
                                {editingItem.features.map((feature, idx) => (
                                    <div key={idx} className="feature-input-group">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => handleFeatureChange(idx, e.target.value)}
                                            placeholder={`Работа ${idx + 1}`}
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
                                    <FaPlus /> Добавить работу
                                </button>
                            </div>

                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={editingItem.active}
                                    onChange={(e) => setEditingItem({ ...editingItem, active: e.target.checked })}
                                />
                                Элемент активен
                            </label>
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

            {/* Модальное окно предпросмотра */}
            {showPreviewModal && previewItem && (
                <div className="modal-overlay">
                    <div className="modal-content large">
                        <div className="modal-header">
                            <h3>Предпросмотр: {previewItem.title}</h3>
                            <button className="close-btn" onClick={() => setShowPreviewModal(false)}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="modal-body preview-body">
                            <div className="preview-card">
                                <div className="preview-images">
                                    <h4>Изображения:</h4>
                                    <div className="preview-image-grid">
                                        {previewItem.images && previewItem.images.length > 0 ? (
                                            previewItem.images.map((img, idx) => (
                                                <div key={idx} className="preview-image-item">
                                                    <img
                                                        src={img.url}
                                                        alt={img.altText || `Изображение ${idx + 1}`}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = getFallbackImage(150, 150, 'Ошибка');
                                                        }}
                                                    />
                                                    <span className="preview-image-type">
                                                        {img.type === 'file' ? 'Файл' : 'URL'}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="no-images">Нет изображений</div>
                                        )}
                                    </div>
                                </div>

                                <div className="preview-info">
                                    <div className="preview-field">
                                        <strong>Категория:</strong> {previewItem.category}
                                    </div>
                                    <div className="preview-field">
                                        <strong>Описание:</strong> {previewItem.description}
                                    </div>
                                    <div className="preview-field">
                                        <strong>Площадь:</strong> {previewItem.area}
                                    </div>
                                    <div className="preview-field">
                                        <strong>Длительность:</strong> {previewItem.duration}
                                    </div>
                                    <div className="preview-field">
                                        <strong>Дата:</strong> {previewItem.date}
                                    </div>
                                    <div className="preview-field">
                                        <strong>Статус:</strong>
                                        <span className={`status-badge ${previewItem.active ? 'active' : 'inactive'}`}>
                                            {previewItem.active ? 'Активно' : 'Неактивно'}
                                        </span>
                                    </div>

                                    {previewItem.features && previewItem.features.length > 0 && (
                                        <div className="preview-field">
                                            <strong>Выполненные работы:</strong>
                                            <ul className="preview-features-list">
                                                {previewItem.features.map((feature, idx) => (
                                                    <li key={idx}>{feature}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="cancel-modal-btn" onClick={() => setShowPreviewModal(false)}>
                                Закрыть
                            </button>
                            <button
                                className="edit-modal-btn"
                                onClick={() => {
                                    setShowPreviewModal(false);
                                    handleEditItem(previewItem);
                                }}
                            >
                                <FaEdit /> Редактировать
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortfolioEditor;