const pool = require('../db');

const DetallePedido = {
  // Crear un nuevo detalle de pedido
  async create(id_pedido, id_producto, cantidad, precio_total) {
    const query = `
      INSERT INTO Detalle_Pedido (ID_Pedido, ID_Producto, Cantidad, Precio_Total)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [id_pedido, id_producto, cantidad, precio_total];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Obtener todos los detalles de un pedido
  async findByPedidoId(id_pedido) {
    const query = 'SELECT * FROM Detalle_Pedido WHERE ID_Pedido = $1;';
    const { rows } = await pool.query(query, [id_pedido]);
    return rows;
  },

  // Actualizar un detalle de pedido
  async update(id, id_pedido, id_producto, cantidad, precio_total) {
    const query = `
      UPDATE Detalle_Pedido
      SET ID_Pedido = $1, ID_Producto = $2, Cantidad = $3, Precio_Total = $4
      WHERE ID_Detalle = $5
      RETURNING *;
    `;
    const values = [id_pedido, id_producto, cantidad, precio_total, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Eliminar un detalle de pedido
  async delete(id) {
    const query = 'DELETE FROM Detalle_Pedido WHERE ID_Detalle = $1;';
    await pool.query(query, [id]);
  },
};

module.exports = DetallePedido;