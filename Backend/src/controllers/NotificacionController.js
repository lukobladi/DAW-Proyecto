const Notificacion = require('../models/Notificacion');

const NotificacionController = {
  // Enviar una notificación
  async enviar(req, res) {
    const { id_usuario, mensaje } = req.body;
    try {
      const nuevaNotificacion = await Notificacion.enviar(id_usuario, mensaje);
      res.status(201).json(nuevaNotificacion);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al enviar la notificación');
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
