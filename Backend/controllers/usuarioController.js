// controllers/usuarioController.js
const Usuario = require('../models/usuario');

const usuarioController = {
  async registrar(req, res) {
    const { nombre, correo, contraseña, rol } = req.body;
    try {
      const nuevoUsuario = await Usuario.create(nombre, correo, contraseña, rol);
      res.status(201).json(nuevoUsuario);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al registrar el usuario');
    }
  },

  async login(req, res) {
    const { correo, contraseña } = req.body;
    try {
      const usuario = await Usuario.findByEmail(correo);
      if (!usuario || usuario.contraseña !== contraseña) {
        return res.status(401).send('Credenciales incorrectas');
      }
      res.json(usuario);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al iniciar sesión');
    }
  },
};

module.exports = usuarioController;