import React, { useState, useEffect } from 'react';
import './HeroEditor.css';
import { FaPlus, FaTrash, FaImage, FaLink, FaPalette } from 'react-icons/fa';

const HeroEditor = () => {
    const [content, setContent] = useState(null);
    const [originalContent, setOriginalContent] = useState(null); // Для хранения исходного состояния
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [pendingUploads, setPendingUploads] = useState([]); // Отслеживаем временные загрузки

    useEffect(() => {
        fetchContent();

        // Очистка при размонтировании компонента
        return () => {
            // Если есть незавершенные загрузки, удаляем их с сервера
            if (pendingUploads.length > 0) {
                cleanupPendingUploads();
            }
        };
    }, []);

    const fetchContent = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/hero/content`);
            const data = await response.json();
            setContent(data);
            setOriginalContent(JSON.parse(JSON.stringify(data))); // Глубокое копирование
        } catch (err) {
            console.error('Error fetching content:', err);
            setError('Ошибка загрузки контента');
        } finally {
            setLoading(false);
        }
    };

    // Очистка временных загрузок
    const cleanupPendingUploads = async () => {
        for (const upload of pendingUploads) {
            try {
                // Здесь должен быть эндпоинт для удаления временного файла
                // Но так как у нас его нет, просто логируем
                console.log('Would delete temp file:', upload);

                // В реальности нужно отправить запрос на сервер для удаления файла
                // await fetch(`${process.env.REACT_APP_API_URL}/api/hero/temp/${upload.filename}`, {
                //     method: 'DELETE',
                // });
            } catch (err) {
                console.error('Error cleaning up pending upload:', err);
            }
        }
        setPendingUploads([]);
    };

    // Отмена всех изменений
    const handleCancel = () => {
        if (originalContent) {
            setContent(JSON.parse(JSON.stringify(originalContent)));
            // Удаляем все временные файлы с сервера
            cleanupPendingUploads();
            setSuccess('Изменения отменены');
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    // Проверка наличия изменений
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

            // Подготавливаем данные для сохранения (убираем полные URL)
            const saveContent = {
                ...content,
                slides: content.slides.map(slide => {
                    if (slide.bgType === 'file' && slide.bgValue) {
                        // Извлекаем относительный путь из полного URL
                        if (slide.bgValue.includes('/uploads')) {
                            const urlParts = slide.bgValue.split('/uploads');
                            if (urlParts.length > 1) {
                                return {
                                    ...slide,
                                    bgValue: `/uploads${urlParts[1]}`
                                };
                            }
                        }
                    }
                    return slide;
                })
            };

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/hero/content`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(saveContent)
            });

            if (!response.ok) {
                throw new Error('Ошибка сохранения');
            }

            const updatedContent = await response.json();
            setContent(updatedContent);
            setOriginalContent(JSON.parse(JSON.stringify(updatedContent))); // Обновляем оригинал
            setPendingUploads([]); // Очищаем список ожидающих загрузок
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

    const handleSlideChange = (index, field, value) => {
        const newSlides = [...content.slides];

        // Если меняем тип на 'file' или 'url', сбрасываем bgValue
        if (field === 'bgType') {
            if (value === 'file') {
                newSlides[index] = {
                    ...newSlides[index],
                    [field]: value,
                    bgValue: '' // Сбрасываем значение для файла
                };
            } else if (value === 'url') {
                newSlides[index] = {
                    ...newSlides[index],
                    [field]: value,
                    bgValue: '' // Сбрасываем значение для URL
                };
            } else {
                // При переключении на цвет, если был файл, он будет удален при сохранении
                newSlides[index] = {
                    ...newSlides[index],
                    [field]: value,
                    bgValue: 'linear-gradient(135deg, #6b85fa 0%, #521364 100%)' // Значение по умолчанию для цвета
                };
            }
        } else {
            newSlides[index] = { ...newSlides[index], [field]: value };
        }

        setContent({ ...content, slides: newSlides });
    };

    const handleFeatureChange = (index, field, value) => {
        const newFeatures = [...content.features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setContent({ ...content, features: newFeatures });
    };

    const handleGradientChange = (index, color1, color2, angle = 135) => {
        const gradient = `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;
        handleSlideChange(index, 'bgValue', gradient);
    };

    const parseGradient = (gradient) => {
        if (!gradient || !gradient.includes('linear-gradient')) {
            return {
                color1: '#6b85fa',
                color2: '#521364',
                angle: 135
            };
        }

        try {
            // Парсим градиент: linear-gradient(135deg, #6b85fa 0%, #521364 100%)
            const match = gradient.match(/linear-gradient\((\d+)deg,\s*([^,]+?)\s*0%,\s*([^,]+?)\s*100%\)/);
            if (match) {
                return {
                    angle: parseInt(match[1]) || 135,
                    color1: match[2].trim(),
                    color2: match[3].trim()
                };
            }
        } catch (e) {
            console.error('Error parsing gradient:', e);
        }

        return {
            color1: '#6b85fa',
            color2: '#521364',
            angle: 135
        };
    };

    const handleImageUpload = async (index, file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/hero/slides/${index}/image`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error('Ошибка загрузки');
            }

            const data = await response.json();

            // Добавляем в список ожидающих загрузок
            const fileName = data.slide.bgValue.split('/').pop();
            setPendingUploads(prev => [...prev, {
                index,
                filename: fileName,
                url: data.slide.bgValue
            }]);

            // Обновляем слайд с полученными данными
            const newSlides = [...content.slides];
            newSlides[index] = data.slide;
            setContent({ ...content, slides: newSlides });

            setSuccess('Изображение загружено (не сохранено)');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error uploading image:', err);
            setError('Ошибка загрузки изображения');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteImage = async (index) => {
        try {
            const token = localStorage.getItem('adminToken');

            // Если это временная загрузка (не сохраненная)
            const pendingUpload = pendingUploads.find(u => u.index === index);

            if (pendingUpload) {
                // Удаляем из списка ожидающих
                setPendingUploads(prev => prev.filter(u => u.index !== index));

                // Возвращаем оригинальное значение слайда
                const newSlides = [...content.slides];
                newSlides[index] = originalContent.slides[index];
                setContent({ ...content, slides: newSlides });

                setSuccess('Изображение удалено');
            } else {
                // Если это сохраненное изображение, удаляем через API
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/hero/slides/${index}/image`,
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

                // Обновляем слайд с полученными данными
                const newSlides = [...content.slides];
                newSlides[index] = data.slide;
                setContent({ ...content, slides: newSlides });

                setSuccess('Изображение удалено');
            }

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error deleting image:', err);
            setError('Ошибка удаления изображения');
            setTimeout(() => setError(''), 3000);
        }
    };

    // Функция для создания изображения-заглушки при ошибке
    const getFallbackImage = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');

        // Заливка фона
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Рамка
        ctx.strokeStyle = '#dee2e6';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

        // Иконка (простой крестик)
        ctx.beginPath();
        ctx.strokeStyle = '#adb5bd';
        ctx.lineWidth = 3;
        ctx.moveTo(150, 80);
        ctx.lineTo(250, 120);
        ctx.moveTo(250, 80);
        ctx.lineTo(150, 120);
        ctx.stroke();

        // Текст
        ctx.fillStyle = '#6c757d';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Изображение не загружено', canvas.width / 2, 150);

        return canvas.toDataURL();
    };

    if (loading) return <div className="editor-loading">Загрузка...</div>;
    if (!content) return <div className="editor-error">Ошибка загрузки</div>;

    return (
        <div className="hero-editor">
            <div className="editor-header">
                <h2>Редактирование главного баннера</h2>
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
                <div className="editor-section">
                    <h3>Основная информация</h3>

                    <div className="form-group">
                        <label>Заголовок</label>
                        <input
                            type="text"
                            value={content.title}
                            onChange={(e) => setContent({ ...content, title: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Подзаголовок</label>
                        <textarea
                            value={content.subtitle}
                            onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                            rows="3"
                        />
                    </div>
                </div>

                <div className="editor-section">
                    <h3>Преимущества</h3>
                    {content.features.map((feature, index) => (
                        <div key={index} className="feature-item">
                            <input
                                type="text"
                                value={feature.text}
                                onChange={(e) => handleFeatureChange(index, 'text', e.target.value)}
                            />
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={feature.active}
                                    onChange={(e) => handleFeatureChange(index, 'active', e.target.checked)}
                                />
                                Активно
                            </label>
                        </div>
                    ))}
                </div>

                <div className="editor-section">
                    <h3>Контактная информация</h3>

                    <div className="form-group">
                        <label>Режим работы (будни)</label>
                        <input
                            type="text"
                            value={content.workHours?.daily || ''}
                            onChange={(e) => setContent({
                                ...content,
                                workHours: { ...content.workHours, daily: e.target.value }
                            })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Режим работы (экстренный)</label>
                        <input
                            type="text"
                            value={content.workHours?.emergency || ''}
                            onChange={(e) => setContent({
                                ...content,
                                workHours: { ...content.workHours, emergency: e.target.value }
                            })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Телефон для экстренной связи</label>
                        <input
                            type="text"
                            value={content.emergencyPhone || ''}
                            onChange={(e) => setContent({ ...content, emergencyPhone: e.target.value })}
                        />
                    </div>
                </div>

                <div className="editor-section">
                    <h3>Слайды (максимум 3)</h3>
                    {content.slides.map((slide, index) => {
                        const gradient = parseGradient(slide.bgType === 'color' ? slide.bgValue : '');
                        const fallbackImage = getFallbackImage();
                        const isPendingUpload = pendingUploads.some(u => u.index === index);

                        return (
                            <div key={index} className="slide-editor">
                                <h4>
                                    Слайд {index + 1}
                                    {isPendingUpload && <span className="pending-badge">⏳ Не сохранено</span>}
                                </h4>

                                <div className="slide-controls">
                                    <button
                                        className={`type-btn ${slide.bgType === 'color' ? 'active' : ''}`}
                                        onClick={() => handleSlideChange(index, 'bgType', 'color')}
                                    >
                                        <FaPalette /> Цвет
                                    </button>
                                    <button
                                        className={`type-btn ${slide.bgType === 'url' ? 'active' : ''}`}
                                        onClick={() => handleSlideChange(index, 'bgType', 'url')}
                                    >
                                        <FaLink /> URL
                                    </button>
                                    <button
                                        className={`type-btn ${slide.bgType === 'file' ? 'active' : ''}`}
                                        onClick={() => handleSlideChange(index, 'bgType', 'file')}
                                    >
                                        <FaImage /> Файл
                                    </button>
                                </div>

                                {slide.bgType === 'color' && (
                                    <div className="gradient-editor">
                                        <div className="form-group">
                                            <label>Угол градиента (градусы)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="360"
                                                value={gradient.angle}
                                                onChange={(e) => handleGradientChange(
                                                    index,
                                                    gradient.color1,
                                                    gradient.color2,
                                                    parseInt(e.target.value) || 135
                                                )}
                                            />
                                        </div>

                                        <div className="color-pickers">
                                            <div className="color-picker-item">
                                                <label>Цвет 1</label>
                                                <input
                                                    type="color"
                                                    value={gradient.color1}
                                                    onChange={(e) => handleGradientChange(
                                                        index,
                                                        e.target.value,
                                                        gradient.color2,
                                                        gradient.angle
                                                    )}
                                                />
                                            </div>

                                            <div className="color-picker-item">
                                                <label>Цвет 2</label>
                                                <input
                                                    type="color"
                                                    value={gradient.color2}
                                                    onChange={(e) => handleGradientChange(
                                                        index,
                                                        gradient.color1,
                                                        e.target.value,
                                                        gradient.angle
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Предпросмотр градиента</label>
                                            <div
                                                className="gradient-preview"
                                                style={{
                                                    background: `linear-gradient(${gradient.angle}deg, ${gradient.color1} 0%, ${gradient.color2} 100%)`
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {slide.bgType === 'url' && (
                                    <div className="url-editor">
                                        <div className="form-group">
                                            <label>URL изображения</label>
                                            <input
                                                type="url"
                                                value={slide.bgValue || ''}
                                                onChange={(e) => handleSlideChange(index, 'bgValue', e.target.value)}
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>
                                        {slide.bgValue && (
                                            <div className="url-preview">
                                                <img
                                                    src={slide.bgValue}
                                                    alt={`Слайд ${index + 1}`}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = fallbackImage;
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {slide.bgType === 'file' && (
                                    <div className="file-upload">
                                        {slide.bgValue && (
                                            <div className="image-preview">
                                                <img
                                                    src={slide.bgValue}
                                                    alt={`Слайд ${index + 1}`}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = fallbackImage;
                                                    }}
                                                />
                                                <button
                                                    className="delete-image"
                                                    onClick={() => handleDeleteImage(index)}
                                                    type="button"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        )}

                                        <div className="file-input-wrapper">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files[0]) {
                                                        handleImageUpload(index, e.target.files[0]);
                                                    }
                                                }}
                                                id={`file-input-${index}`}
                                            />
                                            <label htmlFor={`file-input-${index}`} className="file-input-label">
                                                <FaImage /> {slide.bgValue ? 'Заменить изображение' : 'Выберите изображение'}
                                            </label>
                                        </div>
                                    </div>
                                )}

                                <label className="checkbox-label slide-active-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={slide.active !== false}
                                        onChange={(e) => handleSlideChange(index, 'active', e.target.checked)}
                                    />
                                    Слайд активен
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HeroEditor;