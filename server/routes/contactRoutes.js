const express = require('express');
const router = express.Router();
const { submitContactForm, getContacts } = require('../controllers/contactController');

router.route('/').post(submitContactForm).get(getContacts);

module.exports = router;