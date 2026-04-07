// controllers/contactController.js - исправленная версия

const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Contact = require('../models/Contact');
const sendEmail = require('../config/emailConfig');
require('dotenv').config();

// Маппинг значений из формы в понятные названия на русском (БЕЗ ЭМОДЗИ для БД)
const SERVICE_TYPE_MAPPING = {
    'installation': 'Монтаж электропроводки',
    'repair': 'Ремонт проводки',
    'equipment': 'Установка оборудования',
    'maintenance': 'Обслуживание',
    'consultation': 'Консультация',
    'measurement': 'Замеры и проектирование',
    'emergency': 'Аварийный вызов',
    'other': 'Другое'
};

// Для отображения в письмах (С ЭМОДЗИ)
const SERVICE_TYPE_MAPPING_WITH_EMOJI = {
    'installation': '⚡ Монтаж электропроводки',
    'repair': '🔧 Ремонт проводки',
    'equipment': '💡 Установка оборудования',
    'maintenance': '🛠️ Обслуживание',
    'consultation': '📞 Консультация',
    'measurement': '📏 Замеры и проектирование',
    'emergency': '🚨 Аварийный вызов',
    'other': '🤔 Другое'
};

// Функция для форматирования даты
const formatDate = (date) => {
    return new Date(date).toLocaleString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Функция для проверки подключения к БД
const isDatabaseConnected = () => {
    try {
        return mongoose.connection.readyState === 1;
    } catch (error) {
        console.log('❌ Не удалось проверить подключение к БД:', error.message);
        return false;
    }
};

// Функция для безопасного сохранения в БД (ИСПРАВЛЕНА)
const saveToDatabase = async (data) => {
    if (!isDatabaseConnected()) {
        console.log('⚠️ База данных не подключена, пропускаем сохранение');
        return null;
    }

    try {
        if (!Contact || typeof Contact.create !== 'function') {
            console.log('⚠️ Модель Contact не загружена');
            return null;
        }

        // Проверяем, что serviceType соответствует enum
        const validServiceTypes = [
            'Монтаж электропроводки',
            'Обслуживание',
            'Ремонт проводки',
            'Установка оборудования',
            'Консультация',
            'Другое'
        ];

        let serviceTypeForDB = data.serviceTypeRussian;

        // Если значение не входит в enum, ищем соответствие
        if (!validServiceTypes.includes(serviceTypeForDB)) {
            // Убираем эмодзи и пробелы в начале
            const cleaned = serviceTypeForDB.replace(/^[🔧⚡💡🛠️📞📏🚨🤔]\s*/, '');
            if (validServiceTypes.includes(cleaned)) {
                serviceTypeForDB = cleaned;
            } else {
                serviceTypeForDB = 'Другое';
            }
        }

        console.log(`💾 Сохраняем в БД: serviceType = "${serviceTypeForDB}"`);

        const contact = await Contact.create({
            name: data.name,
            phone: data.phone,
            email: data.email || undefined,
            message: data.message || undefined,
            serviceType: serviceTypeForDB,
            status: 'new',
            notes: ''
        });

        console.log('✅ Заявка сохранена в базе данных:', contact._id);
        return contact;
    } catch (dbError) {
        console.error('❌ Ошибка при сохранении в базу данных:', dbError.message);
        console.error('Детали ошибки:', dbError);
        return null;
    }
};

// Базовые стили для всех писем
const baseStyles = `
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #3B82F6 0%, #1E3A5F 100%);
            padding: 3px;
            border-radius: 16px;
        }
        .email-content {
            background: white;
            padding: 30px;
            border-radius: 14px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #e0e7ff;
            padding-bottom: 20px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            background: linear-gradient(135deg, #3B82F6 0%, #1E3A5F 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: #d6fc03;
            margin-bottom: 10px;
        }
        .badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            margin: 10px 0;
        }
        .badge-danger {
            background: #3B82F6;
            color: white;
        }
        .badge-warning {
            background: #FBBF24;
            color: #333;
        }
        .badge-info {
            background: #06B6D4;
            color: white;
        }
        .badge-success {
            background: #10B981;
            color: white;
        }
        .info-card {
            background: #f0f9ff;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #3B82F6;
        }
        .info-row {
            display: flex;
            margin-bottom: 15px;
            border-bottom: 1px dashed #d1d5db;
            padding-bottom: 10px;
        }
        .info-label {
            font-weight: 600;
            min-width: 140px;
            color: #4B5563;
        }
        .info-value {
            color: #1F2937;
            flex: 1;
        }
        .message-box {
            background: #EFF6FF;
            border: 1px solid #BFDBFE;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            color: #1E3A8A;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e0e7ff;
            text-align: center;
            color: #6B7280;
            font-size: 12px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #3B82F6 0%, #1E3A5F 100%);
            color: white!important;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin: 20px 0;
        }
        .contact-info {
            background: #f0f9ff;
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
        }
        .contact-item {
            margin: 5px 0;
        }
        .emoji {
            font-size: 20px;
            margin-right: 5px;
        }
        .urgent {
            background: #3B82F6;
            color: white;
            padding: 3px 10px;
            border-radius: 15px;
            font-size: 12px;
            margin-left: 10px;
        }
        .highlight {
            color: #3B82F6;
            font-weight: bold;
        }
        .action-box {
            background: #EFF6FF;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            color: #1E40AF;
            border-left: 4px solid #3B82F6;
        }
    </style>
`;

// Письмо для клиента (ИСПРАВЛЕНО - используем MAPPING с эмодзи)
const createClientEmailTemplate = (data) => {
    const serviceType = SERVICE_TYPE_MAPPING_WITH_EMOJI[data.serviceType] || data.serviceType || 'Не указано';

    return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${baseStyles}
</head>
<body>
    <div class="email-wrapper">
        <div class="email-content">
            <div class="header">
                <div class="logo">⚡ ${process.env.APP_NAME || 'ЭлектроМастер Алматы'}</div>
                <div class="badge badge-success">✅ Заявка получена</div>
            </div>
            
            <p>Здравствуйте, <strong>${data.name}</strong>!</p>
            
            <p>Спасибо за обращение в нашу компанию! Мы получили вашу заявку и готовы помочь с электромонтажными работами в Алматы.</p>
            
            <div class="info-card">
                <h3 style="margin-top: 0; color: #3B82F6;">📋 Детали заявки</h3>
                
                <div class="info-row">
                    <span class="info-label"><span class="emoji">👤</span> Имя:</span>
                    <span class="info-value"><strong>${data.name}</strong></span>
                </div>
                
                <div class="info-row">
                    <span class="info-label"><span class="emoji">📱</span> Телефон:</span>
                    <span class="info-value"><strong>${data.phone}</strong></span>
                </div>
                
                ${data.email ? `
                <div class="info-row">
                    <span class="info-label"><span class="emoji">✉️</span> Email:</span>
                    <span class="info-value">${data.email}</span>
                </div>
                ` : ''}
                
                <div class="info-row">
                    <span class="info-label"><span class="emoji">🔧</span> Услуга:</span>
                    <span class="info-value"><strong>${serviceType}</strong></span>
                </div>
                
                ${data.message ? `
                <div class="info-row">
                    <span class="info-label"><span class="emoji">💬</span> Сообщение:</span>
                    <span class="info-value">${data.message}</span>
                </div>
                ` : ''}
            </div>
            
            <p>Наш мастер свяжется с вами в ближайшее время для уточнения деталей. Обычно это занимает не более <span class="highlight">15 минут</span>.</p>
            
            <div class="contact-info">
                <div class="contact-item"><span class="emoji">📞</span> <strong>+7 (727) 123-45-67</strong> - ежедневно</div>
                <div class="contact-item"><span class="emoji">⏰</span> Работаем: Пн-Пт 08:00-20:00 / Сб-Вс 09:00-18:00</div>
                <div class="contact-item"><span class="emoji">📍</span> г. Алматы, БЦ Нурлы Тау</div>
            </div>
            
            <div class="footer">
                <p>С уважением, команда ${process.env.APP_NAME || 'ЭлектроМастер Алматы'}</p>
                <p>© ${new Date().getFullYear()} Все права защищены</p>
                <p style="font-size: 11px; color: #9CA3AF;">Это письмо отправлено автоматически, пожалуйста, не отвечайте на него.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};

// Письмо для администратора (ИСПРАВЛЕНО)
const createAdminEmailTemplate = (data) => {
    const serviceType = SERVICE_TYPE_MAPPING_WITH_EMOJI[data.serviceType] || data.serviceType || 'Не указано';
    const now = new Date();

    return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${baseStyles}
</head>
<body>
    <div class="email-wrapper">
        <div class="email-content">
            <div class="header">
                <div class="logo">⚡ Новая заявка</div>
                <div class="badge badge-danger">Требуется действие</div>
            </div>
            
            <p><strong>Уважаемый администратор,</strong></p>
            
            <p>Поступила новая заявка от клиента. Требуется ваше внимание в ближайшее время!</p>
            
            <div style="text-align: center; margin: 10px 0;">
                <span class="badge badge-warning">🚀 Свяжитесь с клиентом</span>
            </div>
            
            <div class="info-card">
                <h3 style="margin-top: 0; color: #3B82F6;">👤 Данные клиента</h3>
                
                <div class="info-row">
                    <span class="info-label"><span class="emoji">👤</span> Имя:</span>
                    <span class="info-value"><strong>${data.name}</strong></span>
                </div>
                
                <div class="info-row">
                    <span class="info-label"><span class="emoji">📱</span> Телефон:</span>
                    <span class="info-value">
                        <strong><a href="tel:${data.phone}" style="color: #3B82F6; text-decoration: none;">${data.phone}</a></strong>
                        <span class="urgent">Позвонить сейчас</span>
                    </span>
                </div>
                
                ${data.email ? `
                <div class="info-row">
                    <span class="info-label"><span class="emoji">✉️</span> Email:</span>
                    <span class="info-value"><a href="mailto:${data.email}" style="color: #3B82F6; text-decoration: none;">${data.email}</a></span>
                </div>
                ` : ''}
                
                <h3 style="margin-top: 20px; color: #3B82F6;">📋 Детали заявки</h3>
                
                <div class="info-row">
                    <span class="info-label"><span class="emoji">🔧</span> Услуга:</span>
                    <span class="info-value"><strong>${serviceType}</strong></span>
                </div>
                
                ${data.message ? `
                <div class="message-box">
                    <strong style="display: block; margin-bottom: 10px; color: #1E40AF;">💬 Сообщение клиента:</strong>
                    <p style="margin: 0; white-space: pre-line;">${data.message}</p>
                </div>
                ` : ''}
                
                <div class="info-row">
                    <span class="info-label"><span class="emoji">📅</span> Получено:</span>
                    <span class="info-value">${formatDate(now)}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label"><span class="emoji">🔢</span> ID заявки:</span>
                    <span class="info-value">#${Date.now().toString().slice(-8)}</span>
                </div>
            </div>
            
            <div class="action-box">
                <p style="margin: 0;"><strong>🔔 Необходимые действия:</strong></p>
                <p style="margin: 10px 0 0 0;">
                    1️⃣ Свяжитесь с клиентом в течение 15 минут<br>
                    2️⃣ Уточните детали работ<br>
                    3️⃣ Согласуйте время выезда мастера
                </p>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
                <a href="tel:${data.phone}" class="button">📞 Позвонить клиенту</a>
            </div>
            
            <div class="footer">
                <p>Административная панель ${process.env.APP_NAME || 'ЭлектроМастер Алматы'}</p>
                <p style="font-size: 11px; color: #9CA3AF;">📍 г. Алматы, Казахстан</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
    const { name, phone, email, message, service } = req.body;

    // Валидация обязательных полей
    if (!name || !phone) {
        res.status(400);
        throw new Error('Имя и телефон обязательны для заполнения');
    }

    // Получаем русское название для БД (без эмодзи)
    const serviceTypeForDB = SERVICE_TYPE_MAPPING[service] || 'Другое';

    console.log(`📝 Обработка заявки: ${name}, услуга: ${service} -> ${serviceTypeForDB}`);

    let savedContact = null;

    // Пробуем сохранить в БД
    try {
        savedContact = await saveToDatabase({
            name,
            phone,
            email,
            message,
            serviceTypeRussian: serviceTypeForDB
        });

        if (savedContact) {
            console.log(`✅ Заявка сохранена в БД с ID: ${savedContact._id}`);
        } else {
            console.log('⚠️ Заявка не сохранена в БД');
        }
    } catch (error) {
        console.error('❌ Ошибка при сохранении в БД:', error.message);
    }

    // Отправляем подтверждение клиенту (если указан email)
    if (email) {
        try {
            await sendEmail({
                to: email,
                subject: `✅ Спасибо за обращение в ${process.env.APP_NAME || 'ЭлектроМастер Алматы'}!`,
                html: createClientEmailTemplate({
                    name,
                    phone,
                    email,
                    message,
                    serviceType: service
                })
            });
            console.log(`✅ Подтверждение отправлено клиенту на ${email}`);
        } catch (emailError) {
            console.error('❌ Ошибка отправки email клиенту:', emailError);
        }
    }

    // Отправляем уведомление администратору
    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_EMAIL;

    try {
        await sendEmail({
            to: adminEmail,
            subject: `⚡ Новая заявка от ${name} - ${SERVICE_TYPE_MAPPING_WITH_EMOJI[service] || serviceTypeForDB}`,
            html: createAdminEmailTemplate({
                name,
                phone,
                email,
                message,
                serviceType: service
            })
        });
        console.log(`✅ Уведомление отправлено админу на ${adminEmail}`);
    } catch (emailError) {
        console.error('❌ Ошибка отправки email админу:', emailError);
    }

    // Возвращаем успешный ответ
    res.status(200).json({
        success: true,
        message: '✅ Заявка успешно отправлена! Мы свяжемся с вами в течение 15 минут.',
        data: savedContact ? {
            id: savedContact._id,
            name: savedContact.name,
            phone: savedContact.phone,
            serviceType: savedContact.serviceType
        } : null,
        timestamp: new Date().toISOString(),
        referenceId: `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        databaseSaved: savedContact !== null
    });
});

// @desc    Get all contacts (for admin)
// @route   GET /api/contacts
// @access  Private/Admin
const getContacts = asyncHandler(async (req, res) => {
    try {
        if (!isDatabaseConnected()) {
            return res.status(503).json({
                success: false,
                message: 'База данных временно недоступна',
                data: []
            });
        }

        const contacts = await Contact.find().sort('-createdAt');
        console.log(`📊 Получено ${contacts.length} контактов из БД`);

        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts,
        });
    } catch (error) {
        console.error('❌ Ошибка при получении контактов:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении данных',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = {
    submitContactForm,
    getContacts,
};