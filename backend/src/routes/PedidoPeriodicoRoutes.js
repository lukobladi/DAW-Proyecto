// Rutas para los pedidos periodicos

const express = require('express');
const PedidoPeriodicoController = require('../controllers/PedidoPeriodicoController');
const authMiddleware = require('../middlewares/auth'); 

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
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_proveedor:
 *                 type: integer
 *                 example: 1
 *               fecha_inicio:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-10-01T00:00:00Z"
 *               fecha_fin:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-31T23:59:59Z"
 *               activo:
 *                 type: boolean
 *                 example: true
 *               periodicidad:
 *                 type: integer
 *                 example: 30
 *               dia_apertura:
 *                 type: integer
 *                 example: 1
 *               dia_cierre:
 *                 type: integer
 *                 example: 15
 *               dia_entrega:
 *                 type: integer
 *                 example: 20
 *     responses:
 *       201:
 *         description: Pedido periódico creado exitosamente
 *       500:
 *         description: Error del servidor
 */
router.post(
  '/crear',
  authMiddleware,
  PedidoPeriodicoController.crearPedidoPeriodico
);

/**
 * @swagger
 * /api/pedido-periodico/obtenerTodos:
 *   get:
 *     summary: Obtener todos los pedidos periódicos
 *     tags: [PedidoPeriodico]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos periódicos
 *       500:
 *         description: Error del servidor
 */
router.get(
  '/obtenerTodos',
  authMiddleware,
  PedidoPeriodicoController.obtenerPedidosPeriodicos
);

/**
 * @swagger
 * /api/pedido-periodico/obtenerTodos/usuario/{id_usuario}:
 *   get:
 *     summary: Obtener pedidos periódicos de un usuario
 *     tags: [PedidoPeriodico]
 *     security:
 *       - bearerAuth: []
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
 *       500:
 *         description: Error del servidor
 */
router.get(
  '/obtenerTodos/usuario/:id_usuario',
  authMiddleware,
  PedidoPeriodicoController.obtenerPedidosPeriodicosPorUsuario
);

/**
 * @swagger
 * /api/pedido-periodico/actualizar/{id}:
 *   put:
 *     summary: Actualizar un pedido periódico
 *     tags: [PedidoPeriodico]
 *     security:
 *       - bearerAuth: []
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
 *               id_proveedor:
 *                 type: integer
 *                 example: 1
 *               fecha_inicio:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-10-01T00:00:00Z"
 *               fecha_fin:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-31T23:59:59Z"
 *               activo:
 *                 type: boolean
 *                 example: false
 *               periodicidad:
 *                 type: integer
 *                 example: 30
 *               dia_apertura:
 *                 type: integer
 *                 example: 1
 *               dia_cierre:
 *                 type: integer
 *                 example: 15
 *               dia_entrega:
 *                 type: integer
 *                 example: 20
 *     responses:
 *       200:
 *         description: Pedido periódico actualizado
 *       404:
 *         description: Pedido periódico no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put(
  '/actualizar/:id',
  authMiddleware,
  PedidoPeriodicoController.actualizarPedidoPeriodico
);

/**
 * @swagger
 * /api/pedido-periodico/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un pedido periódico
 *     tags: [PedidoPeriodico]
 *     security:
 *       - bearerAuth: []
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
 *       404:
 *         description: Pedido periódico no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete(
  '/eliminar/:id',
  authMiddleware,
  PedidoPeriodicoController.eliminarPedidoPeriodico
);

/**
 * @swagger
 * /api/pedido-periodico/cambiarEstadoActivo/{id}:
 *   patch:
 *     summary: Cambiar el estado activo de un pedido periódico
 *     tags: [PedidoPeriodico]
 *     security:
 *       - bearerAuth: []
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
 *               activo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Estado activo del pedido periódico actualizado
 *       404:
 *         description: Pedido periódico no encontrado
 *       500:
 *         description: Error del servidor
 */
router.patch(
  '/cambiarEstadoActivo/:id',
  authMiddleware,
  PedidoPeriodicoController.cambiarEstadoActivo
);

module.exports = router;
