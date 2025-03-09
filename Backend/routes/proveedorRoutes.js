const express = require('express');
const proveedorController = require('../controllers/proveedorController');

const router = express.Router();

// Crear un nuevo proveedor
router.post('/', proveedorController.crear);

// Obtener todos los proveedores
router.get('/', proveedorController.listar);

// Obtener un proveedor por ID
router.get('/:id', proveedorController.obtenerPorId);

// Actualizar un proveedor
router.put('/:id', proveedorController.actualizar);

// Eliminar un proveedor
router.delete('/:id', proveedorController.eliminar);

module.exports = router;