const nodemailer = require('nodemailer');
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

// Definimos el transporter
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD
    }
});

module.exports = transporter;
