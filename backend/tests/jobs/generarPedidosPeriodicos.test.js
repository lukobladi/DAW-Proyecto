// Tests para el job generarPedidosPeriodicos
// El job genera pedidos periodicos automaticamente

describe('generarPedidosPeriodicos job', () => {
  let calcularFechaProximoPedido;
  let calcularFechasPedido;

  beforeAll(() => {
    const job = require('../../src/jobs/generarPedidosPeriodicos');
    calcularFechaProximoPedido = job.calcularFechaProximoPedido;
    calcularFechasPedido = job.calcularFechasPedido;
  });

  describe('calcularFechaProximoPedido', () => {
    it('deberia retornar null si la fecha de inicio es futura', () => {
      const config = {
        periodicidad: 7,
        ultimo_pedido_generado: null,
        fecha_inicio: new Date(Date.now() + 86400000 * 10).toISOString(),
      };

      const resultado = calcularFechaProximoPedido(config);
      expect(resultado).toBeNull();
    });

    it('deberia retornar hoy si es la primera vez y fecha_inicio ya paso', () => {
      const config = {
        periodicidad: 7,
        ultimo_pedido_generado: null,
        fecha_inicio: new Date(Date.now() - 86400000).toISOString(),
      };

      const resultado = calcularFechaProximoPedido(config);
      expect(resultado).not.toBeNull();
      expect(resultado instanceof Date).toBe(true);
    });

    it('deberia retornar null si no ha pasado suficiente tiempo desde ultimo pedido', () => {
      const config = {
        periodicidad: 7,
        ultimo_pedido_generado: new Date(Date.now() - 86400000 * 3).toISOString(),
        fecha_inicio: new Date(Date.now() - 86400000 * 30).toISOString(),
      };

      const resultado = calcularFechaProximoPedido(config);
      expect(resultado).toBeNull();
    });

    it('deberia retornar hoy si ya paso la periodicidad', () => {
      const config = {
        periodicidad: 7,
        ultimo_pedido_generado: new Date(Date.now() - 86400000 * 10).toISOString(),
        fecha_inicio: new Date(Date.now() - 86400000 * 60).toISOString(),
      };

      const resultado = calcularFechaProximoPedido(config);
      expect(resultado).not.toBeNull();
      expect(resultado instanceof Date).toBe(true);
    });

    it('deberia funcionar con periodicidad de 30 dias', () => {
      const config = {
        periodicidad: 30,
        ultimo_pedido_generado: new Date(Date.now() - 86400000 * 35).toISOString(),
        fecha_inicio: new Date(Date.now() - 86400000 * 90).toISOString(),
      };

      const resultado = calcularFechaProximoPedido(config);
      expect(resultado).not.toBeNull();
    });
  });

  describe('calcularFechasPedido', () => {
    it('deberia calcular fechas de apertura, cierre y entrega', () => {
      const config = {
        dia_apertura: 1,
        dia_cierre: 4,
        dia_entrega: 6,
      };
      const fechaReferencia = new Date('2026-04-15');

      const resultado = calcularFechasPedido(config, fechaReferencia);

      expect(resultado).toHaveProperty('fecha_apertura');
      expect(resultado).toHaveProperty('fecha_cierre');
      expect(resultado).toHaveProperty('fecha_entrega');
    });

    it('deberia usar valores por defecto si no se especifican', () => {
      const config = {};
      const fechaReferencia = new Date('2026-04-15');

      const resultado = calcularFechasPedido(config, fechaReferencia);

      expect(resultado).toHaveProperty('fecha_apertura');
      expect(resultado).toHaveProperty('fecha_cierre');
      expect(resultado).toHaveProperty('fecha_entrega');
    });

    it('deberia ajustar dias al final del mes si exceden', () => {
      const config = {
        dia_apertura: 31,
        dia_cierre: 31,
        dia_entrega: 31,
      };
      const fechaReferencia = new Date('2026-04-15');

      const resultado = calcularFechasPedido(config, fechaReferencia);

      expect(resultado).toHaveProperty('fecha_apertura');
      expect(resultado).toHaveProperty('fecha_cierre');
      expect(resultado).toHaveProperty('fecha_entrega');
    });

    it('deberia calcular fechas en el mismo mes que la fecha de referencia', () => {
      const config = {
        dia_apertura: 10,
        dia_cierre: 15,
        dia_entrega: 20,
      };
      const fechaReferencia = new Date('2026-04-05');

      const resultado = calcularFechasPedido(config, fechaReferencia);

      const fechaApertura = new Date(resultado.fecha_apertura);
      expect(fechaApertura.getDate()).toBe(10);
    });
  });
});
