const Pago = require('../models/Pago');

const PagoController = {
  // Crear un nuevo pago
  async crear(req, res) {
    const {
      id_usuario_deudor,
      id_usuario_creditor,
      monto,
      estado,
      periodo,
      origen,
      concepto,
    } = req.body;

    try {
      const nuevoPago = await Pago.create(
        id_usuario_deudor,
        id_usuario_creditor,
        monto,
        estado || 'pendiente',
        periodo,
        origen,
        concepto
      );
      res.status(201).json(nuevoPago);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear el pago' });
    }
  },

  // Obtener todos los pagos
  async listar(req, res) {
    try {
      const pagos = await Pago.findAll();
      res.json(pagos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener los pagos' });
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
      res.status(500).json({ error: 'Error al obtener los pagos pendientes del deudor' });
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
      res.status(500).json({ error: 'Error al obtener los pagos pendientes del acreedor' });
    }
  },

  // Resumen financiero del mes para usuario autenticado
  async obtenerResumenMensual(req, res) {
    const periodo = req.query.periodo;

    try {
      const resumen = await Pago.obtenerResumenMensual(req.user.id_usuario, periodo);
      res.json(resumen);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener el resumen mensual' });
    }
  },

  // El deudor reporta que ha pagado (no cierra deuda)
  async marcarPagado(req, res) {
    const { id } = req.params;

    try {
      const pago = await Pago.findById(id);
      if (!pago) {
        return res.status(404).json({ error: 'Pago no encontrado' });
      }

      if (pago.estado === 'completado') {
        return res.status(200).json(pago);
      }

      if (req.user.rol !== 'admin' && Number(pago.id_usuario_deudor) !== Number(req.user.id_usuario)) {
        return res.status(403).json({ error: 'Solo el deudor puede marcar este pago como enviado' });
      }

      const pagoActualizado = await Pago.marcarPagadoPorDeudor(id, pago.id_usuario_deudor);
      if (!pagoActualizado) {
        return res.status(400).json({ error: 'No se pudo marcar el pago como enviado' });
      }

      res.json(pagoActualizado);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al marcar el pago como enviado' });
    }
  },

  // El acreedor confirma recibido y cierra deuda
  async marcarRecibido(req, res) {
    const { id } = req.params;

    try {
      const pago = await Pago.findById(id);
      if (!pago) {
        return res.status(404).json({ error: 'Pago no encontrado' });
      }

      if (pago.estado === 'completado') {
        return res.status(200).json(pago);
      }

      if (req.user.rol !== 'admin' && Number(pago.id_usuario_creditor) !== Number(req.user.id_usuario)) {
        return res.status(403).json({ error: 'Solo el acreedor puede confirmar el pago recibido' });
      }

      const pagoActualizado = await Pago.confirmarRecibidoPorAcreedor(id, pago.id_usuario_creditor);
      if (!pagoActualizado) {
        return res.status(400).json({ error: 'No se pudo confirmar el pago recibido' });
      }

      res.json(pagoActualizado);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al confirmar el pago recibido' });
    }
  },

  // Genera/actualiza la liquidacion mensual
  async generarLiquidacionMensual(req, res) {
    const periodo = req.body?.periodo || req.query?.periodo;

    try {
      const resultado = await Pago.generarLiquidacionMensual(periodo);
      res.json(resultado);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al generar la liquidacion mensual' });
    }
  },
};

module.exports = PagoController;
