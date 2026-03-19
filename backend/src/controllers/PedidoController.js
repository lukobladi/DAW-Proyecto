// Controller para los pedidos
// GEstiona la logica de las peticiones HTTP relacionadas con pedidos

const Pedido = require('../models/Pedido');
const Usuario = require('../models/Usuario');
const Proveedor = require('../models/Proveedor');

const PedidoController = {
  // Crear un nuevo pedido
  async crear(req, res) {
    const {
      fecha_apertura,
      fecha_cierre,
      fecha_entrega,
      estado,
    } = req.body;
    let { id_proveedor } = req.body; // Make id_proveedor mutable
    const id_usuario_encargado = req.user.id_usuario;
    const user_role = req.user.rol;

    try {
      if (user_role === 'gestor') {
        const usuario = await Usuario.findById(id_usuario_encargado);
        if (!usuario || !usuario.familia) {
          return res.status(403).json({ error: 'No perteneces a ninguna familia' });
        }
        // findProveedoresByFamilia returns an array of providers
        const proveedores = await Proveedor.findByFamilia(usuario.familia);
        if (!proveedores || proveedores.length === 0) {
          return res.status(403).json({ error: 'Tu familia no gestiona ningun proveedor' });
        }
        // Assuming a gestor's family manages only one provider
        id_proveedor = proveedores[0].id_proveedor;
      }
      const nuevoPedido = await Pedido.create(
        id_usuario_encargado,
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
      const usuario = await Usuario.findById(id_usuario);

      if (!usuario || !usuario.familia) {
        return res
          .status(403)
          .json({ error: 'No perteneces a ninguna familia' });
      }

      const proveedores = await Proveedor.findByFamilia(usuario.familia);

      if (!proveedores || proveedores.length === 0) {
        return res
          .status(403)
          .json({ error: 'Tu familia no gestiona ningun proveedor' });
      }

      // Assuming a gestor's family manages only one provider
      const pedidos = await Pedido.findByProveedor(proveedores[0].id_proveedor);
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
      familia,
      id_proveedor,
      estado,
    } = req.body;
    try {
      const pedidoActualizado = await Pedido.update(
        id,
        fecha_apertura,
        fecha_cierre,
        fecha_entrega,
        familia,
        id_proveedor,
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
