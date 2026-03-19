const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const heroRoutes = require('./routes/heroRoutes');
const contactRoutes = require('./routes/contactRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const priceRoutes = require('./routes/priceRoutes');

const path = require('path');
const connectDB = require('./config/db');

// Загружаем переменные окружения
dotenv.config();

// Подключаемся к базе данных
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статическая раздача файлов из папки uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/price', priceRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/contact', contactRoutes);


app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});