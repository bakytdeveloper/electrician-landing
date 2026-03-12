const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
    bgClass: String,
    bgType: {
        type: String,
        enum: ['color', 'url', 'file'],
        default: 'color'
    },
    bgValue: String, // цвет, URL или путь к файлу
    active: {
        type: Boolean,
        default: true
    }
});

const heroContentSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Профессиональные услуги электрика'
    },
    subtitle: {
        type: String,
        default: 'Монтаж, обслуживание и ремонт электрооборудования любой сложности. Гарантия качества, доступные цены, оперативный выезд.'
    },
    features: [{
        text: String,
        active: Boolean
    }],
    workHours: {
        daily: {
            type: String,
            default: 'Ежедневно 8:00 - 22:00'
        },
        emergency: {
            type: String,
            default: 'Экстренные вызовы - 24/7'
        }
    },
    emergencyPhone: {
        type: String,
        default: '+7 (999) 123-45-67'
    },
    slides: [slideSchema],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('HeroContent', heroContentSchema);