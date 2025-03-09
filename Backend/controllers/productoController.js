const Producto = require('../models/producto');

const productoController = {
  // Crear un nuevo producto
  async crear(req, res) {
    const { nombre, descripcion, precio, id_proveedor } = req.body;
    try {
      const nuevoProducto = await Producto.create(nombre, descripcion, precio, id_proveedor);
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

  // Actualizar un producto
  async actualizar(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, precio, id_proveedor } = req.body;
    try {
      const productoActualizado = await Producto.update(id, nombre, descripcion, precio, id_proveedor);
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
};

module.exports = productoController;