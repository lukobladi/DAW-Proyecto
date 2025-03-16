const express = require('express');
const DetallePedidoController = require('../controllers/DetallePedidoController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Detalle_Pedido
 *   description: Endpoints para gestionar los detalles de los pedidos
 */

/**
 * @swagger
 * /api/detalle-pedido:
 *   post:
 *     summary: Crear un nuevo detalle de pedido
 *     tags: [Detalle_Pedido]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_pedido:
 *                 type: integer
 *                 example: 1
 *               id_producto:
 *                 type: integer
 *                 example: 1
 *               cantidad:
 *                 type: integer
 *                 example: 2
 *               precio_total:
 *                 type: number
 *                 format: float
 *                 example: 20.50
 *     responses:
 *       201:
 *         description: Detalle de pedido creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_detalle:
 *                   type: integer
 *                   example: 1
 *                 id_pedido:
 *                   type: integer
 *                   example: 1
 *                 id_producto:
 *                   type: integer
 *                   example: 1
 *                 cantidad:
 *                   type: integer
 *                   example: 2
 *                 precio_total:
 *                   type: number
 *                   format: float
 *                   example: 20.50
 *       500:
 *         description: Error al crear el detalle de pedido
 */
router.post('/', DetallePedidoController.crear);

/**
 * @swagger
 * /api/detalle-pedido/pedido/{id_pedido}:
 *   get:
 *     summary: Obtener todos los detalles de un pedido
 *     tags: [Detalle_Pedido]
 *     parameters:
 *       - in: path
 *         name: id_pedido
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Lista de detalles del pedido
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_detalle:
 *                     type: integer
 *                     example: 1
 *                   id_pedido:
 *                     type: integer
 *                     example: 1
 *                   id_producto:
 *                     type: integer
 *                     example: 1
 *                   cantidad:
 *                     type: integer
 *                     example: 2
 *                   precio_total:
 *                     type: number
 *                     format: float
 *                     example: 20.50
 *       404:
 *         description: No se encontraron detalles para el pedido
 *       500:
 *         description: Error al obtener los detalles del pedido
 */
router.get('/pedido/:id_pedido', DetallePedidoController.listarPorPedido);

/**
 * @swagger
 * /api/detalle-pedido/{id}:
 *   put:
 *     summary: Actualizar un detalle de pedido
 *     tags: [Detalle_Pedido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle de pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_pedido:
 *                 type: integer
 *                 example: 1
 *               id_producto:
 *                 type: integer
 *                 example: 1
 *               cantidad:
 *                 type: integer
 *                 example: 3
 *               precio_total:
 *                 type: number
 *                 format: float
 *                 example: 30.75
 *     responses:
 *       200:
 *         description: Detalle de pedido actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_detalle:
 *                   type: integer
 *                   example: 1
 *                 id_pedido:
 *                   type: integer
 *                   example: 1
 *                 id_producto:
 *                   type: integer
 *                   example: 1
 *                 cantidad:
 *                   type: integer
 *                   example: 3
 *                 precio_total:
 *                   type: number
 *                   format: float
 *                   example: 30.75
 *       404:
 *         description: Detalle de pedido no encontrado
 *       500:
 *         description: Error al actualizar el detalle de pedido
 */
router.put('/:id', DetallePedidoController.actualizar);

/**
 * @swagger
 * /api/detalle-pedido/{id}:
 *   delete:
 *     summary: Eliminar un detalle de pedido
 *     tags: [Detalle_Pedido]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle de pedido
 *     responses:
 *       204:
 *         description: Detalle de pedido eliminado correctamente
 *       404:
 *         description: Detalle de pedido no encontrado
 *       500:
 *         description: Error al eliminar el detalle de pedido
 */
router.delete('/:id', DetallePedidoController.eliminar);

module.exports = router;