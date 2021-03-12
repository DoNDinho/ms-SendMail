'use strict';
const logger = require('../config/log4js_config');
const headerSchema = require('../schemas/header_schema');
const mailSchema = require('../schemas/mail_schema');
const fs = require('fs');
const path = require('path');
let transporter = require('../config/nodemailer_config');

class Mail {
    /**
     * @method
     * @description Valida el request de la solicitud
     * @param {object} headers Headers de la solicitud
     * @param {object} body Body de la solicitud
     * @param {object} res Objeto que contiene respuesta en caso de solicitud invalida
     */
    validarRequestSendMail(headers, body, res) {
        const Ajv = require('ajv');
        const ajv = new Ajv();
        let valid;

        return new Promise((resolve, reject) => {
            logger.info('Validando request de la solicitud');
            // Validando headers de la solicitud
            valid = ajv.validate(headerSchema, headers);
            if (!valid) {
                logger.error('Solicitud invalida - Headers invalidos!');
                return res.status(400).json({
                    code: '400',
                    message: `${ajv.errors[0].message}`
                });
            } else {
                // Validando body de la solicitud
                valid = ajv.validate(mailSchema, body);
                if (!valid) {
                    logger.error('Solicitud invalida - Body invalido!');
                    reject(
                        res.status(400).json({
                            code: '400',
                            message: `${ajv.errors[0].dataPath} - ${ajv.errors[0].message}`
                        })
                    );
                } else {
                    logger.info('Solicitud valida!');
                    resolve(body);
                }
            }
        });
    }

    /**
     * @method
     * @description Obtiene template de correo
     * @param {string} id_template ID del template de correo
     * @param {object} res Objeto respuesta si no existe template
     * @returns {string} Devuelve template de correo
     * @throws {templateNotExists} Template de correo no se encontro
     */
    obtenerTemplate(id_template, res) {
        try {
            logger.info('Obteniendo template de correo');

            let rutaTemplate = `/templates/${id_template}.html`;
            rutaTemplate = path.join(path.dirname(__dirname), rutaTemplate);
            let templateHtml = fs.readFileSync(rutaTemplate, 'utf-8');

            logger.info('Template de correo obtenido');
            return templateHtml;
        } catch (err) {
            logger.info('Template de correo no existe');

            let templateNotExists = res.status(422).json({
                code: err.code,
                message: 'Template de correo no existe'
            });

            throw templateNotExists;
        }
    }

    /**
     * @method
     * @description Llena los campos del template de correo con parametros
     * @param {Array} params Arreglo con parametros de correo
     * @param {string} templateHtml Template de correo
     * @returns {string} Devuelve template de correo con campos
     */
    llenarTemplate(params, templateHtml) {
        let templateMail = templateHtml;

        params.forEach((i) => {
            templateMail = templateMail.replace(`{{.${i.name}}}`, i.value);
        });

        return templateMail;
    }

    /**
     * @method
     * @description Envia correo a traves de servidor SMTP
     * @param {string} from_description Descripcion de correo remitente
     * @param {string} to Direccion de correo receptor
     * @param {string} subject Asunto de correo
     * @param {string} templateMail Template de correo a enviar
     * @returns {object} Devuelve objeto con respuesta final de microservicio
     */
    enviarCorreo(from_description, to, subject, templateMail, res) {
        // Definimos el email
        let mailOptions = {
            from: `${from_description} <${process.env.MAIL_USER}>`,
            to: to,
            subject: subject,
            html: templateMail
        };

        logger.info('Enviando correo a cliente');
        // Enviamos el email
        transporter.sendMail(mailOptions, function (error, success) {
            if (error) {
                logger.error('Error al enviar correo a cliente ', error);

                return res.status(422).json({
                    code: error.code,
                    message: error.message
                });
            } else {
                logger.info('Correo enviado exitosamente');

                return res.json({
                    data: {
                        response: success.response
                    }
                });
            }
        });
    }
}

module.exports = Mail;
