// Los controllers GEstiona logica de solicitud HTTP

const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');
const Proveedor = require('../models/Proveedor');
const upload = require('../config/multer');

const ProductoController = {
  // Crear un nuevo producto con imagen
  async crear(req, res) {
    const { nombre, descripcion, precio } = req.body;
    let { id_proveedor } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;
    const user_role = req.user.rol;
    const id_usuario_encargado = req.user.id_usuario;

    try {
      if (user_role === 'gestor') {
        const proveedores = await Proveedor.findByUsuario(id_usuario_encargado);
        if (!proveedores || proveedores.length === 0) {
          return res.status(403).json({ error: 'No tienes proveedores asignados' });
        }
        id_proveedor = proveedores[0].id_proveedor;
      }
      const nuevoProducto = await Producto.create(
        nombre,
        descripcion,
        precio,
        id_proveedor,
        imagen
      );
      res.status(201).json(nuevoProducto);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al crear el producto');
    }
  },

  // Obtener todos los productos
  async listar(req, res) {
    try {
      const productos = await Producto.findAll();
      res.json(productos);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener los productos');
    }
  },

  // Obtener productos del proveedor asignado a la familia del usuario
  async listarMisProductos(req, res) {
    try {
      const id_usuario = req.user.id_usuario;

      const proveedores = await Proveedor.findByUsuario(id_usuario);

      if (!proveedores || proveedores.length === 0) {
        return res
          .status(403)
          .json({
            error:
              'No tienes proveedores asignados. Contacta con un administrador',
          });
      }

      const productos = await Producto.findByProveedor(proveedores[0].id_proveedor);
      res.json(productos);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener los productos');
    }
  },

  // Obtener un producto por ID
  async obtenerPorId(req, res) {
    const { id } = req.params;
    try {
      const producto = await Producto.findById(id);
      if (!producto) {
        return res.status(404).send('Producto no encontrado');
      }
      res.json(producto);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener el producto');
    }
  },

  // Actualizar un producto con imagen
  async actualizar(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, precio, activo } = req.body;
    let { id_proveedor } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null; // URL de la imagen

    try {
      if (req.user.rol === 'gestor') {
        const proveedores = await Proveedor.findByUsuario(req.user.id_usuario);
        id_proveedor = proveedores[0].id_proveedor;
      }
      const productoActualizado = await Producto.update(
        id,
        nombre,
        descripcion,
        precio,
        id_proveedor,
        imagen,
        activo
      );
      res.json(productoActualizado);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al actualizar el producto');
    }
  },

  // Eliminar un producto
  async eliminar(req, res) {
    const { id } = req.params;
    try {
      await Producto.delete(id);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al eliminar el producto');
    }
  },

  // Cambiar el estado de un producto
  async cambiarEstadoActivo(req, res) {
    const { id } = req.params;
    const { activo } = req.body; // `activo` debe ser un booleano

    try {
      const producto = await Producto.findById(id);
      if (!producto) {
        return res.status(404).send('Producto no encontrado');
      }

      const productoActualizado = await Producto.updateEstado(id, activo);
      res.json(productoActualizado);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al cambiar el estado del producto');
    }
  },
};

module.exports = ProductoController;
