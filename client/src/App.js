import React, { useState } from 'react';
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

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('callback');

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
      <div className="App">
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