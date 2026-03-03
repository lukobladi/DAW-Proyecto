const Proveedor = require('../models/Proveedor');

const ProveedorController = {
  // Crear un nuevo proveedor
  async crear(req, res) {
    const { nombre, contacto, telefono, correo } = req.body;
    try {
      const nuevoProveedor = await Proveedor.create(nombre, contacto, telefono, correo);
      res.status(201).json(nuevoProveedor);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al crear el proveedor');
    }
  },

  // Obtener todos los proveedores
  async listar(req, res) {
    try {
      const proveedores = await Proveedor.findAll();
      res.json(proveedores);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener los proveedores');
    }
  },

  // Obtener un proveedor por ID
  async obtenerPorId(req, res) {
    const { id } = req.params;
    try {
      const proveedor = await Proveedor.findById(id);
      if (!proveedor) {
        return res.status(404).send('Proveedor no encontrado');
      }
      res.json(proveedor);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener el proveedor');
    }
  },

  // Actualizar un proveedor
  async actualizar(req, res) {
    const { id } = req.params;
    const { nombre, contacto, telefono, correo } = req.body;
    try {
      const proveedorActualizado = await Proveedor.update(id, nombre, contacto, telefono, correo);
      res.json(proveedorActualizado);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al actualizar el proveedor');
    }
  },

  // Eliminar un proveedor
  async eliminar(req, res) {
    const { id } = req.params;
    try {
      await Proveedor.delete(id);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al eliminar el proveedor');
    }
  },

  // Activar o desactivar un proveedor
  async cambiarEstadoActivo(req, res) {
    const { id } = req.params;
    const { activo } = req.body; // `activo` must be a boolean
    try {
      const proveedor = await Proveedor.toggleActiveStatus(id, activo);
      if (!proveedor) {
        return res.status(404).send('Proveedor no encontrado');
      }
      res.json(proveedor);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al cambiar el estado del proveedor');
    }
  }
};

module.exports = ProveedorController;