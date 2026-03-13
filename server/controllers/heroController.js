const HeroContent = require('../models/HeroContent');
const fs = require('fs').promises;
const path = require('path');

// Создание необходимых директорий
const ensureUploadDirectories = async () => {
    // Используем правильный путь относительно корня проекта
    const serverDir = path.join(__dirname, '..');
    const uploadsDir = path.join(serverDir, 'uploads');
    const slidesDir = path.join(uploadsDir, 'slides');

    try {
        // Проверяем и создаем основную папку uploads
        try {
            await fs.access(uploadsDir);
            console.log('Uploads directory exists:', uploadsDir);
        } catch {
            await fs.mkdir(uploadsDir, { recursive: true });
            console.log('Created uploads directory:', uploadsDir);
        }

        // Проверяем и создаем папку slides
        try {
            await fs.access(slidesDir);
            console.log('Slides directory exists:', slidesDir);
        } catch {
            await fs.mkdir(slidesDir, { recursive: true });
            console.log('Created slides directory:', slidesDir);
        }

        return { uploadsDir, slidesDir };
    } catch (error) {
        console.error('Error creating directories:', error);
        throw error;
    }
};

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

        // Формируем полные URL для изображений
        const contentWithUrls = content.toObject();
        if (contentWithUrls.slides) {
            contentWithUrls.slides = contentWithUrls.slides.map(slide => {
                if (slide.bgType === 'file' && slide.bgValue && !slide.bgValue.startsWith('http')) {
                    // Добавляем полный URL для локальных файлов
                    slide.bgValue = `${process.env.API_URL || 'http://localhost:5000'}${slide.bgValue}`;
                }
                return slide;
            });
        }

        res.json(contentWithUrls);
    } catch (error) {
        console.error('Error in getHeroContent:', error);
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
            // Для каждого слайда проверяем изменения
            for (let i = 0; i < updates.slides.length; i++) {
                const updatedSlide = updates.slides[i];
                const currentSlide = content.slides[i];

                if (currentSlide) {
                    // СЛУЧАЙ 1: Тип изменился с file на что-то другое (color или url)
                    if (currentSlide.bgType === 'file' && updatedSlide.bgType !== 'file' && currentSlide.bgValue) {
                        const fileName = path.basename(currentSlide.bgValue);
                        const serverDir = path.join(__dirname, '..');
                        const filePath = path.join(serverDir, 'uploads', 'slides', fileName);

                        try {
                            await fs.access(filePath);
                            await fs.unlink(filePath);
                            console.log('File deleted after type change:', filePath);
                        } catch (err) {
                            console.log('Error deleting file or file not found:', err);
                        }
                    }

                    // СЛУЧАЙ 2: Тип остался file, но изменился URL (замена на другое изображение)
                    // Этот случай обрабатывается в uploadSlideImage, здесь не нужно
                }
            }

            content.slides = updates.slides;
        }

        content.updatedAt = Date.now();
        await content.save();

        // Формируем ответ с полными URL
        const savedContent = content.toObject();
        if (savedContent.slides) {
            savedContent.slides = savedContent.slides.map(slide => {
                if (slide.bgType === 'file' && slide.bgValue && !slide.bgValue.startsWith('http')) {
                    slide.bgValue = `${process.env.API_URL || 'http://localhost:5000'}${slide.bgValue}`;
                }
                return slide;
            });
        }

        res.json(savedContent);
    } catch (error) {
        console.error('Error in updateHeroContent:', error);
        res.status(500).json({ message: 'Ошибка при обновлении контента' });
    }
};

// Загрузка изображения для слайда
const uploadSlideImage = async (req, res) => {
    let tempFilePath = null;

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Файл не загружен' });
        }

        tempFilePath = req.file.path;
        console.log('File uploaded to temp location:', tempFilePath);

        // Создаем необходимые директории
        const { slidesDir } = await ensureUploadDirectories();

        const slideIndex = parseInt(req.params.slideIndex);
        const content = await HeroContent.findOne();

        if (!content || !content.slides[slideIndex]) {
            // Удаляем загруженный файл если слайд не найден
            await fs.unlink(tempFilePath);
            return res.status(404).json({ message: 'Слайд не найден' });
        }

        // Удаляем старое изображение если оно было файлом
        const oldSlide = content.slides[slideIndex];
        if (oldSlide.bgType === 'file' && oldSlide.bgValue) {
            const fileName = path.basename(oldSlide.bgValue);
            const oldPath = path.join(slidesDir, fileName);
            try {
                await fs.access(oldPath);
                await fs.unlink(oldPath);
                console.log('Old file deleted:', oldPath);
            } catch (err) {
                console.log('Old file not found or error deleting:', err);
            }
        }

        // Новый путь для файла
        const newPath = path.join(slidesDir, req.file.filename);

        // Перемещаем файл
        await fs.rename(tempFilePath, newPath);
        console.log('File moved to:', newPath);

        // Проверяем, что файл действительно перемещен
        try {
            await fs.access(newPath);
            console.log('File verified at new location');

            // Проверим, есть ли файл в папке slides
            const files = await fs.readdir(slidesDir);
            console.log('Files in slides directory:', files);
        } catch (err) {
            throw new Error('File was not moved successfully');
        }

        // Обновляем слайд - используем относительный путь
        const imageUrl = `/uploads/slides/${req.file.filename}`;

        // Сохраняем oldSlide как обычный объект
        const oldSlideObj = oldSlide.toObject ? oldSlide.toObject() : oldSlide;

        content.slides[slideIndex] = {
            ...oldSlideObj,
            bgType: 'file',
            bgValue: imageUrl
        };

        await content.save();
        console.log('Database updated with path:', imageUrl);

        // Формируем ответ с полным URL
        const updatedSlide = content.slides[slideIndex].toObject ? content.slides[slideIndex].toObject() : content.slides[slideIndex];
        const fullImageUrl = `${process.env.API_URL || 'http://localhost:5000'}${imageUrl}`;

        res.json({
            message: 'Изображение загружено',
            slide: {
                ...updatedSlide,
                bgValue: fullImageUrl
            }
        });
    } catch (error) {
        console.error('Error in uploadSlideImage:', error);
        // В случае ошибки удаляем временный файл
        if (tempFilePath) {
            try {
                await fs.unlink(tempFilePath);
                console.log('Temp file deleted after error');
            } catch (unlinkError) {
                console.error('Error deleting temp file:', unlinkError);
            }
        }
        res.status(500).json({ message: 'Ошибка при загрузке изображения: ' + error.message });
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
            const fileName = path.basename(slide.bgValue);
            // Используем правильный путь
            const serverDir = path.join(__dirname, '..');
            const filePath = path.join(serverDir, 'uploads', 'slides', fileName);
            try {
                await fs.access(filePath);
                await fs.unlink(filePath);
                console.log('File deleted:', filePath);
            } catch (err) {
                console.log('File not found or error deleting:', err);
            }
        }

        // Сбрасываем на цвет по умолчанию
        const defaultGradient = 'linear-gradient(135deg, #6b85fa 0%, #521364 100%)';
        const slideObj = slide.toObject ? slide.toObject() : slide;

        content.slides[slideIndex] = {
            ...slideObj,
            bgType: 'color',
            bgValue: defaultGradient
        };

        await content.save();

        // Формируем ответ
        const updatedSlide = content.slides[slideIndex].toObject ? content.slides[slideIndex].toObject() : content.slides[slideIndex];

        res.json({
            message: 'Изображение удалено',
            slide: updatedSlide
        });
    } catch (error) {
        console.error('Error in deleteSlideImage:', error);
        res.status(500).json({ message: 'Ошибка при удалении изображения' });
    }
};

module.exports = {
    getHeroContent,
    updateHeroContent,
    uploadSlideImage,
    deleteSlideImage
};