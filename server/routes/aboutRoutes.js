const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    getAboutContent,
    updateAboutContent
} = require('../controllers/aboutController');

// Публичные маршруты
router.get('/content', getAboutContent);

// Защищенные маршруты
router.put('/content', authMiddleware, updateAboutContent);

module.exports = router;