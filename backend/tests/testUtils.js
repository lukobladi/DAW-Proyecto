// Utils para los tests
// Funciones helper para configurar el entorno de pruebas

const request = require('supertest');
const pool = require('./src/config/db'); // Importa la conexion a la base de datos
const app = require('../index'); // Importa la app
const bcrypt = require('bcryptjs'); // Necesario para hashear passwords

let token; // Variable para guardar el token de autenticacion

/**
 * Configura un usuario administrador y obtiene un token de autenticacion.
 * Se usa para las pruebas que requieren permisos de admin.
 */
async function getAuthToken() {
  if (token) return token; // Si ya existe un token se reutiliza

  // Crear un usuario administrador para el login
  const hashedPassword = await bcrypt.hash('1234', 10); // Hash del password
  await pool.query(
    `
    INSERT INTO usuario (nombre, correo, pass, rol, movil)
    VALUES ('Admin Test', 'enekoloko7@hotmail.com', $1, 'admin', '123456789')
    ON CONFLICT (correo) DO NOTHING;
  `,
    [hashedPassword]
  ); // Usar el password hasheado

  // Obtener el token de autenticacion
  const res = await request(app).post('/api/usuarios/login').send({
    correoOMovil: 'enekoloko7@hotmail.com',
    password: '1234', // Password en texto plano
  });

  console.log('Respuesta de login:', res.body); // Comprobar la respuesta

  if (!res.body.token) {
    console.error('Fallo el login:', res.body); // Comprobar si falta el token
    throw new Error('No se genero el token durante el login');
  }

  token = res.body.token; // Guardar el token para usarlo en los demas tests
  return token;
}

module.exports = { getAuthToken };