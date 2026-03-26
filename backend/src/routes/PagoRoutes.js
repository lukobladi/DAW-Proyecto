// Rutas para la gestion de pagos entre usuarios

const express = require('express');
const PagoController = require('../controllers/PagoController');
const authMiddleware = require('../middlewares/auth'); 
const adminMiddleware = require('../middlewares/admin');
const validators = require('../middlewares/validators');
const validar = require('../middlewares/validar');

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
router.post(
  '/crear/',
  authMiddleware,
  validators.crearPago,
  validar,
  PagoController.crear
);

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
 * /api/pagos/resumen-mensual:
 *   get:
 *     summary: Obtener resumen financiero mensual del usuario autenticado
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: periodo
 *         required: false
 *         schema:
 *           type: string
 *           example: 2026-03
 *         description: Mes en formato YYYY-MM. Si no se indica, usa el mes actual.
 *     responses:
 *       200:
 *         description: Resumen financiero mensual
 *       500:
 *         description: Error al obtener el resumen mensual
 */
router.get(
  '/resumen-mensual',
  authMiddleware,
  PagoController.obtenerResumenMensual
);

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
router.get(
  '/pendientes-deudor/:id_usuario_deudor',
  authMiddleware,
  PagoController.obtenerPendientesDeudor
);

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
router.get(
  '/pendientes-creditor/:id_usuario_creditor',
  authMiddleware,
  PagoController.obtenerPendientesCreditor
);

/**
 * @swagger
 * /api/pagos/{id}/marcar-pagado:
 *   patch:
 *     summary: El deudor marca que ha pagado (no cierra la deuda)
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pago marcado como enviado por deudor
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Pago no encontrado
 */
router.patch('/:id/marcar-pagado', authMiddleware, validators.idParam, validar, PagoController.marcarPagado);

/**
 * @swagger
 * /api/pagos/{id}/marcar-recibido:
 *   patch:
 *     summary: El acreedor confirma recibido y cierra la deuda
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pago confirmado como recibido
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Pago no encontrado
 */
router.patch(
  '/:id/marcar-recibido',
  authMiddleware,
  validators.idParam,
  validar,
  PagoController.marcarRecibido
);

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
router.put('/cambiar-estado/:id', authMiddleware, validators.marcarPago, validar, PagoController.cambiarEstado);

/**
 * @swagger
 * /api/pagos/generar-liquidacion-mensual:
 *   post:
 *     summary: Generar o actualizar la liquidación mensual (solo admin)
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               periodo:
 *                 type: string
 *                 example: 2026-03
 *     responses:
 *       200:
 *         description: Liquidación mensual generada
 *       403:
 *         description: Acceso denegado
 */
router.post(
  '/generar-liquidacion-mensual',
  authMiddleware,
  adminMiddleware,
  PagoController.generarLiquidacionMensual
);

module.exports = router;
