const express = require('express');
const pedidoController = require('../controllers/pedidoController');

const router = express.Router();

// Crear un nuevo pedido
router.post('/', pedidoController.crear);

// Obtener todos los pedidos
router.get('/', pedidoController.listar);

// Obtener un pedido por ID
router.get('/:id', pedidoController.obtenerPorId);

// Actualizar un pedido
router.put('/:id', pedidoController.actualizar);

// Eliminar un pedido
router.delete('/:id', pedidoController.eliminar);

module.exports = router;