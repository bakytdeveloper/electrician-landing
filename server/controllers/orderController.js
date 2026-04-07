// controllers/orderController.js
const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');

// @desc    Получить все заказы (с пагинацией и фильтрацией)
// @route   GET /api/orders
// @access  Private (Admin)
const getAllOrders = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;

    const skip = (page - 1) * limit;

    // Строим фильтр
    let filter = {};
    if (status && status !== 'all') {
        filter.status = status;
    }
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    const orders = await Contact.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(limit);

    const total = await Contact.countDocuments(filter);

    res.status(200).json({
        success: true,
        data: orders,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

// @desc    Получить один заказ по ID
// @route   GET /api/orders/:id
// @access  Private (Admin)
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Contact.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Заказ не найден');
    }

    res.status(200).json({
        success: true,
        data: order
    });
});

// @desc    Обновить статус заказа
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!['new', 'contacted', 'completed', 'cancelled'].includes(status)) {
        res.status(400);
        throw new Error('Некорректный статус');
    }

    const order = await Contact.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Заказ не найден');
    }

    order.status = status;
    await order.save();

    res.status(200).json({
        success: true,
        message: 'Статус заказа обновлен',
        data: order
    });
});

// @desc    Обновить заметки заказа
// @route   PUT /api/orders/:id/notes
// @access  Private (Admin)
const updateOrderNotes = asyncHandler(async (req, res) => {
    const { notes } = req.body;

    const order = await Contact.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Заказ не найден');
    }

    order.notes = notes;
    await order.save();

    res.status(200).json({
        success: true,
        message: 'Заметки обновлены',
        data: order
    });
});

// @desc    Удалить заказ
// @route   DELETE /api/orders/:id
// @access  Private (Admin)
const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Contact.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Заказ не найден');
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Заказ удален'
    });
});

// @desc    Получить статистику по заказам
// @route   GET /api/orders/stats/summary
// @access  Private (Admin)
const getOrderStats = asyncHandler(async (req, res) => {
    const total = await Contact.countDocuments();
    const newOrders = await Contact.countDocuments({ status: 'new' });
    const contacted = await Contact.countDocuments({ status: 'contacted' });
    const completed = await Contact.countDocuments({ status: 'completed' });
    const cancelled = await Contact.countDocuments({ status: 'cancelled' });

    // Заказы за последние 7 дней
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOrders = await Contact.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
        success: true,
        data: {
            total,
            newOrders,
            contacted,
            completed,
            cancelled,
            recentOrders
        }
    });
});

module.exports = {
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    updateOrderNotes,
    deleteOrder,
    getOrderStats
};