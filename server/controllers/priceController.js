const PriceContent = require('../models/PriceContent');

// Получение текущего контента
const getPriceContent = async (req, res) => {
    try {
        let content = await PriceContent.findOne();

        // Если контента нет, создаем с дефолтными значениями
        if (!content) {
            content = await PriceContent.create({
                modalTitle: 'Прайс-лист на электромонтажные работы',
                searchPlaceholder: 'Поиск по услугам или цене...',
                footerNote: '* Цены указаны ориентировочно. Точная стоимость зависит от сложности работ.',
                orderButtonText: 'Заказать расчет',
                sections: [
                    {
                        section: 'Подготовительные работы',
                        order: 1,
                        items: [
                            { name: 'Разметка трасс электропроводки', unit: 'объект', price: '5 000', order: 1 },
                            { name: 'Штробление стен под кабель', unit: 'м.п.', price: '1 200', order: 2 },
                            { name: 'Штробление под подрозетник', unit: 'шт.', price: '1 800', order: 3 },
                            { name: 'Сверление отверстий под подрозетник', unit: 'шт.', price: '1 200', order: 4 },
                            { name: 'Установка подрозетника', unit: 'шт', price: '900', order: 5 }
                        ]
                    },
                    {
                        section: 'Прокладка кабеля',
                        order: 2,
                        items: [
                            { name: 'Прокладка кабеля в штробе', unit: 'м.п.', price: '600', order: 1 },
                            { name: 'Прокладка кабеля в гофре', unit: 'м.п.', price: '500', order: 2 },
                            { name: 'Прокладка кабеля в кабель-канале', unit: 'м.п.', price: '500', order: 3 },
                            { name: 'Монтаж кабель-канала', unit: 'м.п.', price: '600', order: 4 },
                            { name: 'Прокладка интернет кабеля (LAN)', unit: 'м.п.', price: '400', order: 5 },
                            { name: 'Прокладка ТВ кабеля', unit: 'м.п.', price: '400', order: 6 }
                        ]
                    },
                    {
                        section: 'Установка розеток и выключателей',
                        order: 3,
                        items: [
                            { name: 'Установка розетки', unit: 'шт', price: '1 500', order: 1 },
                            { name: 'Установка двойной розетки', unit: 'шт', price: '2 000', order: 2 },
                            { name: 'Установка выключателя', unit: 'шт', price: '1 500', order: 3 },
                            { name: 'Установка проходного выключателя', unit: 'шт', price: '2 500', order: 4 },
                            { name: 'Монтаж интернет-розетки', unit: 'шт', price: '2 000', order: 5 },
                            { name: 'Монтаж ТВ-розетки', unit: 'шт', price: '2 000', order: 6 }
                        ]
                    },
                    {
                        section: 'Монтаж освещения',
                        order: 4,
                        items: [
                            { name: 'Монтаж точечного светильника', unit: 'шт.', price: '2 500', order: 1 },
                            { name: 'Установка люстры', unit: 'шт.', price: '4 000', order: 2 },
                            { name: 'Установка бра', unit: 'шт.', price: '3 000', order: 3 },
                            { name: 'Монтаж светодиодной ленты', unit: 'м.п.', price: '2 500', order: 4 },
                            { name: 'Монтаж уличного освещения', unit: 'шт.', price: '4 000', order: 5 }
                        ]
                    },
                    {
                        section: 'Электрощит и автоматика',
                        order: 5,
                        items: [
                            { name: 'Установка электрического щита', unit: 'шт.', price: '10 000', order: 1 },
                            { name: 'Монтаж автоматического выключателя', unit: 'шт.', price: '2 000', order: 2 },
                            { name: 'Установка УЗО', unit: 'шт.', price: '3 000', order: 3 },
                            { name: 'Монтаж дифавтомата', unit: 'шт.', price: '3 500', order: 4 },
                            { name: 'Сборка электрощита', unit: 'шт.', price: '15 000', order: 5 },
                            { name: 'Подключение счетчика', unit: 'шт.', price: '7 000', order: 6 }
                        ]
                    },
                    {
                        section: 'Подключение бытовой техники',
                        order: 6,
                        items: [
                            { name: 'Подключение варочной панели', unit: 'шт.', price: '5 000', order: 1 },
                            { name: 'Подключение духового шкафа', unit: 'шт.', price: '4 000', order: 2 },
                            { name: 'Подключение стиральной машины', unit: 'шт.', price: '3 000', order: 3 },
                            { name: 'Подключение посудомоечной машины', unit: 'шт.', price: '3 000', order: 4 },
                            { name: 'Подключение бойлера', unit: 'шт.', price: '4 000', order: 5 },
                            { name: 'Подключение кондиционера', unit: 'шт.', price: '6 000', order: 6 }
                        ]
                    },
                    {
                        section: 'Дополнительные работы',
                        order: 7,
                        items: [
                            { name: 'Перенос розетки', unit: 'шт', price: '3 000', order: 1 },
                            { name: 'Перенос выключателя', unit: 'шт', price: '3 000', order: 2 },
                            { name: 'Замена проводки', unit: 'м²', price: '4 500', order: 3 },
                            { name: 'Монтаж системы заземления', unit: 'точка', price: '15 000', order: 4 },
                            { name: 'Диагностика электропроводки', unit: 'объект', price: '10 000', order: 5 }
                        ]
                    },
                    {
                        section: 'Комплексные услуги',
                        order: 8,
                        items: [
                            { name: 'Электромонтаж квартиры', unit: 'м²', price: 'от 5 000', order: 1 },
                            { name: 'Электромонтаж частного дома', unit: 'м²', price: 'от 6 000', order: 2 },
                            { name: 'Электромонтаж офиса', unit: 'м²', price: 'от 4 500', order: 3 },
                            { name: 'Полная замена проводки', unit: 'м²', price: 'от 5 500', order: 4 }
                        ]
                    }
                ]
            });
        }

        res.json(content);
    } catch (error) {
        console.error('Error in getPriceContent:', error);
        res.status(500).json({ message: 'Ошибка при получении контента прайс-листа' });
    }
};

// Обновление контента
const updatePriceContent = async (req, res) => {
    try {
        const updates = req.body;
        console.log('Received updates:', updates);

        const content = await PriceContent.findById(updates._id);

        if (!content) {
            return res.status(404).json({ message: 'Контент не найден' });
        }

        // Обновляем простые поля
        const simpleFields = ['modalTitle', 'searchPlaceholder', 'footerNote', 'orderButtonText'];
        simpleFields.forEach(field => {
            if (updates[field] !== undefined) {
                content[field] = updates[field];
            }
        });

        // Обновляем секции
        if (updates.sections) {
            content.sections = [];
            updates.sections.forEach(section => {
                const { _id, ...sectionData } = section;
                if (sectionData.items) {
                    sectionData.items = sectionData.items.map(item => {
                        const { _id, ...itemData } = item;
                        return itemData;
                    });
                }
                content.sections.push(sectionData);
            });
        }

        content.updatedAt = Date.now();
        await content.save({ versionKey: false });

        res.json(content);
    } catch (error) {
        console.error('Error in updatePriceContent:', error);
        res.status(500).json({ message: 'Ошибка при обновлении контента прайс-листа: ' + error.message });
    }
};

module.exports = {
    getPriceContent,
    updatePriceContent
};