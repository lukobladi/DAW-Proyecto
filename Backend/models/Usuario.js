const pool = require('../db');

const Usuario = {
  // Crear un nuevo usuario
  async create(nombre, correo, contraseña, rol) {
    const query = `
      INSERT INTO Usuario (Nombre, Correo, Contraseña, Rol)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [nombre, correo, contraseña, rol];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Obtener un usuario por correo
  async findByEmail(correo) {
    const query = 'SELECT * FROM Usuario WHERE Correo = $1;';
    const { rows } = await pool.query(query, [correo]);
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
  async update(id, nombre, correo, contraseña, rol) {
    const query = `
      UPDATE Usuario
      SET Nombre = $1, Correo = $2, Contraseña = $3, Rol = $4
      WHERE ID_Usuario = $5
      RETURNING *;
    `;
    const values = [nombre, correo, contraseña, rol, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Eliminar un usuario
  async delete(id) {
    const query = 'DELETE FROM Usuario WHERE ID_Usuario = $1;';
    await pool.query(query, [id]);
  },
};

module.exports = Usuario;