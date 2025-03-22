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
 * /api/pagos:
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
router.post('/', validators.crearPedido, PagoController.crear);

/**
 * @swagger
 * /api/pagos:
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
router.get('/', PagoController.listar);

/**
 * @swagger
 * /api/pagos/{id}/cambiar-estado:
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
router.put('/:id/cambiar-estado', PagoController.cambiarEstado);

module.exports = router;