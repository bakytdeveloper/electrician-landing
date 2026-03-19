const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    getPriceContent,
    updatePriceContent
} = require('../controllers/priceController');

// Публичные маршруты
router.get('/content', getPriceContent);

// Защищенные маршруты
router.put('/content', authMiddleware, updatePriceContent);

module.exports = router;