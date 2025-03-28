const Pedido = require('../models/Pedido');

const PedidoController = {
  // Crear un nuevo pedido
  async crear(req, res) {
    const { fecha_apertura, fecha_cierre, fecha_entrega, id_usuario_encargado, id_proveedor, estado } = req.body;
    try {
      const nuevoPedido = await Pedido.create(fecha_apertura, fecha_cierre, fecha_entrega, id_usuario_encargado, id_proveedor, estado);
      res.status(201).json(nuevoPedido);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al crear el pedido');
    }
  },

  // Obtener todos los pedidos
  async listar(req, res) {
    try {
      const pedidos = await Pedido.findAll();
      res.json(pedidos);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener los pedidos');
    }
  },

  // Obtener un pedido por ID
  async obtenerPorId(req, res) {
    const { id } = req.params;
    try {
      const pedido = await Pedido.findById(id);
      if (!pedido) {
        return res.status(404).send('Pedido no encontrado');
      }
      res.json(pedido);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener el pedido');
    }
  },

  // Actualizar un pedido
  async actualizar(req, res) {
    const { id } = req.params;
    const { fecha_apertura, fecha_cierre, fecha_entrega, id_usuario_encargado, id_proveedor, estado } = req.body;
    try {
      const pedidoActualizado = await Pedido.update(id, fecha_apertura, fecha_cierre, fecha_entrega, id_usuario_encargado, id_proveedor, estado);
      res.json(pedidoActualizado);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al actualizar el pedido');
    }
  },

  // Eliminar un pedido
  async eliminar(req, res) {
    const { id } = req.params;
    try {
      await Pedido.delete(id);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al eliminar el pedido');
    }
  },

  // Cambiar el estado de un pedido
  async cambiarEstado(req, res) {
    const { id } = req.params;
    const { estado } = req.body;
    try {
      const pedido = await Pedido.findById(id);
      if (!pedido) {
        return res.status(404).send('Pedido no encontrado');
      }
      const pedidoActualizado = await Pedido.updateEstado(id, estado);
      res.json(pedidoActualizado);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al cambiar el estado del pedido');
    }
  }
};

module.exports = PedidoController;