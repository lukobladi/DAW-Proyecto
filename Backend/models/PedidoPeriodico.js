// backend/models/PedidoPeriodico.js
const pool = require('../config/db');

class PedidoPeriodico {
  static async crear({ id_usuario, id_producto, cantidad, fecha_fin, activo = true }) {
    const query = `
      INSERT INTO Pedido_Periodico (ID_Usuario, ID_Producto, Cantidad, Fecha_Fin, Activo)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [id_usuario, id_producto, cantidad, fecha_fin, activo];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async obtenerTodos() {
    const query = 'SELECT * FROM Pedido_Periodico;';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async obtenerPorUsuario(id_usuario) {
    const query = 'SELECT * FROM Pedido_Periodico WHERE ID_Usuario = $1;';
    const { rows } = await pool.query(query, [id_usuario]);
    return rows;
  }

  static async actualizar(id, { id_usuario, id_producto, cantidad, fecha_fin, activo }) {
    const query = `
      UPDATE Pedido_Periodico
      SET ID_Usuario = $1, ID_Producto = $2, Cantidad = $3, Fecha_Fin = $4, Activo = $5
      WHERE ID_Pedido_Periodico = $6
      RETURNING *;
    `;
    const values = [id_usuario, id_producto, cantidad, fecha_fin, activo, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async eliminar(id) {
    const query = 'DELETE FROM Pedido_Periodico WHERE ID_Pedido_Periodico = $1 RETURNING *;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = PedidoPeriodico;