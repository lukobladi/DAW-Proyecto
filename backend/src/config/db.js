// Configuracion de la conexion a la base de datos PostgreSQL

// El pool de conexiones mantiene las conexiones abiertas evitando abrir una conexion por cada solicitud. 
const { Pool } = require('pg');

// Cargo las variables de entorno del fichero .env (excepto en tests)
require('dotenv').config({ quiet: process.env.NODE_ENV === 'test' });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  max: 20, // Maximo de conexiones en el pool
  idleTimeoutMillis: 30000, // Tiempo maximo de inactividad 30s
  connectionTimeoutMillis: 2000, // Tiempo maximo de espera para una conexion 2s
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
  process.exit(-1);
});

module.exports = pool;
