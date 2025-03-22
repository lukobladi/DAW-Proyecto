const Saldo = require('../models/Saldo');

const SaldoController = {
  // Calcular el saldo de un usuario
  async calcularSaldo(req, res) {
    const { id_usuario } = req.params;
    try {
      const saldo = await Saldo.calcularSaldo(id_usuario);
      res.json({ saldo });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al calcular el saldo');
    }
  },
};

module.exports = SaldoController;
