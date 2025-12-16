const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose'); // Добавляем импорт mongoose
const Contact = require('../models/Contact');
const sendEmail = require('../config/emailConfig');

// Маппинг значений из формы в понятные названия на русском
const SERVICE_TYPE_MAPPING = {
    'installation': 'Монтаж электропроводки',
    'repair': 'Ремонт проводки',
    'equipment': 'Установка оборудования',
    'maintenance': 'Обслуживание',
    'consultation': 'Консультация',
    'other': 'Другое'
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
        // Проверяем, существует ли модель Contact
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
        // Не прерываем выполнение, продолжаем отправку email
        return null;
    }
};

// Красиво отформатированное HTML письмо
const createEmailTemplate = (data) => {
    const serviceType = SERVICE_TYPE_MAPPING[data.serviceType] || data.serviceType || 'Не указано';

    return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 10px; 
            overflow: hidden; 
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center;
        }
        .header h1 { 
            margin: 0; 
            font-size: 24px; 
            font-weight: 600;
        }
        .content { 
            padding: 30px;
        }
        .info-card { 
            background: #f8f9fa; 
            border-left: 4px solid #667eea; 
            padding: 15px 20px; 
            margin-bottom: 15px; 
            border-radius: 5px;
        }
        .info-label { 
            font-weight: 600; 
            color: #555; 
            display: inline-block; 
            min-width: 150px;
        }
        .footer { 
            background: #f1f3f4; 
            padding: 20px; 
            text-align: center; 
            color: #666; 
            font-size: 14px;
        }
        .priority-badge { 
            display: inline-block; 
            background: #ff6b6b; 
            color: white; 
            padding: 5px 10px; 
            border-radius: 20px; 
            font-size: 12px; 
            font-weight: 600;
            margin-left: 10px;
        }
        .message-box { 
            background: #e3f2fd; 
            border: 1px solid #bbdefb; 
            padding: 15px; 
            border-radius: 5px; 
            margin-top: 20px;
        }
        .date-time { 
            color: #666; 
            font-size: 14px; 
            margin-top: 20px; 
            padding-top: 20px; 
            border-top: 1px solid #eee;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Новая заявка с сайта электрика</h1>
            <p>Требует внимания в течение 15 минут</p>
        </div>
        
        <div class="content">
            <div class="info-card">
                <span class="info-label">👤 Клиент:</span>
                <strong>${data.name}</strong>
            </div>
            
            <div class="info-card">
                <span class="info-label">📱 Телефон:</span>
                <strong><a href="tel:${data.phone}" style="color: #667eea; text-decoration: none;">${data.phone}</a></strong>
                <span class="priority-badge">Высокий приоритет</span>
            </div>
            
            ${data.email ? `
            <div class="info-card">
                <span class="info-label">📧 Email:</span>
                <strong><a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">${data.email}</a></strong>
            </div>
            ` : ''}
            
            <div class="info-card">
                <span class="info-label">🔧 Тип услуги:</span>
                <strong>${serviceType}</strong>
            </div>
            
            ${data.message ? `
            <div class="message-box">
                <p style="margin-top: 0; font-weight: 600; color: #555;">💬 Сообщение от клиента:</p>
                <p style="white-space: pre-line; margin: 10px 0 0 0;">${data.message}</p>
            </div>
            ` : ''}
            
            <div class="date-time">
                <p style="margin: 0;">
                    📅 Дата получения: ${new Date().toLocaleString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} Электромастер. Все права защищены.</p>
            <p><small>Это письмо сгенерировано автоматически. Пожалуйста, не отвечайте на него.</small></p>
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
        // Не прерываем выполнение, продолжаем отправку email
    }

    // Отправляем email уведомление администратору
    try {
        const emailData = {
            name,
            phone,
            email: email || 'Не указан',
            serviceType: service,
            message: message || 'Не указано'
        };

        await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: `🚀 Новая заявка: ${name} - ${serviceTypeRussian}`,
            text: `
НОВАЯ ЗАЯВКА С САЙТА ЭЛЕКТРИКА
─────────────────────────────────
👤 КЛИЕНТ: ${name}
📱 ТЕЛЕФОН: ${phone}
📧 EMAIL: ${email || 'Не указан'}
🔧 УСЛУГА: ${serviceTypeRussian}
💬 СООБЩЕНИЕ: ${message || 'Не указано'}
─────────────────────────────────
📅 ДАТА: ${new Date().toLocaleString('ru-RU')}
🚀 СРОЧНОСТЬ: В течение 15 минут

Свяжитесь с клиентом как можно скорее!
`,
            html: createEmailTemplate(emailData),
        });

        console.log('✅ Email уведомление отправлено');
    } catch (emailError) {
        console.error('❌ Ошибка при отправке email:', emailError);
        // Если email не отправлен, это критично - возвращаем ошибку
        res.status(500);
        throw new Error('Ошибка при отправке заявки. Пожалуйста, позвоните нам напрямую.');
    }

    // Всегда возвращаем успех, если email отправлен
    res.status(200).json({
        success: true,
        message: '✅ Заявка успешно отправлена! Мы свяжемся с вами в течение 15 минут.',
        data: savedContact,
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
        // Проверяем подключение к БД
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