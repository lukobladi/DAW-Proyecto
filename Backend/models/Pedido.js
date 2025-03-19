const pool = require('../db');

const Pedido = {
  // Crear un nuevo pedido
  async create(fecha, id_usuario, estado) {
    const query = `
      INSERT INTO Pedido (Fecha, ID_Usuario, Estado)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [fecha, id_usuario, estado];
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
  async update(id, fecha, id_usuario, estado) {
    const query = `
      UPDATE Pedido
      SET Fecha = $1, ID_Usuario = $2, Estado = $3
      WHERE ID_Pedido = $4
      RETURNING *;
    `;
    const values = [fecha, id_usuario, estado, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Eliminar un pedido
  async delete(id) {
    const query = 'DELETE FROM Pedido WHERE ID_Pedido = $1;';
    await pool.query(query, [id]);
  },
};

module.exports = Pedido;