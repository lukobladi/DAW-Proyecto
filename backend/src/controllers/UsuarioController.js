// Los controllers GEstiona logica de solicitud HTTP

const Usuario = require('../models/Usuario');
const emailService = require('../services/emailService');
const logger = require('../config/logger');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = process.env.JWT_SECRET;

const UsuarioController = {
  async registrar(req, res) {
    const { nombre, correo, password, rol, movil, familia } = req.body;
    try {
      const nuevoUsuario = await Usuario.create(nombre, correo, password, rol, movil, familia);

      try {
        const adminEmails = await Usuario.findAdminEmails();
        logger.info(`Admins encontrados para notificar: ${adminEmails.length}`);
        
        if (adminEmails.length > 0) {
          const mensaje = `Se ha registrado un nuevo usuario en Ekonsumo:\n\nNombre: ${nombre}\nCorreo: ${correo}\nMovil: ${movil || 'No proporcionado'}\nFamilia: ${familia || 'No asignada'}\nRol: ${rol}\n\nPor favor, revisa el panel de administracion para activar el usuario si es necesario.`;
          await emailService.enviarCorreoMultiple(adminEmails, 'Nuevo usuario registrado en Ekonsumo', mensaje);
          logger.info('Notificacion de registro enviada a administradores');
        } else {
          logger.warn('No hay administradores activos para notificar');
        }
      } catch (emailError) {
        logger.error('Error al enviar notificacion a administradores:', emailError);
      }

      res.status(201).json(nuevoUsuario);
    } catch (err) {
      logger.error('Error al registrar usuario:', err);
      res.status(500).send('Error al registrar el usuario: ' + err);
    }
  },

  async login(req, res) {
    const { correoOMovil, password } = req.body;

    try {
      const user = await Usuario.findByEmailOrMobile(correoOMovil);

      if (!user) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }

      const validPassword = await bcrypt.compare(password, user.pass);
      if (!validPassword) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }

      if (!user.activo) {
        return res.status(403).json({ message: 'Usuario desactivado. Contacta al administrador.' });
      }

      const token = jwt.sign(
        { id_usuario: user.id_usuario, rol: user.rol },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
        movil: user.movil,
        token,
      });
    } catch (err) {
      logger.error('Error en el login:', err);
      res.status(500).json({ message: 'Error al iniciar sesion' });
    }
  },

  async cambiarEstadoActivo(req, res) {
    const { id } = req.params;
    const { activo } = req.body;
  
    try {
      const usuarioActualizado = await Usuario.toggleActivation(id, activo);
      if (!usuarioActualizado) {
        return res.status(404).send('Usuario no encontrado');
      }
      const estado = activo ? 'activado' : 'desactivado';
      res.json({ mensaje: `Usuario ${estado} correctamente`, usuario: usuarioActualizado });
    } catch (err) {
      logger.error('Error al cambiar estado activo:', err);
      res.status(500).send('Error al actualizar el estado del usuario');
    }
  },

  async recuperarPassword(req, res) {
    const { correoOMovil } = req.body;

    if (!correoOMovil) {
      return res.status(400).json({ error: 'Correo o movil es requerido' });
    }

    try {
      const usuario = await Usuario.findByEmailOrMobile(correoOMovil);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const enlaceRecuperacion = `${process.env.FRONTEND_URL}/recuperar-password/${usuario.id_usuario}`;

      const mensaje = `Hola ${usuario.nombre},\n\nHaz clic en el siguiente enlace para recuperar tu contrasena:\n\n${enlaceRecuperacion}\n\nSi no solicitaste esta accion, ignora este correo.`;

      await emailService.enviarCorreo(usuario.correo, 'Recuperacion de Contrasena', mensaje);

      res.status(200).json({ mensaje: 'Enlace de recuperacion enviado correctamente' });
    } catch (error) {
      logger.error('Error al procesar recuperacion de contrasena:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
  },

  async listar(req, res) {
    try {
      const usuarios = await Usuario.findAll();
      res.json(usuarios);
    } catch (err) {
      logger.error('Error al listar usuarios:', err);
      res.status(500).send('Error al obtener los usuarios');
    }
  },

  async obtenerPorId(req, res) {
    const { id } = req.params;
    try {
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        return res.status(404).send('Usuario no encontrado');
      }
      res.json(usuario);
    } catch (err) {
      logger.error('Error al obtener usuario por ID:', err);
      res.status(500).send('Error al obtener el usuario');
    }
  },

  async actualizar(req, res) {
    const { id } = req.params;
    const { nombre, correo, rol, movil, familia } = req.body;
    try {
      const usuarioActualizado = await Usuario.update(id, nombre, correo, rol, movil, familia);
      if (!usuarioActualizado) {
        return res.status(404).send('Usuario no encontrado');
      }
      res.json(usuarioActualizado);
    } catch (err) {
      logger.error('Error al actualizar usuario:', err);
      res.status(500).send('Error al actualizar el usuario');
    }
  },

  async eliminar(req, res) {
    const { id } = req.params;
    try {
      await Usuario.delete(id);
      res.status(204).send();
    } catch (err) {
      logger.error('Error al eliminar usuario:', err);
      res.status(500).send('Error al eliminar el usuario');
    }
  },

  async calcularSaldo(req, res) {
    const { id_usuario } = req.params;
    try {
      const saldo = await Usuario.calcularSaldo(id_usuario);
      res.json({ saldo });
    } catch (err) {
      logger.error('Error al calcular saldo:', err);
      res.status(500).send('Error al calcular el saldo');
    }
  },

};

module.exports = UsuarioController;