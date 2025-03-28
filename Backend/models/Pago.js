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
      SELECT 
        p.ID_Pago,
        p.Monto,
        p.Estado,
        u_deudor.ID_Usuario AS ID_Usuario_Deudor,
        u_deudor.Nombre AS Nombre_Deudor,
        u_creditor.ID_Usuario AS ID_Usuario_Creditor,
        u_creditor.Nombre AS Nombre_Creditor
      FROM Pago p
      JOIN Usuario u_deudor ON p.ID_Usuario_Deudor = u_deudor.ID_Usuario
      JOIN Usuario u_creditor ON p.ID_Usuario_Creditor = u_creditor.ID_Usuario;
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

  static async findPendientesDeudor(id_usuario_deudor) {
    const query = `
      SELECT 
        p.ID_Pago,
        p.Monto,
        p.Estado,
        u_deudor.ID_Usuario AS ID_Usuario_Deudor,
        u_deudor.Nombre AS Nombre_Deudor,
        u_creditor.ID_Usuario AS ID_Usuario_Creditor,
        u_creditor.Nombre AS Nombre_Creditor
      FROM Pago p
      JOIN Usuario u_deudor ON p.ID_Usuario_Deudor = u_deudor.ID_Usuario
      JOIN Usuario u_creditor ON p.ID_Usuario_Creditor = u_creditor.ID_Usuario
      WHERE p.ID_Usuario_Deudor = $1 AND p.Estado = 'pendiente';
    `;
    const { rows } = await db.query(query, [id_usuario_deudor]);
    return rows;
  }

  static async findPendientesCreditor(id_usuario_creditor) {
    const query = `
      SELECT 
        p.ID_Pago,
        p.Monto,
        p.Estado,
        u_deudor.ID_Usuario AS ID_Usuario_Deudor,
        u_deudor.Nombre AS Nombre_Deudor,
        u_creditor.ID_Usuario AS ID_Usuario_Creditor,
        u_creditor.Nombre AS Nombre_Creditor
      FROM Pago p
      JOIN Usuario u_deudor ON p.ID_Usuario_Deudor = u_deudor.ID_Usuario
      JOIN Usuario u_creditor ON p.ID_Usuario_Creditor = u_creditor.ID_Usuario
      WHERE p.ID_Usuario_Creditor = $1 AND p.Estado = 'pendiente';
    `;
    const { rows } = await db.query(query, [id_usuario_creditor]);
    return rows;
  }
}

module.exports = Pago;