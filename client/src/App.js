import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Services from './components/Services/Services';
import Portfolio from './components/Portfolio/Portfolio';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import Modal from './components/common/Modal/Modal';
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton";
import SEO from "./components/SEO/SEO";
import SchemaMarkup from "./components/SEO/SchemaMarkup";

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('callback');
    const location = useLocation();

    // Функция для скролла наверх
    const scrollToTop = (behavior = 'smooth') => {
        window.scrollTo({
            top: 0,
            behavior: behavior
        });
    };

    // Скролл наверх при изменении маршрута
    useEffect(() => {
        // Небольшая задержка для корректного скролла после рендера
        const timer = setTimeout(() => {
            scrollToTop('smooth');
        }, 100);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    // Скролл наверх при загрузке/перезагрузке страницы
    useEffect(() => {
        // Проверяем тип навигации
        const navigationEntries = performance.getEntriesByType('navigation');
        const isReload = navigationEntries.length > 0 &&
            navigationEntries[0].type === 'reload';

        if (isReload || document.referrer.includes('/admin')) {
            // Если страница перезагружена или пришли с админки
            scrollToTop('auto'); // Мгновенный скролл для перезагрузки
        } else {
            // Обычный переход на страницу
            scrollToTop('smooth');
        }
    }, []);

    const openModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Определяем текущую страницу для SEO
    const getCurrentPage = () => {
        const hash = location.hash;
        if (hash === '#services') return 'services';
        if (hash === '#contact') return 'contact';
        if (hash === '#portfolio') return 'portfolio';
        if (hash === '#about') return 'about';
        return 'home';
    };


    return (
        <div className="App">
            <SEO page={getCurrentPage()} />
            <SchemaMarkup />
            <Header openModal={openModal} />
            <Hero openModal={openModal} />
            <Services />
            <Portfolio />
            <About />
            <Contact openModal={openModal} />
            <Footer />

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                type={modalType}
            />
            <ConditionalWhatsAppButton />
        </div>
    );
}

// Компонент для условного отображения WhatsAppButton
const ConditionalWhatsAppButton = () => {
    const location = useLocation();

    // Не показываем на админских и клиентских страницах
    if (location.pathname.startsWith('/admin') ||
        location.pathname.startsWith('/auth')) {
        return null;
    }

    return <WhatsAppButton />;
};

export default App;