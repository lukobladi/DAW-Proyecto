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
      INSERT INTO Usuario (nombre, correo, pass, rol, movil, familia)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [nombre, correo, hashedPassword, rol, movil, familia];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Activar o desactivar usuario
  async toggleActivation(id, activo) {
    const query = `
      UPDATE Usuario
      SET Activo = $2
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
      SELECT * FROM Usuario
      WHERE (Correo = $1 OR Movil = $1);
    `;
    const values = [correoOMovil];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Obtener todos los usuarios
  async findAll() {
    const query = `
      SELECT DISTINCT ON (u.id_usuario) u.*, 
             p.id_proveedor as proveedor_id, 
             p.nombre as proveedor_nombre
      FROM Usuario u
      LEFT JOIN Proveedor p ON u.familia = p.familia
      ORDER BY u.id_usuario;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  // Obtener un usuario por ID
  async findById(id) {
    const query = 'SELECT * FROM Usuario WHERE id_usuario = $1;';
    const { rows } = await pool.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Actualizar un usuario
  async update(id, nombre, correo, rol, movil, familia = null) {
    const query = `
      UPDATE Usuario
      SET nombre = $2, correo = $3, rol = $4, movil = $5, familia = $6
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
      UPDATE Usuario
      SET Pass = $2
      WHERE id_usuario = $1
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id, hashedPassword]);
    return rows[0];
  },

  // Eliminar un usuario
  async delete(id) {
    const query = 'DELETE FROM Usuario WHERE id_usuario = $1 RETURNING *;';
    const { rows } = await pool.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Calcular el saldo que debe un usuario
  async calcularSaldo(id_usuario) {
    const query = `
      SELECT SUM(Monto) AS saldo
      FROM Pago
      WHERE id_usuario_Deudor = $1 AND Estado = 'pendiente';
    `;
    const { rows } = await pool.query(query, [id_usuario]);
    return parseFloat(rows[0].saldo) || 0;
  },

  // Obtener los correos de los administradores
  async findAdminEmails() {
    const query =
      'SELECT correo FROM Usuario WHERE rol = $1 AND activo = true;';
    const { rows } = await pool.query(query, ['admin']);
    return rows.map((row) => row.correo);
  },
};

module.exports = Usuario;
