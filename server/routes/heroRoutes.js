const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');
const {
    getHeroContent,
    updateHeroContent,
    uploadSlideImage,
    deleteSlideImage
} = require('../controllers/heroController');

// Создаем папку uploads если её нет - используем правильный путь относительно корня сервера
const serverDir = path.join(__dirname, '..');
const uploadsDir = path.join(serverDir, 'uploads');
const slidesDir = path.join(uploadsDir, 'slides');

// Создаем директории при старте
[uploadsDir, slidesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Сохраняем сразу в правильную папку
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'slide-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Только изображения разрешены (jpeg, jpg, png, gif, webp, svg)'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Публичные маршруты
router.get('/content', getHeroContent);

// Защищенные маршруты
router.put('/content', authMiddleware, updateHeroContent);
router.post('/slides/:slideIndex/image', authMiddleware, upload.single('image'), uploadSlideImage);
router.delete('/slides/:slideIndex/image', authMiddleware, deleteSlideImage);

module.exports = router;