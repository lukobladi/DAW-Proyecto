// Los models son para acceder a la base de datos

const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const Usuario = {
  // Verificar contrasena
  async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  },

  // Crear un nuevo usuario
  async create(nombre, correo, password, rol, movil, familia = null) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO usuario (nombre, correo, pass, rol, movil, familia, fecha_modificacion)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const values = [nombre, correo, hashedPassword, rol, movil, familia];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Activar o desactivar usuario
  async toggleActivation(id, activo) {
    const query = `
      UPDATE usuario
      SET activo = $2, fecha_modificacion = CURRENT_TIMESTAMP
      WHERE id_usuario = $1
      RETURNING *;
    `;
    const values = [id, activo];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Obtener un usuario por correo o movil
  async findByEmailOrMobile(correoOMovil) {
    const query = `
      SELECT * FROM usuario
      WHERE (correo = $1 OR movil = $1);
    `;
    const values = [correoOMovil];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Obtener todos los usuarios
  async findAll() {
    const query = 'SELECT * FROM usuario ORDER BY id_usuario;';
    const { rows } = await pool.query(query);
    return rows;
  },

  // Obtener un usuario por ID
  async findById(id) {
    const query = 'SELECT * FROM usuario WHERE id_usuario = $1;';
    const { rows } = await pool.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Actualizar un usuario
  async update(id, nombre, correo, rol, movil, familia = null) {
    const query = `
      UPDATE usuario
      SET nombre = $2, correo = $3, rol = $4, movil = $5, familia = $6, fecha_modificacion = CURRENT_TIMESTAMP
      WHERE id_usuario = $1
      RETURNING *;
    `;
    const values = [id, nombre, correo, rol, movil, familia];
    const { rows } = await pool.query(query, values);
    return rows.length > 0 ? rows[0] : null;
  },

  // Actualizar la contrasena de un usuario
  async updatePassword(id, nuevaPassword) {
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
    const query = `
      UPDATE usuario
      SET pass = $2, fecha_modificacion = CURRENT_TIMESTAMP
      WHERE id_usuario = $1
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id, hashedPassword]);
    return rows[0];
  },

  // Eliminar un usuario
  async delete(id) {
    const query = 'DELETE FROM usuario WHERE id_usuario = $1 RETURNING *;';
    const { rows } = await pool.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Calcular el saldo que debe un usuario
  async calcularSaldo(id_usuario) {
    const query = `
      SELECT SUM(monto) AS saldo
      FROM pago
      WHERE id_usuario_deudor = $1 AND estado = 'pendiente';
    `;
    const { rows } = await pool.query(query, [id_usuario]);
    return parseFloat(rows[0].saldo) || 0;
  },

  // Obtener los correos de los administradores
  async findAdminEmails() {
    const query =
      "SELECT correo FROM usuario WHERE rol = 'admin' AND activo = true;";
    const { rows } = await pool.query(query);
    return rows.map((row) => row.correo);
  },
};

module.exports = Usuario;

