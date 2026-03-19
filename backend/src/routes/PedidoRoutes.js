// Rutas para la gestion de pedidos

const express = require('express');
const PedidoController = require('../controllers/PedidoController');
const authMiddleware = require('../middlewares/auth'); 
const adminMiddleware = require('../middlewares/admin'); 
const adminOrGestorMiddleware = require('../middlewares/adminOrGestor'); 

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Endpoints para gestionar pedidos
 */

/**
 * @swagger
 * /api/pedidos/crear:
 *   post:
 *     summary: Crear un nuevo pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_apertura:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-03-01T12:00:00Z"
 *               id_usuario_encargado:
 *                 type: integer
 *                 example: 1
 *               id_proveedor:
 *                 type: integer
 *                 example: 2
 *               estado:
 *                 type: string
 *                 example: "pendiente"
 *     responses:
 *       201:
 *         description: Pedido creado correctamente
 *       500:
 *         description: Error al crear el pedido
 */
router.post(
  '/crear',
  [authMiddleware, adminOrGestorMiddleware],
  PedidoController.crear
);

/**
 * @swagger
 * /api/pedidos/obtenerTodos:
 *   get:
 *     summary: Obtener todos los pedidos
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *       500:
 *         description: Error al obtener los pedidos
 */
router.get(
  '/obtenerTodos',
  authMiddleware,
  adminMiddleware,
  PedidoController.listar
);

/**
 * @swagger
 * /api/pedidos/misPedidos:
 *   get:
 *     summary: Obtener pedidos del proveedor asignado al usuario
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos del proveedor asignado
 *       403:
 *         description: No tienes ningún proveedor asignado
 *       500:
 *         description: Error al obtener los pedidos
 */
router.get(
  '/misPedidos',
  authMiddleware,
  PedidoController.listarPorProveedorAsignado
);

/**
 * @swagger
 * /api/pedidos/obtener/{id}:
 *   get:
 *     summary: Obtener un pedido por ID
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error al obtener el pedido
 */
router.get('/obtener/:id', authMiddleware, PedidoController.obtenerPorId);

/**
 * @swagger
 * /api/pedidos/actualizar/{id}:
 *   put:
 *     summary: Actualizar un pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_apertura:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-03-01T12:00:00Z"
 *               id_usuario_encargado:
 *                 type: integer
 *                 example: 1
 *               id_proveedor:
 *                 type: integer
 *                 example: 2
 *               estado:
 *                 type: string
 *                 example: "en proceso"
 *     responses:
 *       200:
 *         description: Pedido actualizado correctamente
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error al actualizar el pedido
 */
router.put('/actualizar/:id', authMiddleware, PedidoController.actualizar);

/**
 * @swagger
 * /api/pedidos/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido
 *     responses:
 *       204:
 *         description: Pedido eliminado correctamente
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error al eliminar el pedido
 */
router.delete('/eliminar/:id', authMiddleware, PedidoController.eliminar);

/**
 * @swagger
 * /api/pedidos/cambiarEstado/{id}:
 *   patch:
 *     summary: Cambiar el estado de un pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, en proceso, entregado, repartido, cancelado]
 *                 example: "en proceso"
 *     responses:
 *       200:
 *         description: Estado del pedido actualizado correctamente
 *       400:
 *         description: Estado no válido
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error al cambiar el estado del pedido
 */
router.patch(
  '/cambiarEstado/:id',
  authMiddleware,
  PedidoController.cambiarEstado
);

module.exports = router;
