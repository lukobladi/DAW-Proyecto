// Servicio para enviar correos electronicos. Utiliza la libreria nodemailer con SMTP de AOL

const nodemailer = require('nodemailer');
const logger = require('../config/logger');

const emailService = {
  // Crea y retorna un transporter configurado para AOL SMTP
  _crearTransporter() {
    return nodemailer.createTransport({
      host: 'smtp.aol.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        ciphers: 'TLSv1.2',
        rejectUnauthorized: true,
      },
    });
  },

  // Enviar un correo a un solo destinatario
  async enviarCorreo(destinatario, asunto, mensaje) {
    logger.info(
      `Intentando enviar correo a: ${destinatario}, Asunto: ${asunto}`
    );
    try {
      const transporter = this._crearTransporter();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: destinatario,
        subject: asunto,
        text: mensaje,
      };

      await transporter.sendMail(mailOptions);
      logger.info(`Correo enviado correctamente a: ${destinatario}`);
    } catch (error) {
      logger.error(`Error al enviar correo a ${destinatario}:`, error);
      throw new Error('No se pudo enviar el correo');
    }
  },

  // Enviar un correo a varios destinatarios (copia oculta)
  async enviarCorreoMultiple(destinatarios, asunto, mensaje) {
    logger.info(
      `Intentando enviar correo a ${destinatarios.length} destinatarios, Asunto: ${asunto}`
    );
    try {
      const transporter = this._crearTransporter();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        bcc: destinatarios,
        subject: asunto,
        text: mensaje,
      };

      await transporter.sendMail(mailOptions);
      logger.info(
        `Correo enviado correctamente a ${destinatarios.length} destinatarios`
      );
    } catch (error) {
      logger.error(`Error al enviar correo masivo:`, error);
      throw new Error('No se pudo enviar el correo');
    }
  },
};

module.exports = emailService;
