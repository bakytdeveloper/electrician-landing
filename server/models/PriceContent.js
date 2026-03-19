const mongoose = require('mongoose');

const priceItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    }
});

const priceSectionSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true
    },
    items: [priceItemSchema],
    order: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    }
});

const priceContentSchema = new mongoose.Schema({
    modalTitle: {
        type: String,
        default: 'Прайс-лист на электромонтажные работы'
    },
    searchPlaceholder: {
        type: String,
        default: 'Поиск по услугам или цене...'
    },
    footerNote: {
        type: String,
        default: '* Цены указаны ориентировочно. Точная стоимость зависит от сложности работ.'
    },
    orderButtonText: {
        type: String,
        default: 'Заказать расчет'
    },
    sections: [priceSectionSchema],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PriceContent', priceContentSchema);