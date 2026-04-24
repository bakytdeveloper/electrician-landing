const jwt = require('jsonwebtoken');

// Авторизация без базы — сверка с .env
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Сравниваем с данными из .env
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }

        // Генерация токена
        const token = jwt.sign(
            { email: process.env.ADMIN_EMAIL },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, message: 'Успешный вход' });
    } catch (error) {
        console.error('Ошибка авторизации:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Проверка токена
const verify = async (req, res) => {
    res.json({ valid: true });
};

module.exports = { login, verify };
