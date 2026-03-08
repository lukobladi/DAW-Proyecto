const Usuario = require('../models/Usuario');
const emailService = require('../services/emailService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = process.env.JWT_SECRET; // Use the environment variable for the secret key

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
      const user = await Usuario.findByEmailOrMobile(correoOMovil);

      if (!user) {
        console.error('Fallo de login: Usuario no encontrado'); // Log depuracion
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }

      const validPassword = await bcrypt.compare(password, user.pass);
      if (!validPassword) {
        console.error('Fallo de login: Password invalido'); // Log depuracion
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }

      if (!user.activo) {
        console.error('Fallo de login: Usuario desactivado'); // Log depuracion
        return res.status(403).json({ message: 'Usuario desactivado. Contacta al administrador.' });
      }

      const token = jwt.sign(
        { id_usuario: user.id_usuario, rol: user.rol },
        SECRET_KEY, // Variasble global
        { expiresIn: '1h' }
      );

      console.log('Login correcto, token generado:', token); // Log depuracion

      res.status(200).json({
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
        movil: user.movil,
        token,
      });
    } catch (err) {
      console.error('Error en el login:', err.message); // Log depuracion
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  },

  // Activar o desactivar usuario
  async cambiarEstadoActivo(req, res) {
    const { id } = req.params;
    const { activo } = req.body; // booleano 
  
    try {
      const usuarioActualizado = await Usuario.toggleActivation(id, activo);
      if (!usuarioActualizado) {
        return res.status(404).send('Usuario no encontrado');
      }
      const estado = activo ? 'activado' : 'desactivado';
      res.json({ mensaje: `Usuario ${estado} correctamente`, usuario: usuarioActualizado });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al actualizar el estado del usuario');
    }
  },

  async recuperarPassword(req, res) {
    const { correoOMovil } = req.body;

    if (!correoOMovil) {
      return res.status(400).json({ error: 'Correo o móvil es requerido' });
    }

    try {
      console.log('try');
      const usuario = await Usuario.findByEmailOrMobile(correoOMovil);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      console.log('usuario ' + usuario);

      const enlaceRecuperacion = `${process.env.FRONTEND_URL}/recuperar-password/${usuario.id_usuario}`;

      console.log('enlaceRecuperacion ' + enlaceRecuperacion);

      const mensaje = `Hola ${usuario.nombre},\n\nHaz clic en el siguiente enlace para recuperar tu contraseña:\n\n${enlaceRecuperacion}\n\nSi no solicitaste esta acción, ignora este correo.`;

      console.log('mensaje ' + mensaje);


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
    const { nombre, correo, rol, movil } = req.body; // Excluye la contraseña
    try {
      const usuarioActualizado = await Usuario.update(id, nombre, correo, rol, movil);
      if (!usuarioActualizado) {
        return res.status(404).send('Usuario no encontrado');
      }
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

    // Calcular el saldo de un usuario
    async calcularSaldo(req, res) {
      const { id_usuario } = req.params;
      try {
        const saldo = await Usuario.calcularSaldo(id_usuario);
        res.json({ saldo });
      } catch (err) {
        console.error(err);
        res.status(500).send('Error al calcular el saldo');
      }
    },

};

module.exports = UsuarioController;