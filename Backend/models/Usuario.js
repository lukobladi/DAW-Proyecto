const pool = require('../db');

const Usuario = {
  // Crear un nuevo usuario
  async create(nombre, correo, password, rol, movil) {
    const query = `
      INSERT INTO Usuario (Nombre, Correo, Pass, Rol, Movil)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [nombre, correo, password, rol, movil];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Obtener un usuario por correo o móvil
  async findByEmailOrMobile(correoOMovil) {
    const query = `
      SELECT * FROM Usuario
      WHERE Correo = $1 OR Movil = $1;
    `;
    const { rows } = await pool.query(query, [correoOMovil]);
    return rows[0];
  },

  // Obtener todos los usuarios
  async findAll() {
    const query = 'SELECT * FROM Usuario;';
    const { rows } = await pool.query(query);
    return rows;
  },

  // Obtener un usuario por ID
  async findById(id) {
    const query = 'SELECT * FROM Usuario WHERE ID_Usuario = $1;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Actualizar un usuario
  async updatePassword(id, nuevaPassword) {
    const query = `
      UPDATE Usuario
      SET Pass = $2
      WHERE ID_Usuario = $1
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id, nuevaPassword]);
    return rows[0];
  },

  // Eliminar un usuario
  async delete(id) {
    const query = 'DELETE FROM Usuario WHERE ID_Usuario = $1;';
    await pool.query(query, [id]);
  },
};

module.exports = Usuario;