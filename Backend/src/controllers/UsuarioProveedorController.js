// backend/controllers/UsuarioProveedorController.js
const UsuarioProveedor = require('../models/UsuarioProveedor');

class UsuarioProveedorController {
  static async crearRelacion(req, res) {
    try {
      const { id_usuario, id_proveedor } = req.body;
      const nuevaRelacion = await UsuarioProveedor.crear({ id_usuario, id_proveedor });
      res.status(201).json(nuevaRelacion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async obtenerRelacionesPorUsuario(req, res) {
    try {
      const { id_usuario } = req.params;
      const relaciones = await UsuarioProveedor.obtenerPorUsuario(id_usuario);
      res.status(200).json(relaciones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async obtenerRelacionesPorProveedor(req, res) {
    try {
      const { id_proveedor } = req.params;
      const relaciones = await UsuarioProveedor.obtenerPorProveedor(id_proveedor);
      res.status(200).json(relaciones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async eliminarRelacion(req, res) {
    try {
      const { id_usuario, id_proveedor } = req.params;
      const relacionEliminada = await UsuarioProveedor.eliminar({ id_usuario, id_proveedor });
      res.status(200).json(relacionEliminada);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UsuarioProveedorController;