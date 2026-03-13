const ServicesContent = require('./../models/ServicesContent');

// Получение текущего контента
const getServicesContent = async (req, res) => {
    try {
        let content = await ServicesContent.findOne();

        // Если контента нет, создаем с дефолтными значениями
        if (!content) {
            content = await ServicesContent.create({
                services: [
                    {
                        id: 1,
                        title: 'Монтаж электропроводки',
                        description: 'Полный комплекс работ по прокладке и замене электропроводки в квартирах, домах и офисах.',
                        icon: 'FaBolt',
                        category: 'Монтаж',
                        features: ['Скрытая проводка', 'Открытая проводка', 'Замена проводки', 'Дизайн-проект'],
                        price: 'от 2 500 ₸',
                        duration: 'от 4 часов',
                        order: 1
                    },
                    {
                        id: 2,
                        title: 'Установка электрощитов',
                        description: 'Сборка и установка распределительных щитов с автоматическими выключателями и УЗО.',
                        icon: 'MdOutlineElectricalServices',
                        category: 'Монтаж',
                        features: ['Сборка щита', 'Монтаж автоматов', 'Подключение УЗО', 'Маркировка'],
                        price: 'от 3 500 ₸',
                        duration: 'от 3 часов',
                        order: 2
                    },
                    {
                        id: 3,
                        title: 'Монтаж розеток и выключателей',
                        description: 'Установка и замена розеток, выключателей, диммеров и других электроустановочных изделий.',
                        icon: 'MdHomeRepairService',
                        category: 'Монтаж',
                        features: ['Евро розетки', 'Проходные выключатели', 'Сенсорные панели', 'Влагозащищенные'],
                        price: 'от 450 ₸/шт',
                        duration: 'от 30 мин',
                        order: 3
                    },
                    {
                        id: 4,
                        title: 'Обсл.электрооборудования',
                        description: 'Регулярное техническое обслуживание электросистем для предотвращения аварийных ситуаций.',
                        icon: 'FaTools',
                        category: 'Обслуживание',
                        features: ['Диагностика', 'Профилактика', 'Замена изношенных частей', 'Настройка'],
                        price: 'от 1 800 ₸',
                        duration: 'от 2 часов',
                        order: 1
                    },
                    {
                        id: 5,
                        title: 'Ремонт бытовой техники',
                        description: 'Диагностика и ремонт стиральных машин, холодильников, плит и другой бытовой техники.',
                        icon: 'FaWrench',
                        category: 'Ремонт',
                        features: ['Диагностика', 'Запчасти в наличии', 'Гарантия на ремонт', 'Выезд мастера'],
                        price: 'от 1 200 ₸',
                        duration: 'от 1 часа',
                        order: 1
                    },
                    {
                        id: 6,
                        title: 'Аварийные работы',
                        description: 'Круглосуточный выезд для устранения аварийных ситуаций и восстановления электроснабжения.',
                        icon: 'MdSecurity',
                        category: 'Аварийные',
                        features: ['Круглосуточно', 'Быстрый выезд', 'Экстренный ремонт', 'Выезд в течение часа'],
                        price: 'от 3 000 ₸',
                        duration: 'от 30 мин',
                        order: 1
                    }
                ],
                benefits: [
                    {
                        icon: 'FaCheckCircle',
                        title: 'Гарантия 3 года',
                        description: 'На все виды работ предоставляем официальную гарантию',
                        active: true
                    },
                    {
                        icon: 'FaClock',
                        title: 'Работаем быстро',
                        description: 'Среднее время выполнения заказа - 2-4 часа',
                        active: true
                    },
                    {
                        icon: 'FaTruck',
                        title: 'Бесплатный выезд',
                        description: 'Выезд мастера и диагностика - бесплатно',
                        active: true
                    }
                ],
                cta: {
                    title: 'Нужна консультация электрика?',
                    description: 'Оставьте заявку и получите бесплатную консультацию по вашему вопросу',
                    buttonText: 'Получить консультацию',
                    phoneText: 'Или позвоните: +7 (999) 123-45-67',
                    phoneNumber: '+79991234567'
                }
            });
        }

        res.json(content);
    } catch (error) {
        console.error('Error in getServicesContent:', error);
        res.status(500).json({ message: 'Ошибка при получении контента услуг' });
    }
};

// Обновление контента
const updateServicesContent = async (req, res) => {
    try {
        const updates = req.body;
        const content = await ServicesContent.findOne();

        if (!content) {
            return res.status(404).json({ message: 'Контент не найден' });
        }

        // Обновляем поля
        Object.keys(updates).forEach(key => {
            if (key !== 'services' && key !== 'benefits' && key !== 'cta') {
                content[key] = updates[key];
            }
        });

        // Обновляем услуги если есть
        if (updates.services) {
            content.services = updates.services;
        }

        // Обновляем преимущества если есть
        if (updates.benefits) {
            content.benefits = updates.benefits;
        }

        // Обновляем CTA если есть
        if (updates.cta) {
            content.cta = { ...content.cta, ...updates.cta };
        }

        content.updatedAt = Date.now();
        await content.save();

        res.json(content);
    } catch (error) {
        console.error('Error in updateServicesContent:', error);
        res.status(500).json({ message: 'Ошибка при обновлении контента услуг' });
    }
};

// Создание новой услуги
const createService = async (req, res) => {
    try {
        const content = await ServicesContent.findOne();

        if (!content) {
            return res.status(404).json({ message: 'Контент не найден' });
        }

        // Генерируем новый ID
        const maxId = Math.max(...content.services.map(s => s.id), 0);
        const newService = {
            ...req.body,
            id: maxId + 1,
            active: true
        };

        content.services.push(newService);
        await content.save();

        res.json(newService);
    } catch (error) {
        console.error('Error in createService:', error);
        res.status(500).json({ message: 'Ошибка при создании услуги' });
    }
};

// Удаление услуги
const deleteService = async (req, res) => {
    try {
        const serviceId = parseInt(req.params.id);
        const content = await ServicesContent.findOne();

        if (!content) {
            return res.status(404).json({ message: 'Контент не найден' });
        }

        content.services = content.services.filter(s => s.id !== serviceId);
        await content.save();

        res.json({ message: 'Услуга удалена', services: content.services });
    } catch (error) {
        console.error('Error in deleteService:', error);
        res.status(500).json({ message: 'Ошибка при удалении услуги' });
    }
};

module.exports = {
    getServicesContent,
    updateServicesContent,
    createService,
    deleteService
};