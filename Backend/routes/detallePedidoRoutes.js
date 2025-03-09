const express = require('express');
const detallePedidoController = require('../controllers/detallePedidoController');

const router = express.Router();

// Crear un nuevo detalle de pedido
router.post('/', detallePedidoController.crear);

// Obtener todos los detalles de un pedido
router.get('/pedido/:id_pedido', detallePedidoController.listarPorPedido);

// Actualizar un detalle de pedido
router.put('/:id', detallePedidoController.actualizar);

// Eliminar un detalle de pedido
router.delete('/:id', detallePedidoController.eliminar);

module.exports = router;