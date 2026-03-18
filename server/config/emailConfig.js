const nodemailer = require('nodemailer');
require('dotenv').config();

// Создаем транспортер для отправки почты
const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: {
        rejectUnauthorized: false
    }
});

// Проверка подключения при запуске
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Ошибка подключения к SMTP серверу:');
        console.error('   Детали ошибки:', error);
    } else {
        console.log('✅ SMTP сервер готов к отправке писем');
    }
});

// Функция для отправки email
const sendEmail = async (options) => {
    try {
        // Формируем отправителя: "ElectroMaster" <email>
        const fromField = `"${process.env.APP_NAME}" <${process.env.SMTP_FROM}>`;

        const mailOptions = {
            from: fromField,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        };

        console.log('📨 Отправка письма:');
        console.log('   От:', fromField);
        console.log('   Кому:', options.to);
        console.log('   Тема:', options.subject);

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email отправлен:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Ошибка отправки email:');
        console.error('   Код ошибки:', error.code);
        console.error('   Сообщение:', error.message);
        throw new Error('Email could not be sent');
    }
};

module.exports = sendEmail;