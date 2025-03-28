const express = require('express');
const PagoController = require('../controllers/PagoController');
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_pago:
 *                   type: integer
 *                   example: 1
 *                 id_usuario_deudor:
 *                   type: integer
 *                   example: 1
 *                 id_usuario_creditor:
 *                   type: integer
 *                   example: 2
 *                 monto:
 *                   type: number
 *                   format: float
 *                   example: 100.50
 *                 estado:
 *                   type: string
 *                   example: "pendiente"
 *       500:
 *         description: Error al crear el pago
 */
router.post('/crear/', validators.crearPedido, PagoController.crear);

/**
 * @swagger
 * /api/pagos/obtenerTodos/:
 *   get:
 *     summary: Obtener todos los pagos
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Lista de pagos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_pago:
 *                     type: integer
 *                     example: 1
 *                   id_usuario_deudor:
 *                     type: integer
 *                     example: 1
 *                   id_usuario_creditor:
 *                     type: integer
 *                     example: 2
 *                   monto:
 *                     type: number
 *                     format: float
 *                     example: 100.50
 *                   estado:
 *                     type: string
 *                     example: "pendiente"
 *       500:
 *         description: Error al obtener los pagos
 */
router.get('/obtenerTodos/', PagoController.listar);

/**
 * @swagger
 * /api/pagos/pendientes-deudor/{id_usuario_deudor}:
 *   get:
 *     summary: Obtener todos los pagos pendientes de un usuario deudor
 *     tags: [Pagos]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_pago:
 *                     type: integer
 *                     example: 1
 *                   id_usuario_deudor:
 *                     type: integer
 *                     example: 1
 *                   id_usuario_creditor:
 *                     type: integer
 *                     example: 2
 *                   monto:
 *                     type: number
 *                     format: float
 *                     example: 100.50
 *                   estado:
 *                     type: string
 *                     example: "pendiente"
 *       500:
 *         description: Error al obtener los pagos
 */
router.get('/pendientes-deudor/:id_usuario_deudor', PagoController.obtenerPendientesDeudor);

/**
 * @swagger
 * /api/pagos/pendientes-creditor/{id_usuario_creditor}:
 *   get:
 *     summary: Obtener todos los pagos pendientes de un usuario acreedor
 *     tags: [Pagos]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_pago:
 *                     type: integer
 *                     example: 1
 *                   id_usuario_deudor:
 *                     type: integer
 *                     example: 1
 *                   id_usuario_creditor:
 *                     type: integer
 *                     example: 2
 *                   monto:
 *                     type: number
 *                     format: float
 *                     example: 100.50
 *                   estado:
 *                     type: string
 *                     example: "pendiente"
 *       500:
 *         description: Error al obtener los pagos
 */
router.get('/pendientes-creditor/:id_usuario_creditor', PagoController.obtenerPendientesCreditor);


/**
 * @swagger
 * /api/pagos/cambiar-estado/{id}:
 *   put:
 *     summary: Cambiar el estado de un pago
 *     tags: [Pagos]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_pago:
 *                   type: integer
 *                   example: 1
 *                 id_usuario_deudor:
 *                   type: integer
 *                   example: 1
 *                 id_usuario_creditor:
 *                   type: integer
 *                   example: 2
 *                 monto:
 *                   type: number
 *                   format: float
 *                   example: 100.50
 *                 estado:
 *                   type: string
 *                   example: "completado"
 *       404:
 *         description: Pago no encontrado
 *       500:
 *         description: Error al cambiar el estado del pago
 */
router.put('/cambiar-estado/:id', PagoController.cambiarEstado);

module.exports = router;