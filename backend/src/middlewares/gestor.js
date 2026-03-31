const Producto = require('../models/Producto');
const Proveedor = require('../models/Proveedor');

const gestor = async (req, res, next) => {
  try {
    if (req.user.rol === 'admin') {
      return next();
    }

    if (req.user.rol === 'gestor') {
      const proveedores = await Proveedor.findByUsuario(req.user.id_usuario);
      if (!proveedores || proveedores.length === 0) {
        return res
          .status(403)
          .json({ error: 'No tienes proveedores asignados.' });
      }

      if (req.method === 'POST') {
        return next();
      }

      const { id } = req.params;
      if (id) {
        const producto = await Producto.findById(id);
        if (!producto) {
          return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        if (
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
