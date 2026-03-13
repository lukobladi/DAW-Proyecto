// Rutas de prueba para verificar que la API y la base de datos funcionan
// Solo para desarrollo y testing

const express = require('express');
const pool = require('../config/db');

const router = express.Router();

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Probar la API y la base de datos
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Conexión exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 dbStatus:
 *                   type: string
 *       500:
 *         description: Error en la conexión
 */
router.get('/', async (req, res) => {
  try {
    // Pruebo la conexion a la base de datos
    const dbResult = await pool.query('SELECT NOW()');
    res.status(200).json({
      message: 'API funcionando correctamente',
      dbStatus: 'Conexión a la base de datos exitosa',
      dbTime: dbResult.rows[0].now,
    });
  } catch (err) {
    console.error('Error en el endpoint de prueba:', err);
    res.status(500).json({
      message: 'Error en la API',
      dbStatus: 'Error al conectar con la base de datos',
      error: err.message,
    });
  }
});

module.exports = router;
