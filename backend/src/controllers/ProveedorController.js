// Los controllers GEstiona logica de solicitud HTTP

const Proveedor = require('../models/Proveedor');
const FamiliaProveedor = require('../models/FamiliaProveedor');

const ProveedorController = {
  // Crear un nuevo proveedor y asignarle una familia si se proporciona
  async crear(req, res) {
    const {
      nombre,
      contacto,
      telefono,
      movil,
      correo,
      metodo_pago,
      frecuencia_pedido_aproximada,
      envio_movil,
      envio_mail,
      familia, // Puede ser null
    } = req.body;
    try {
      // 1. Crear el proveedor
      const nuevoProveedor = await Proveedor.create(
        nombre,
        contacto,
        telefono,
        movil,
        correo,
        metodo_pago,
        frecuencia_pedido_aproximada,
        envio_movil,
        envio_mail
      );

      // 2. Si se proporciono una familia, asignarla
      if (familia !== null && familia > 0) {
        await FamiliaProveedor.asignar(familia, nuevoProveedor.id_proveedor);
      }
      
      const proveedorConFamilia = await Proveedor.findById(nuevoProveedor.id_proveedor);
      res.status(201).json(proveedorConFamilia);
    } catch (err) {
      console.error(err);
      res.status(500).send(`Error al crear el proveedor: ${err.message}`);
    }
  },

  // Obtener todos los proveedores
  async listar(req, res) {
    try {
      const proveedores = await Proveedor.findAll();
      res.json(proveedores);
    } catch (err) {
      console.error(err);
      res.status(500).send(`Error al obtener los proveedores: ${err.message}`);
    }
  },

  // Obtener un proveedor por ID
  async obtenerPorId(req, res) {
    const { id } = req.params;
    try {
      const proveedor = await Proveedor.findById(id);
      if (!proveedor) {
        return res.status(404).send('Proveedor no encontrado');
      }
      res.json(proveedor);
    } catch (err) {
      console.error(err);
      res.status(500).send(`Error al obtener el proveedor: ${err.message}`);
    }
  },

  // Actualizar un proveedor y su asignacion de familia
  async actualizar(req, res) {
    const { id } = req.params;
    const {
      nombre,
      contacto,
      telefono,
      movil,
      correo,
      metodo_pago,
      frecuencia_pedido_aproximada,
      envio_movil,
      envio_mail,
      familia,
    } = req.body;
    try {
      // 1. Actualizar los datos del proveedor
      const proveedorActualizado = await Proveedor.update(
        id,
        nombre,
        contacto,
        telefono,
        movil,
        correo,
        metodo_pago,
        frecuencia_pedido_aproximada,
        envio_movil,
        envio_mail
      );

      // 2. Gestionar la asignacion de familia
      // Primero, desasignamos todas las familias para este proveedor
      const familiasActuales = await FamiliaProveedor.findFamiliasByProveedor(id);
      for (const fam of familiasActuales) {
        await FamiliaProveedor.desasignar(fam, id);
      }
      
      // Si se proporciona una nueva familia, la asignamos
      if (familia !== null && familia > 0) {
        await FamiliaProveedor.asignar(familia, id);
      }

      const proveedorConFamilia = await Proveedor.findById(id);
      res.json(proveedorConFamilia);
    } catch (err) {
      console.error(err);
      res.status(500).send(`Error al actualizar el proveedor: ${err.message}`);
    }
  },

  // Eliminar un proveedor
  async eliminar(req, res) {
    const { id } = req.params;
    try {
      await Proveedor.delete(id);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).send(`Error al eliminar el proveedor: ${err.message}`);
    }
  },

  // Activar o desactivar un proveedor
  async cambiarEstadoActivo(req, res) {
    const { id } = req.params;
    const { activo } = req.body;
    try {
      const proveedor = await Proveedor.toggleActiveStatus(id, activo);
      if (!proveedor) {
        return res.status(404).send('Proveedor no encontrado');
      }
      res.json(proveedor);
    } catch (err) {
      console.error(err);
      res.status(500).send(`Error al cambiar el estado del proveedor: ${err.message}`);
    }
  },
};

module.exports = ProveedorController;
