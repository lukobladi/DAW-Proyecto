const express = require('express');
const router = express.Router();
const UsuarioProveedorController = require('../controllers/UsuarioProveedorController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const validators = require('../middlewares/validators');
const validar = require('../middlewares/validar');

/**
 * @swagger
 * tags:
 *   name: Usuario-Proveedor
 *   description: Endpoints para gestionar la asignación de usuarios a proveedores
 */

/**
 * @swagger
 * /api/usuario-proveedor:
 *   get:
 *     summary: Obtener todas las asignaciones de usuarios a proveedores
 *     tags: [Usuario-Proveedor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asignaciones
 *       500:
 *         description: Error al obtener las asignaciones
 */
router.get('/', [auth, admin], UsuarioProveedorController.listar);

/**
 * @swagger
 * /api/usuario-proveedor/asignar:
 *   post:
 *     summary: Asignar un usuario a un proveedor
 *     tags: [Usuario-Proveedor]
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
 *               id_proveedor:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Asignación creada correctamente
 *       500:
 *         description: Error al crear la asignación
 */
router.post('/asignar', [auth, admin], validators.asignarUsuarioProveedor, validar, UsuarioProveedorController.asignar);

/**
 * @swagger
 * /api/usuario-proveedor/desasignar:
 *   post:
 *     summary: Desasignar un usuario de un proveedor
 *     tags: [Usuario-Proveedor]
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
 *               id_proveedor:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       204:
 *         description: Asignación eliminada correctamente
 *       500:
 *         description: Error al eliminar la asignación
 */
router.post('/desasignar', [auth, admin], validators.asignarUsuarioProveedor, validar, UsuarioProveedorController.desasignar);

module.exports = router;
