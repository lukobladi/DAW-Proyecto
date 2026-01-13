const db = require('../config/db');

class Notificacion {
  static async enviar(id_usuario, mensaje) {
    const query = `
      INSERT INTO Notificacion (ID_Usuario, Mensaje)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const { rows } = await db.query(query, [id_usuario, mensaje]);
    return rows[0];
  }

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
