// backend/controllers/PedidoPeriodicoController.js
const PedidoPeriodico = require('../models/PedidoPeriodico');

const PedidoPeriodicoController = {
  async crearPedidoPeriodico(req, res) {
    const { id_proveedor, fecha_inicio, fecha_fin, activo, periodicidad, dia_apertura, dia_cierre, dia_entrega } = req.body;
    try {
      const nuevoPedidoPeriodico = await PedidoPeriodico.crear({ id_proveedor, fecha_inicio, fecha_fin, activo, periodicidad, dia_apertura, dia_cierre, dia_entrega });
      res.status(201).json(nuevoPedidoPeriodico);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

   async obtenerPedidosPeriodicos(req, res) {
    try {
      const pedidosPeriodicos = await PedidoPeriodico.obtenerTodos();
      res.status(200).json(pedidosPeriodicos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

   async obtenerPedidosPeriodicosPorUsuario(req, res) {
    try {
      const { id_usuario } = req.params;
      const pedidosPeriodicos = await PedidoPeriodico.obtenerPorUsuario(id_usuario);
      res.status(200).json(pedidosPeriodicos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async actualizarPedidoPeriodico(req, res) {
    try {
      const { id } = req.params;
      const { id_proveedor, fecha_inicio, fecha_fin, activo, periodicidad, dia_apertura, dia_cierre, dia_entrega } = req.body;
      const pedidoPeriodicoActualizado = await PedidoPeriodico.actualizar(id, { id_proveedor, fecha_inicio, fecha_fin, activo, periodicidad, dia_apertura, dia_cierre, dia_entrega });
      res.status(200).json(pedidoPeriodicoActualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


 async eliminarPedidoPeriodico(req, res) {
    try {
      const { id } = req.params;
      const pedidoPeriodicoEliminado = await PedidoPeriodico.eliminar(id);
      res.status(200).json(pedidoPeriodicoEliminado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async cambiarEstadoActivo(req, res) {
    try {
      const { id } = req.params;
      const { activo } = req.body; // `activo` debe ser un booleano (true o false)
      const pedidoPeriodicoActualizado = await PedidoPeriodico.cambiarEstado(id, activo);
      res.status(200).json(pedidoPeriodicoActualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

};


module.exports = PedidoPeriodicoController;
