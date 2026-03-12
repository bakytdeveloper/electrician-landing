import React, { useState, useEffect, useRef } from 'react';
import {
    FaUser,
    FaAward,
    FaCertificate,
    FaTools,
    FaShieldAlt,
    FaClock,
    FaCheckCircle,
    FaGraduationCap,
    FaBriefcase,
    FaStar,
    FaQuoteLeft,
    FaQuoteRight,
    FaChevronLeft,
    FaChevronRight,
    FaPhone
} from 'react-icons/fa';
import { MdElectricalServices, MdEngineering, MdSupportAgent } from 'react-icons/md';
import './About.css';

const About = () => {
    const [activeTab, setActiveTab] = useState('services');
    const [activeCert, setActiveCert] = useState(0);
    const [stats, setStats] = useState({
        projects: 0,
        clients: 0,
        years: 0,
        warranty: 0
    });
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const testimonialsRef = useRef(null);

    useEffect(() => {
        const targetStats = {
            projects: 250,
            clients: 180,
            years: 12,
            warranty: 36
        };

        const duration = 2000;
        const steps = 60;
        const increment = targetStats.projects / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            setStats({
                projects: Math.min(Math.floor(increment * currentStep), targetStats.projects),
                clients: Math.min(Math.floor((targetStats.clients / steps) * currentStep), targetStats.clients),
                years: Math.min(Math.floor((targetStats.years / steps) * currentStep), targetStats.years),
                warranty: Math.min(Math.floor((targetStats.warranty / steps) * currentStep), targetStats.warranty)
            });

            if (currentStep >= steps) {
                clearInterval(timer);
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, []);

    const timeline = [
        {
            year: '2012',
            title: 'Начало карьеры',
            description: 'Окончил профессиональное училище по специальности "Электромонтажник"',
            icon: <FaGraduationCap />
        },
        {
            year: '2014',
            title: 'Первая компания',
            description: 'Работа в строительной компании электромонтажником',
            icon: <FaBriefcase />
        },
        {
            year: '2017',
            title: 'Собственное дело',
            description: 'Открытие индивидуального предпринимательства',
            icon: <MdEngineering />
        },
        {
            year: '2020',
            title: 'Расширение услуг',
            description: 'Добавление услуг по ремонту бытовой техники',
            icon: <MdElectricalServices />
        },
        {
            year: '2023',
            title: 'Современные технологии',
            description: 'Обучение работе с системами умного дома',
            icon: <FaStar />
        }
    ];


    const testimonials = [
        {
            name: 'Анна Петрова',
            role: 'Владелец квартиры',
            text: 'Заменяли проводку в хрущевке. Работа выполнена быстро, аккуратно, все спрятали в штробы. Прошло уже 2 года - никаких проблем.',
            rating: 5,
            date: '15.03.2023',
            project: 'Замена проводки в 3-комнатной квартире'
        },
        {
            name: 'Игорь Семенов',
            role: 'Директор офиса',
            text: 'Делали электрику в новом офисе. Учли все пожелания по розеткам и освещению. Работали даже в выходные, чтобы успеть к открытию.',
            rating: 5,
            date: '22.11.2022',
            project: 'Электромонтаж в офисе 120 м²'
        },
        {
            name: 'Мария Козлова',
            role: 'Владелец коттеджа',
            text: 'Полный монтаж электрики в доме 150 м². Сделали все от щитка до розеток. Отдельное спасибо за уличное освещение - очень красиво.',
            rating: 4,
            date: '08.06.2023',
            project: 'Электрика в частном доме'
        },
        {
            name: 'Сергей Иванов',
            role: 'Владелец магазина',
            text: 'Установили освещение витрин и систему резервного питания. Всё работает идеально, даже при отключениях электричества.',
            rating: 5,
            date: '30.01.2023',
            project: 'Освещение торгового зала'
        },
        {
            name: 'Ольга Смирнова',
            role: 'Владелец ресторана',
            text: 'Проектирование и монтаж декоративного освещения. Создали уникальную атмосферу. Клиенты отмечают уютную обстановку.',
            rating: 4,
            date: '14.09.2022',
            project: 'Освещение в ресторане'
        },
        {
            name: 'Дмитрий Волков',
            role: 'Директор производства',
            text: 'Монтаж промышленной электропроводки в цеху. Учтены все требования безопасности. Работа выполнена в срок.',
            rating: 5,
            date: '05.04.2023',
            project: 'Промышленная электропроводка'
        }
    ];

    const servicesList = [
        'Монтаж и замена электропроводки',
        'Установка и сборка электрощитов',
        'Монтаж розеток, выключателей, светильников',
        'Установка систем защиты (УЗО, стабилизаторы)',
        'Ремонт бытовой техники',
        'Обслуживание электрооборудования',
        'Проектирование электроснабжения',
        'Аварийные работы 24/7'
    ];

    const scrollTestimonials = (direction) => {
        if (testimonialsRef.current) {
            const scrollAmount = 400;
            const currentScroll = testimonialsRef.current.scrollLeft;
            const newScroll = direction === 'left'
                ? currentScroll - scrollAmount
                : currentScroll + scrollAmount;

            testimonialsRef.current.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
        }
    };

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            scrollTestimonials('right');
        }

        if (isRightSwipe) {
            scrollTestimonials('left');
        }

        setTouchStart(null);
        setTouchEnd(null);
    };

    return (
        <section id="about" className="about-section">
            <div className="about-container">
                {/* Заголовок секции */}
                <div className="about-section-header">
                    <h2 className="about-section-title">О нас</h2>
                    <p className="about-section-subtitle">
                        Профессиональный электрик с 12-летним опытом работы. Гарантирую качество, надежность и безопасность всех работ.
                    </p>
                </div>

                {/* Основная информация - теперь всё в одну колонку */}
                <div className="about-content">
                    {/* Приветствие */}
                    <div className="about-greeting-card">
                        <div className="about-greeting-header">
                            <div className="about-avatar">
                                <FaUser />
                            </div>
                            <div className="about-greeting-text">
                                <h3>Привет, я Антон - ваш электрик</h3>
                                <p className="about-tagline">Профессионал с многолетним опытом</p>
                            </div>
                        </div>

                        <div className="about-greeting-body">
                            <p>
                                Я занимаюсь электромонтажными работами уже более {stats.years} лет.
                                За это время я выполнил более {stats.projects} проектов различной сложности -
                                от замены розетки до полного монтажа электрики в коттеджах и офисах.
                            </p>
                            <p>
                                Моя философия проста: качественная работа, надежные материалы и индивидуальный
                                подход к каждому клиенту. Я гарантирую безопасность всех выполненных работ
                                и предоставляю официальную гарантию до {stats.warranty} месяцев.
                            </p>
                        </div>
                    </div>

                    {/* Статистика */}
                    <div className="about-stats-grid">
                        <div className="about-stat-card">
                            <div className="about-stat-icon">
                                <MdElectricalServices />
                            </div>
                            <div className="about-stat-content">
                                <div className="about-stat-number">{stats.projects}+</div>
                                <div className="about-stat-label">Выполненных проектов</div>
                            </div>
                        </div>

                        <div className="about-stat-card">
                            <div className="about-stat-icon">
                                <FaUser />
                            </div>
                            <div className="about-stat-content">
                                <div className="about-stat-number">{stats.clients}+</div>
                                <div className="about-stat-label">Довольных клиентов</div>
                            </div>
                        </div>

                        <div className="about-stat-card">
                            <div className="about-stat-icon">
                                <FaBriefcase />
                            </div>
                            <div className="about-stat-content">
                                <div className="about-stat-number">{stats.years}</div>
                                <div className="about-stat-label">Лет опыта</div>
                            </div>
                        </div>

                        <div className="about-stat-card">
                            <div className="about-stat-icon">
                                <FaShieldAlt />
                            </div>
                            <div className="about-stat-content">
                                <div className="about-stat-number">{stats.warranty}</div>
                                <div className="about-stat-label">Месяцев гарантии</div>
                            </div>
                        </div>
                    </div>

                    {/* Вкладки */}
                    <div className="about-tabs-section">
                        <div className="about-tabs-header">
                            <button
                                className={`about-tab-button ${activeTab === 'services' ? 'about-active' : ''}`}
                                onClick={() => setActiveTab('services')}
                            >
                                Услуги
                            </button>
                            <button
                                className={`about-tab-button ${activeTab === 'experience' ? 'about-active' : ''}`}
                                onClick={() => setActiveTab('experience')}
                            >
                                Опыт работы
                            </button>
                        </div>

                        <div className="about-tabs-content">
                            {activeTab === 'experience' && (
                                <div className="about-timeline">
                                    {timeline.map((item, index) => (
                                        <div key={index} className="about-timeline-item">
                                            <div className="about-timeline-year">{item.year}</div>
                                            <div className="about-timeline-content">
                                                <div className="about-timeline-icon">
                                                    {item.icon}
                                                </div>
                                                <div className="about-timeline-text">
                                                    <h4>{item.title}</h4>
                                                    <p>{item.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'services' && (
                                <div className="about-services-list">
                                    <h4>Полный перечень услуг</h4>
                                    <ul className="about-services-ul">
                                        {servicesList.map((service, index) => (
                                            <li key={index} className="about-service-item">
                                                <FaCheckCircle className="about-check-icon" />
                                                <span>{service}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Отзывы - горизонтальный скролл */}
                    <div className="about-testimonials-section">
                        <div className="about-testimonials-header">
                            <h3>Отзывы клиентов</h3>
                            <div className="about-testimonials-controls">
                                <button
                                    className="about-scroll-button about-scroll-left"
                                    onClick={() => scrollTestimonials('left')}
                                    aria-label="Предыдущие отзывы"
                                >
                                    <FaChevronLeft />
                                </button>
                                <button
                                    className="about-scroll-button about-scroll-right"
                                    onClick={() => scrollTestimonials('right')}
                                    aria-label="Следующие отзывы"
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        </div>

                        <div
                            className="about-testimonials-container"
                            ref={testimonialsRef}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <div className="about-testimonials-track">
                                {testimonials.map((testimonial, index) => (
                                    <div key={index} className="about-testimonial-card">
                                        <div className="about-testimonial-header">
                                            <div className="about-client-info">
                                                <div className="about-client-avatar">
                                                    {testimonial.name.charAt(0)}
                                                </div>
                                                <div className="about-client-details">
                                                    <h4>{testimonial.name}</h4>
                                                    <p className="about-client-role">{testimonial.role}</p>
                                                    <p className="about-client-project">{testimonial.project}</p>
                                                </div>
                                            </div>
                                            <div className="about-testimonial-rating">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        className={`about-star ${i < testimonial.rating ? 'about-filled' : ''}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="about-testimonial-body">
                                            <FaQuoteLeft className="about-quote-left" />
                                            <p className="about-testimonial-text">{testimonial.text}</p>
                                            <FaQuoteRight className="about-quote-right" />
                                        </div>

                                        <div className="about-testimonial-footer">
                                            <span className="about-testimonial-date">{testimonial.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* CTA секция */}
                    <div className="about-cta-section">
                        <div className="about-cta-content">
                            <div className="about-cta-text">
                                <h3>Готовы начать проект?</h3>
                                <p>Свяжитесь со мной для бесплатной консультации и расчета стоимости работ</p>
                            </div>
                            <div className="about-cta-buttons">
                                <button
                                    className="about-cta-btn about-primary"
                                    onClick={() => document.querySelector('.contact-section')?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    Получить консультацию
                                </button>
                                <a href="tel:+79991234567" className="about-cta-btn about-secondary">
                                    <FaPhone />
                                    Позвонить сейчас
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;