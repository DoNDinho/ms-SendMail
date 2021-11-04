const nodemailer = require('nodemailer');
const MAIL_HOST = process.env.MAIL_HOST;
const MAIL_PORT = process.env.MAIL_PORT;
const MAIL_SECURE = process.env.MAIL_SECURE;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

// Definimos el transporter
let transporter = nodemailer.createTransport({
	host: MAIL_HOST,
	port: MAIL_PORT,
	secure: MAIL_SECURE,
	auth: {
		user: MAIL_USER,
		pass: MAIL_PASSWORD
	}
});

module.exports = transporter;
