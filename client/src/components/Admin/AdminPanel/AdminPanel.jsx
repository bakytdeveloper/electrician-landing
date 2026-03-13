import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import HeroEditor from '../HeroEditor/HeroEditor';
import ServicesEditor from '../ServicesEditor/ServicesEditor';
import { FaSignOutAlt, FaCog } from 'react-icons/fa';

const AdminPanel = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState('hero');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Проверка токена при загрузке
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/verify`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Не авторизован');
                }
            } catch (err) {
                onLogout();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [onLogout]);

    if (loading) {
        return <div className="admin-loading">Загрузка...</div>;
    }

    return (
        <div className="admin-panel">
            <div className="admin-sidebar">
                <div className="admin-logo">
                    <FaCog />
                    <span>Админ панель</span>
                </div>

                <nav className="admin-nav">
                    <button
                        className={activeTab === 'hero' ? 'active' : ''}
                        onClick={() => setActiveTab('hero')}
                    >
                        Главный баннер
                    </button>
                    <button
                        className={activeTab === 'services' ? 'active' : ''}
                        onClick={() => setActiveTab('services')}
                    >
                        Услуги
                    </button>
                    <button
                        className={activeTab === 'about' ? 'active' : ''}
                        onClick={() => setActiveTab('about')}
                    >
                        О компании
                    </button>
                </nav>

                <button className="logout-btn" onClick={onLogout}>
                    <FaSignOutAlt />
                    Выйти
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'hero' && <HeroEditor />}
                {activeTab === 'services' && <ServicesEditor />}
                {/* Другие редакторы будут добавлены позже */}
            </div>
        </div>
    );
};

export default AdminPanel;