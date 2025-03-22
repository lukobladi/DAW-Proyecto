const express = require('express');
const SaldoController = require('../controllers/SaldoController');

const router = express.Router();

router.get('/:id_usuario', SaldoController.calcularSaldo);

module.exports = router;
