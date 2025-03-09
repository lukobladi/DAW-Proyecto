const express = require('express');
const proveedorController = require('../controllers/proveedorController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Proveedores
 *   description: Endpoints para gestionar proveedores
 */

/**
 * @swagger
 * /api/proveedores:
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
router.post('/', proveedorController.crear);

/**
 * @swagger
 * /api/proveedores:
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
router.get('/', proveedorController.listar);

/**
 * @swagger
 * /api/proveedores/{id}:
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
router.get('/:id', proveedorController.obtenerPorId);

/**
 * @swagger
 * /api/proveedores/{id}:
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
router.put('/:id', proveedorController.actualizar);

/**
 * @swagger
 * /api/proveedores/{id}:
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
router.delete('/:id', proveedorController.eliminar);

module.exports = router;