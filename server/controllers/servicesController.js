const ServicesContent = require('./../models/ServicesContent');


// Получение текущего контента
const getServicesContent = async (req, res) => {
    try {
        let content = await ServicesContent.findOne();

        // Если контента нет, создаем с дефолтными значениями
        if (!content) {
            content = await ServicesContent.create({
                categories: [
                    { id: 'installation', label: 'Монтаж', order: 1 },
                    { id: 'maintenance', label: 'Обслуживание', order: 2 },
                    { id: 'repair', label: 'Ремонт', order: 3 },
                    { id: 'consultation', label: 'Консультации', order: 4 },
                    { id: 'all', label: 'Все услуги', order: 5 }
                ],
                services: [
                    {
                        id: 1,
                        title: 'Монтаж электропроводки',
                        description: 'Полный комплекс работ по прокладке и замене электропроводки в квартирах, домах и офисах.',
                        icon: 'FaBolt',
                        category: 'installation',
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
                        category: 'installation',
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
                        category: 'installation',
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
                        category: 'maintenance',
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
                        category: 'repair',
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
                        category: 'maintenance',
                        features: ['Круглосуточно', 'Быстрый выезд', 'Экстренный ремонт', 'Выезд в течение часа'],
                        price: 'от 3 000 ₸',
                        duration: 'от 30 мин',
                        order: 2
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
                ]
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
            if (key !== 'services' && key !== 'categories' && key !== 'benefits' && key !== 'cta') {
                content[key] = updates[key];
            }
        });

        // Обновляем категории если есть
        if (updates.categories) {
            content.categories = updates.categories;
        }

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

// Создание категории
const createCategory = async (req, res) => {
    try {
        const content = await ServicesContent.findOne();

        if (!content) {
            return res.status(404).json({ message: 'Контент не найден' });
        }

        content.categories.push(req.body);
        await content.save();

        res.json(content.categories);
    } catch (error) {
        console.error('Error in createCategory:', error);
        res.status(500).json({ message: 'Ошибка при создании категории' });
    }
};

// Удаление категории
const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const content = await ServicesContent.findOne();

        if (!content) {
            return res.status(404).json({ message: 'Контент не найден' });
        }

        // Не удаляем категорию 'all' и проверяем, есть ли услуги в этой категории
        if (categoryId === 'all') {
            return res.status(400).json({ message: 'Нельзя удалить категорию "Все услуги"' });
        }

        const servicesInCategory = content.services.filter(s => s.category === categoryId);
        if (servicesInCategory.length > 0) {
            return res.status(400).json({ message: 'Нельзя удалить категорию, в которой есть услуги' });
        }

        content.categories = content.categories.filter(c => c.id !== categoryId);
        await content.save();

        res.json(content.categories);
    } catch (error) {
        console.error('Error in deleteCategory:', error);
        res.status(500).json({ message: 'Ошибка при удалении категории' });
    }
};

module.exports = {
    getServicesContent,
    updateServicesContent,
    createService,
    deleteService,
    createCategory,
    deleteCategory
};