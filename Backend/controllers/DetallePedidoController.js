const DetallePedido = require('../models/DetallePedido');

const DetallePedidoController = {
  // Crear un nuevo detalle de pedido
  async crear(req, res) {
    const { id_pedido, id_producto, cantidad, precio_total } = req.body;
    try {
      const nuevoDetalle = await DetallePedido.create(id_pedido, id_producto, cantidad, precio_total);
      res.status(201).json(nuevoDetalle);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al crear el detalle del pedido');
    }
  },

  // Obtener todos los detalles de un pedido
  async listarPorPedido(req, res) {
    const { id_pedido } = req.params;
    try {
      const detalles = await DetallePedido.findByPedidoId(id_pedido);
      res.json(detalles);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener los detalles del pedido');
    }
  },

  // Actualizar un detalle de pedido
  async actualizar(req, res) {
    const { id } = req.params;
    const { id_pedido, id_producto, cantidad, precio_total } = req.body;
    try {
      const detalleActualizado = await DetallePedido.update(id, id_pedido, id_producto, cantidad, precio_total);
      res.json(detalleActualizado);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al actualizar el detalle del pedido');
    }
  },

  // Eliminar un detalle de pedido
  async eliminar(req, res) {
    const { id } = req.params;
    try {
      await DetallePedido.delete(id);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al eliminar el detalle del pedido');
    }
  },
};

module.exports = DetallePedidoController;