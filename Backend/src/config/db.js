// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  // user: process.env.DB_USER,
  // host: process.env.DB_HOST,
  // database: process.env.DB_NAME,
  // password: process.env.DB_PASSWORD,
  // port: process.env.DB_PORT,
  host: 'localhost',
  port: '5432',
  user: 'ekonsumo_user',
  password: '1234',
  database: 'ekonsumo'
});

module.exports = pool;