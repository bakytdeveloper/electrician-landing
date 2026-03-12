const HeroContent = require('../models/HeroContent');
const fs = require('fs').promises;
const path = require('path');

// Получение текущего контента
const getHeroContent = async (req, res) => {
    try {
        let content = await HeroContent.findOne();

        // Если контента нет, создаем с дефолтными значениями
        if (!content) {
            content = await HeroContent.create({
                slides: [
                    { bgClass: 'slide-1', bgType: 'color', bgValue: 'linear-gradient(135deg, #6b85fa 0%, #521364 100%)' },
                    { bgClass: 'slide-2', bgType: 'color', bgValue: 'linear-gradient(135deg, #f487ff 0%, #fd0b2b 100%)' },
                    { bgClass: 'slide-3', bgType: 'color', bgValue: 'linear-gradient(135deg, #0052e3 0%, #00d8fe 100%)' }
                ],
                features: [
                    { text: 'Бесплатный выезд и диагностика', active: true },
                    { text: 'Опыт работы более 10 лет', active: true },
                    { text: 'Официальная гарантия', active: true }
                ]
            });
        }

        res.json(content);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении контента' });
    }
};

// Обновление контента
const updateHeroContent = async (req, res) => {
    try {
        const updates = req.body;
        const content = await HeroContent.findOne();

        if (!content) {
            return res.status(404).json({ message: 'Контент не найден' });
        }

        // Обновляем поля
        Object.keys(updates).forEach(key => {
            if (key !== 'slides' && key !== 'features') {
                content[key] = updates[key];
            }
        });

        // Обновляем features если есть
        if (updates.features) {
            content.features = updates.features;
        }

        // Обновляем slides если есть
        if (updates.slides) {
            content.slides = updates.slides;
        }

        content.updatedAt = Date.now();
        await content.save();

        res.json(content);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении контента' });
    }
};

// Загрузка изображения для слайда
const uploadSlideImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Файл не загружен' });
        }

        const slideIndex = parseInt(req.params.slideIndex);
        const content = await HeroContent.findOne();

        if (!content || !content.slides[slideIndex]) {
            // Удаляем загруженный файл если слайд не найден
            await fs.unlink(req.file.path);
            return res.status(404).json({ message: 'Слайд не найден' });
        }

        // Удаляем старое изображение если оно было файлом
        const oldSlide = content.slides[slideIndex];
        if (oldSlide.bgType === 'file' && oldSlide.bgValue) {
            const oldPath = path.join(__dirname, '../../uploads', path.basename(oldSlide.bgValue));
            try {
                await fs.access(oldPath);
                await fs.unlink(oldPath);
            } catch (err) {
                // Файл не существует, игнорируем
            }
        }

        // Обновляем слайд
        const imageUrl = `/uploads/${req.file.filename}`;
        content.slides[slideIndex] = {
            ...oldSlide,
            bgType: 'file',
            bgValue: imageUrl
        };

        await content.save();

        res.json({
            message: 'Изображение загружено',
            slide: content.slides[slideIndex]
        });
    } catch (error) {
        // В случае ошибки удаляем загруженный файл
        if (req.file) {
            await fs.unlink(req.file.path);
        }
        res.status(500).json({ message: 'Ошибка при загрузке изображения' });
    }
};

// Удаление изображения слайда
const deleteSlideImage = async (req, res) => {
    try {
        const slideIndex = parseInt(req.params.slideIndex);
        const content = await HeroContent.findOne();

        if (!content || !content.slides[slideIndex]) {
            return res.status(404).json({ message: 'Слайд не найден' });
        }

        const slide = content.slides[slideIndex];

        // Удаляем файл если он существует
        if (slide.bgType === 'file' && slide.bgValue) {
            const filePath = path.join(__dirname, '../../uploads', path.basename(slide.bgValue));
            try {
                await fs.access(filePath);
                await fs.unlink(filePath);
            } catch (err) {
                // Файл не существует, продолжаем
            }
        }

        // Сбрасываем на цвет по умолчанию
        content.slides[slideIndex] = {
            ...slide,
            bgType: 'color',
            bgValue: 'linear-gradient(135deg, #6b85fa 0%, #521364 100%)'
        };

        await content.save();

        res.json({
            message: 'Изображение удалено',
            slide: content.slides[slideIndex]
        });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении изображения' });
    }
};

module.exports = {
    getHeroContent,
    updateHeroContent,
    uploadSlideImage,
    deleteSlideImage
};