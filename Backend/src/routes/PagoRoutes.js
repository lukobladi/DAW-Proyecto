const express = require('express');
const PagoController = require('../controllers/PagoController');
const authMiddleware = require('../middlewares/auth'); // Middleware de autenticación
const validators = require('../middlewares/validators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Endpoints para gestionar pagos
 */

/**
 * @swagger
 * /api/pagos/crear:
 *   post:
 *     summary: Crear un nuevo pago
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario_deudor:
 *                 type: integer
 *                 example: 1
 *               id_usuario_creditor:
 *                 type: integer
 *                 example: 2
 *               monto:
 *                 type: number
 *                 format: float
 *                 example: 100.50
 *               estado:
 *                 type: string
 *                 example: "pendiente"
 *     responses:
 *       201:
 *         description: Pago creado correctamente
 *       500:
 *         description: Error al crear el pago
 */
router.post('/crear/', authMiddleware, validators.crearPedido, PagoController.crear);

/**
 * @swagger
 * /api/pagos/obtenerTodos/:
 *   get:
 *     summary: Obtener todos los pagos
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pagos
 *       500:
 *         description: Error al obtener los pagos
 */
router.get('/obtenerTodos/', authMiddleware, PagoController.listar);

/**
 * @swagger
 * /api/pagos/pendientes-deudor/{id_usuario_deudor}:
 *   get:
 *     summary: Obtener todos los pagos pendientes de un usuario deudor
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_usuario_deudor
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario deudor
 *     responses:
 *       200:
 *         description: Lista de pagos pendientes del deudor
 *       500:
 *         description: Error al obtener los pagos
 */
router.get('/pendientes-deudor/:id_usuario_deudor', authMiddleware, PagoController.obtenerPendientesDeudor);

/**
 * @swagger
 * /api/pagos/pendientes-creditor/{id_usuario_creditor}:
 *   get:
 *     summary: Obtener todos los pagos pendientes de un usuario acreedor
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_usuario_creditor
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario acreedor
 *     responses:
 *       200:
 *         description: Lista de pagos pendientes del acreedor
 *       500:
 *         description: Error al obtener los pagos
 */
router.get('/pendientes-creditor/:id_usuario_creditor', authMiddleware, PagoController.obtenerPendientesCreditor);

/**
 * @swagger
 * /api/pagos/cambiar-estado/{id}:
 *   put:
 *     summary: Cambiar el estado de un pago
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 example: "completado"
 *     responses:
 *       200:
 *         description: Estado del pago actualizado correctamente
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error al cambiar el estado del pago
 */
router.put('/cambiar-estado/:id', authMiddleware, PagoController.cambiarEstado);

module.exports = router;