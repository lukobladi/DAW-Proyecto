const request = require('supertest');
const pool = require('../db'); // Importa la conexión a la base de datos
const app = require('../index'); // Importa la app
const bcrypt = require('bcryptjs'); // Necesario para hashear passwords
const jwt = require('jsonwebtoken'); // Utilizar tokens JWT

let token; // Variable para almacenar el token de autenticación

/**
 * Configura un usuario administrador y obtiene un token de autenticación.
 */
async function getAuthToken() {
  if (token) return token; // Si ya existe un token, reutilízalo

  // Crear un usuario administrador para el login
  const hashedPassword = await bcrypt.hash('1234', 10); // Hash the password
  await pool.query(`
    INSERT INTO usuario (nombre, correo, pass, rol, movil)
    VALUES ('Admin Test', 'enekoloko7@hotmail.com', $1, 'admin', '123456789')
    ON CONFLICT (correo) DO NOTHING;
  `, [hashedPassword]); // Utilizar password hasheado

  // Obtener el token de autenticación
  const res = await request(app).post('/api/usuarios/login').send({
    correoOMovil: 'enekoloko7@hotmail.com',
    password: '1234', // Loguear con contraseña texto plano
  });

  console.log('Login response:', res.body); // Comprobar respuesta

  if (!res.body.token) {
    console.error('Login failed:', res.body); // Comprobar si falta token
    throw new Error('Token not generated during login');
  }

  token = res.body.token; // Guardar el token para usarlo en los demás tests
  return token;
}

module.exports = { getAuthToken };