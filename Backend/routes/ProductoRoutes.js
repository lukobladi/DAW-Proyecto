const express = require('express');
const ProductoController = require('../controllers/ProductoController');
const upload = require('../config/multer'); // Importa Multer

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Endpoints para gestionar productos
 */

/**
 * @swagger
 * /api/productos/crear:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Manzana"
 *               descripcion:
 *                 type: string
 *                 example: "Manzana roja orgánica"
 *               precio:
 *                 type: number
 *                 format: float
 *                 example: 1.50
 *               id_proveedor:
 *                 type: integer
 *                 example: 1
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_producto:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: "Manzana"
 *                 descripcion:
 *                   type: string
 *                   example: "Manzana roja orgánica"
 *                 precio:
 *                   type: number
 *                   format: float
 *                   example: 1.50
 *                 id_proveedor:
 *                   type: integer
 *                   example: 1
 *                 imagen:
 *                   type: string
 *                   example: "/uploads/imagen.jpg"
 *       500:
 *         description: Error al crear el producto
 */
router.post('/crear', upload.single('imagen'), ProductoController.crear);

/**
 * @swagger
 * /api/productos/obtenerTodos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_producto:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "Manzana"
 *                   descripcion:
 *                     type: string
 *                     example: "Manzana roja orgánica"
 *                   precio:
 *                     type: number
 *                     format: float
 *                     example: 1.50
 *                   id_proveedor:
 *                     type: integer
 *                     example: 1
 *                   imagen:
 *                     type: string
 *                     example: "/uploads/imagen.jpg"
 *       500:
 *         description: Error al obtener los productos
 */
router.get('/obtenerTodos', ProductoController.listar);

/**
 * @swagger
 * /api/productos/obtener/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_producto:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: "Manzana"
 *                 descripcion:
 *                   type: string
 *                   example: "Manzana roja orgánica"
 *                 precio:
 *                   type: number
 *                   format: float
 *                   example: 1.50
 *                 id_proveedor:
 *                   type: integer
 *                   example: 1
 *                 imagen:
 *                   type: string
 *                   example: "/uploads/imagen.jpg"
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al obtener el producto
 */
router.get('/obtener/:id', ProductoController.obtenerPorId);

/**
 * @swagger
 * /api/productos/actualizar/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Manzana Verde"
 *               descripcion:
 *                 type: string
 *                 example: "Manzana verde orgánica"
 *               precio:
 *                 type: number
 *                 format: float
 *                 example: 1.75
 *               id_proveedor:
 *                 type: integer
 *                 example: 1
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_producto:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: "Manzana Verde"
 *                 descripcion:
 *                   type: string
 *                   example: "Manzana verde orgánica"
 *                 precio:
 *                   type: number
 *                   format: float
 *                   example: 1.75
 *                 id_proveedor:
 *                   type: integer
 *                   example: 1
 *                 imagen:
 *                   type: string
 *                   example: "/uploads/imagen.jpg"
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al actualizar el producto
 */
router.put('/actualizar/:id', upload.single('imagen'), ProductoController.actualizar);

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       204:
 *         description: Producto eliminado correctamente
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al eliminar el producto
 */
router.delete('/eliminar/:id', ProductoController.eliminar);

module.exports = router;