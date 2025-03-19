const Pedido = require('../models/Pedido');

const PedidoController = {
  // Crear un nuevo pedido
  async crear(req, res) {
    const { fecha, id_usuario, estado } = req.body;
    try {
      const nuevoPedido = await Pedido.create(fecha, id_usuario, estado);
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
    const { fecha, id_usuario, estado } = req.body;
    try {
      const pedidoActualizado = await Pedido.update(id, fecha, id_usuario, estado);
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
};

module.exports = PedidoController;