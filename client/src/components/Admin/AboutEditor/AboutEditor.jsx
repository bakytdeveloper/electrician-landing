import React, { useState, useEffect } from 'react';
import './AboutEditor.css';
import {
    FaPlus, FaTrash, FaEdit, FaTimes, FaArrowDown,
    FaUser, FaAward, FaCertificate, FaTools, FaShieldAlt,
    FaClock, FaCheckCircle, FaGraduationCap, FaBriefcase,
    FaStar, FaQuoteLeft, FaPhone, FaSave
} from 'react-icons/fa';
import {
    MdElectricalServices, MdEngineering, MdSupportAgent
} from 'react-icons/md';

const AboutEditor = () => {
    const [content, setContent] = useState(null);
    const [originalContent, setOriginalContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('general');

    // Маппинг иконок
    const iconMap = {
        FaUser: FaUser,
        FaAward: FaAward,
        FaCertificate: FaCertificate,
        FaTools: FaTools,
        FaShieldAlt: FaShieldAlt,
        FaClock: FaClock,
        FaCheckCircle: FaCheckCircle,
        FaGraduationCap: FaGraduationCap,
        FaBriefcase: FaBriefcase,
        FaStar: FaStar,
        FaQuoteLeft: FaQuoteLeft,
        MdElectricalServices: MdElectricalServices,
        MdEngineering: MdEngineering,
        MdSupportAgent: MdSupportAgent
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/about/content`);
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
                ...content
            };

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/about/content`, {
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

    // Управление статистикой
    const handleStatChange = (index, field, value) => {
        const newStats = [...content.stats];
        newStats[index] = { ...newStats[index], [field]: value };
        setContent({ ...content, stats: newStats });
    };

    const handleAddStat = () => {
        const newStat = {
            label: '',
            value: 0,
            suffix: '+',
            icon: 'FaUser',
            order: content.stats.length + 1
        };
        setContent({ ...content, stats: [...content.stats, newStat] });
    };

    const handleDeleteStat = (index) => {
        const newStats = content.stats.filter((_, i) => i !== index);
        setContent({ ...content, stats: newStats });
    };

    // Управление услугами
    const handleServiceChange = (index, field, value) => {
        const newServices = [...content.services];
        newServices[index] = { ...newServices[index], [field]: value };
        setContent({ ...content, services: newServices });
    };

    const handleAddService = () => {
        const newService = {
            text: '',
            active: true,
            order: content.services.length + 1
        };
        setContent({ ...content, services: [...content.services, newService] });
    };

    const handleDeleteService = (index) => {
        const newServices = content.services.filter((_, i) => i !== index);
        setContent({ ...content, services: newServices });
    };

    // Управление таймлайном
    const handleTimelineChange = (index, field, value) => {
        const newTimeline = [...content.timeline];
        newTimeline[index] = { ...newTimeline[index], [field]: value };
        setContent({ ...content, timeline: newTimeline });
    };

    const handleAddTimeline = () => {
        const newItem = {
            year: new Date().getFullYear().toString(),
            title: '',
            description: '',
            icon: 'FaGraduationCap',
            order: content.timeline.length + 1
        };
        setContent({ ...content, timeline: [...content.timeline, newItem] });
    };

    const handleDeleteTimeline = (index) => {
        const newTimeline = content.timeline.filter((_, i) => i !== index);
        setContent({ ...content, timeline: newTimeline });
    };

    // Управление отзывами
    const handleTestimonialChange = (index, field, value) => {
        const newTestimonials = [...content.testimonials];
        newTestimonials[index] = { ...newTestimonials[index], [field]: value };
        setContent({ ...content, testimonials: newTestimonials });
    };

    const handleAddTestimonial = () => {
        const newTestimonial = {
            name: '',
            role: '',
            text: '',
            rating: 5,
            date: new Date().toLocaleDateString('ru-RU'),
            project: '',
            active: true,
            order: content.testimonials.length + 1
        };
        setContent({ ...content, testimonials: [...content.testimonials, newTestimonial] });
    };

    const handleDeleteTestimonial = (index) => {
        const newTestimonials = content.testimonials.filter((_, i) => i !== index);
        setContent({ ...content, testimonials: newTestimonials });
    };

    if (loading) return <div className="editor-loading">Загрузка...</div>;
    if (!content) return <div className="editor-error">Ошибка загрузки</div>;

    return (
        <div className="about-editor">
            <div className="editor-header">
                <h2>Редактирование раздела "О нас"</h2>
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

            {/* Вкладки */}
            <div className="editor-tabs-header">
                <button
                    className={`editor-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
                    onClick={() => setActiveTab('general')}
                >
                    Основная информация
                </button>
                <button
                    className={`editor-tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stats')}
                >
                    Статистика
                </button>
                <button
                    className={`editor-tab-btn ${activeTab === 'services' ? 'active' : ''}`}
                    onClick={() => setActiveTab('services')}
                >
                    Услуги
                </button>
                <button
                    className={`editor-tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
                    onClick={() => setActiveTab('timeline')}
                >
                    Опыт работы
                </button>
                <button
                    className={`editor-tab-btn ${activeTab === 'testimonials' ? 'active' : ''}`}
                    onClick={() => setActiveTab('testimonials')}
                >
                    Отзывы
                </button>
            </div>

            <div className="editor-tabs-content">
                {/* Основная информация */}
                {activeTab === 'general' && (
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

                        <h3 style={{ marginTop: '30px' }}>Приветствие</h3>

                        <div className="form-group">
                            <label>Заголовок приветствия</label>
                            <input
                                type="text"
                                value={content.greetingTitle}
                                onChange={(e) => setContent({ ...content, greetingTitle: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Подпись под заголовком</label>
                            <input
                                type="text"
                                value={content.greetingTagline}
                                onChange={(e) => setContent({ ...content, greetingTagline: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Имя специалиста</label>
                            <input
                                type="text"
                                value={content.specialistName}
                                onChange={(e) => setContent({ ...content, specialistName: e.target.value })}
                            />
                            <small className="form-hint">Будет использоваться в тексте</small>
                        </div>

                        <div className="form-group">
                            <label>Первый абзац</label>
                            <textarea
                                value={content.greetingText1}
                                onChange={(e) => setContent({ ...content, greetingText1: e.target.value })}
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label>Второй абзац</label>
                            <textarea
                                value={content.greetingText2}
                                onChange={(e) => setContent({ ...content, greetingText2: e.target.value })}
                                rows="3"
                            />
                        </div>
                    </div>
                )}

                {/* Статистика */}
                {activeTab === 'stats' && (
                    <div className="editor-section">
                        <div className="section-header">
                            <h3>Статистика</h3>
                            <button className="add-btn" onClick={handleAddStat}>
                                <FaPlus /> Добавить показатель
                            </button>
                        </div>

                        <div className="stats-list">
                            {content.stats.map((stat, index) => (
                                <div key={index} className="stat-item">
                                    <div className="stat-fields">
                                        <input
                                            type="text"
                                            value={stat.label}
                                            onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                                            placeholder="Название"
                                        />
                                        <input
                                            type="number"
                                            value={stat.value}
                                            onChange={(e) => handleStatChange(index, 'value', parseInt(e.target.value))}
                                            placeholder="Значение"
                                            style={{ width: '100px' }}
                                        />
                                        <input
                                            type="text"
                                            value={stat.suffix}
                                            onChange={(e) => handleStatChange(index, 'suffix', e.target.value)}
                                            placeholder="Суффикс"
                                            style={{ width: '60px' }}
                                        />
                                        <select
                                            value={stat.icon}
                                            onChange={(e) => handleStatChange(index, 'icon', e.target.value)}
                                            style={{ width: '150px' }}
                                        >
                                            <option value="MdElectricalServices">Электрика</option>
                                            <option value="FaUser">Пользователь</option>
                                            <option value="FaBriefcase">Портфель</option>
                                            <option value="FaShieldAlt">Щит</option>
                                            <option value="FaAward">Награда</option>
                                            <option value="FaClock">Часы</option>
                                        </select>
                                    </div>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteStat(index)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Услуги */}
                {activeTab === 'services' && (
                    <div className="editor-section">
                        <div className="section-header">
                            <h3>Услуги</h3>
                            <button className="add-btn" onClick={handleAddService}>
                                <FaPlus /> Добавить услугу
                            </button>
                        </div>

                        <div className="services-list">
                            {content.services.map((service, index) => (
                                <div key={index} className="service-item">
                                    <div className="service-fields">
                                        <input
                                            type="text"
                                            value={service.text}
                                            onChange={(e) => handleServiceChange(index, 'text', e.target.value)}
                                            placeholder="Название услуги"
                                        />
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={service.active}
                                                onChange={(e) => handleServiceChange(index, 'active', e.target.checked)}
                                            />
                                            Активно
                                        </label>
                                    </div>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteService(index)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Таймлайн (Опыт работы) */}
                {activeTab === 'timeline' && (
                    <div className="editor-section">
                        <div className="section-header">
                            <h3>Опыт работы</h3>
                            <button className="add-btn" onClick={handleAddTimeline}>
                                <FaPlus /> Добавить событие
                            </button>
                        </div>

                        <div className="timeline-list">
                            {content.timeline.map((item, index) => (
                                <div key={index} className="timeline-item">
                                    <div className="timeline-fields">
                                        <input
                                            type="text"
                                            value={item.year}
                                            onChange={(e) => handleTimelineChange(index, 'year', e.target.value)}
                                            placeholder="Год"
                                            style={{ width: '80px' }}
                                        />
                                        <input
                                            type="text"
                                            value={item.title}
                                            onChange={(e) => handleTimelineChange(index, 'title', e.target.value)}
                                            placeholder="Название"
                                        />
                                        <textarea
                                            value={item.description}
                                            onChange={(e) => handleTimelineChange(index, 'description', e.target.value)}
                                            placeholder="Описание"
                                            rows="2"
                                        />
                                        <select
                                            value={item.icon}
                                            onChange={(e) => handleTimelineChange(index, 'icon', e.target.value)}
                                        >
                                            <option value="FaGraduationCap">Образование</option>
                                            <option value="FaBriefcase">Работа</option>
                                            <option value="MdEngineering">Инженерия</option>
                                            <option value="MdElectricalServices">Электрика</option>
                                            <option value="FaStar">Достижение</option>
                                        </select>
                                    </div>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteTimeline(index)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Отзывы */}
                {activeTab === 'testimonials' && (
                    <div className="editor-section">
                        <div className="section-header">
                            <h3>Отзывы</h3>
                            <button className="add-btn" onClick={handleAddTestimonial}>
                                <FaPlus /> Добавить отзыв
                            </button>
                        </div>

                        <div className="testimonials-list">
                            {content.testimonials.map((testimonial, index) => (
                                <div key={index} className="testimonial-item">
                                    <div className="testimonial-fields">
                                        <div className="testimonial-row">
                                            <input
                                                type="text"
                                                value={testimonial.name}
                                                onChange={(e) => handleTestimonialChange(index, 'name', e.target.value)}
                                                placeholder="Имя"
                                            />
                                            <input
                                                type="text"
                                                value={testimonial.role}
                                                onChange={(e) => handleTestimonialChange(index, 'role', e.target.value)}
                                                placeholder="Роль"
                                            />
                                        </div>
                                        <div className="testimonial-row">
                                            <input
                                                type="text"
                                                value={testimonial.project}
                                                onChange={(e) => handleTestimonialChange(index, 'project', e.target.value)}
                                                placeholder="Проект"
                                            />
                                            <input
                                                type="text"
                                                value={testimonial.date}
                                                onChange={(e) => handleTestimonialChange(index, 'date', e.target.value)}
                                                placeholder="Дата"
                                                style={{ width: '120px' }}
                                            />
                                        </div>
                                        <div className="testimonial-row">
                                            <select
                                                value={testimonial.rating}
                                                onChange={(e) => handleTestimonialChange(index, 'rating', parseInt(e.target.value))}
                                                style={{ width: '80px' }}
                                            >
                                                {[1,2,3,4,5].map(r => (
                                                    <option key={r} value={r}>{r} звезд</option>
                                                ))}
                                            </select>
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={testimonial.active}
                                                    onChange={(e) => handleTestimonialChange(index, 'active', e.target.checked)}
                                                />
                                                Активно
                                            </label>
                                        </div>
                                        <textarea
                                            value={testimonial.text}
                                            onChange={(e) => handleTestimonialChange(index, 'text', e.target.value)}
                                            placeholder="Текст отзыва"
                                            rows="3"
                                        />
                                    </div>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteTestimonial(index)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AboutEditor;