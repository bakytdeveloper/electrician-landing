import React, { useState, useEffect } from 'react';
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
    FaQuoteRight
} from 'react-icons/fa';
import { MdElectricalServices, MdEngineering, MdSupportAgent } from 'react-icons/md';
import './About.css';

const About = () => {
    const [activeTab, setActiveTab] = useState('experience');
    const [activeCert, setActiveCert] = useState(0);
    const [stats, setStats] = useState({
        projects: 0,
        clients: 0,
        years: 0,
        warranty: 0
    });

    useEffect(() => {
        const targetStats = {
            projects: 250,
            clients: 180,
            years: 12,
            warranty: 36
        };

        const duration = 2000; // 2 секунды
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

    const certificates = [
        {
            id: 1,
            title: 'Электромонтажник 4 разряда',
            issuer: 'Государственный образовательный центр',
            year: '2012',
            number: 'E-04567'
        },
        {
            id: 2,
            title: 'Специалист по обслуживанию электроустановок',
            issuer: 'Профессиональная ассоциация электриков',
            year: '2015',
            number: 'PAE-78901'
        },
        {
            id: 3,
            title: 'Безопасность работ на высоте',
            issuer: 'Центр охраны труда',
            year: '2018',
            number: 'BOT-23456'
        },
        {
            id: 4,
            title: 'Системы умного дома KNX',
            issuer: 'Международная ассоциация KNX',
            year: '2022',
            number: 'KNX-12345'
        }
    ];

    const principles = [
        {
            icon: <FaShieldAlt />,
            title: 'Безопасность',
            description: 'Строгое соблюдение всех норм и правил электробезопасности'
        },
        {
            icon: <FaTools />,
            title: 'Качество',
            description: 'Использование только качественных материалов и оборудования'
        },
        {
            icon: <FaClock />,
            title: 'Пунктуальность',
            description: 'Строгое соблюдение сроков и договоренностей'
        },
        {
            icon: <MdSupportAgent />,
            title: 'Поддержка',
            description: 'Консультации и помощь даже после завершения работ'
        }
    ];

    const testimonials = [
        {
            name: 'Анна Петрова',
            role: 'Владелец квартиры',
            text: 'Заменяли проводку в хрущевке. Работа выполнена быстро, аккуратно, все спрятали в штробы. Прошло уже 2 года - никаких проблем.',
            rating: 5,
            date: '15.03.2023'
        },
        {
            name: 'Игорь Семенов',
            role: 'Директор офиса',
            text: 'Делали электрику в новом офисе. Учли все пожелания по розеткам и освещению. Работали даже в выходные, чтобы успеть к открытию.',
            rating: 5,
            date: '22.11.2022'
        },
        {
            name: 'Мария Козлова',
            role: 'Владелец коттеджа',
            text: 'Полный монтаж электрики в доме 150 м². Сделали все от щитка до розеток. Отдельное спасибо за уличное освещение - очень красиво.',
            rating: 5,
            date: '08.06.2023'
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

    return (
        <section id="about" className="about">
            <div className="container">
                {/* Заголовок секции */}
                <div className="section-header">
                    <h2 className="section-title">О нас</h2>
                    <p className="section-subtitle">
                        Профессиональный электрик с 12-летним опытом работы. Гарантирую качество, надежность и безопасность всех работ.
                    </p>
                </div>

                <div className="about-content">
                    {/* Основная информация */}
                    <div className="about-main">
                        {/* Приветствие */}
                        <div className="greeting-card">
                            <div className="greeting-header">
                                <div className="avatar">
                                    <FaUser />
                                </div>
                                <div className="greeting-text">
                                    <h3>Привет, я Алексей - ваш электрик</h3>
                                    <p className="tagline">Профессионал с многолетним опытом</p>
                                </div>
                            </div>

                            <div className="greeting-body">
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
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <MdElectricalServices />
                                </div>
                                <div className="stat-content">
                                    <div className="stat-number">{stats.projects}+</div>
                                    <div className="stat-label">Выполненных проектов</div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <FaUser />
                                </div>
                                <div className="stat-content">
                                    <div className="stat-number">{stats.clients}+</div>
                                    <div className="stat-label">Довольных клиентов</div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <FaBriefcase />
                                </div>
                                <div className="stat-content">
                                    <div className="stat-number">{stats.years}</div>
                                    <div className="stat-label">Лет опыта</div>
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    <FaShieldAlt />
                                </div>
                                <div className="stat-content">
                                    <div className="stat-number">{stats.warranty}</div>
                                    <div className="stat-label">Месяцев гарантии</div>
                                </div>
                            </div>
                        </div>

                        {/* Принципы работы */}
                        <div className="principles-section">
                            <h3>Мои принципы работы</h3>
                            <div className="principles-grid">
                                {principles.map((principle, index) => (
                                    <div key={index} className="principle-card">
                                        <div className="principle-icon">
                                            {principle.icon}
                                        </div>
                                        <div className="principle-content">
                                            <h4>{principle.title}</h4>
                                            <p>{principle.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Боковая панель */}
                    <div className="about-sidebar">
                        {/* Вкладки */}
                        <div className="tabs-section">
                            <div className="tabs-header">
                                <button
                                    className={`tab-button ${activeTab === 'experience' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('experience')}
                                >
                                    Опыт
                                </button>
                                <button
                                    className={`tab-button ${activeTab === 'services' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('services')}
                                >
                                    Услуги
                                </button>
                                <button
                                    className={`tab-button ${activeTab === 'certificates' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('certificates')}
                                >
                                    Сертификаты
                                </button>
                            </div>

                            <div className="tabs-content">
                                {activeTab === 'experience' && (
                                    <div className="timeline">
                                        {timeline.map((item, index) => (
                                            <div key={index} className="timeline-item">
                                                <div className="timeline-year">{item.year}</div>
                                                <div className="timeline-content">
                                                    <div className="timeline-icon">
                                                        {item.icon}
                                                    </div>
                                                    <div className="timeline-text">
                                                        <h4>{item.title}</h4>
                                                        <p>{item.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'services' && (
                                    <div className="services-list">
                                        <h4>Полный перечень услуг</h4>
                                        <ul>
                                            {servicesList.map((service, index) => (
                                                <li key={index} className="service-item">
                                                    <FaCheckCircle className="check-icon" />
                                                    <span>{service}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {activeTab === 'certificates' && (
                                    <div className="certificates-section">
                                        <div className="certificates-slider">
                                            <div className="certificate-active">
                                                <div className="certificate-header">
                                                    <FaCertificate className="cert-icon" />
                                                    <div className="cert-title">
                                                        <h4>{certificates[activeCert].title}</h4>
                                                        <p className="cert-issuer">{certificates[activeCert].issuer}</p>
                                                    </div>
                                                </div>
                                                <div className="certificate-details">
                                                    <div className="detail">
                                                        <span className="label">Год выдачи:</span>
                                                        <span className="value">{certificates[activeCert].year}</span>
                                                    </div>
                                                    <div className="detail">
                                                        <span className="label">Номер:</span>
                                                        <span className="value">{certificates[activeCert].number}</span>
                                                    </div>
                                                </div>
                                                <div className="certificate-preview">
                                                    {/* Заглушка для изображения сертификата */}
                                                    <div className="certificate-placeholder">
                                                        <FaAward className="preview-icon" />
                                                        <span>Сертификат {activeCert + 1}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="certificates-nav">
                                                <button
                                                    className="nav-button prev"
                                                    onClick={() => setActiveCert(activeCert > 0 ? activeCert - 1 : certificates.length - 1)}
                                                >
                                                    ←
                                                </button>
                                                <div className="certificates-dots">
                                                    {certificates.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            className={`dot ${index === activeCert ? 'active' : ''}`}
                                                            onClick={() => setActiveCert(index)}
                                                        />
                                                    ))}
                                                </div>
                                                <button
                                                    className="nav-button next"
                                                    onClick={() => setActiveCert(activeCert < certificates.length - 1 ? activeCert + 1 : 0)}
                                                >
                                                    →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Отзывы */}
                        <div className="testimonials-section">
                            <h3>Отзывы клиентов</h3>
                            <div className="testimonials-slider">
                                {testimonials.map((testimonial, index) => (
                                    <div key={index} className="testimonial-card">
                                        <div className="testimonial-header">
                                            <div className="client-info">
                                                <div className="client-avatar">
                                                    {testimonial.name.charAt(0)}
                                                </div>
                                                <div className="client-details">
                                                    <h4>{testimonial.name}</h4>
                                                    <p className="client-role">{testimonial.role}</p>
                                                </div>
                                            </div>
                                            <div className="testimonial-rating">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        className={`star ${i < testimonial.rating ? 'filled' : ''}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="testimonial-body">
                                            <FaQuoteLeft className="quote-left" />
                                            <p className="testimonial-text">{testimonial.text}</p>
                                            <FaQuoteRight className="quote-right" />
                                        </div>

                                        <div className="testimonial-footer">
                                            <span className="testimonial-date">{testimonial.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA секция */}
                <div className="about-cta">
                    <div className="cta-content">
                        <div className="cta-text">
                            <h3>Готовы начать проект?</h3>
                            <p>Свяжитесь со мной для бесплатной консультации и расчета стоимости работ</p>
                        </div>
                        <div className="cta-buttons">
                            <button
                                className="cta-btn primary"
                                onClick={() => document.querySelector('.contact')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Получить консультацию
                            </button>
                            <a href="tel:+79991234567" className="cta-btn secondary">
                                <FaUser />
                                Позвонить сейчас
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;