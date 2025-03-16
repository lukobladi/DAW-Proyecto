// backend/controllers/PedidoPeriodicoController.js
const PedidoPeriodico = require('../models/PedidoPeriodico');

class PedidoPeriodicoController {
  static async crearPedidoPeriodico(req, res) {
    try {
      const { id_usuario, id_producto, cantidad, fecha_fin, activo } = req.body;
      const nuevoPedidoPeriodico = await PedidoPeriodico.crear({ id_usuario, id_producto, cantidad, fecha_fin, activo });
      res.status(201).json(nuevoPedidoPeriodico);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async obtenerPedidosPeriodicos(req, res) {
    try {
      const pedidosPeriodicos = await PedidoPeriodico.obtenerTodos();
      res.status(200).json(pedidosPeriodicos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async obtenerPedidosPeriodicosPorUsuario(req, res) {
    try {
      const { id_usuario } = req.params;
      const pedidosPeriodicos = await PedidoPeriodico.obtenerPorUsuario(id_usuario);
      res.status(200).json(pedidosPeriodicos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async actualizarPedidoPeriodico(req, res) {
    try {
      const { id } = req.params;
      const { id_usuario, id_producto, cantidad, fecha_fin, activo } = req.body;
      const pedidoPeriodicoActualizado = await PedidoPeriodico.actualizar(id, { id_usuario, id_producto, cantidad, fecha_fin, activo });
      res.status(200).json(pedidoPeriodicoActualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async eliminarPedidoPeriodico(req, res) {
    try {
      const { id } = req.params;
      const pedidoPeriodicoEliminado = await PedidoPeriodico.eliminar(id);
      res.status(200).json(pedidoPeriodicoEliminado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = PedidoPeriodicoController;