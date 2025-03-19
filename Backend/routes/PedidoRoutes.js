const express = require('express');
const PedidoController = require('../controllers/PedidoController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Endpoints para gestionar pedidos
 */

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Crear un nuevo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-10-01T12:00:00Z"
 *               id_usuario:
 *                 type: integer
 *                 example: 1
 *               estado:
 *                 type: string
 *                 example: "Pendiente"
 *     responses:
 *       201:
 *         description: Pedido creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_pedido:
 *                   type: integer
 *                   example: 1
 *                 fecha:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-10-01T12:00:00Z"
 *                 id_usuario:
 *                   type: integer
 *                   example: 1
 *                 estado:
 *                   type: string
 *                   example: "Pendiente"
 *       500:
 *         description: Error al crear el pedido
 */
router.post('/', PedidoController.crear);

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Obtener todos los pedidos
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_pedido:
 *                     type: integer
 *                     example: 1
 *                   fecha:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-10-01T12:00:00Z"
 *                   id_usuario:
 *                     type: integer
 *                     example: 1
 *                   estado:
 *                     type: string
 *                     example: "Pendiente"
 *       500:
 *         description: Error al obtener los pedidos
 */
router.get('/', PedidoController.listar);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   get:
 *     summary: Obtener un pedido por ID
 *     tags: [Pedidos]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_pedido:
 *                   type: integer
 *                   example: 1
 *                 fecha:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-10-01T12:00:00Z"
 *                 id_usuario:
 *                   type: integer
 *                   example: 1
 *                 estado:
 *                   type: string
 *                   example: "Pendiente"
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error al obtener el pedido
 */
router.get('/:id', PedidoController.obtenerPorId);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   put:
 *     summary: Actualizar un pedido
 *     tags: [Pedidos]
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
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-10-01T12:00:00Z"
 *               id_usuario:
 *                 type: integer
 *                 example: 1
 *               estado:
 *                 type: string
 *                 example: "Completado"
 *     responses:
 *       200:
 *         description: Pedido actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_pedido:
 *                   type: integer
 *                   example: 1
 *                 fecha:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-10-01T12:00:00Z"
 *                 id_usuario:
 *                   type: integer
 *                   example: 1
 *                 estado:
 *                   type: string
 *                   example: "Completado"
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error al actualizar el pedido
 */
router.put('/:id', PedidoController.actualizar);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   delete:
 *     summary: Eliminar un pedido
 *     tags: [Pedidos]
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
router.delete('/:id', PedidoController.eliminar);

module.exports = router;