const Pago = require('../models/Pago');

const PagoController = {
  // Crear un nuevo pago
  async crear(req, res) {
    const { id_usuario_deudor, id_usuario_creditor, monto, estado } = req.body;
    try {
      const nuevoPago = await Pago.create(id_usuario_deudor, id_usuario_creditor, monto, estado);
      res.status(201).json(nuevoPago);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al crear el pago');
    }
  },

  // Obtener todos los pagos
  async listar(req, res) {
    try {
      const pagos = await Pago.findAll();
      res.json(pagos);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener los pagos');
    }
  },

  // Cambiar el estado de un pago
  async cambiarEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
  
      const pago = await Pago.findById(id);
      if (!pago) {
        return res.status(404).json({ error: 'Pago no encontrado' });
      }
  
      const pagoActualizado = await Pago.cambiarEstado(id, estado);
      res.status(200).json(pagoActualizado);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al cambiar el estado del pago' });
    }
  },

  // Obtener pagos pendientes de un usuario deudor
  async obtenerPendientesDeudor(req, res) {
    const { id_usuario_deudor } = req.params;
    try {
      const pagos = await Pago.findPendientesDeudor(id_usuario_deudor);
      res.json(pagos);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener los pagos pendientes del deudor');
    }
  },

  // Obtener pagos pendientes de un usuario acreedor
  async obtenerPendientesCreditor(req, res) {
    const { id_usuario_creditor } = req.params;
    try {
      const pagos = await Pago.findPendientesCreditor(id_usuario_creditor);
      res.json(pagos);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener los pagos pendientes del acreedor');
    }
  },
};

module.exports = PagoController;