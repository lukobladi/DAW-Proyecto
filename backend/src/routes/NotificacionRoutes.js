// Rutas para las notificaciones.Enviar y marcar como leidas

const express = require('express');
const NotificacionController = require('../controllers/NotificacionController');
const authMiddleware = require('../middlewares/auth'); 

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notificaciones
 *   description: Endpoints para gestionar notificaciones
 */

/**
 * @swagger
 * /api/notificaciones/enviar:
 *   post:
 *     summary: Enviar una notificación
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
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
 *               mensaje:
 *                 type: string
 *                 example: "Tu pedido ha sido enviado"
 *     responses:
 *       201:
 *         description: Notificación enviada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_notificacion:
 *                   type: integer
 *                   example: 1
 *                 id_usuario:
 *                   type: integer
 *                   example: 1
 *                 mensaje:
 *                   type: string
 *                   example: "Tu pedido ha sido enviado"
 *                 fecha:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-10-01T12:00:00Z"
 *                 leida:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Error al enviar la notificación
 */
router.post('/enviar/', authMiddleware, NotificacionController.enviar);

/**
 * @swagger
 * /api/notificaciones/marcar-leida/{id}:
 *   put:
 *     summary: Marcar una notificación como leída
 *     tags: [Notificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Notificación marcada como leída
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_notificacion:
 *                   type: integer
 *                   example: 1
 *                 id_usuario:
 *                   type: integer
 *                   example: 1
 *                 mensaje:
 *                   type: string
 *                   example: "Tu pedido ha sido enviado"
 *                 fecha:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-10-01T12:00:00Z"
 *                 leida:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error al marcar la notificación como leída
 */
router.put(
  '/marcar-leida/:id',
  authMiddleware,
  NotificacionController.marcarLeida
);

module.exports = router;
