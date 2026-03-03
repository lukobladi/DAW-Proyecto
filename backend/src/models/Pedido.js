const pool = require('../config/db');

const Pedido = {
  // Crear un nuevo pedido
    async create(fecha_apertura, fecha_cierre, fecha_entrega, id_usuario_encargado, id_proveedor, estado) {
      const query = `
        INSERT INTO Pedido (Fecha_Apertura, Fecha_Cierre, Fecha_Entrega, ID_Usuario_Encargado, ID_Proveedor, Estado, Fecha_Modificacion)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        RETURNING *;
      `;
      const values = [fecha_apertura, fecha_cierre, fecha_entrega, id_usuario_encargado, id_proveedor, estado];
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
    const query = 'SELECT * FROM Pedido WHERE ID_Pedido = $1;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Actualizar un pedido
  async update(id, fecha_apertura, fecha_cierre, fecha_entrega, id_usuario_encargado, id_proveedor, estado) {
    const query = `
      UPDATE Pedido
      SET Fecha_Apertura = $1, Fecha_Cierre = $2, Fecha_Entrega = $3, ID_Usuario_Encargado = $4, ID_Proveedor = $5, Estado = $6, Fecha_Modificacion = CURRENT_TIMESTAMP
      WHERE ID_Pedido = $7
      RETURNING *;
    `;
    const values = [fecha_apertura, fecha_cierre, fecha_entrega, id_usuario_encargado, id_proveedor, estado, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Cambiar el estado de un pedido
  async changeStatus(id, estado) {
    const query = `
      UPDATE Pedido
      SET Estado = $1, Fecha_Modificacion = CURRENT_TIMESTAMP
      WHERE ID_Pedido = $2
      RETURNING *;
    `;
    const values = [estado, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Eliminar un pedido
  // async delete(id) {
  //   const query = 'DELETE FROM Pedido WHERE ID_Pedido = $1;';
  //   await pool.query(query, [id]);
  // },
};

module.exports = Pedido;