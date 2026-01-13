const express = require('express');
const UsuarioProveedorController = require('../controllers/UsuarioProveedorController');
const authMiddleware = require('../middlewares/auth'); // Middleware de autenticación

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: UsuarioProveedor
 *   description: Gestión de la relación entre usuarios y proveedores
 */

/**
 * @swagger
 * /api/usuario-proveedor/crear:
 *   post:
 *     summary: Crear una nueva relación entre usuario y proveedor
 *     tags: [UsuarioProveedor]
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
 *         description: Relación creada exitosamente
 *       500:
 *         description: Error del servidor
 */
router.post('/crear', authMiddleware, UsuarioProveedorController.crearRelacion);

/**
 * @swagger
 * /api/usuario-proveedor/obtenerProveedoresUsuario/{id_usuario}:
 *   get:
 *     summary: Obtener todas las relaciones de un usuario
 *     tags: [UsuarioProveedor]
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
 *         description: Lista de relaciones del usuario
 *       500:
 *         description: Error del servidor
 */
router.get('/obtenerProveedoresUsuario/:id_usuario', authMiddleware, UsuarioProveedorController.obtenerRelacionesPorUsuario);

/**
 * @swagger
 * /api/usuario-proveedor/obtenerUsuariosProveedor/{id_proveedor}:
 *   get:
 *     summary: Obtener todas las relaciones de un proveedor
 *     tags: [UsuarioProveedor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_proveedor
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de relaciones del proveedor
 *       500:
 *         description: Error del servidor
 */
router.get('/obtenerUsuariosProveedor/:id_proveedor', authMiddleware, UsuarioProveedorController.obtenerRelacionesPorProveedor);

/**
 * @swagger
 * /api/usuario-proveedor/eliminar/{id_usuario}/{id_proveedor}:
 *   delete:
 *     summary: Eliminar una relación entre usuario y proveedor
 *     tags: [UsuarioProveedor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: id_proveedor
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Relación eliminada exitosamente
 *       404:
 *         description: Relación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/eliminar/:id_usuario/:id_proveedor', authMiddleware, UsuarioProveedorController.eliminarRelacion);

module.exports = router;