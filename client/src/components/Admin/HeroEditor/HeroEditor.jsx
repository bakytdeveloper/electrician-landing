import React, { useState, useEffect } from 'react';
import './HeroEditor.css';
import { FaPlus, FaTrash, FaImage, FaLink, FaPalette } from 'react-icons/fa';

const HeroEditor = () => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/hero/content`);
            const data = await response.json();
            setContent(data);
        } catch (err) {
            setError('Ошибка загрузки контента');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/hero/content`, {
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

            setSuccess('Изменения сохранены');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Ошибка при сохранении');
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
            handleSlideChange(index, 'bgValue', data.slide.bgValue);
            handleSlideChange(index, 'bgType', 'file');
            setSuccess('Изображение загружено');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Ошибка загрузки изображения');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteImage = async (index) => {
        try {
            const token = localStorage.getItem('adminToken');
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
            handleSlideChange(index, 'bgValue', data.slide.bgValue);
            handleSlideChange(index, 'bgType', 'color');
            setSuccess('Изображение удалено');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Ошибка удаления изображения');
            setTimeout(() => setError(''), 3000);
        }
    };

    if (loading) return <div className="editor-loading">Загрузка...</div>;
    if (!content) return <div className="editor-error">Ошибка загрузки</div>;

    return (
        <div className="hero-editor">
            <div className="editor-header">
                <h2>Редактирование главного баннера</h2>
                <button
                    className="save-btn"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
            </div>

            {error && <div className="editor-error-message">{error}</div>}
            {success && <div className="editor-success-message">{success}</div>}

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

                        return (
                            <div key={index} className="slide-editor">
                                <h4>Слайд {index + 1}</h4>

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
                                                        e.target.src = 'https://via.placeholder.com/400x200?text=Ошибка+загрузки+изображения';
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
                                                    src={slide.bgValue.startsWith('http') ? slide.bgValue : `${process.env.REACT_APP_API_URL}${slide.bgValue}`}
                                                    alt={`Слайд ${index + 1}`}
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
                                                <FaImage /> Выберите изображение
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