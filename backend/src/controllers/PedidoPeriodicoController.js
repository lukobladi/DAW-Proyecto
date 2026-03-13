// Controller para los pedidos periodicos
// GEstiona la logica de las peticiones HTTP relacionadas con pedidos que se repiten

const PedidoPeriodico = require('../models/PedidoPeriodico');

const PedidoPeriodicoController = {
  // Crear un nuevo pedido periodico
  async crearPedidoPeriodico(req, res) {
    const {
      id_proveedor,
      fecha_inicio,
      fecha_fin,
      activo,
      periodicidad,
      dia_apertura,
      dia_cierre,
      dia_entrega,
    } = req.body;
    try {
      const nuevoPedidoPeriodico = await PedidoPeriodico.crear({
        id_proveedor,
        fecha_inicio,
        fecha_fin,
        activo,
        periodicidad,
        dia_apertura,
        dia_cierre,
        dia_entrega,
      });
      res.status(201).json(nuevoPedidoPeriodico);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener todos los pedidos periodicos
  async obtenerPedidosPeriodicos(req, res) {
    try {
      const pedidosPeriodicos = await PedidoPeriodico.obtenerTodos();
      res.status(200).json(pedidosPeriodicos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener los pedidos periodicos de un usuario
  async obtenerPedidosPeriodicosPorUsuario(req, res) {
    try {
      const { id_usuario } = req.params;
      const pedidosPeriodicos =
        await PedidoPeriodico.obtenerPorUsuario(id_usuario);
      res.status(200).json(pedidosPeriodicos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Actualizar un pedido periodico
  async actualizarPedidoPeriodico(req, res) {
    try {
      const { id } = req.params;
      const {
        id_proveedor,
        fecha_inicio,
        fecha_fin,
        activo,
        periodicidad,
        dia_apertura,
        dia_cierre,
        dia_entrega,
      } = req.body;
      const pedidoPeriodicoActualizado = await PedidoPeriodico.actualizar(id, {
        id_proveedor,
        fecha_inicio,
        fecha_fin,
        activo,
        periodicidad,
        dia_apertura,
        dia_cierre,
        dia_entrega,
      });
      res.status(200).json(pedidoPeriodicoActualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar un pedido periodico
  async eliminarPedidoPeriodico(req, res) {
    try {
      const { id } = req.params;
      const pedidoPeriodicoEliminado = await PedidoPeriodico.eliminar(id);
      res.status(200).json(pedidoPeriodicoEliminado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Cambiar el estado activo/inactivo de un pedido periodico
  async cambiarEstadoActivo(req, res) {
    try {
      const { id } = req.params;
      const { activo } = req.body; // activo tiene que ser true o false
      const pedidoPeriodicoActualizado = await PedidoPeriodico.cambiarEstado(
        id,
        activo
      );
      res.status(200).json(pedidoPeriodicoActualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = PedidoPeriodicoController;
