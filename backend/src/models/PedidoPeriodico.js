// Los models son para acceder a la base de datos

const pool = require('../config/db');

class PedidoPeriodico {
  // Crear un nuevo pedido periodico
  static async crear({
    id_proveedor,
    fecha_inicio,
    fecha_fin,
    activo,
    periodicidad,
    dia_apertura,
    dia_cierre,
    dia_entrega,
  }) {
    const query = `
      INSERT INTO Pedido_Periodico (id_proveedor, Fecha_Inicio, Fecha_Fin, Activo, Periodicidad, Dia_Apertura, Dia_Cierre, Dia_Entrega)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [
      id_proveedor,
      fecha_inicio,
      fecha_fin,
      activo,
      periodicidad,
      dia_apertura,
      dia_cierre,
      dia_entrega,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  // Obtener todos los pedidos periodicos
  static async obtenerTodos() {
    const query =
      'SELECT * FROM Pedido_Periodico ORDER BY ID_Pedido_Periodico;';
    const { rows } = await pool.query(query);
    return rows;
  }

  // Obtener pedidos periodicos por proveedor
  static async obtenerPorProveedor(id_proveedor) {
    const query = 'SELECT * FROM Pedido_Periodico WHERE id_proveedor = $1;';
    const { rows } = await pool.query(query, [id_proveedor]);
    return rows;
  }

  // Actualizar un pedido periodico
  static async actualizar(
    id,
    {
      id_proveedor,
      fecha_inicio,
      fecha_fin,
      activo,
      periodicidad,
      dia_apertura,
      dia_cierre,
      dia_entrega,
    }
  ) {
    const query = `
      UPDATE Pedido_Periodico
      SET id_proveedor = $1, Fecha_Inicio = $2, Fecha_Fin = $3, Activo = $4, Periodicidad = $5, Dia_Apertura = $6, Dia_Cierre = $7, Dia_Entrega = $8
      WHERE ID_Pedido_Periodico = $9
      RETURNING *;
    `;
    const values = [
      id_proveedor,
      fecha_inicio,
      fecha_fin,
      activo,
      periodicidad,
      dia_apertura,
      dia_cierre,
      dia_entrega,
      id,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  // Eliminar un pedido periodico
  static async eliminar(id) {
    const query =
      'DELETE FROM Pedido_Periodico WHERE ID_Pedido_Periodico = $1 RETURNING *;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  // Activar o desactivar un pedido periodico
  static async cambiarEstado(id, activo) {
    const query = `
      UPDATE Pedido_Periodico
      SET Activo = $1
      WHERE ID_Pedido_Periodico = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [activo, id]);
    return rows[0];
  }
}

module.exports = PedidoPeriodico;
