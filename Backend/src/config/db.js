// db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'ekonsumo_user',
  password: process.env.DB_PASSWORD || '1234', // ⚠️ Solo para desarrollo
  database: process.env.DB_NAME || 'ekonsumo',

  max: 20, // máximo de conexiones en el pool
  idleTimeoutMillis: 30000, 
  connectionTimeoutMillis: 2000, 
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
  process.exit(-1);
});


module.exports = pool;