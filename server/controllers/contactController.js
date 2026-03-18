const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Contact = require('../models/Contact');
const sendEmail = require('../config/emailConfig');
require('dotenv').config();

// Маппинг значений из формы в понятные названия на русском
const SERVICE_TYPE_MAPPING = {
    'installation': '⚡ Монтаж электропроводки',
    'repair': '🔧 Ремонт проводки',
    'equipment': '💡 Установка оборудования',
    'maintenance': '🛠️ Обслуживание',
    'consultation': '📞 Консультация',
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

// Функция для безопасного сохранения в БД
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

        const contact = await Contact.create({
            name: data.name,
            phone: data.phone,
            email: data.email || undefined,
            message: data.message || undefined,
            serviceType: data.serviceTypeRussian,
        });

        console.log('✅ Заявка сохранена в базе данных:', contact._id);
        return contact;
    } catch (dbError) {
        console.error('❌ Ошибка при сохранении в базу данных:', dbError.message);
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
            background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
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
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 20px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
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
            background: #FF6B6B;
            color: white;
        }
        .badge-warning {
            background: #FFE66D;
            color: #333;
        }
        .badge-info {
            background: #4ECDC4;
            color: white;
        }
        .info-card {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #FF6B6B;
        }
        .info-row {
            display: flex;
            margin-bottom: 15px;
            border-bottom: 1px dashed #e0e0e0;
            padding-bottom: 10px;
        }
        .info-label {
            font-weight: 600;
            min-width: 140px;
            color: #555;
        }
        .info-value {
            color: #333;
            flex: 1;
        }
        .message-box {
            background: #FFF3CD;
            border: 1px solid #FFE69C;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            color: #856404;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #f0f0f0;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin: 20px 0;
        }
        .contact-info {
            background: #f8f9fa;
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
            background: #FF6B6B;
            color: white;
            padding: 3px 10px;
            border-radius: 15px;
            font-size: 12px;
            margin-left: 10px;
        }
    </style>
`;

// Красиво отформатированное HTML письмо для клиента
const createClientEmailTemplate = (data) => {
    const serviceType = SERVICE_TYPE_MAPPING[data.serviceType] || data.serviceType || 'Не указано';

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
                <div class="logo">⚡ ${process.env.APP_NAME}</div>
                <div class="badge badge-info">✅ Заявка получена</div>
            </div>
            
            <p>Здравствуйте, <strong>${data.name}</strong>!</p>
            
            <p>Спасибо за обращение в нашу компанию! Мы получили вашу заявку и готовы помочь с электромонтажными работами.</p>
            
            <div class="info-card">
                <h3 style="margin-top: 0; color: #FF6B6B;">📋 Детали заявки</h3>
                
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
            
            <p>Наш мастер свяжется с вами в ближайшее время для уточнения деталей. Обычно это занимает не более 15 минут.</p>
            
            <div class="contact-info">
                <div class="contact-item"><span class="emoji">📞</span> <strong>+7 (800) 123-45-67</strong> - круглосуточно</div>
                <div class="contact-item"><span class="emoji">⏰</span> Работаем ежедневно с 8:00 до 22:00</div>
            </div>
            
            <div class="footer">
                <p>С уважением, команда ${process.env.APP_NAME}</p>
                <p>© ${new Date().getFullYear()} Все права защищены</p>
                <p style="font-size: 11px; color: #999;">Это письмо отправлено автоматически, пожалуйста, не отвечайте на него.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};

// Красиво отформатированное HTML письмо для администратора
const createAdminEmailTemplate = (data) => {
    const serviceType = SERVICE_TYPE_MAPPING[data.serviceType] || data.serviceType || 'Не указано';
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
                <span class="badge badge-warning">🚀 Срочность: Высокая</span>
            </div>
            
            <div class="info-card">
                <h3 style="margin-top: 0; color: #FF6B6B;">👤 Данные клиента</h3>
                
                <div class="info-row">
                    <span class="info-label"><span class="emoji">👤</span> Имя:</span>
                    <span class="info-value"><strong>${data.name}</strong></span>
                </div>
                
                <div class="info-row">
                    <span class="info-label"><span class="emoji">📱</span> Телефон:</span>
                    <span class="info-value">
                        <strong><a href="tel:${data.phone}" style="color: #FF6B6B; text-decoration: none;">${data.phone}</a></strong>
                        <span class="urgent">Позвонить сейчас</span>
                    </span>
                </div>
                
                ${data.email ? `
                <div class="info-row">
                    <span class="info-label"><span class="emoji">✉️</span> Email:</span>
                    <span class="info-value"><a href="mailto:${data.email}" style="color: #FF6B6B; text-decoration: none;">${data.email}</a></span>
                </div>
                ` : ''}
                
                <h3 style="margin-top: 20px; color: #FF6B6B;">📋 Детали заявки</h3>
                
                <div class="info-row">
                    <span class="info-label"><span class="emoji">🔧</span> Услуга:</span>
                    <span class="info-value"><strong>${serviceType}</strong></span>
                </div>
                
                ${data.message ? `
                <div class="message-box">
                    <strong style="display: block; margin-bottom: 10px;">💬 Сообщение клиента:</strong>
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
            
            <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0; color: #0c5460;">
                <p style="margin: 0;"><strong>🔔 Необходимые действия:</strong></p>
                <p style="margin: 10px 0 0 0;">
                    1. Свяжитесь с клиентом в течение 15 минут<br>
                    2. Уточните детали работ<br>
                    3. Согласуйте время выезда мастера
                </p>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
                <a href="tel:${data.phone}" class="button">📞 Позвонить клиенту</a>
            </div>
            
            <div class="footer">
                <p>Административная панель ${process.env.APP_NAME}</p>
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

    // Преобразуем service из формы в русское значение
    const serviceTypeRussian = SERVICE_TYPE_MAPPING[service] || service || 'Другое';

    let savedContact = null;

    // Пробуем сохранить в БД, но не падаем при ошибке
    try {
        savedContact = await saveToDatabase({
            name,
            phone,
            email,
            message,
            serviceTypeRussian
        });
    } catch (error) {
        console.error('❌ Ошибка при обработке базы данных:', error.message);
    }

    // Отправляем подтверждение клиенту (если указан email)
    if (email) {
        try {
            await sendEmail({
                to: email,
                subject: `✅ Спасибо за обращение в ${process.env.APP_NAME}!`,
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
            subject: `⚡ Новая заявка от ${name} - ${serviceTypeRussian}`,
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
        res.status(500);
        throw new Error('Ошибка при отправке заявки. Пожалуйста, позвоните нам напрямую.');
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