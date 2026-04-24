const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');
const {
    getPortfolioContent,
    updatePortfolioContent,
    createPortfolioItem,
    deletePortfolioItem,
    uploadPortfolioImage,
    deletePortfolioImage,
    cleanupTempFiles,
    uploadTempImage // Добавим новый контроллер
} = require('../controllers/portfolioController');

// Создаем папку uploads/portfolio если её нет
const uploadsDir = path.join(__dirname, '../uploads');
const portfolioDir = path.join(uploadsDir, 'portfolio');
const tempDir = path.join(uploadsDir, 'temp'); // Добавим временную папку

[uploadsDir, portfolioDir, tempDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Для временных загрузок используем temp папку
        if (req.path.includes('/temp')) {
            cb(null, tempDir);
        } else {
            cb(null, uploadsDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'portfolio-' + uniqueSuffix + ext);
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
router.get('/content', getPortfolioContent);

// Защищенные маршруты
router.put('/content', authMiddleware, updatePortfolioContent);
router.post('/items', authMiddleware, createPortfolioItem);
router.delete('/items/:id', authMiddleware, deletePortfolioItem);

// Временная загрузка изображения для нового элемента
router.post('/items/temp/images', authMiddleware, upload.single('image'), uploadTempImage);

// Загрузка изображения для существующего элемента
router.post('/items/:itemId/images/:imageIndex', authMiddleware, upload.single('image'), uploadPortfolioImage);

router.delete('/items/:itemId/images/:imageIndex', authMiddleware, deletePortfolioImage);
router.post('/temp/cleanup', authMiddleware, cleanupTempFiles);


module.exports = router;