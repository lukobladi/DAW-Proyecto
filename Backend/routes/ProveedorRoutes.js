const express = require('express');
const ProveedorController = require('../controllers/ProveedorController');

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_proveedor:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: "EcoFruits S.A."
 *                 contacto:
 *                   type: string
 *                   example: "Juan Pérez"
 *                 telefono:
 *                   type: string
 *                   example: "+34 123 456 789"
 *                 correo:
 *                   type: string
 *                   example: "info@ecofruits.com"
 *       500:
 *         description: Error al crear el proveedor
 */
router.post('/crear', ProveedorController.crear);

/**
 * @swagger
 * /api/proveedores/obtenerTodos:
 *   get:
 *     summary: Obtener todos los proveedores
 *     tags: [Proveedores]
 *     responses:
 *       200:
 *         description: Lista de proveedores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_proveedor:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "EcoFruits S.A."
 *                   contacto:
 *                     type: string
 *                     example: "Juan Pérez"
 *                   telefono:
 *                     type: string
 *                     example: "+34 123 456 789"
 *                   correo:
 *                     type: string
 *                     example: "info@ecofruits.com"
 *       500:
 *         description: Error al obtener los proveedores
 */
router.get('/obtenerTodos', ProveedorController.listar);

/**
 * @swagger
 * /api/proveedores/obtener/{id}:
 *   get:
 *     summary: Obtener un proveedor por ID
 *     tags: [Proveedores]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_proveedor:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: "EcoFruits S.A."
 *                 contacto:
 *                   type: string
 *                   example: "Juan Pérez"
 *                 telefono:
 *                   type: string
 *                   example: "+34 123 456 789"
 *                 correo:
 *                   type: string
 *                   example: "info@ecofruits.com"
 *       404:
 *         description: Proveedor no encontrado
 *       500:
 *         description: Error al obtener el proveedor
 */
router.get('/obtener/:id', ProveedorController.obtenerPorId);

/**
 * @swagger
 * /api/proveedores/actualizar/{id}:
 *   put:
 *     summary: Actualizar un proveedor
 *     tags: [Proveedores]
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
 *                 example: "EcoFruits España"
 *               contacto:
 *                 type: string
 *                 example: "Ana Gómez"
 *               telefono:
 *                 type: string
 *                 example: "+34 987 654 321"
 *               correo:
 *                 type: string
 *                 example: "contacto@ecofruits.es"
 *     responses:
 *       200:
 *         description: Proveedor actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_proveedor:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: "EcoFruits España"
 *                 contacto:
 *                   type: string
 *                   example: "Ana Gómez"
 *                 telefono:
 *                   type: string
 *                   example: "+34 987 654 321"
 *                 correo:
 *                   type: string
 *                   example: "contacto@ecofruits.es"
 *       404:
 *         description: Proveedor no encontrado
 *       500:
 *         description: Error al actualizar el proveedor
 */
router.put('/actualizar/:id', ProveedorController.actualizar);

/**
 * @swagger
 * /api/proveedores/eliminar/{id}:
 *   delete:
 *     summary: Eliminar un proveedor
 *     tags: [Proveedores]
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
router.delete('/eliminar/:id', ProveedorController.eliminar);

module.exports = router;