const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const emailService = {
  async enviarCorreo(destinatario, asunto, mensaje) {
    logger.info(`Intentando enviar correo a: ${destinatario}, Asunto: ${asunto}`);
    try {
      // Configuracion transporte de correo
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
          clientId: process.env.OAUTH_CLIENTID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN
        }

      });

      // Configuracion correo
      const mailOptions = {
        from: 'emartinmon6@educacion.navarra.es',
        to: destinatario,
        subject: asunto,
        text: mensaje,
      };

      // Enviar el correo
      await transporter.sendMail(mailOptions);
      logger.info(`Correo enviado correctamente a: ${destinatario}`);
    } catch (error) {
      logger.error(`Error al enviar correo a ${destinatario}:`, error);
      throw new Error('No se pudo enviar el correo');
    }
  },
};

module.exports = emailService;