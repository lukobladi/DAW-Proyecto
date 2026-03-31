// Rutas para la gestion de productos

const express = require('express');
const ProductoController = require('../controllers/ProductoController');
const authMiddleware = require('../middlewares/auth'); 
const adminMiddleware = require('../middlewares/admin'); 
const upload = require('../config/multer'); // Middleware para manejar archivos
const validators = require('../middlewares/validators');
const validar = require('../middlewares/validar');

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
 *     security:
 *       - bearerAuth: []
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
 *       500:
 *         description: Error al crear el producto
 */
const gestorMiddleware = require('../middlewares/gestor');

router.post(
  '/crear',
  [authMiddleware, gestorMiddleware],
  upload.single('imagen'),
  validators.crearProducto,
  validar,
  ProductoController.crear
);

/**
 * @swagger
 * /api/productos/obtenerTodos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos
 *       500:
 *         description: Error al obtener los productos
 */
router.get(
  '/obtenerTodos',
  authMiddleware,
  ProductoController.listar
);

/**
 * @swagger
 * /api/productos/misProductos:
 *   get:
 *     summary: Obtener productos del proveedor asignado al usuario
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos del proveedor asignado
 *       403:
 *         description: No tienes ningún proveedor asignado
 *       500:
 *         description: Error al obtener los productos
 */
router.get(
  '/misProductos',
  authMiddleware,
  ProductoController.listarMisProductos
);

/**
 * @swagger
 * /api/productos/obtener/{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
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
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al obtener el producto
 */
router.get('/obtener/:id', authMiddleware, validators.idParam, validar, ProductoController.obtenerPorId);

/**
 * @swagger
 * /api/productos/actualizar/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
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
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al actualizar el producto
 */
router.put(
  '/actualizar/:id',
  [authMiddleware, gestorMiddleware],
  upload.single('imagen'),
  validators.actualizarProducto,
  validar,
  ProductoController.actualizar
);
router.delete('/eliminar/:id', [authMiddleware, gestorMiddleware], validators.idParam, validar, ProductoController.eliminar);

/**
 * @swagger
 * /api/productos/cambiarEstadoActivo/{id}:
 *   patch:
 *     summary: Cambiar el estado activo de un producto
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               activo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Estado activo del producto actualizado correctamente
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al cambiar el estado activo del producto
 */
router.patch(
  '/cambiarEstadoActivo/:id',
  authMiddleware,
  ProductoController.cambiarEstadoActivo
);

module.exports = router;
