'use strict';
const express = require('express');
const router = express.Router();
const mailController = require('../controllers/sendmail_controller');

// Metodo para insertar usuario
router.post('/send/mail', mailController.mail);

module.exports = router;
