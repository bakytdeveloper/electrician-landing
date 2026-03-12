const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/auth');
const {
    getHeroContent,
    updateHeroContent,
    uploadSlideImage,
    deleteSlideImage
} = require('../controllers/heroController');

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'slide-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Только изображения разрешены'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Публичные маршруты
router.get('/content', getHeroContent);

// Защищенные маршруты
router.put('/content', authMiddleware, updateHeroContent);
router.post('/slides/:slideIndex/image', authMiddleware, upload.single('image'), uploadSlideImage);
router.delete('/slides/:slideIndex/image', authMiddleware, deleteSlideImage);

module.exports = router;