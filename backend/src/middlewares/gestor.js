const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Proveedor = require('../models/Proveedor');

// Middleware para verificar si el usuario es admin o gestor de un proveedor
const gestor = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.user.id_usuario);

    // Si es admin, tiene acceso total
    if (usuario.rol === 'admin') {
      return next();
    }

    if (usuario.rol === 'gestor') {
      if (!usuario.familia) {
        return res
          .status(403)
          .json({ error: 'No tienes una familia asignada.' });
      }

      // Para crear un nuevo producto, solo verificamos si el usuario es un gestor con una familia.
      // El controlador se encargara de asignar el proveedor correcto.
      if (req.method === 'POST') {
        return next();
      }

      // Para actualizar/eliminar productos existentes, verificamos la propiedad.
      const { id } = req.params;
      if (id) {
        const producto = await Producto.findById(id);
        if (!producto) {
          return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        const proveedores = await Proveedor.findByFamilia(usuario.familia);
        if (
          proveedores &&
          proveedores.some((p) => p.id_proveedor === producto.id_proveedor)
        ) {
          return next();
        }
      }
    }

    return res
      .status(403)
      .json({ error: 'No tienes permisos para realizar esta acción.' });
  } catch (error) {
    console.error('Error en middleware de gestor:', error);
    res
      .status(500)
      .json({ error: 'Error al verificar los permisos de gestor.' });
  }
};

module.exports = gestor;
