const db = require('../db');

class Saldo {
  static async calcularSaldo(id_usuario) {
    const query = `
      SELECT SUM(Monto) AS saldo
      FROM Pago
      WHERE ID_Usuario_Deudor = $1 AND Estado = 'pendiente';
    `;
    const { rows } = await db.query(query, [id_usuario]);
    return rows[0].saldo || 0;
  }
}

module.exports = Saldo;
