// models/usuario.js
const pool = require('../db');

const Usuario = {
  async create(nombre, correo, contraseña, rol) {
    const query = 'INSERT INTO Usuario (Nombre, Correo, Contraseña, Rol) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [nombre, correo, contraseña, rol];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async findByEmail(correo) {
    const query = 'SELECT * FROM Usuario WHERE Correo = $1';
    const { rows } = await pool.query(query, [correo]);
    return rows[0];
  },
};

module.exports = Usuario;