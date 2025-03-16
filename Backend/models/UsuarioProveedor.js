// backend/models/UsuarioProveedor.js
const pool = require('../config/db');

class UsuarioProveedor {
  static async crear({ id_usuario, id_proveedor }) {
    const query = `
      INSERT INTO Usuario_Proveedor (ID_Usuario, ID_Proveedor)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [id_usuario, id_proveedor];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async obtenerPorUsuario(id_usuario) {
    const query = 'SELECT * FROM Usuario_Proveedor WHERE ID_Usuario = $1;';
    const { rows } = await pool.query(query, [id_usuario]);
    return rows;
  }

  static async eliminar({ id_usuario, id_proveedor }) {
    const query = 'DELETE FROM Usuario_Proveedor WHERE ID_Usuario = $1 AND ID_Proveedor = $2 RETURNING *;';
    const { rows } = await pool.query(query, [id_usuario, id_proveedor]);
    return rows[0];
  }
}

module.exports = UsuarioProveedor;