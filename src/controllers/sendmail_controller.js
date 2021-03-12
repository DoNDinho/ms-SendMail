'use strict';
const logger = require('../config/log4js_config');
const Mail = require('../services/sendmail_service');

exports.mail = async (req, res) => {
    try {
        let transactionId = req.headers.transaction_id;
        logger.addContext('transaction_id', transactionId);
        let mail = new Mail();

        let headers = req.headers;
        let body = req.body;
        let id_template = body.data.id_template;
        let params = body.data.list_params.params;
        let from_description = body.data.email_info.from_description;
        let to = body.data.email_info.to;
        let subject = body.data.email_info.subject;

        try {
            await mail.validarRequestSendMail(headers, body, res);
            let templateHtml = mail.obtenerTemplate(id_template, res);

            let templateMail = mail.llenarTemplate(params, templateHtml);
            await mail.enviarCorreo(from_description, to, subject, templateMail, res);
        } catch (err) {
            // Devlueve objeto error
            return err;
        }
    } catch (err) {
        logger.error('Ha ocurrido un error en metodo Send Mail Controller: ', err);
        return res.status(500).json({
            code: '500',
            message: 'Internal Server Error'
        });
    }
};
