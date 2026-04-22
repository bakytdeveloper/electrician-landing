const express = require('express');
const authMiddleware = require("../middleware/auth");
const router = express.Router();
const {
    getContactConfig,
    updateContactConfig,
    getContactsList
} = require('../controllers/contactConfigController');

router.route('/config')
    .get(getContactConfig)
    .put(authMiddleware, updateContactConfig);

router.get('/submissions', authMiddleware, getContactsList);

module.exports = router;