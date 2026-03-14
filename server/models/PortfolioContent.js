const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['url', 'file'],
        default: 'url'
    },
    altText: String,
    order: {
        type: Number,
        default: 0
    }
});

const portfolioItemSchema = new mongoose.Schema({
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
    category: {
        type: String,
        required: true
    },
    images: [imageSchema],
    features: [{
        type: String
    }],
    date: {
        type: String,
        required: true
    },
    area: {
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

const portfolioContentSchema = new mongoose.Schema({
    sectionTitle: {
        type: String,
        default: 'Наши работы'
    },
    sectionSubtitle: {
        type: String,
        default: 'Посмотрите примеры наших работ. Каждый проект - это индивидуальный подход и гарантия качества.'
    },
    items: [portfolioItemSchema],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PortfolioContent', portfolioContentSchema);