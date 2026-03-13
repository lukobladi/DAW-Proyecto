// Controller para los detalles de pedido
// GEstiona la logica de las peticiones HTTP relacionadas con los detalles de cada pedido

const DetallePedido = require('../models/DetallePedido');
const Pedido = require('../models/Pedido');

// Funcion helper para saber si un pedido esta abierto
// Un pedido esta abierto si esta en estado pendiente, la fecha de apertura ya paso y la de cierre todavia no
function pedidoEstaAbierto(pedido) {
  if (!pedido || pedido.estado !== 'pendiente') {
    return false;
  }

  const ahora = new Date();
  const apertura = pedido.fecha_apertura
    ? new Date(pedido.fecha_apertura)
    : null;
  const cierre = pedido.fecha_cierre ? new Date(pedido.fecha_cierre) : null;

  if (apertura && ahora < apertura) {
    return false;
  }

  if (cierre && ahora > cierre) {
    return false;
  }

  return true;
}

const DetallePedidoController = {
  // Crear un nuevo detalle de pedido (una linea de producto en un pedido)
  async crear(req, res) {
    const {
      id_pedido,
      id_producto,
      cantidad,
      precio_unitario,
      id_usuario_comprador,
    } = req.body;
    try {
      const nuevoDetalle = await DetallePedido.create(
        id_pedido,
        id_producto,
        cantidad,
        precio_unitario,
        id_usuario_comprador
      );
      res.status(201).json(nuevoDetalle);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al crear el detalle del pedido');
    }
  },

  // Obtener todos los detalles de un pedido (todas las lineas de productos)
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

  // Actualizar un detalle de pedido (cantidad, etc)
  // Solo se puede modificar si el pedido esta abierto
  async actualizar(req, res) {
    const { id } = req.params;
    const {
      id_pedido,
      id_producto,
      cantidad,
      precio_unitario,
      id_usuario_comprador,
    } = req.body;

    if (cantidad === undefined || cantidad === null || Number(cantidad) < 0) {
      return res
        .status(400)
        .json({ error: 'La cantidad debe ser un numero mayor o igual a 0' });
    }

    try {
      const detalleActual = await DetallePedido.findById(id);
      if (!detalleActual) {
        return res
          .status(404)
          .json({ error: 'Detalle de pedido no encontrado' });
      }

      const pedido = await Pedido.findById(detalleActual.id_pedido);
      if (!pedidoEstaAbierto(pedido)) {
        return res
          .status(409)
          .json({
            error: 'Solo se puede modificar un detalle de un pedido abierto',
          });
      }

      let detalleActualizado;

      if (
        id_pedido !== undefined &&
        id_producto !== undefined &&
        precio_unitario !== undefined &&
        id_usuario_comprador !== undefined
      ) {
        detalleActualizado = await DetallePedido.update(
          id,
          id_pedido,
          id_producto,
          cantidad,
          precio_unitario,
          id_usuario_comprador
        );
      } else {
        detalleActualizado = await DetallePedido.updateCantidad(id, cantidad);
      }

      res.json(detalleActualizado);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al actualizar el detalle del pedido');
    }
  },

  // Eliminar un detalle de pedido (quitar un producto del pedido)
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
