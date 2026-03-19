// Tests unitarios para el modelo Pago
// Prueban las operaciones CRUD del modelo

const Pago = require('../../src/models/Pago');
const Usuario = require('../../src/models/Usuario');
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
    await pool.end();
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