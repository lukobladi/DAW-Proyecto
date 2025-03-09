const express = require('express');
const productoController = require('../controllers/productoController');

const router = express.Router();

// Crear un nuevo producto
router.post('/', productoController.crear);

// Obtener todos los productos
router.get('/', productoController.listar);

// Obtener un producto por ID
router.get('/:id', productoController.obtenerPorId);

// Actualizar un producto
router.put('/:id', productoController.actualizar);

// Eliminar un producto
router.delete('/:id', productoController.eliminar);

module.exports = router;