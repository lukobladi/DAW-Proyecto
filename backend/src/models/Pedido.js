const pool = require('../config/db');

const Pedido = {
  // Crear un nuevo pedido
    async create(fecha_apertura, fecha_cierre, fecha_entrega, familia, id_proveedor, estado) {
      const query = `
        INSERT INTO Pedido (fecha_apertura, fecha_cierre, fecha_entrega, familia, id_proveedor, estado, fecha_modificacion)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        RETURNING *;
      `;
      const values = [fecha_apertura, fecha_cierre, fecha_entrega, familia, id_proveedor, estado];
      const { rows } = await pool.query(query, values);
      return rows[0];
    },

  // Obtener todos los pedidos
  async findAll() {
    const query = 'SELECT * FROM Pedido;';
    const { rows } = await pool.query(query);
    return rows;
  },

  // Obtener un pedido por ID
  async findById(id) {
    const query = 'SELECT * FROM Pedido WHERE id_pedido = $1;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Obtener pedidos por proveedor
  async findByProveedor(id_proveedor) {
    const query = 'SELECT * FROM Pedido WHERE id_proveedor = $1;';
    const { rows } = await pool.query(query, [id_proveedor]);
    return rows;
  },

  // Obtener pedidos por familia
  async findByFamilia(familia) {
    const query = 'SELECT * FROM Pedido WHERE familia = $1;';
    const { rows } = await pool.query(query, [familia]);
    return rows;
  },

  // Actualizar un pedido
  async update(id, fecha_apertura, fecha_cierre, fecha_entrega, familia, id_proveedor, estado) {
    const query = `
      UPDATE Pedido
      SET fecha_apertura = $1, fecha_cierre = $2, fecha_entrega = $3, familia = $4, id_proveedor = $5, estado = $6, fecha_modificacion = CURRENT_TIMESTAMP
      WHERE id_pedido = $7
      RETURNING *;
    `;
    const values = [fecha_apertura, fecha_cierre, fecha_entrega, familia, id_proveedor, estado, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Cambiar el estado de un pedido
  async changeStatus(id, estado) {
    const query = `
      UPDATE Pedido
      SET estado = $1, fecha_modificacion = CURRENT_TIMESTAMP
      WHERE id_pedido = $2
      RETURNING *;
    `;
    const values = [estado, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async updateEstado(id, estado) {
    return this.changeStatus(id, estado);
  },

  // Eliminar un pedido
  async delete(id) {
    const query = 'DELETE FROM Pedido WHERE id_pedido = $1;';
    await pool.query(query, [id]);
  },
};

module.exports = Pedido;
