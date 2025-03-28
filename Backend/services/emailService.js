const nodemailer = require('nodemailer');

const emailService = {
  async enviarCorreo(destinatario, asunto, mensaje) {
    console.log('enviarCorreo ');
    try {
      // Configurar el transporte de correo
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Cambia esto según tu proveedor de correo
        auth: {
          user: 'emartinmon6@educacion.navarra.es', // Tu correo
          pass: 'oirj btiv qobe tukr ', // Tu contraseña o app password
        },
      });

      // Configurar el correo
      const mailOptions = {
        from: 'emartinmon6@educacion.navarra.es',
        to: destinatario,
        subject: asunto,
        text: mensaje,
      };

      // Enviar el correo
      await transporter.sendMail(mailOptions);
      console.log(`Correo enviado a ${destinatario}`);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('No se pudo enviar el correo');
    }
  },
};

module.exports = emailService;