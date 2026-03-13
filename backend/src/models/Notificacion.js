// Model para las notificaciones de usuarios
// Guarda mensajes que se muestran en la app

const db = require('../config/db');

class Notificacion {
  // Envia una notificacion a un usuario
  static async enviar(id_usuario, mensaje) {
    const query = `
      INSERT INTO Notificacion (id_usuario, Mensaje)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const { rows } = await db.query(query, [id_usuario, mensaje]);
    return rows[0];
  }

  // Marca una notificacion como leida
  static async marcarLeida(id) {
    const query = `
      UPDATE Notificacion
      SET Leida = TRUE
      WHERE ID_Notificacion = $1
      RETURNING *;
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = Notificacion;
