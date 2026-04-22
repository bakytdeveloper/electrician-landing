const asyncHandler = require('express-async-handler');
const ContactConfig = require('../models/ContactConfig');
const Contact = require('../models/Contact');

// @desc    Get contact configuration
// @route   GET /api/contacts/config
// @access  Public
const getContactConfig = asyncHandler(async (req, res) => {
    let config = await ContactConfig.findOne();

    // Если конфигурации нет, создаем с дефолтными значениями из .env
    if (!config) {
        config = await ContactConfig.create({
            // Основная информация
            companyName: process.env.REACT_APP_COMPANY_NAME || 'ЭлектроМастер',
            companyAlternateName: process.env.REACT_APP_COMPANY_ALTERNATE_NAME || 'Услуги электрика в Алматы',
            companyDescription: process.env.REACT_APP_COMPANY_DESCRIPTION || 'Профессиональные услуги электрика в Алматы: монтаж, ремонт электропроводки, установка электрооборудования, замеры, консультации. Выезд по всему городу.',

            // Контакты
            phoneDisplay: process.env.REACT_APP_PHONE_DISPLAY || '+7 (727) 123-45-67',
            phoneRaw: process.env.REACT_APP_PHONE_RAW || '+77271234567',
            phoneForWhatsapp: process.env.REACT_APP_PHONE_FOR_WHATSAPP || '77071234567',
            email: process.env.REACT_APP_EMAIL || 'info@electromaster.kz',
            telegramUsername: process.env.REACT_APP_TELEGRAM_USERNAME || 'electromaster_almaty',
            instagramUsername: process.env.REACT_APP_INSTAGRAM_USERNAME || 'electromaster_almaty',

            // Адрес
            addressStreet: process.env.REACT_APP_ADDRESS_STREET || 'ул. Абая, 123',
            addressCity: process.env.REACT_APP_ADDRESS_CITY || 'Алматы',
            addressRegion: process.env.REACT_APP_ADDRESS_REGION || 'Алматинская область',
            addressPostalCode: process.env.REACT_APP_ADDRESS_POSTAL_CODE || '050000',
            officeDescription: process.env.REACT_APP_OFFICE_DESCRIPTION || 'БЦ Нурлы Тау, офис 123',

            // Яндекс Карта (формируем из координат, если есть)
            yandexMapUrl: `https://yandex.kz/maps/?ll=${process.env.REACT_APP_GEO_LNG || '76.8512'}%2C${process.env.REACT_APP_GEO_LAT || '43.2220'}&z=17&mode=search&text=${encodeURIComponent(process.env.REACT_APP_OFFICE_DESCRIPTION || 'БЦ Нурлы Тау Алматы')}`,
            yandexMapEmbedUrl: `https://yandex.kz/map-widget/v1/?ll=${process.env.REACT_APP_GEO_LNG || '76.8512'}%2C${process.env.REACT_APP_GEO_LAT || '43.2220'}&z=17&l=map&pt=${process.env.REACT_APP_GEO_LNG || '76.8512'}%2C${process.env.REACT_APP_GEO_LAT || '43.2220'}`,
            map2GisUrl: process.env.REACT_APP_2GIS_URL || 'https://2gis.kz/almaty/search/Нурлы%20Тау',

            // Рабочие часы
            weekdayHours: process.env.REACT_APP_WEEKDAY_HOURS || '08:00 - 20:00',
            weekendHours: process.env.REACT_APP_WEEKEND_HOURS || '09:00 - 18:00',

            // Дополнительные настройки
            responseTime: '15 минут',
            emergencyAvailable: true,
            emergencyText: 'Аварийный выезд - круглосуточно'
        });

        console.log('✅ Создана конфигурация контактов с значениями по умолчанию');
    }

    res.json(config);
});

// @desc    Update contact configuration
// @route   PUT /api/contacts/config
// @access  Private/Admin
const updateContactConfig = asyncHandler(async (req, res) => {
    let config = await ContactConfig.findOne();

    if (!config) {
        config = new ContactConfig();
    }

    // Обновляем поля
    const allowedFields = [
        'companyName', 'companyAlternateName', 'companyDescription',
        'phoneDisplay', 'phoneRaw', 'phoneForWhatsapp', 'email',
        'telegramUsername', 'instagramUsername',
        'addressStreet', 'addressCity', 'addressRegion', 'addressPostalCode', 'officeDescription',
        'yandexMapUrl', 'yandexMapEmbedUrl', 'map2GisUrl',
        'weekdayHours', 'weekendHours',
        'responseTime', 'emergencyAvailable', 'emergencyText'
    ];

    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            config[field] = req.body[field];
        }
    });

    config.updatedAt = Date.now();
    await config.save();

    res.json({
        success: true,
        message: 'Контакты успешно обновлены',
        data: config
    });
});

// @desc    Get all contact submissions
// @route   GET /api/contacts/submissions
// @access  Private/Admin
const getContactsList = asyncHandler(async (req, res) => {
    const contacts = await Contact.find().sort('-createdAt');
    res.json({
        success: true,
        count: contacts.length,
        data: contacts
    });
});

module.exports = {
    getContactConfig,
    updateContactConfig,
    getContactsList
};