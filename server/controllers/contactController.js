const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');
const sendEmail = require('../config/emailConfig');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
    const { name, phone, email, message, serviceType } = req.body;

    // Validate required fields
    if (!name || !phone) {
        res.status(400);
        throw new Error('Name and phone are required');
    }

    // Create contact
    const contact = await Contact.create({
        name,
        phone,
        email,
        message,
        serviceType,
    });

    // Send email notification to admin
    try {
        await sendEmail({
            to: process.env.ADMIN_EMAIL,
            subject: `Новая заявка от ${name}`,
            text: `
                Новая заявка на сайте электрика:
                
                Имя: ${name}
                Телефон: ${phone}
                Email: ${email || 'Не указан'}
                Тип услуги: ${serviceType}
                Сообщение: ${message || 'Не указано'}
                
                Дата: ${new Date().toLocaleString('ru-RU')}
              `,
            html: `
        <h2>Новая заявка на сайте электрика</h2>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || 'Не указан'}</p>
        <p><strong>Тип услуги:</strong> ${serviceType}</p>
        <p><strong>Сообщение:</strong> ${message || 'Не указано'}</p>
        <p><strong>Дата:</strong> ${new Date().toLocaleString('ru-RU')}</p>
      `,
        });
    } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
    }

    res.status(201).json({
        success: true,
        data: contact,
        message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
    });
});

// @desc    Get all contacts (for admin, later)
// @route   GET /api/contact
// @access  Private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find().sort('-createdAt');
    res.status(200).json({
        success: true,
        count: contacts.length,
        data: contacts,
    });
});

module.exports = {
    submitContactForm,
    getContacts,
};