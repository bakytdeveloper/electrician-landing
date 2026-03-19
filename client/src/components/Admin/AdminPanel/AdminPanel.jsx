import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import HeroEditor from '../HeroEditor/HeroEditor';
import ServicesEditor from '../ServicesEditor/ServicesEditor';
import PortfolioEditor from '../PortfolioEditor/PortfolioEditor';
import AboutEditor from '../AboutEditor/AboutEditor';

import { FaSignOutAlt, FaCog, FaHome } from 'react-icons/fa';
import PriceEditor from "../PriceEditor/PriceEditor";

const AdminPanel = ({ onLogout, onClose }) => {
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
                        className={activeTab === 'portfolio' ? 'active' : ''}
                        onClick={() => setActiveTab('portfolio')}
                    >
                        Портфолио
                    </button>
                    <button
                        className={activeTab === 'about' ? 'active' : ''}
                        onClick={() => setActiveTab('about')}
                    >
                        О нас
                    </button>

                    <button
                        className={activeTab === 'price' ? 'active' : ''}
                        onClick={() => setActiveTab('price')}
                    >
                        Прайс-лист
                    </button>

                </nav>

                <div className="admin-sidebar-buttons">
                    <button className="site-btn" onClick={onClose}>
                        <FaHome />
                        На сайт
                    </button>
                    <button className="logout-btn" onClick={onLogout}>
                        <FaSignOutAlt />
                        Выйти
                    </button>
                </div>
            </div>

            <div className="admin-content">
                {activeTab === 'hero' && <HeroEditor />}
                {activeTab === 'services' && <ServicesEditor />}
                {activeTab === 'portfolio' && <PortfolioEditor />}
                {activeTab === 'about' && <AboutEditor />}
                {activeTab === 'price' && <PriceEditor />}
                {/* Другие редакторы будут добавлены позже */}
            </div>
        </div>
    );
};

export default AdminPanel;