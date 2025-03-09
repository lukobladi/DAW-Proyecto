const Usuario = require('../models/usuario');

const usuarioController = {
  // Registrar un nuevo usuario
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

  // Autenticar un usuario (login)
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

  // Obtener todos los usuarios
  async listar(req, res) {
    try {
      const usuarios = await Usuario.findAll();
      res.json(usuarios);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener los usuarios');
    }
  },

  // Obtener un usuario por ID
  async obtenerPorId(req, res) {
    const { id } = req.params;
    try {
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        return res.status(404).send('Usuario no encontrado');
      }
      res.json(usuario);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener el usuario');
    }
  },

  // Actualizar un usuario
  async actualizar(req, res) {
    const { id } = req.params;
    const { nombre, correo, contraseña, rol } = req.body;
    try {
      const usuarioActualizado = await Usuario.update(id, nombre, correo, contraseña, rol);
      res.json(usuarioActualizado);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al actualizar el usuario');
    }
  },

  // Eliminar un usuario
  async eliminar(req, res) {
    const { id } = req.params;
    try {
      await Usuario.delete(id);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al eliminar el usuario');
    }
  },
};

module.exports = usuarioController;