const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    getServicesContent,
    updateServicesContent,
    createService,
    deleteService,
} = require('../controllers/servicesController');

// Публичные маршруты
router.get('/content', getServicesContent);

// Защищенные маршруты
router.put('/content', authMiddleware, updateServicesContent);
router.post('/services', authMiddleware, createService);
router.delete('/services/:id', authMiddleware, deleteService);
// router.post('/categories', authMiddleware, createCategory);
// router.delete('/categories/:id', authMiddleware, deleteCategory);

module.exports = router;