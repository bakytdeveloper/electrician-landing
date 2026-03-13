const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'FaBolt' // Название иконки для отображения
    },
    category: {
        type: String,
        enum: ['installation', 'maintenance', 'repair', 'consultation'],
        required: true
    },
    features: [{
        type: String
    }],
    price: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
});

const categorySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    label: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    }
});

const benefitSchema = new mongoose.Schema({
    icon: {
        type: String,
        default: 'FaCheckCircle'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
});

const ctaSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Нужна консультация электрика?'
    },
    description: {
        type: String,
        default: 'Оставьте заявку и получите бесплатную консультацию по вашему вопросу'
    },
    buttonText: {
        type: String,
        default: 'Получить консультацию'
    },
    phoneText: {
        type: String,
        default: 'Или позвоните: +7 (999) 123-45-67'
    },
    phoneNumber: {
        type: String,
        default: '+79991234567'
    }
});

const servicesContentSchema = new mongoose.Schema({
    sectionTitle: {
        type: String,
        default: 'Наши услуги'
    },
    sectionSubtitle: {
        type: String,
        default: 'Профессиональные услуги электрика любой сложности. Работаем качественно, быстро и с гарантией.'
    },
    categories: [categorySchema],
    services: [serviceSchema],
    benefits: [benefitSchema],
    cta: {
        type: ctaSchema,
        default: () => ({})
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ServicesContent', servicesContentSchema);