// Models para acceder a la base de datos

const pool = require('../config/db');

const Pedido = {
  // Crear un nuevo pedido
  async create(
    id_usuario_encargado,
    id_proveedor,
    fecha_apertura,
    fecha_cierre,
    fecha_entrega,
    estado
  ) {
    const query = `
        INSERT INTO pedido (id_usuario_encargado, id_proveedor, fecha_apertura, fecha_cierre, fecha_entrega, estado, fecha_modificacion)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        RETURNING *;
      `;
    const values = [
      id_usuario_encargado,
      id_proveedor,
      fecha_apertura,
      fecha_cierre,
      fecha_entrega,
      estado,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Obtener todos los pedidos
  async findAll() {
    const query = 'SELECT * FROM pedido;';
    const { rows } = await pool.query(query);
    return rows;
  },

  // Obtener un pedido por ID
  async findById(id) {
    const query = 'SELECT * FROM pedido WHERE id_pedido = $1;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Obtener pedidos por proveedor
  async findByProveedor(id_proveedor) {
    const query = 'SELECT * FROM pedido WHERE id_proveedor = $1;';
    const { rows } = await pool.query(query, [id_proveedor]);
    return rows;
  },

  // Actualizar un pedido
  async update(
    id,
    id_usuario_encargado,
    id_proveedor,
    fecha_apertura,
    fecha_cierre,
    fecha_entrega,
    estado
  ) {
    const query = `
      UPDATE pedido
      SET id_usuario_encargado = $2, id_proveedor = $3, fecha_apertura = $4, fecha_cierre = $5, fecha_entrega = $6, estado = $7, fecha_modificacion = CURRENT_TIMESTAMP
      WHERE id_pedido = $1
      RETURNING *;
    `;
    const values = [
      id,
      id_usuario_encargado,
      id_proveedor,
      fecha_apertura,
      fecha_cierre,
      fecha_entrega,
      estado,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Cambiar el estado de un pedido
  async changeStatus(id, estado) {
    const query = `
      UPDATE pedido
      SET estado = $1, fecha_modificacion = CURRENT_TIMESTAMP
      WHERE id_pedido = $2
      RETURNING *;
    `;
    const values = [estado, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Eliminar un pedido
  async delete(id) {
    const query = 'DELETE FROM pedido WHERE id_pedido = $1;';
    await pool.query(query, [id]);
  },
};

module.exports = Pedido;

