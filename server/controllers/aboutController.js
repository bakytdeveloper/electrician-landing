const AboutContent = require('../models/AboutContent');

// Получение текущего контента
const getAboutContent = async (req, res) => {
    try {
        let content = await AboutContent.findOne();

        // Если контента нет, создаем с дефолтными значениями
        if (!content) {
            content = await AboutContent.create({
                sectionTitle: 'О компании',
                sectionSubtitle: 'Профессиональные электромонтажные работы любой сложности. Гарантируем качество, надежность и безопасность.',
                greetingTitle: 'ЭлектроМастер — ваш надежный партнер',
                greetingTagline: 'Команда профессионалов с многолетним опытом',
                greetingText: ` Сегодня без надежной электрики не обходится ни уютная квартира, ни целое производство. Но когда что-то искрит или гаснет, нужен не просто "человек с отверткой", а профильный специалист.

 Аварии случаются внезапно. Мы это понимаем, поэтому наши мастера готовы выехать на дом или в офис сразу после звонка. Вы можете вызвать наших электриков в Алматы в любое время. Это избавляет вас от необходимости ждать днями или пытаться разобраться в проводах самостоятельно.

 Хороший электромонтаж — это не всегда заоблачный ценник. Мы держим баланс: вы получаете надежную систему, которая не подведет годами, и при этом не переплачиваете за бренд.

 Наши электромонтеры работают в этой сфере более 20 лет. Это не просто цифра, а гарантия того, что любое решение будет безопасным и долговечным. Мы не только чиним, но и подсказываем, как сделать лучше, соблюдая все нормы безопасности. Нужна честная бригада с репутацией? Мы на связи.`,
                specialistName: 'ЭлектроМастер',
                stats: [
                    { label: 'Выполненных проектов', value: 250, suffix: '+', icon: 'MdElectricalServices', order: 1 },
                    { label: 'Довольных клиентов', value: 180, suffix: '+', icon: 'FaUser', order: 2 },
                    { label: 'Лет опыта', value: 12, suffix: '', icon: 'FaBriefcase', order: 3 },
                    { label: 'Месяцев гарантии', value: 36, suffix: '', icon: 'FaShieldAlt', order: 4 }
                ],
                testimonials: [
                    {
                        name: 'Анна Петрова',
                        role: 'Владелец квартиры',
                        text: 'Заменяли проводку в хрущевке. Работа выполнена быстро, аккуратно, все спрятали в штробы. Прошло уже 2 года - никаких проблем.',
                        rating: 5,
                        date: '15.03.2023',
                        project: 'Замена проводки в 3-комнатной квартире',
                        active: true,
                        order: 1
                    },
                    {
                        name: 'Игорь Семенов',
                        role: 'Директор офиса',
                        text: 'Делали электрику в новом офисе. Учли все пожелания по розеткам и освещению. Работали даже в выходные, чтобы успеть к открытию.',
                        rating: 5,
                        date: '22.11.2022',
                        project: 'Электромонтаж в офисе 120 м²',
                        active: true,
                        order: 2
                    },
                    {
                        name: 'Мария Козлова',
                        role: 'Владелец коттеджа',
                        text: 'Полный монтаж электрики в доме 150 м². Сделали все от щитка до розеток. Отдельное спасибо за уличное освещение - очень красиво.',
                        rating: 4,
                        date: '08.06.2023',
                        project: 'Электрика в частном доме',
                        active: true,
                        order: 3
                    },
                    {
                        name: 'Сергей Иванов',
                        role: 'Владелец магазина',
                        text: 'Установили освещение витрин и систему резервного питания. Всё работает идеально, даже при отключениях электричества.',
                        rating: 5,
                        date: '30.01.2023',
                        project: 'Освещение торгового зала',
                        active: true,
                        order: 4
                    },
                    {
                        name: 'Ольга Смирнова',
                        role: 'Владелец ресторана',
                        text: 'Проектирование и монтаж декоративного освещения. Создали уникальную атмосферу. Клиенты отмечают уютную обстановку.',
                        rating: 4,
                        date: '14.09.2022',
                        project: 'Освещение в ресторане',
                        active: true,
                        order: 5
                    },
                    {
                        name: 'Дмитрий Волков',
                        role: 'Директор производства',
                        text: 'Монтаж промышленной электропроводки в цеху. Учтены все требования безопасности. Работа выполнена в срок.',
                        rating: 5,
                        date: '05.04.2023',
                        project: 'Промышленная электропроводка',
                        active: true,
                        order: 6
                    }
                ]
            });
        }

        res.json(content);
    } catch (error) {
        console.error('Error in getAboutContent:', error);
        res.status(500).json({ message: 'Ошибка при получении контента раздела О нас' });
    }
};

// Обновление контента
const updateAboutContent = async (req, res) => {
    try {
        const updates = req.body;

        const content = await AboutContent.findById(updates._id);

        if (!content) {
            return res.status(404).json({ message: 'Контент не найден' });
        }

        // Обновляем простые поля
        const simpleFields = [
            'sectionTitle', 'sectionSubtitle', 'greetingTitle',
            'greetingTagline', 'greetingText', 'specialistName'
        ];


        simpleFields.forEach(field => {
            if (updates[field] !== undefined) {
                content[field] = updates[field];
            }
        });

        // Обновляем статистику
        if (updates.stats) {
            content.stats = [];
            updates.stats.forEach(stat => {
                const { _id, ...statData } = stat;
                content.stats.push(statData);
            });
        }

        // Обновляем отзывы
        if (updates.testimonials) {
            content.testimonials = [];
            updates.testimonials.forEach(testimonial => {
                const { _id, ...testimonialData } = testimonial;
                content.testimonials.push(testimonialData);
            });
        }

        content.updatedAt = Date.now();
        await content.save({ versionKey: false });

        res.json(content);
    } catch (error) {
        console.error('Error in updateAboutContent:', error);
        res.status(500).json({ message: 'Ошибка при обновлении контента раздела О нас: ' + error.message });
    }
};

module.exports = {
    getAboutContent,
    updateAboutContent
};