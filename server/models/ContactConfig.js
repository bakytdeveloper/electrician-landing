const mongoose = require('mongoose');

const contactConfigSchema = new mongoose.Schema({
    // Основная информация
    companyName: {
        type: String,
        required: true,
        default: 'ЭлектроМастер'
    },
    companyAlternateName: {
        type: String,
        default: 'Услуги электрика в Алматы'
    },
    companyDescription: {
        type: String,
        default: 'Профессиональные услуги электрика в Алматы: монтаж, ремонт электропроводки, установка электрооборудования, замеры, консультации. Выезд по всему городу.'
    },

    // Контакты
    phoneDisplay: {
        type: String,
        required: true,
        default: '+7 (727) 123-45-67'
    },
    phoneRaw: {
        type: String,
        required: true,
        default: '+77271234567'
    },
    phoneForWhatsapp: {
        type: String,
        required: true,
        default: '77071234567'
    },
    email: {
        type: String,
        required: true,
        default: 'info@electromaster.kz'
    },
    telegramUsername: {
        type: String,
        default: 'electromaster_almaty'
    },
    instagramUsername: {
        type: String,
        default: 'electromaster_almaty'
    },

    // Адрес
    addressStreet: {
        type: String,
        default: 'ул. Абая, 123'
    },
    addressCity: {
        type: String,
        required: true,
        default: 'Алматы'
    },
    addressRegion: {
        type: String,
        default: 'Алматинская область'
    },
    addressPostalCode: {
        type: String,
        default: '050000'
    },
    officeDescription: {
        type: String,
        default: 'БЦ Нурлы Тау, офис 123'
    },

    // Яндекс Карта
    yandexMapUrl: {
        type: String,
        default: 'https://yandex.kz/maps/?ll=76.8512%2C43.2220&z=17&mode=search&text=%D0%91%D0%A6%20%D0%9D%D1%83%D1%80%D0%BB%D1%8B%20%D0%A2%D0%B0%D1%83%20%D0%90%D0%BB%D0%BC%D0%B0%D1%82%D1%8B'
    },
    yandexMapEmbedUrl: {
        type: String,
        default: 'https://yandex.kz/map-widget/v1/?ll=76.8512%2C43.2220&z=17&l=map&pt=76.8512%2C43.2220'
    },

    // Ссылки на карты
    map2GisUrl: {
        type: String,
        default: 'https://2gis.kz/almaty/search/Нурлы%20Тау'
    },

    // Рабочие часы
    weekdayHours: {
        type: String,
        default: '08:00 - 20:00'
    },
    weekendHours: {
        type: String,
        default: '09:00 - 18:00'
    },

    // Дополнительные настройки
    responseTime: {
        type: String,
        default: '15 минут'
    },
    emergencyAvailable: {
        type: Boolean,
        default: true
    },
    emergencyText: {
        type: String,
        default: 'Аварийный выезд - круглосуточно'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    // Добавляем опцию timestamps для автоматического обновления
    timestamps: true
});

contactConfigSchema.pre('save', async function() {
    this.updatedAt = Date.now();
    // можно добавить await для асинхронных операций
});


module.exports = mongoose.models.ContactConfig || mongoose.model('ContactConfig', contactConfigSchema);