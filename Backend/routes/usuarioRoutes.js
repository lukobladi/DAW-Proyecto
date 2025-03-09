const express = require('express');
const usuarioController = require('../controllers/usuarioController');

const router = express.Router();

// Registrar un nuevo usuario
router.post('/registrar', usuarioController.registrar);

// Autenticar un usuario (login)
router.post('/login', usuarioController.login);

// Obtener todos los usuarios
router.get('/', usuarioController.listar);

// Obtener un usuario por ID
router.get('/:id', usuarioController.obtenerPorId);

// Actualizar un usuario
router.put('/:id', usuarioController.actualizar);

// Eliminar un usuario
router.delete('/:id', usuarioController.eliminar);

module.exports = router;