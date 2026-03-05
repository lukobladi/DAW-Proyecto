const pool = require('../config/db');

const DetallePedido = {
  // Crear un nuevo detalle de pedido
  async create(id_pedido, id_producto, cantidad, precio_unitario, id_usuario_comprador) {
    const query = `
      INSERT INTO Detalle_Pedido (ID_Pedido, ID_Producto, Cantidad, Precio_Unitario, ID_Usuario_Comprador, Fecha_Modificacion)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const values = [id_pedido, id_producto, cantidad, precio_unitario, id_usuario_comprador];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Obtener todos los detalles de un pedido
  async findByPedidoId(id_pedido) {
    const query = 'SELECT * FROM Detalle_Pedido WHERE ID_Pedido = $1;';
    const { rows } = await pool.query(query, [id_pedido]);
    return rows;
  },

  async findById(id) {
    const query = 'SELECT * FROM Detalle_Pedido WHERE ID_Detalle = $1;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Actualizar un detalle de pedido
  async update(id, id_pedido, id_producto, cantidad, precio_unitario, id_usuario_comprador) {
    const query = `
      UPDATE Detalle_Pedido
      SET ID_Pedido = $1, ID_Producto = $2, Cantidad = $3, Precio_Unitario = $4, ID_Usuario_Comprador = $5, Fecha_Modificacion = CURRENT_TIMESTAMP
      WHERE ID_Detalle = $6
      RETURNING *;
    `;
    const values = [id_pedido, id_producto, cantidad, precio_unitario, id_usuario_comprador, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async updateCantidad(id, cantidad) {
    const query = `
      UPDATE Detalle_Pedido
      SET Cantidad = $1, Fecha_Modificacion = CURRENT_TIMESTAMP
      WHERE ID_Detalle = $2
      RETURNING *;
    `;
    const values = [cantidad, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Eliminar un detalle de pedido. En vez de eliminar de la base de datos ponemos las unidades a 0. Así queda registro.
  async delete(id) {
    const query = `
      UPDATE Detalle_Pedido
      SET Cantidad = 0, Fecha_Modificacion = CURRENT_TIMESTAMP
      WHERE ID_Detalle = $1
      RETURNING *;
    `;
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
};

module.exports = DetallePedido;
