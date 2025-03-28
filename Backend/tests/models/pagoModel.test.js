const Pago = require('../../models/Pago');
const pool = require('../../db');

describe('Pago Model', () => {
  let pagoId; // Para almacenar el ID del pago creado
  const pagoData = {
    id_usuario_deudor: 1,
    id_usuario_creditor: 2,
    monto: 100.50,
    estado: 'pendiente',
  };

  afterAll(async () => {
    await pool.end(); // Cierra la conexión a la base de datos después de las pruebas
  });

  afterEach(async () => {
    // Limpiar los pagos creados durante los tests
    await pool.query('DELETE FROM pago WHERE id_usuario_deudor = $1', [1]);
    const pagos = await Pago.findPendientesDeudor(1);
    expect(pagos).toHaveLength(0); // Validar que no queden registros
  });

  it('Debería crear un nuevo pago', async () => {
    const nuevoPago = await Pago.create(
      pagoData.id_usuario_deudor,
      pagoData.id_usuario_creditor,
      pagoData.monto,
      pagoData.estado
    );
    expect(nuevoPago).toHaveProperty('id_pago');
    pagoId = nuevoPago.id_pago; // Guardar el ID del pago creado
  });

  it('Debería obtener todos los pagos', async () => {
    const pagos = await Pago.findAll();
    expect(pagos).toBeInstanceOf(Array);
    if (pagos.length > 0) {
      expect(pagos[0]).toHaveProperty('id_pago');
      expect(pagos[0]).toHaveProperty('monto');
    }
  });

  it('Debería cambiar el estado de un pago', async () => {
    const pagoActualizado = await Pago.cambiarEstado(pagoId, 'completado');
    expect(pagoActualizado).toHaveProperty('estado', 'completado');
  });

  it('Debería obtener pagos pendientes de un usuario deudor', async () => {
    const pagosPendientes = await Pago.findPendientesDeudor(pagoData.id_usuario_deudor);
    expect(pagosPendientes).toBeInstanceOf(Array);
  });

  it('Debería obtener pagos pendientes de un usuario acreedor', async () => {
    const pagosPendientes = await Pago.findPendientesCreditor(pagoData.id_usuario_creditor);
    expect(pagosPendientes).toBeInstanceOf(Array);
  });

  it('Debería manejar un caso de error al cambiar el estado de un pago inexistente', async () => {
    try {
      await Pago.cambiarEstado(9999, 'completado'); // ID inexistente
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});


// Cerrar conexiones
afterAll(async () => {
  await pool.end(); // Cierra la conexión a la base de datos
});