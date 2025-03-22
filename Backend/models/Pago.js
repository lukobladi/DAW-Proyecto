const db = require('../db');

class Pago {
  static async create(id_usuario_deudor, id_usuario_creditor, monto, estado) {
    const query = `
      INSERT INTO Pago (ID_Usuario_Deudor, ID_Usuario_Creditor, Monto, Estado)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [id_usuario_deudor, id_usuario_creditor, monto, estado];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async findAll() {
    const query = `
      SELECT * FROM Pago;
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  static async cambiarEstado(id, estado) {
    const query = `
      UPDATE Pago
      SET Estado = $1
      WHERE ID_Pago = $2
      RETURNING *;
    `;
    const { rows } = await db.query(query, [estado, id]);
    return rows[0];
  }
}

module.exports = Pago;
