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
        default: 'О компании'
    },
    sectionSubtitle: {
        type: String,
        default: 'Профессиональные электромонтажные работы любой сложности. Гарантируем качество, надежность и безопасность.'
    },

    // Основная информация
    greetingTitle: {
        type: String,
        default: 'ЭлектроМастер — ваш надежный партнер'
    },
    greetingTagline: {
        type: String,
        default: 'Команда профессионалов с многолетним опытом'
    },
    // ОДИН параграф вместо двух
    // ОДИН параграф вместо двух
    greetingText: {
        type: String,
        default:  ` Сегодня без надежной электрики не обходится ни уютная квартира, ни целое производство. Но когда что-то искрит или гаснет, нужен не просто "человек с отверткой", а профильный специалист.

 Аварии случаются внезапно. Мы это понимаем, поэтому наши мастера готовы выехать на дом или в офис сразу после звонка. Вы можете вызвать нашего электрика в Алматы в любое время. Это избавляет вас от необходимости ждать днями или пытаться разобраться в проводах самостоятельно.

 Хороший электромонтаж — это не всегда заоблачный ценник. Мы держим баланс: вы получаете надежную систему, которая не подведет годами, и при этом не переплачиваете за бренд.

 Наши электромонтеры работают в этой сфере более 20 лет. Это не просто цифра, а гарантия того, что любое решение будет безопасным и долговечным. Мы не только чиним, но и подсказываем, как сделать лучше, соблюдая все нормы безопасности. Нужен честный мастер с репутацией? Мы на связи.`
    },



    // Название компании
    specialistName: {
        type: String,
        default: 'ЭлектроМастер'
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