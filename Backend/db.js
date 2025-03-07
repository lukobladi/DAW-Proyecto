// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: 'localhost',
  port: '5432',
  user: 'ekonsumo_user',
  password: '1234',
  database: 'ekonsumo',
});

module.exports = pool;