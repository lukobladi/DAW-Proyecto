// Rutas para la gestion de proveedores

const express = require('express');
const ProveedorController = require('../controllers/ProveedorController');
const authMiddleware = require('../middlewares/auth'); 

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Proveedores
 *   description: Endpoints para gestionar proveedores
 */

/**
 * @swagger
 * /api/proveedores/crear:
 *   post:
 *     summary: Crear un nuevo proveedor
 *     tags: [Proveedores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "EcoFruits S.A."
 *               contacto:
 *                 type: string
 *                 example: "Juan Pérez"
 *               telefono:
 *                 type: string
 *                 example: "+34 123 456 789"
 *               correo:
 *                 type: string
 *                 example: "info@ecofruits.com"
 *     responses:
 *       201:
 *         description: Proveedor creado correctamente
 *       500:
 *         description: Error al crear el proveedor
 */
router.post('/crear', authMiddleware, ProveedorController.crear);

/**
 * @swagger
 * /api/proveedores/obtenerTodos:
 *   get:
 *     summary: Obtener todos los proveedores
 *     tags: [Proveedores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proveedores
 *       500:
 *         description: Error al obtener los proveedores
 */
router.get('/obtenerTodos', authMiddleware, ProveedorController.listar);

/**
 * @swagger
 * /api/proveedores/obtener/{id}:
 *   get:
 *     summary: Obtener un proveedor por ID
 *     tags: [Proveedores]
 *     security:
 *       - bearerAuth []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proveedor
 *     responses:
 *       200:
 *         description: Proveedor encontrado
 *       404:
 *         description: Proveedor no encontrado
 *       500:
 *         description: Error al obtener el proveedor
 */
router.get('/obtener/:id', authMiddleware, ProveedorController.obtenerPorId);

/**
 * @swagger
 * /api/proveedores/cambiarEstadoActivo/{id}:
 *   patch:
 *     summary: Cambiar el estado activo de un proveedor
 *     tags: [Proveedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proveedor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estadoActivo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Estado del proveedor actualizado correctamente
 *       404:
 *         description: Proveedor no encontrado
 *       500:
 *         description: Error al actualizar el estado del proveedor
 */
router.patch(
  '/cambiarEstadoActivo/:id',
  authMiddleware,
  ProveedorController.cambiarEstadoActivo
);

/**
 * @swagger
 * /api/proveedores/actualizar/{id}:
 *   patch:
 *     summary: Actualizar un proveedor
 *     tags: [Proveedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proveedor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "EcoFruits S.A. Updated"
 *               contacto:
 *                 type: string
 *                 example: "Jane Doe"
 *               telefono:
 *                 type: string
 *                 example: "+34 987 654 321"
 *               correo:
 *                 type: string
 *                 example: "contact@ecofruits-updated.com"
 *     responses:
 *       200:
 *         description: Proveedor actualizado correctamente
 *       404:
 *         description: Proveedor no encontrado
 *       500:
 *         description: Error al actualizar el proveedor
 */
router.patch('/actualizar/:id', authMiddleware, ProveedorController.actualizar);

/**
 * @swagger
 * /api/proveedores/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un proveedor
 *     tags: [Proveedores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proveedor
 *     responses:
 *       204:
 *         description: Proveedor eliminado correctamente
 *       404:
 *         description: Proveedor no encontrado
 *       500:
 *         description: Error al eliminar el proveedor
 */
router.delete('/eliminar/:id', authMiddleware, ProveedorController.eliminar);

module.exports = router;
