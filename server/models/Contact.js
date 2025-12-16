const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Пожалуйста, укажите имя'],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Пожалуйста, укажите номер телефона'],
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    message: {
        type: String,
        trim: true,
    },
    serviceType: {
        type: String,
        enum: [
            'Монтаж электропроводки',
            'Обслуживание',
            'Ремонт проводки',
            'Установка оборудования',
            'Консультация',
            'Другое'
        ],
        default: 'Другое',
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'completed', 'cancelled'],
        default: 'new',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.models.Contact || mongoose.model('Contact', contactSchema);