// Los models acceden a los datos de la BDD mediante SQLs

const pool = require('../config/db');

const DetallePedido = {
  // Crear un nuevo Detalle de pedido
  async create(
    id_pedido,
    id_producto,
    cantidad,
    precio_unitario,
    id_usuario_comprador
  ) {
    const query = `
      INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, id_usuario_comprador, fecha_modificacion)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const values = [
      id_pedido,
      id_producto,
      cantidad,
      precio_unitario,
      id_usuario_comprador,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Obtener todos los Detalles de un pedido
  async findByPedidoId(id_pedido) {
    const query = 'SELECT * FROM detalle_pedido WHERE id_pedido = $1;';
    const { rows } = await pool.query(query, [id_pedido]);
    return rows;
  },

  // Obtener un Detalle por ID
  async findById(id) {
    const query = 'SELECT * FROM detalle_pedido WHERE id_detalle = $1;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Actualizar un Detalle de pedido
  async update(
    id,
    id_pedido,
    id_producto,
    cantidad,
    precio_unitario,
    id_usuario_comprador
  ) {
    const query = `
      UPDATE detalle_pedido
      SET id_pedido = $1, id_producto = $2, cantidad = $3, precio_unitario = $4, id_usuario_comprador = $5, fecha_modificacion = CURRENT_TIMESTAMP
      WHERE id_detalle = $6
      RETURNING *;
    `;
    const values = [
      id_pedido,
      id_producto,
      cantidad,
      precio_unitario,
      id_usuario_comprador,
      id,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Actualizar solo la cantidad
  async updateCantidad(id, cantidad) {
    const query = `
      UPDATE detalle_pedido
      SET cantidad = $1, fecha_modificacion = CURRENT_TIMESTAMP
      WHERE id_detalle = $2
      RETURNING *;
    `;
    const values = [cantidad, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Eliminar un detalle. En vez de borrar ponemos cantidad a 0 para mantener el historial
  async delete(id) {
    const query = `
      UPDATE detalle_pedido
      SET cantidad = 0, fecha_modificacion = CURRENT_TIMESTAMP
      WHERE id_detalle = $1
      RETURNING *;
    `;
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
};

module.exports = DetallePedido;

