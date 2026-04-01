// Controller para los pedidos
// GEstiona la logica de las peticiones HTTP relacionadas con pedidos

const Pedido = require('../models/Pedido');
const Usuario = require('../models/Usuario');
const Proveedor = require('../models/Proveedor');

const PedidoController = {
  async crear(req, res) {
    const {
      fecha_apertura,
      fecha_cierre,
      fecha_entrega,
      estado,
    } = req.body;
    let { id_proveedor } = req.body;
    const user_role = req.user.rol;

    try {
      if (user_role === 'gestor') {
        const proveedores = await Proveedor.findByUsuario(req.user.id_usuario);
        if (!proveedores || proveedores.length === 0) {
          return res.status(403).json({ error: 'No tienes proveedores asignados' });
        }
        id_proveedor = proveedores[0].id_proveedor;
      }
      const nuevoPedido = await Pedido.create(
        id_proveedor,
        fecha_apertura,
        fecha_cierre,
        fecha_entrega,
        estado
      );
      res.status(201).json(nuevoPedido);
    } catch (err) {
      console.error('Error al crear el pedido:', err);
      res.status(500).json({ message: 'Error al crear el pedido', error: err.message });
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

  // Obtener pedidos del proveedor que gestiona la familia del usuario
  async listarPorProveedorAsignado(req, res) {
    try {
      const id_usuario = req.user.id_usuario;

      const proveedores = await Proveedor.findByUsuario(id_usuario);

      if (!proveedores || proveedores.length === 0) {
        return res
          .status(403)
          .json({ error: 'No tienes proveedores asignados' });
      }

      const proveedorIds = proveedores.map(p => p.id_proveedor);
      const pedidos = await Pedido.findByProveedores(proveedorIds);
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
    const {
      fecha_apertura,
      fecha_cierre,
      fecha_entrega,
      id_proveedor,
      estado,
    } = req.body;
    try {
      const pedidoActual = await Pedido.findById(id);
      if (!pedidoActual) {
        return res.status(404).send('Pedido no encontrado');
      }
      const pedidoActualizado = await Pedido.update(
        id,
        id_proveedor,
        fecha_apertura,
        fecha_cierre,
        fecha_entrega,
        estado
      );
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
  },
};

module.exports = PedidoController;
