// Models para acceder a la base de datos

const pool = require('../config/db');

const Pedido = {
  async create(
    id_proveedor,
    fecha_apertura,
    fecha_cierre,
    fecha_entrega,
    estado
  ) {
    const query = `
        INSERT INTO pedido (id_proveedor, fecha_apertura, fecha_cierre, fecha_entrega, estado, fecha_modificacion)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
        RETURNING *;
      `;
    const values = [
      id_proveedor,
      fecha_apertura,
      fecha_cierre,
      fecha_entrega,
      estado,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async findAll() {
    const query = 'SELECT * FROM pedido;';
    const { rows } = await pool.query(query);
    return rows;
  },

  async findById(id) {
    const query = 'SELECT * FROM pedido WHERE id_pedido = $1;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  async findByProveedor(id_proveedor) {
    const query = 'SELECT * FROM pedido WHERE id_proveedor = $1;';
    const { rows } = await pool.query(query, [id_proveedor]);
    return rows;
  },

  async update(
    id,
    id_proveedor,
    fecha_apertura,
    fecha_cierre,
    fecha_entrega,
    estado
  ) {
    const query = `
      UPDATE pedido
      SET id_proveedor = $2, fecha_apertura = $3, fecha_cierre = $4, fecha_entrega = $5, estado = $6, fecha_modificacion = CURRENT_TIMESTAMP
      WHERE id_pedido = $1
      RETURNING *;
    `;
    const values = [
      id,
      id_proveedor,
      fecha_apertura,
      fecha_cierre,
      fecha_entrega,
      estado,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

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

  async delete(id) {
    const query = 'DELETE FROM pedido WHERE id_pedido = $1;';
    await pool.query(query, [id]);
  },
};

module.exports = Pedido;

