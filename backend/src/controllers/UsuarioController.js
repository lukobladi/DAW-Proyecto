// Los controllers GEstiona logica de solicitud HTTP

const Usuario = require('../models/Usuario');
const Proveedor = require('../models/Proveedor');
const emailService = require('../services/emailService');
const logger = require('../config/logger');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = process.env.JWT_SECRET;

const UsuarioController = {
  async registrar(req, res) {
    const { nombre, correo, password, rol, movil } = req.body;
    try {
      const nuevoUsuario = await Usuario.create(
        nombre,
        correo,
        password,
        rol,
        movil
      );

      try {
        const adminEmails = await Usuario.findAdminEmails();
        logger.info(`Admins encontrados para notificar: ${adminEmails.length}`);

        if (adminEmails.length > 0) {
          const mensaje = `Se ha registrado un nuevo usuario en Ekonsumo:\n\nNombre: ${nombre}\nCorreo: ${correo}\nMovil: ${movil || 'No proporcionado'}\nRol: ${rol}\n\nPor favor, revisa el panel de administracion para activar el usuario si es necesario.`;
          await emailService.enviarCorreoMultiple(
            adminEmails,
            'Nuevo usuario registrado en Ekonsumo',
            mensaje
          );
          logger.info('Notificacion de registro enviada a administradores');
        } else {
          logger.warn('No hay administradores activos para notificar');
        }
      } catch (emailError) {
        logger.error(
          'Error al enviar notificacion a administradores:',
          emailError
        );
      }

      res.status(201).json(nuevoUsuario);
    } catch (err) {
      logger.error('Error al registrar usuario:', err);
      res.status(500).send('Error al registrar el usuario: ' + err);
    }
  },

  async login(req, res) {
    const { correoOMovil, password } = req.body;

    logger.info(`Intento de login para: ${correoOMovil}`);

    try {
      const user = await Usuario.findByEmailOrMobile(correoOMovil);

      if (!user) {
        logger.warn(`Usuario no encontrado: ${correoOMovil}`);
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }

      const validPassword = await bcrypt.compare(password, user.pass);
      if (!validPassword) {
        logger.warn(`Password invalido para usuario: ${correoOMovil}`);
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }

      if (!user.activo) {
        logger.warn(`Usuario desactivado: ${correoOMovil}`);
        return res
          .status(403)
          .json({ message: 'Usuario desactivado. Contacta al administrador.' });
      }

      const token = jwt.sign(
        { id_usuario: user.id_usuario, rol: user.rol },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      let proveedor_gestionado = null;
      if (user.rol === 'gestor') {
        try {
          const proveedores = await Proveedor.findByUsuario(user.id_usuario);
          if (proveedores && proveedores.length > 0) {
            proveedor_gestionado = proveedores[0].nombre;
          }
        } catch (proveedorError) {
          logger.error('Error al buscar proveedor gestionado:', proveedorError);
        }
      }

      logger.info(`Login exitoso para usuario: ${correoOMovil}`);

      res.status(200).json({
        token,
        user: {
          id_usuario: user.id_usuario,
          nombre: user.nombre,
          correo: user.correo,
          rol: user.rol,
          movil: user.movil,
          proveedor_gestionado,
        },
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
      res.json({
        mensaje: `Usuario ${estado} correctamente`,
        usuario: usuarioActualizado,
      });
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

      const token = jwt.sign(
        { id_usuario: usuario.id_usuario, correo: usuario.correo },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      const enlaceRecuperacion = `${process.env.FRONTEND_URL}/recuperar-password/${token}`;

      const mensaje = `Hola ${usuario.nombre},\n\nHaz clic en el siguiente enlace para recuperar tu contrasena:\n\n${enlaceRecuperacion}\n\nEste enlace expira en 1 hora. Si no solicitaste esta accion, ignora este correo.`;

      await emailService.enviarCorreo(
        usuario.correo,
        'Recuperacion de Contrasena',
        mensaje
      );

      res
        .status(200)
        .json({ mensaje: 'Enlace de recuperacion enviado correctamente' });
    } catch (error) {
      logger.error('Error al procesar recuperacion de contrasena:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
  },

  async resetPassword(req, res) {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token y nueva contrasena son requeridos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contrasena debe tener al menos 6 caracteres' });
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);

      const usuario = await Usuario.findById(decoded.id_usuario);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      if (usuario.correo !== decoded.correo) {
        return res.status(401).json({ error: 'Token invalido' });
      }

      await Usuario.updatePassword(usuario.id_usuario, password);

      const mensaje = `Hola ${usuario.nombre},\n\nTu contrasena ha sido cambiada exitosamente.\n\nSi no fuiste tu, contacta con el administrador inmediatamente.`;

      await emailService.enviarCorreo(
        usuario.correo,
        'Contrasena cambiada - Ekonsumo',
        mensaje
      );

      res.status(200).json({ mensaje: 'Contrasena cambiada correctamente' });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'El enlace ha expirado. Solicita uno nuevo.' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Token invalido' });
      }
      logger.error('Error al resetear contrasena:', error);
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

  async obtenerAdmins(req, res) {
    try {
      const admins = await Usuario.findAdmins();
      res.json(admins);
    } catch (err) {
      logger.error('Error al obtener administradores:', err);
      res.status(500).send('Error al obtener los administradores');
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
    const { nombre, correo, rol, movil } = req.body;
    try {
      const usuarioActualizado = await Usuario.update(
        id,
        nombre,
        correo,
        rol,
        movil
      );
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
