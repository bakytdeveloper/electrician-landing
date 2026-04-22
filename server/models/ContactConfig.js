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

    // Google Карта (используем простой embed без API ключа)
    googleMapUrl: {
        type: String,
        default: 'https://www.google.com/maps/search/?api=1&query=БЦ+Нурлы+Тау+Алматы'
    },
    googleMapEmbedUrl: {
        type: String,
        default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2906.123456789!2d76.8512!3d43.2220!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38836e5a5a5a5a5a%3A0x123456789abcdef!2z0J3Rg9GA0LvRiyDQotCw0Y8!5e0!3m2!1sru!2skz!4v1234567890!5m2!1sru!2skz'
    },

    // Ссылки на карты
    map2GisUrl: {
        type: String,
        default: 'https://2gis.kz/almaty/search/Нурлы%20Тау'
    },

    // Рабочие часы для каждого дня отдельно
    mondayHours: {
        type: String,
        default: '08:00 - 20:00'
    },
    tuesdayHours: {
        type: String,
        default: '08:00 - 20:00'
    },
    wednesdayHours: {
        type: String,
        default: '08:00 - 20:00'
    },
    thursdayHours: {
        type: String,
        default: '08:00 - 20:00'
    },
    fridayHours: {
        type: String,
        default: '08:00 - 20:00'
    },
    saturdayHours: {
        type: String,
        default: '09:00 - 18:00'
    },
    sundayHours: {
        type: String,
        default: 'Выходной'
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
    timestamps: true
});

// Обновляем timestamp при сохранении
contactConfigSchema.pre('save', async function(next) {
    this.updatedAt = Date.now();
    // next();
});

module.exports = mongoose.models.ContactConfig || mongoose.model('ContactConfig', contactConfigSchema);