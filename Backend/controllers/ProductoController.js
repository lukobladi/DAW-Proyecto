const Producto = require('../models/Producto');
const upload = require('../config/multer'); // Importa Multer

const ProductoController = {
  // Crear un nuevo producto con imagen
  async crear(req, res) {
    const { nombre, descripcion, precio, id_proveedor } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null; // URL de la imagen

    try {
      const nuevoProducto = await Producto.create(nombre, descripcion, precio, id_proveedor, imagen);
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
    const { nombre, descripcion, precio, id_proveedor } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null; // URL de la imagen

    try {
      const productoActualizado = await Producto.update(id, nombre, descripcion, precio, id_proveedor, imagen);
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
  }
};

module.exports = ProductoController;