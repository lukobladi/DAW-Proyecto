const Usuario = require('../models/Usuario');
const emailService = require('../services/emailService');


const UsuarioController = {
  // Registrar un nuevo usuario
  async registrar(req, res) {
    const { nombre, correo, password, rol, movil } = req.body;
    try {
      const nuevoUsuario = await Usuario.create(nombre, correo, password, rol, movil);
      res.status(201).json(nuevoUsuario);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al registrar el usuario: ' + err);
    }
  },

  // Autenticar un usuario (login)
  async login(req, res) {
    const { correoOMovil, password } = req.body;
    try {
      const usuario = await Usuario.findByEmailOrMobile(correoOMovil);
      if (!usuario || usuario.password !== password) {
        return res.status(401).send('Credenciales incorrectas');
      }
      res.json({ token: 'fake-jwt-token', usuario });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al iniciar sesión');
    }
  },

  async recuperarPassword(req, res) {
    const { correoOMovil } = req.body;

    if (!correoOMovil) {
      return res.status(400).json({ error: 'Correo o móvil es requerido' });
    }

    try {
      const usuario = await Usuario.findByEmailOrMobile(correoOMovil);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const enlaceRecuperacion = `http://localhost:8080/recuperar-password/${usuario.id}`;
      const mensaje = `Hola ${usuario.nombre},\n\nHaz clic en el siguiente enlace para recuperar tu contraseña:\n\n${enlaceRecuperacion}\n\nSi no solicitaste esta acción, ignora este correo.`;

      await emailService.enviarCorreo(usuario.correo, 'Recuperación de Contraseña', mensaje);

      res.status(200).json({ mensaje: 'Enlace de recuperación enviado correctamente' });
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud' });
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
    const { nombre, correo, password, rol, movil } = req.body;
    try {
      const usuarioActualizado = await Usuario.update(id, nombre, correo, password, rol, movil);
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

module.exports = UsuarioController;