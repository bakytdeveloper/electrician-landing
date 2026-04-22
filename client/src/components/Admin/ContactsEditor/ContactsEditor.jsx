import React, { useState, useEffect } from 'react';
import './ContactsEditor.css';
import { FaSave, FaUndo, FaPlus, FaTrash, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const ContactsEditor = () => {
    const [config, setConfig] = useState(null);
    const [originalConfig, setOriginalConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contacts/config`);
            const data = await response.json();
            setConfig(data);
            setOriginalConfig(JSON.parse(JSON.stringify(data)));
        } catch (err) {
            console.error('Error fetching config:', err);
            setError('Ошибка загрузки конфигурации');
        } finally {
            setLoading(false);
        }
    };

    const hasChanges = () => {
        return JSON.stringify(config) !== JSON.stringify(originalConfig);
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contacts/config`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(config)
            });

            if (!response.ok) {
                throw new Error('Ошибка сохранения');
            }

            const updatedConfig = await response.json();
            setConfig(updatedConfig.data);
            setOriginalConfig(JSON.parse(JSON.stringify(updatedConfig.data)));
            setSuccess('Конфигурация успешно сохранена');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error saving:', err);
            setError('Ошибка при сохранении: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (originalConfig) {
            setConfig(JSON.parse(JSON.stringify(originalConfig)));
            setSuccess('Изменения отменены');
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    if (loading) return <div className="contacts-editor-loading">Загрузка...</div>;
    if (!config) return <div className="contacts-editor-error">Ошибка загрузки</div>;

    return (
        <div className="contacts-editor">
            <div className="editor-header">
                <h2>Редактирование контактов</h2>
                <div className="header-buttons">
                    {hasChanges() && (
                        <button className="cancel-btn" onClick={handleCancel} disabled={saving}>
                            <FaUndo /> Отменить
                        </button>
                    )}
                    <button className="save-btn" onClick={handleSave} disabled={saving || !hasChanges()}>
                        <FaSave /> {saving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </div>
            </div>

            {error && <div className="editor-error-message">{error}</div>}
            {success && <div className="editor-success-message">{success}</div>}

            {hasChanges() && (
                <div className="unsaved-changes-warning">
                    ⚠️ Есть несохраненные изменения
                </div>
            )}

            <div className="editor-tabs-header">
                <button className={`editor-tab-btn ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>
                    Основная информация
                </button>
                <button className={`editor-tab-btn ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => setActiveTab('contacts')}>
                    Контакты
                </button>
                <button className={`editor-tab-btn ${activeTab === 'address' ? 'active' : ''}`} onClick={() => setActiveTab('address')}>
                    Адрес и карта
                </button>
                <button className={`editor-tab-btn ${activeTab === 'hours' ? 'active' : ''}`} onClick={() => setActiveTab('hours')}>
                    Часы работы
                </button>
            </div>

            <div className="editor-tabs-content">
                {/* Основная информация */}
                {activeTab === 'general' && (
                    <div className="editor-section">
                        <h3>Информация о компании</h3>

                        <div className="form-group">
                            <label>Название компании</label>
                            <input
                                type="text"
                                value={config.companyName}
                                onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                                placeholder="Название компании"
                            />
                        </div>

                        <div className="form-group">
                            <label>Альтернативное название</label>
                            <input
                                type="text"
                                value={config.companyAlternateName}
                                onChange={(e) => setConfig({ ...config, companyAlternateName: e.target.value })}
                                placeholder="Альтернативное название"
                            />
                        </div>

                        <div className="form-group">
                            <label>Описание компании</label>
                            <textarea
                                value={config.companyDescription}
                                onChange={(e) => setConfig({ ...config, companyDescription: e.target.value })}
                                rows="4"
                                placeholder="Описание компании"
                            />
                        </div>
                    </div>
                )}

                {/* Контакты */}
                {activeTab === 'contacts' && (
                    <div className="editor-section">
                        <h3><FaPhone /> Контактная информация</h3>

                        <div className="form-group">
                            <label>Номер телефона (отображаемый)</label>
                            <input
                                type="text"
                                value={config.phoneDisplay}
                                onChange={(e) => setConfig({ ...config, phoneDisplay: e.target.value })}
                                placeholder="+7 (727) 123-45-67"
                            />
                        </div>

                        <div className="form-group">
                            <label>Номер телефона (для ссылок)</label>
                            <input
                                type="text"
                                value={config.phoneRaw}
                                onChange={(e) => setConfig({ ...config, phoneRaw: e.target.value })}
                                placeholder="+77271234567"
                            />
                            <small className="form-hint">Используется для tel: ссылок</small>
                        </div>

                        <div className="form-group">
                            <label>WhatsApp номер</label>
                            <input
                                type="text"
                                value={config.phoneForWhatsapp}
                                onChange={(e) => setConfig({ ...config, phoneForWhatsapp: e.target.value })}
                                placeholder="77071234567"
                            />
                            <small className="form-hint">Без +, только цифры</small>
                        </div>

                        <div className="form-group">
                            <label><FaEnvelope /> Email</label>
                            <input
                                type="email"
                                value={config.email}
                                onChange={(e) => setConfig({ ...config, email: e.target.value })}
                                placeholder="info@electromaster.kz"
                            />
                        </div>

                        <div className="form-group">
                            <label>Telegram username</label>
                            <input
                                type="text"
                                value={config.telegramUsername}
                                onChange={(e) => setConfig({ ...config, telegramUsername: e.target.value })}
                                placeholder="electromaster_almaty"
                            />
                        </div>

                        <div className="form-group">
                            <label>Instagram username</label>
                            <input
                                type="text"
                                value={config.instagramUsername}
                                onChange={(e) => setConfig({ ...config, instagramUsername: e.target.value })}
                                placeholder="electromaster_almaty"
                            />
                        </div>

                        <div className="form-group">
                            <label>Время ответа</label>
                            <input
                                type="text"
                                value={config.responseTime}
                                onChange={(e) => setConfig({ ...config, responseTime: e.target.value })}
                                placeholder="15 минут"
                            />
                        </div>
                    </div>
                )}

                {/* Адрес и карта */}
                {activeTab === 'address' && (
                    <div className="editor-section">
                        <h3><FaMapMarkerAlt /> Адрес</h3>

                        <div className="form-group">
                            <label>Улица, дом</label>
                            <input
                                type="text"
                                value={config.addressStreet}
                                onChange={(e) => setConfig({ ...config, addressStreet: e.target.value })}
                                placeholder="ул. Абая, 123"
                            />
                        </div>

                        <div className="form-group">
                            <label>Город</label>
                            <input
                                type="text"
                                value={config.addressCity}
                                onChange={(e) => setConfig({ ...config, addressCity: e.target.value })}
                                placeholder="Алматы"
                            />
                        </div>

                        <div className="form-group">
                            <label>Область/Регион</label>
                            <input
                                type="text"
                                value={config.addressRegion}
                                onChange={(e) => setConfig({ ...config, addressRegion: e.target.value })}
                                placeholder="Алматинская область"
                            />
                        </div>

                        <div className="form-group">
                            <label>Почтовый индекс</label>
                            <input
                                type="text"
                                value={config.addressPostalCode}
                                onChange={(e) => setConfig({ ...config, addressPostalCode: e.target.value })}
                                placeholder="050000"
                            />
                        </div>

                        <div className="form-group">
                            <label>Описание офиса</label>
                            <input
                                type="text"
                                value={config.officeDescription}
                                onChange={(e) => setConfig({ ...config, officeDescription: e.target.value })}
                                placeholder="БЦ Нурлы Тау, офис 123"
                            />
                        </div>

                        <h3 style={{ marginTop: '30px' }}>Яндекс Карта</h3>

                        <div className="form-group">
                            <label>URL Яндекс Карты (полная версия)</label>
                            <textarea
                                value={config.yandexMapUrl}
                                onChange={(e) => setConfig({ ...config, yandexMapUrl: e.target.value })}
                                rows="3"
                                placeholder="https://yandex.kz/maps/..."
                            />
                            <small className="form-hint">Ссылка на карту для перехода</small>
                        </div>

                        <div className="form-group">
                            <label>URL для встраивания (Embed)</label>
                            <textarea
                                value={config.yandexMapEmbedUrl}
                                onChange={(e) => setConfig({ ...config, yandexMapEmbedUrl: e.target.value })}
                                rows="3"
                                placeholder="https://yandex.kz/map-widget/v1/..."
                            />
                            <small className="form-hint">Ссылка для iframe</small>
                        </div>

                        <div className="form-group">
                            <label>Ссылка на 2GIS</label>
                            <input
                                type="text"
                                value={config.map2GisUrl}
                                onChange={(e) => setConfig({ ...config, map2GisUrl: e.target.value })}
                                placeholder="https://2gis.kz/almaty/..."
                            />
                        </div>

                        {/* Предпросмотр карты */}
                        {config.yandexMapEmbedUrl && (
                            <div className="map-preview">
                                <h4>Предпросмотр карты:</h4>
                                <iframe
                                    title="Яндекс Карта"
                                    src={config.yandexMapEmbedUrl}
                                    width="100%"
                                    height="300"
                                    style={{ border: 0, borderRadius: '8px' }}
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Часы работы */}
                {activeTab === 'hours' && (
                    <div className="editor-section">
                        <h3><FaClock /> График работы</h3>

                        <div className="form-group">
                            <label>Часы работы в будни</label>
                            <input
                                type="text"
                                value={config.weekdayHours}
                                onChange={(e) => setConfig({ ...config, weekdayHours: e.target.value })}
                                placeholder="08:00 - 20:00"
                            />
                            <small className="form-hint">Формат: 08:00 - 20:00</small>
                        </div>

                        <div className="form-group">
                            <label>Часы работы в выходные</label>
                            <input
                                type="text"
                                value={config.weekendHours}
                                onChange={(e) => setConfig({ ...config, weekendHours: e.target.value })}
                                placeholder="09:00 - 18:00"
                            />
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={config.emergencyAvailable}
                                    onChange={(e) => setConfig({ ...config, emergencyAvailable: e.target.checked })}
                                />
                                Доступен аварийный выезд
                            </label>
                        </div>

                        {config.emergencyAvailable && (
                            <div className="form-group">
                                <label>Текст аварийного выезда</label>
                                <input
                                    type="text"
                                    value={config.emergencyText}
                                    onChange={(e) => setConfig({ ...config, emergencyText: e.target.value })}
                                    placeholder="Аварийный выезд - круглосуточно"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactsEditor;