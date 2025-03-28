const bcrypt = require('bcryptjs'); // Reemplazar bcrypt con bcryptjs
const pool = require('../db');

const Usuario = {
  // Verificar contraseña
  async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword); // Compara la contraseña con el hash
  },

  // Crear un nuevo usuario
  async create(nombre, correo, password, rol, movil) {
    const hashedPassword = await bcrypt.hash(password, 10); // Genera el hash de la contraseña
    const query = `
      INSERT INTO Usuario (Nombre, Correo, Pass, Rol, Movil)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [nombre, correo, hashedPassword, rol, movil];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Activar o desarctivar usuario
  async toggleActivation(id, activo) {
    const query = `
      UPDATE Usuario
      SET Activo = $2
      WHERE ID_Usuario = $1
      RETURNING *;
    `;
    const values = [id, activo];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Obtener un usuario por correo o móvil
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
    const query = 'SELECT * FROM Usuario;';
    const { rows } = await pool.query(query);
    return rows;
  },

  // Obtener un usuario por ID
  async findById(id) {
    const query = 'SELECT * FROM Usuario WHERE ID_Usuario = $1;';
    const { rows } = await pool.query(query, [id]);
    return rows.length > 0 ? rows[0] : null; // Return null if no user is found
  },

  // Actualizar un usuario
  async update(id, nombre, correo, rol, movil) {
    const query = `
      UPDATE Usuario
      SET Nombre = $2, Correo = $3, Rol = $4, Movil = $5
      WHERE ID_Usuario = $1
      RETURNING *;
    `;
    const values = [id, nombre, correo, rol, movil];
    const { rows } = await pool.query(query, values);
    return rows.length > 0 ? rows[0] : null; // Return null if no user is updated
  },

  // Actualizar la contraseña de un usuario
  async updatePassword(id, nuevaPassword) {
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10); // Genera el hash de la nueva contraseña
    const query = `
      UPDATE Usuario
      SET Pass = $2
      WHERE ID_Usuario = $1
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id, hashedPassword]);
    return rows[0];
  },

  // Eliminar un usuario
  async delete(id) {
    const query = 'DELETE FROM Usuario WHERE ID_Usuario = $1 RETURNING *;';
    const { rows } = await pool.query(query, [id]);
    return rows.length > 0 ? rows[0] : null; // Return null if no user was deleted
  },

  async calcularSaldo(id_usuario) {
    const query = `
      SELECT SUM(Monto) AS saldo
      FROM Pago
      WHERE ID_Usuario_Deudor = $1 AND Estado = 'pendiente';
    `;
    const { rows } = await pool.query(query, [id_usuario]); // Cambiar db.query a pool.query
    return parseFloat(rows[0].saldo) || 0; // Convertir a número
  }
};

module.exports = Usuario;