const express = require('express');
const router = express.Router();
const FamiliaProveedorController = require('../controllers/FamiliaProveedorController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const validators = require('../middlewares/validators');
const validar = require('../middlewares/validar');

/**
 * @swagger
 * tags:
 *   name: Familia-Proveedor
 *   description: Endpoints para gestionar la asignación de familias a proveedores
 */

/**
 * @swagger
 * /api/familia-proveedor:
 *   get:
 *     summary: Obtener todas las asignaciones de familias a proveedores
 *     tags: [Familia-Proveedor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asignaciones
 *       500:
 *         description: Error al obtener las asignaciones
 */
router.get('/', [auth, admin], FamiliaProveedorController.listar);

/**
 * @swagger
 * /api/familia-proveedor/asignar:
 *   post:
 *     summary: Asignar una familia a un proveedor
 *     tags: [Familia-Proveedor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_familia:
 *                 type: integer
 *                 example: 1
 *               id_proveedor:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Asignación creada correctamente
 *       500:
 *         description: Error al crear la asignación
 */
router.post('/asignar', [auth, admin], validators.asignarFamiliaProveedor, validar, FamiliaProveedorController.asignar);

/**
 * @swagger
 * /api/familia-proveedor/desasignar:
 *   post:
 *     summary: Desasignar una familia de un proveedor
 *     tags: [Familia-Proveedor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_familia:
 *                 type: integer
 *                 example: 1
 *               id_proveedor:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       204:
 *         description: Asignación eliminada correctamente
 *       500:
 *         description: Error al eliminar la asignación
 */
router.post('/desasignar', [auth, admin], validators.asignarFamiliaProveedor, validar, FamiliaProveedorController.desasignar);

module.exports = router;
