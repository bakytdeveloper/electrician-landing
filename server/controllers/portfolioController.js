const PortfolioContent = require('../models/PortfolioContent');
const fs = require('fs').promises;
const path = require('path');

// Создание необходимых директорий
const ensureUploadDirectories = async () => {
    const serverDir = path.join(__dirname, '..');
    const uploadsDir = path.join(serverDir, 'uploads');
    const portfolioDir = path.join(uploadsDir, 'portfolio');

    try {
        // Проверяем и создаем основную папку uploads
        try {
            await fs.access(uploadsDir);
        } catch {
            await fs.mkdir(uploadsDir, { recursive: true });
            console.log('Created uploads directory:', uploadsDir);
        }

        // Проверяем и создаем папку portfolio
        try {
            await fs.access(portfolioDir);
        } catch {
            await fs.mkdir(portfolioDir, { recursive: true });
            console.log('Created portfolio directory:', portfolioDir);
        }

        return { uploadsDir, portfolioDir };
    } catch (error) {
        console.error('Error creating directories:', error);
        throw error;
    }
};

// Получение текущего контента
const getPortfolioContent = async (req, res) => {
    try {
        let content = await PortfolioContent.findOne();

        // Если контента нет, создаем с дефолтными значениями
        if (!content) {
            content = await PortfolioContent.create({
                items: [
                    {
                        id: 1,
                        title: 'Полная замена проводки в квартире',
                        description: 'Замена старой алюминиевой проводки на медную, установка современного электрощита с УЗО и автоматами.',
                        category: 'Квартиры',
                        images: [
                            { url: 'https://avatars.mds.yandex.net/i?id=3a3970ebdae3a325bdae846745b94986_l-5236752-images-thumbs&ref=rim&n=13&w=732&h=429', type: 'url', altText: 'Монтаж проводки в квартире', order: 0 },
                            { url: 'https://decorexpro.com/images/article/orig/2018/05/otoplenie-doma-ekonomnye-sposoby-i-varianty-23.jpg', type: 'url', altText: 'Установленный электрощит', order: 1 }
                        ],
                        features: ['Медная проводка', 'Электрощит Legrand', '35 розеток'],
                        date: '15.12.2023',
                        area: '85 м²',
                        duration: '3 дня',
                        order: 1
                    },
                    {
                        id: 2,
                        title: 'Электрика в частном доме под ключ',
                        description: 'Монтаж проводки с нуля в новом доме, установка уличного освещения и автоматических ворот.',
                        category: 'Частные дома',
                        images: [
                            { url: 'https://avatars.mds.yandex.net/get-ydo/4421910/2a0000018d79328effbd0bf54054d36f6154/diploma', type: 'url', altText: 'Электрика в частном доме', order: 0 },
                            { url: 'https://avatars.mds.yandex.net/i?id=30a4073eca9c7f207b7d54b12b3b62e6_l-4827941-images-thumbs&n=13', type: 'url', altText: 'Уличное освещение', order: 1 }
                        ],
                        features: ['Наружное освещение', 'Автоматические ворота', 'Стабилизатор напряжения', 'Резервный генератор'],
                        date: '05.11.2023',
                        area: '150 м²',
                        duration: '7 дней',
                        order: 2
                    },
                    {
                        id: 3,
                        title: 'Модернизация офисного электрощита',
                        description: 'Замена устаревшего электрощита на современный с разделением по группам и установкой УЗИП.',
                        category: 'Офисы',
                        images: [
                            { url: 'https://img.freepik.com/free-photo/male-electrician-working-electrical-panel-male-electrician-overalls_169016-67274.jpg', type: 'url', altText: 'Офисный электрощит', order: 0 },
                            { url: 'https://img.freepik.com/free-photo/male-electrician-working-electrical-panel-male-electrician-overalls_169016-67433.jpg', type: 'url', altText: 'Монтажные работы', order: 1 }
                        ],
                        features: ['Щиток ABB', 'УЗИП', 'Групповые автоматы', 'Мониторинг энергопотребления'],
                        date: '22.10.2023',
                        area: '120 м²',
                        duration: '2 дня',
                        order: 3
                    },
                    {
                        id: 4,
                        title: 'Промышленная электропроводка в цеху',
                        description: 'Прокладка силовых кабелей, установка промышленных розеток и организация освещения.',
                        category: 'Промышленные',
                        images: [
                            { url: 'https://img.freepik.com/premium-photo/electrical-engineers-check-electrical-control-devices-with-multimeter_539854-551.jpg', type: 'url', altText: 'Промышленная проводка', order: 0 }
                        ],
                        features: ['Силовые кабели', 'Промышленные розетки', 'LED освещение', 'Защита от пыли и влаги'],
                        date: '10.09.2023',
                        area: '500 м²',
                        duration: '14 дней',
                        order: 4
                    },
                    {
                        id: 5,
                        title: 'Ремонт электрощита после замыкания',
                        description: 'Аварийный ремонт электрощита с полной заменой поврежденных автоматов и восстановлением питания.',
                        category: 'Частные дома',
                        images: [
                            { url: 'https://avatars.mds.yandex.net/i?id=7da152d96abd0a9875600e87168e0179_l-4079990-images-thumbs&n=13', type: 'url', altText: 'Ремонт электрощита', order: 0 },
                            { url: 'https://avatars.mds.yandex.net/i?id=74a99342a7ac057dcd09b4f27ad2c271_l-10414886-images-thumbs&ref=rim&n=13&w=644&h=429', type: 'url', altText: 'Диагностика электрики', order: 1 }
                        ],
                        features: ['Аварийный выезд', 'Замена автоматов', 'Диагностика сети', 'Профилактические работы'],
                        date: '03.06.2023',
                        area: '90 м²',
                        duration: '5 часов',
                        order: 5
                    },
                    {
                        id: 6,
                        title: 'Освещение в ресторане',
                        description: 'Проектирование и монтаж декоративного освещения с зонированием и диммированием.',
                        category: 'Коммерческие',
                        images: [
                            { url: 'https://img.freepik.com/premium-photo/full-length-portrait-electrician-stepladder-installs-lighting-ceiling-office_493343-27764.jpg', type: 'url', altText: 'Освещение ресторана', order: 0 },
                            { url: 'https://img.freepik.com/premium-photo/beautiful-ceiling-with-led-lighting-flat-round_152904-49666.jpg', type: 'url', altText: 'Декоративный свет', order: 1 }
                        ],
                        features: ['Декоративное освещение', 'Диммирование', 'Зонирование света', 'Энергоэффективность'],
                        date: '20.05.2023',
                        area: '200 м²',
                        duration: '8 дней',
                        order: 6
                    }
                ]
            });
        }

        // Формируем полные URL для локальных изображений
        const contentWithUrls = content.toObject();
        if (contentWithUrls.items) {
            contentWithUrls.items = contentWithUrls.items.map(item => {
                if (item.images) {
                    item.images = item.images.map(img => {
                        if (img.type === 'file' && img.url && !img.url.startsWith('http')) {
                            img.url = `${process.env.API_URL || 'http://localhost:5000'}${img.url}`;
                        }
                        return img;
                    });
                }
                return item;
            });
        }

        res.json(contentWithUrls);
    } catch (error) {
        console.error('Error in getPortfolioContent:', error);
        res.status(500).json({ message: 'Ошибка при получении контента портфолио' });
    }
};

// Обновление контента
const updatePortfolioContent = async (req, res) => {
    try {
        const updates = req.body;
        console.log('Received updates:', updates);

        const content = await PortfolioContent.findById(updates._id);

        if (!content) {
            return res.status(404).json({ message: 'Контент не найден' });
        }

        // Обновляем поля
        content.sectionTitle = updates.sectionTitle || content.sectionTitle;
        content.sectionSubtitle = updates.sectionSubtitle || content.sectionSubtitle;

        // Обновляем элементы портфолио если есть
        if (updates.items) {
            content.items = [];
            updates.items.forEach(item => {
                const { _id, ...itemData } = item;
                if (itemData.images) {
                    itemData.images = itemData.images.map(img => {
                        const { _id, ...imgData } = img;
                        return imgData;
                    });
                }
                content.items.push(itemData);
            });
        }

        content.updatedAt = Date.now();
        await content.save({ versionKey: false });

        res.json(content);
    } catch (error) {
        console.error('Error in updatePortfolioContent:', error);
        res.status(500).json({ message: 'Ошибка при обновлении контента портфолио: ' + error.message });
    }
};

// Создание нового элемента портфолио
const createPortfolioItem = async (req, res) => {
    try {
        const content = await PortfolioContent.findOne();

        if (!content) {
            return res.status(404).json({ message: 'Контент не найден' });
        }

        // Генерируем новый ID
        const maxId = Math.max(...content.items.map(s => s.id), 0);
        const newItem = {
            id: maxId + 1,
            title: req.body.title,
            description: req.body.description || '',
            category: req.body.category,
            images: req.body.images || [],
            features: Array.isArray(req.body.features) ? req.body.features : [],
            date: req.body.date,
            area: req.body.area,
            duration: req.body.duration,
            active: req.body.active !== undefined ? req.body.active : true,
            order: req.body.order || content.items.length + 1
        };

        content.items.push(newItem);
        await content.save({ versionKey: false });

        res.json(newItem);
    } catch (error) {
        console.error('Error in createPortfolioItem:', error);
        res.status(500).json({ message: 'Ошибка при создании элемента портфолио: ' + error.message });
    }
};

// Удаление элемента портфолио
const deletePortfolioItem = async (req, res) => {
    try {
        const itemId = parseInt(req.params.id);
        const content = await PortfolioContent.findOne();

        if (!content) {
            return res.status(404).json({ message: 'Контент не найден' });
        }

        // Находим удаляемый элемент для удаления файлов
        const itemToDelete = content.items.find(item => item.id === itemId);
        if (itemToDelete && itemToDelete.images) {
            // Удаляем все файлы изображений
            for (const img of itemToDelete.images) {
                if (img.type === 'file' && img.url) {
                    const fileName = path.basename(img.url);
                    const filePath = path.join(__dirname, '../uploads/portfolio', fileName);
                    try {
                        await fs.access(filePath);
                        await fs.unlink(filePath);
                        console.log('Deleted file:', filePath);
                    } catch (err) {
                        console.log('File not found or error deleting:', err);
                    }
                }
            }
        }

        content.items = content.items.filter(item => item.id !== itemId);
        await content.save({ versionKey: false });

        res.json({ message: 'Элемент удален', items: content.items });
    } catch (error) {
        console.error('Error in deletePortfolioItem:', error);
        res.status(500).json({ message: 'Ошибка при удалении элемента портфолио' });
    }
};

// Загрузка изображения для портфолио
const uploadPortfolioImage = async (req, res) => {
    let tempFilePath = null;

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Файл не загружен' });
        }

        tempFilePath = req.file.path;
        console.log('File uploaded to temp location:', tempFilePath);

        // Создаем необходимые директории
        const { portfolioDir } = await ensureUploadDirectories();

        const { itemId, imageIndex } = req.params;
        const content = await PortfolioContent.findOne();

        if (!content) {
            await fs.unlink(tempFilePath);
            return res.status(404).json({ message: 'Контент не найден' });
        }

        const item = content.items.find(i => i.id === parseInt(itemId));
        if (!item) {
            await fs.unlink(tempFilePath);
            return res.status(404).json({ message: 'Элемент не найден' });
        }

        // Удаляем старое изображение если оно было файлом
        if (item.images && item.images[imageIndex] && item.images[imageIndex].type === 'file' && item.images[imageIndex].url) {
            const fileName = path.basename(item.images[imageIndex].url);
            const oldPath = path.join(portfolioDir, fileName);
            try {
                await fs.access(oldPath);
                await fs.unlink(oldPath);
                console.log('Old file deleted:', oldPath);
            } catch (err) {
                console.log('Old file not found or error deleting:', err);
            }
        }

        // Новый путь для файла
        const newPath = path.join(portfolioDir, req.file.filename);
        await fs.rename(tempFilePath, newPath);
        console.log('File moved to:', newPath);

        // Формируем относительный путь
        const imageUrl = `/uploads/portfolio/${req.file.filename}`;

        res.json({
            message: 'Изображение загружено',
            imageUrl,
            filename: req.file.filename
        });
    } catch (error) {
        console.error('Error in uploadPortfolioImage:', error);
        if (tempFilePath) {
            try {
                await fs.unlink(tempFilePath);
            } catch (unlinkError) {
                console.error('Error deleting temp file:', unlinkError);
            }
        }
        res.status(500).json({ message: 'Ошибка при загрузке изображения: ' + error.message });
    }
};

// Удаление изображения из портфолио
const deletePortfolioImage = async (req, res) => {
    try {
        const { itemId, imageIndex } = req.params;
        const content = await PortfolioContent.findOne();

        if (!content) {
            return res.status(404).json({ message: 'Контент не найден' });
        }

        const item = content.items.find(i => i.id === parseInt(itemId));
        if (!item || !item.images || !item.images[imageIndex]) {
            return res.status(404).json({ message: 'Изображение не найдено' });
        }

        const image = item.images[imageIndex];

        // Удаляем файл если он существует
        if (image.type === 'file' && image.url) {
            const fileName = path.basename(image.url);
            const filePath = path.join(__dirname, '../uploads/portfolio', fileName);
            try {
                await fs.access(filePath);
                await fs.unlink(filePath);
                console.log('File deleted:', filePath);
            } catch (err) {
                console.log('File not found or error deleting:', err);
            }
        }

        // Удаляем изображение из массива
        item.images.splice(imageIndex, 1);
        await content.save({ versionKey: false });

        res.json({ message: 'Изображение удалено', images: item.images });
    } catch (error) {
        console.error('Error in deletePortfolioImage:', error);
        res.status(500).json({ message: 'Ошибка при удалении изображения' });
    }
};

module.exports = {
    getPortfolioContent,
    updatePortfolioContent,
    createPortfolioItem,
    deletePortfolioItem,
    uploadPortfolioImage,
    deletePortfolioImage
};