const pool = require('../config/db');

const UsuarioProveedor = {
  async asignar(id_usuario, id_proveedor) {
    const query = `
      INSERT INTO usuario_proveedor (id_usuario, id_proveedor)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id_usuario, id_proveedor]);
    return rows[0];
  },

  async desasignar(id_usuario, id_proveedor) {
    const query = 'DELETE FROM usuario_proveedor WHERE id_usuario = $1 AND id_proveedor = $2;';
    await pool.query(query, [id_usuario, id_proveedor]);
  },

  async findAll() {
    const query = 'SELECT * FROM usuario_proveedor;';
    const { rows } = await pool.query(query);
    return rows;
  },

  async findProveedoresByUsuario(id_usuario) {
    const query = `
      SELECT p.* FROM Proveedor p
      JOIN usuario_proveedor up ON p.id_proveedor = up.id_proveedor
      WHERE up.id_usuario = $1;
    `;
    const { rows } = await pool.query(query, [id_usuario]);
    return rows;
  },

  async findUsuariosByProveedor(id_proveedor) {
    const query = 'SELECT id_usuario FROM usuario_proveedor WHERE id_proveedor = $1;';
    const { rows } = await pool.query(query, [id_proveedor]);
    return rows.map(r => r.id_usuario);
  },
};

module.exports = UsuarioProveedor;
