const express = require('express');
const router = express.Router();
const { login, verify } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/login', login);
router.get('/verify', authMiddleware, verify);

module.exports = router;