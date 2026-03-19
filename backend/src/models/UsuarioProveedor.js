// Model para la relacion usuario-proveedor
// Cada usuario gestiona un proveedor y cada proveedor tiene un usuario gestor

const pool = require('../config/db');

class UsuarioProveedor {
  // Crea la relacion usuario-proveedor (relacion 1:1)
  // Antes de crear borra relaciones anteriores para evitar duplicados
  static async crear({ id_usuario, id_proveedor }) {
    // Borrar relacion anterior del usuario si existe
    await pool.query('DELETE FROM usuario_proveedor WHERE id_usuario = $1', [
      id_usuario,
    ]);
    // Borrar relacion anterior del proveedor si existe
    await pool.query('DELETE FROM usuario_proveedor WHERE id_proveedor = $1', [
      id_proveedor,
    ]);

    const query = `
      INSERT INTO usuario_proveedor (id_usuario, id_proveedor)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [id_usuario, id_proveedor];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  // Obtiene todas las relaciones de un usuario
  static async obtenerPorUsuario(id_usuario) {
    const query = 'SELECT * FROM usuario_proveedor WHERE id_usuario = $1;';
    const { rows } = await pool.query(query, [id_usuario]);
    return rows;
  }

  // Obtiene todas las relaciones de un proveedor
  static async obtenerPorProveedor(id_proveedor) {
    const query = 'SELECT * FROM usuario_proveedor WHERE id_proveedor = $1;';
    const { rows } = await pool.query(query, [id_proveedor]);
    return rows;
  }

  // Elimina una relacion usuario-proveedor
  static async eliminar({ id_usuario, id_proveedor }) {
    const query =
      'DELETE FROM usuario_proveedor WHERE id_usuario = $1 AND id_proveedor = $2 RETURNING *;';
    const { rows } = await pool.query(query, [id_usuario, id_proveedor]);
    return rows[0];
  }
}

module.exports = UsuarioProveedor;
