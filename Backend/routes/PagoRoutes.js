const express = require('express');
const PagoController = require('../controllers/PagoController');
const validators = require('../middlewares/validators');

const router = express.Router();

router.post('/', validators.crearPedido, PagoController.crear);
router.get('/', PagoController.listar);
router.put('/:id/cambiar-estado', PagoController.cambiarEstado);

module.exports = router;
