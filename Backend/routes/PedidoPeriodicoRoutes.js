// backend/routes/PedidoPeriodicoRoutes.js
const express = require('express');
const PedidoPeriodicoController = require('../controllers/PedidoPeriodicoController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: PedidoPeriodico
 *   description: Gestión de pedidos periódicos
 */

/**
 * @swagger
 * /api/pedido-periodico/crear:
 *   post:
 *     summary: Crear un nuevo pedido periódico
 *     tags: [PedidoPeriodico]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 example: 1
 *               id_producto:
 *                 type: integer
 *                 example: 1
 *               cantidad:
 *                 type: integer
 *                 example: 5
 *               fecha_fin:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-31T23:59:59Z"
 *               activo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Pedido periódico creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_pedido_periodico:
 *                   type: integer
 *                   example: 1
 *                 id_usuario:
 *                   type: integer
 *                   example: 1
 *                 id_producto:
 *                   type: integer
 *                   example: 1
 *                 cantidad:
 *                   type: integer
 *                   example: 5
 *                 fecha_inicio:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-10-01T00:00:00Z"
 *                 fecha_fin:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-12-31T23:59:59Z"
 *                 activo:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Error del servidor
 */
router.post('/crear', PedidoPeriodicoController.crearPedidoPeriodico);

/**
 * @swagger
 * /api/pedido-periodico/obtenerTodos:
 *   get:
 *     summary: Obtener todos los pedidos periódicos
 *     tags: [PedidoPeriodico]
 *     responses:
 *       200:
 *         description: Lista de pedidos periódicos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_pedido_periodico:
 *                     type: integer
 *                     example: 1
 *                   id_usuario:
 *                     type: integer
 *                     example: 1
 *                   id_producto:
 *                     type: integer
 *                     example: 1
 *                   cantidad:
 *                     type: integer
 *                     example: 5
 *                   fecha_inicio:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-10-01T00:00:00Z"
 *                   fecha_fin:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-12-31T23:59:59Z"
 *                   activo:
 *                     type: boolean
 *                     example: true
 *       500:
 *         description: Error del servidor
 */
router.get('/obtenerTodos', PedidoPeriodicoController.obtenerPedidosPeriodicos);

/**
 * @swagger
 * /api/pedido-periodico/obtenerTodos/usuario/{id_usuario}:
 *   get:
 *     summary: Obtener pedidos periódicos de un usuario
 *     tags: [PedidoPeriodico]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de pedidos periódicos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_pedido_periodico:
 *                     type: integer
 *                     example: 1
 *                   id_usuario:
 *                     type: integer
 *                     example: 1
 *                   id_producto:
 *                     type: integer
 *                     example: 1
 *                   cantidad:
 *                     type: integer
 *                     example: 5
 *                   fecha_inicio:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-10-01T00:00:00Z"
 *                   fecha_fin:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-12-31T23:59:59Z"
 *                   activo:
 *                     type: boolean
 *                     example: true
 *       500:
 *         description: Error del servidor
 */
router.get('/obtenerTodos/usuario/:id_usuario', PedidoPeriodicoController.obtenerPedidosPeriodicosPorUsuario);

/**
 * @swagger
 * /api/pedido-periodico/actualizar/{id}:
 *   put:
 *     summary: Actualizar un pedido periódico
 *     tags: [PedidoPeriodico]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 example: 1
 *               id_producto:
 *                 type: integer
 *                 example: 1
 *               cantidad:
 *                 type: integer
 *                 example: 10
 *               fecha_fin:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-31T23:59:59Z"
 *               activo:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Pedido periódico actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_pedido_periodico:
 *                   type: integer
 *                   example: 1
 *                 id_usuario:
 *                   type: integer
 *                   example: 1
 *                 id_producto:
 *                   type: integer
 *                   example: 1
 *                 cantidad:
 *                   type: integer
 *                   example: 10
 *                 fecha_inicio:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-10-01T00:00:00Z"
 *                 fecha_fin:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-12-31T23:59:59Z"
 *                 activo:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: Pedido periódico no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/actualizar/:id', PedidoPeriodicoController.actualizarPedidoPeriodico);

/**
 * @swagger
 * /api/pedido-periodico/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un pedido periódico
 *     tags: [PedidoPeriodico]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Pedido periódico eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pedido periódico eliminado correctamente"
 *       404:
 *         description: Pedido periódico no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/eliminar/:id', PedidoPeriodicoController.eliminarPedidoPeriodico);

module.exports = router;