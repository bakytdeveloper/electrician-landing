// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    updateOrderNotes,
    deleteOrder,
    getOrderStats
} = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

// Все маршруты требуют авторизации админа
router.use(authMiddleware);

// Статистика
router.get('/stats/summary', getOrderStats);

// Основные CRUD операции
router.route('/')
    .get(getAllOrders);

router.route('/:id')
    .get(getOrderById)
    .delete(deleteOrder);

router.put('/:id/status', updateOrderStatus);
router.put('/:id/notes', updateOrderNotes);

module.exports = router;