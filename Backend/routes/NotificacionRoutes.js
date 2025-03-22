const express = require('express');
const NotificacionController = require('../controllers/NotificacionController');

const router = express.Router();

router.post('/', NotificacionController.enviar);
router.put('/:id/marcar-leida', NotificacionController.marcarLeida);

module.exports = router;
