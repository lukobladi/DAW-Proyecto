// backend/routes/UsuarioProveedorRoutes.js
const express = require('express');
const UsuarioProveedorController = require('../controllers/UsuarioProveedorController');
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_usuario:
 *                   type: integer
 *                   example: 1
 *                 id_proveedor:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Error del servidor
 */
router.post('/crear', UsuarioProveedorController.crearRelacion);

/**
 * @swagger
 * /api/usuario-proveedor/obtenerProveedoresUsuario/{id_usuario}:
 *   get:
 *     summary: Obtener todas las relaciones de un usuario
 *     tags: [UsuarioProveedor]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_usuario:
 *                     type: integer
 *                     example: 1
 *                   id_proveedor:
 *                     type: integer
 *                     example: 1
 *       500:
 *         description: Error del servidor
 */
router.get('/obtenerProveedoresUsuario/:id_usuario', UsuarioProveedorController.obtenerRelacionesPorUsuario);

/**
 * @swagger
 * /api/usuario-proveedor/obtenerUsuariosProveedor/{id_proveedor}:
 *   get:
 *     summary: Obtener todas las relaciones de un proveedor
 *     tags: [UsuarioProveedor]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_usuario:
 *                     type: integer
 *                     example: 1
 *                   id_proveedor:
 *                     type: integer
 *                     example: 1
 *       500:
 *         description: Error del servidor
 */
router.get('/obtenerUsuariosProveedor/:id_proveedor', UsuarioProveedorController.obtenerRelacionesPorProveedor);

/**
 * @swagger
 * /api/usuario-proveedor:
 *   delete:
 *     summary: Eliminar una relación entre usuario y proveedor
 *     tags: [UsuarioProveedor]
 *     parameters:
 *       - in: query
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: id_proveedor
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Relación eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Relación eliminada correctamente"
 *       404:
 *         description: Relación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/', UsuarioProveedorController.eliminarRelacion);

module.exports = router;