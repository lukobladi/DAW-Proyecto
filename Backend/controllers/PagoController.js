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
    const { id } = req.params;
    const { estado } = req.body;
    try {
      const pagoActualizado = await Pago.cambiarEstado(id, estado);
      res.json(pagoActualizado);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al cambiar el estado del pago');
    }
  },
};

module.exports = PagoController;
