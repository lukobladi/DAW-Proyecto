// Tests unitarios para el modelo Pago
// Prueban las operaciones CRUD del modelo

const Pago = require('../../src/models/Pago');
const Usuario = require('../../src/models/Usuario');
const Proveedor = require('../../src/models/Proveedor');
const Producto = require('../../src/models/Producto');
const Pedido = require('../../src/models/Pedido');
const DetallePedido = require('../../src/models/DetallePedido');
const UsuarioProveedor = require('../../src/models/UsuarioProveedor');
const pool = require('../../src/config/db');

describe('Modelo Pago', () => {
  let deudorId;
  let acreedorId;

  // Datos del usuario deudor
  const deudorCorreo = 'johiwa3415@soco7.com';
  const acreedorCorreo = `acreedor.pago+${Date.now()}@soco7.com`;

  beforeAll(async () => {
    // Crear usuarios para las pruebas
    const deudor = await Usuario.create(
      'Usuario Deudor',
      deudorCorreo,
      'password123',
      'usuario',
      '111111111'
    );
    deudorId = deudor.id_usuario;

    const acreedor = await Usuario.create(
      'Usuario Acreedor',
      acreedorCorreo,
      'password123',
      'usuario',
      '222222222'
    );
    acreedorId = acreedor.id_usuario;
  });

  afterAll(async () => {
    // Limpiar usuarios al terminar
    if (deudorId) {
      await Usuario.delete(deudorId);
    }
    if (acreedorId) {
      await Usuario.delete(acreedorId);
    }
  });

  // Test: crear un nuevo pago
  it('deberia crear un nuevo pago', async () => {
    const nuevoPago = await Pago.create(
      deudorId,
      acreedorId,
      50.00,
      'pendiente',
      '2024-01-01', // Fecha completa
      'pedido',
      'Pago de prueba'
    );
    expect(nuevoPago).toHaveProperty('id_pago');
    expect(parseFloat(nuevoPago.monto)).toBe(50.00);
    expect(nuevoPago.estado).toBe('pendiente');
  });

  // Test: obtener todos los pagos
  it('deberia obtener todos los pagos', async () => {
    const pagos = await Pago.findAll();
    expect(pagos).toBeInstanceOf(Array);
  });

  // Test: obtener un pago por ID
  it('deberia obtener un pago por ID', async () => {
    const pago = await Pago.create(
      deudorId,
      acreedorId,
      25.00,
      'pendiente',
      '2024-02-01',
      'pedido',
      'Pago test findById'
    );

    const pagoEncontrado = await Pago.findById(pago.id_pago);
    expect(pagoEncontrado).not.toBeNull();
    expect(pagoEncontrado).toHaveProperty('id_pago', pago.id_pago);
  });

  // Test: obtener pagos pendientes de un deudor
  it('deberia obtener pagos pendientes de un deudor', async () => {
    // Crear pago pendiente
    const pago = await Pago.create(
      deudorId,
      acreedorId,
      25.00,
      'pendiente',
      '2024-03-01',
      'pedido',
      'Pago pendiente test'
    );

    const pagosPendientes = await Pago.findPendientesDeudor(deudorId);
    expect(pagosPendientes).toBeInstanceOf(Array);
    expect(pagosPendientes.length).toBeGreaterThan(0);
  });

  // Test: obtener pagos pendientes de un acreedor
  it('deberia obtener pagos pendientes de un acreedor', async () => {
    // Crear pago pendiente
    const pago = await Pago.create(
      deudorId,
      acreedorId,
      30.00,
      'pendiente',
      '2024-04-01',
      'pedido',
      'Pago pendiente test acreedor'
    );

    const pagosPendientes = await Pago.findPendientesCreditor(acreedorId);
    expect(pagosPendientes).toBeInstanceOf(Array);
    expect(pagosPendientes.length).toBeGreaterThan(0);
  });

  // Test: marcar pago como enviado por deudor
  it('deberia marcar un pago como enviado', async () => {
    const pago = await Pago.create(
      deudorId,
      acreedorId,
      15.00,
      'pendiente',
      '2024-05-01',
      'pedido',
      'Pago a marcar'
    );

    const pagoActualizado = await Pago.marcarPagadoPorDeudor(pago.id_pago, deudorId);
    expect(pagoActualizado).not.toBeNull();
    expect(pagoActualizado.deudor_reporta_pagado).toBe(true);
  });

  // Test: cambiar estado de un pago
  it('deberia cambiar el estado de un pago', async () => {
    const pago = await Pago.create(
      deudorId,
      acreedorId,
      35.00,
      'pendiente',
      '2024-06-01',
      'pedido',
      'Pago cambio estado'
    );

    const pagoActualizado = await Pago.cambiarEstado(pago.id_pago, 'completado');
    expect(pagoActualizado).toHaveProperty('estado', 'completado');
  });

  // Test: obtener resumen mensual
  it('deberia obtener resumen mensual de un usuario', async () => {
    const resumen = await Pago.obtenerResumenMensual(deudorId, '2024-01');
    expect(resumen).toHaveProperty('periodo_consultado');
    expect(resumen).toHaveProperty('saldo_actual');
    expect(resumen).toHaveProperty('total_gastado_mes');
    expect(resumen).toHaveProperty('total_pendiente_por_pagar');
    expect(resumen).toHaveProperty('total_pendiente_por_cobrar');
    expect(resumen).toHaveProperty('deudas_pendientes');
  });
});

describe('Pago.generarLiquidacionMensual', () => {
  let proveedorId;
  let productoId;
  let pedidoId;
  let detalleId;
  let acreedorId;
  let deudorId;

  const testPeriod = '2026-03';

  beforeAll(async () => {
    acreedorId = deudorId;

    const acreedor = await Usuario.create(
      'Usuario Acreedor Liquidacion',
      `acreedor.liquidacion+${Date.now()}@test.com`,
      'password123',
      'usuario',
      '333333333'
    );
    acreedorId = acreedor.id_usuario;

    const deudor = await Usuario.create(
      'Usuario Deudor Liquidacion',
      `deudor.liquidacion+${Date.now()}@test.com`,
      'password123',
      'usuario',
      '444444444'
    );
    deudorId = deudor.id_usuario;

    const proveedor = await Proveedor.create(
      'Proveedor Liquidacion Test',
      'Contacto Test',
      '123456789',
      '321654987',
      'liquidacion@test.com',
      'Transferencia',
      'mensual',
      true,
      true
    );
    proveedorId = proveedor.id_proveedor;

    const producto = await Producto.create(
      'Producto Liquidacion Test',
      'Descripcion test',
      10.50,
      proveedorId,
      null
    );
    productoId = producto.id_producto;

    const pedido = await Pedido.create(
      proveedorId,
      `${testPeriod}-01`,
      `${testPeriod}-10`,
      `${testPeriod}-12`,
      'pendiente'
    );
    pedidoId = pedido.id_pedido;

    const detalle = await DetallePedido.create(
      pedidoId,
      productoId,
      3,
      10.50,
      deudorId
    );
    detalleId = detalle.id_detalle;

    await UsuarioProveedor.asignar(acreedorId, proveedorId);
  });

  afterAll(async () => {
    if (detalleId) {
      await DetallePedido.delete(detalleId);
    }
    if (pedidoId) {
      await Pedido.delete(pedidoId);
    }
    if (productoId) {
      await Producto.delete(productoId);
    }
    if (proveedorId) {
      await Proveedor.delete(proveedorId);
    }
    if (deudorId) {
      await Usuario.delete(deudorId);
    }
    if (acreedorId) {
      await Usuario.delete(acreedorId);
    }
  });

  it('deberia generar liquidacion mensual para periodo especifico', async () => {
    const resultado = await Pago.generarLiquidacionMensual(testPeriod);

    expect(resultado).toHaveProperty('periodo', testPeriod);
    expect(resultado).toHaveProperty('total_registros');
    expect(resultado).toHaveProperty('registros');
    expect(resultado.registros).toBeInstanceOf(Array);
  });

  it('deberia usar periodo actual si no se especifica argumento', async () => {
    const resultado = await Pago.generarLiquidacionMensual();

    expect(resultado).toHaveProperty('periodo');
    expect(resultado.periodo).toMatch(/^\d{4}-\d{2}$/);
  });

  it('deberia aceptar formato YYYY-MM para el periodo', async () => {
    const resultado = await Pago.generarLiquidacionMensual('2026-03');

    expect(resultado).toHaveProperty('periodo', '2026-03');
  });

  it('deberia aceptar formato YYYY-MM-DD para el periodo', async () => {
    const resultado = await Pago.generarLiquidacionMensual('2026-03-15');

    expect(resultado).toHaveProperty('periodo', '2026-03');
  });

  it('deberia excluir pedidos cancelados de la liquidacion', async () => {
    await Pedido.changeStatus(pedidoId, 'cancelado');

    const resultado = await Pago.generarLiquidacionMensual(testPeriod);

    const liquidacionDelPeriodo = resultado.registros.filter(
      r => r.periodo && r.periodo.toString().startsWith(testPeriod)
    );
    expect(liquidacionDelPeriodo.length).toBe(0);

    await Pedido.changeStatus(pedidoId, 'pendiente');
  });

  it('deberia preservar estado completado al actualizar liquidacion existente', async () => {
    await Pago.generarLiquidacionMensual(testPeriod);

    const pagoExistente = await pool.query(
      `SELECT id_pago FROM pago 
       WHERE periodo = $1::date AND origen = 'liquidacion_mensual'
       LIMIT 1`,
      [`${testPeriod}-01`]
    );

    if (pagoExistente.rows.length > 0) {
      await Pago.cambiarEstado(pagoExistente.rows[0].id_pago, 'completado');

      const resultado = await Pago.generarLiquidacionMensual(testPeriod);
      const pagoActualizado = resultado.registros.find(
        r => r.id_pago === pagoExistente.rows[0].id_pago
      );

      expect(pagoActualizado.estado).toBe('completado');
    }
  });

  it('deberia retornar 0 registros cuando no hay datos para el periodo', async () => {
    const resultado = await Pago.generarLiquidacionMensual('2099-01');

    expect(resultado.total_registros).toBe(0);
    expect(resultado.registros).toHaveLength(0);
  });
});