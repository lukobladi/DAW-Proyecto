const express = require('express');
const SaldoController = require('../controllers/SaldoController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Saldos
 *   description: Endpoints para gestionar saldos
 */

/**
 * @swagger
 * /api/saldos/{id_usuario}:
 *   get:
 *     summary: Obtener el saldo de un usuario
 *     tags: [Saldos]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Saldo del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 saldo:
 *                   type: number
 *                   format: float
 *                   example: 150.75
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al calcular el saldo
 */
router.get('/:id_usuario', SaldoController.calcularSaldo);

module.exports = router;