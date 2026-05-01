const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    date: {
        type: String,
        required: true
    },
    project: {
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

const statSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    suffix: {
        type: String,
        default: '+'
    },
    icon: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    }
});

const aboutContentSchema = new mongoose.Schema({
    // Заголовок секции
    sectionTitle: {
        type: String,
        default: 'ЭлектроМастер'
    },
    sectionSubtitle: {
        type: String,
        default: 'Профессиональный электрик с 12-летним опытом работы. Гарантирую качество, надежность и безопасность всех работ.'
    },

    // Основная информация
    greetingTitle: {
        type: String,
        default: 'Привет, я Антон - ваш электрик'
    },
    greetingTagline: {
        type: String,
        default: 'Профессионал с многолетним опытом'
    },
    greetingText1: {
        type: String,
        default: 'Я занимаюсь электромонтажными работами уже более 12 лет. За это время я выполнил более 250 проектов различной сложности - от замены розетки до полного монтажа электрики в коттеджах и офисах.'
    },
    greetingText2: {
        type: String,
        default: 'Моя философия проста: качественная работа, надежные материалы и индивидуальный подход к каждому клиенту. Я гарантирую безопасность всех выполненных работ и предоставляю официальную гарантию до 36 месяцев.'
    },

    // Имя специалиста (для подстановки в текст)
    specialistName: {
        type: String,
        default: 'Антон'
    },

    // Статистика
    stats: [statSchema],

    // Отзывы
    testimonials: [testimonialSchema],

    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AboutContent', aboutContentSchema);