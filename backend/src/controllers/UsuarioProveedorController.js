const UsuarioProveedor = require('../models/UsuarioProveedor');

const UsuarioProveedorController = {
  async asignar(req, res) {
    const { id_usuario, id_proveedor } = req.body;
    try {
      const asignacion = await UsuarioProveedor.asignar(id_usuario, id_proveedor);
      res.status(201).json(asignacion);
    } catch (err) {
      res.status(500).send(`Error al asignar proveedor a usuario: ${err.message}`);
    }
  },

  async desasignar(req, res) {
    const { id_usuario, id_proveedor } = req.body;
    try {
      await UsuarioProveedor.desasignar(id_usuario, id_proveedor);
      res.status(204).send();
    } catch (err) {
      res.status(500).send(`Error al desasignar proveedor: ${err.message}`);
    }
  },

  async listar(req, res) {
    try {
      const asignaciones = await UsuarioProveedor.findAll();
      res.json(asignaciones);
    } catch (err) {
      res.status(500).send(`Error al listar asignaciones: ${err.message}`);
    }
  },
};

module.exports = UsuarioProveedorController;
