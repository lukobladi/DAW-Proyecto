const FamiliaProveedor = require('../models/FamiliaProveedor');

const FamiliaProveedorController = {
  // Asignar un proveedor a una familia
  async asignar(req, res) {
    const { id_familia, id_proveedor } = req.body;
    try {
      const asignacion = await FamiliaProveedor.asignar(id_familia, id_proveedor);
      res.status(201).json(asignacion);
    } catch (err) {
      res.status(500).send(`Error al asignar proveedor a familia: ${err.message}`);
    }
  },

  // Desasignar un proveedor de una familia
  async desasignar(req, res) {
    const { id_familia, id_proveedor } = req.body;
    try {
      await FamiliaProveedor.desasignar(id_familia, id_proveedor);
      res.status(204).send();
    } catch (err) {
      res.status(500).send(`Error al desasignar proveedor: ${err.message}`);
    }
  },

  // Listar asignaciones
  async listar(req, res) {
    try {
      const asignaciones = await FamiliaProveedor.findAll();
      res.json(asignaciones);
    } catch (err) {
      res.status(500).send(`Error al listar asignaciones: ${err.message}`);
    }
  },
};

module.exports = FamiliaProveedorController;
