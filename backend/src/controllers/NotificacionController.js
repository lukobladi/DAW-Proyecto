// Los controllers GEstiona logica de solicitud HTTP

const Notificacion = require('../models/Notificacion');
const Usuario = require('../models/Usuario');
const emailService = require('../services/emailService');
const logger = require('../config/logger');

const NotificacionController = {
  // Enviar notificación
  async enviar(req, res) {
    const { id_usuario, mensaje } = req.body;
    try {
      const nuevaNotificacion = await Notificacion.enviar(id_usuario, mensaje);

      if (mensaje.startsWith('[SOPORTE]')) {
        try {
          const usuario = await Usuario.findById(id_usuario);
          if (usuario && usuario.correo) {
            const adminEmails = await Usuario.findAdminEmails();
            if (adminEmails.length > 0) {
              const mensajeCompleto = `Consulta de soporte recibida:\n\nDe: ${usuario.nombre} (${usuario.correo})\n\n${mensaje}`;
              await emailService.enviarCorreoMultiple(
                adminEmails,
                'Nueva consulta de soporte - Ekonsumo',
                mensajeCompleto
              );
              logger.info(`Correo de soporte enviado a ${adminEmails.length} administradores`);
            }
          }
        } catch (emailError) {
          logger.error('Error al enviar correo de soporte:', emailError);
        }
      }

      res.status(201).json(nuevaNotificacion);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al enviar la notificacion');
    }
  },

  // Marcar una notificación como leída
  async marcarLeida(req, res) {
    const { id } = req.params;
    try {
      const notificacion = await Notificacion.marcarLeida(id);
      res.json(notificacion);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al marcar la notificación como leída');
    }
  },
};

module.exports = NotificacionController;
