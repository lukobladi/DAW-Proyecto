const Proveedor = require('../../models/Proveedor');
const pool = require('../../db');

describe('Proveedor Model', () => {
  let proveedorId;
  const proveedorData = {
    nombre: 'Test Proveedor',
    contacto: 'Juan Pérez',
    telefono: '123456789',
    movil: '987654321',
    correo: 'test.proveedor@example.com',
    metodo_pago: 'Transferencia',
    frecuencia_pedido_aproximada: 'semanal',
    envio_movil: true,
    envio_mail: true,
  };

  beforeEach(async () => {
    const nuevoProveedor = await Proveedor.create(
      proveedorData.nombre,
      proveedorData.contacto,
      proveedorData.telefono,
      proveedorData.movil,
      proveedorData.correo,
      proveedorData.metodo_pago,
      proveedorData.frecuencia_pedido_aproximada,
      proveedorData.envio_movil,
      proveedorData.envio_mail
    );
    proveedorId = nuevoProveedor.id_proveedor;
  });

  afterEach(async () => {
    if (proveedorId) {
      await Proveedor.delete(proveedorId);
      proveedorId = null;
    }
  });

  afterAll(async () => {
    await pool.end(); // Ensure pool is closed to prevent open handles
  });

  it('should create a new provider', async () => {
    const nuevoProveedor = await Proveedor.create(
      'Nuevo Proveedor',
      'Maria López',
      '111222333',
      '444555666',
      'nuevo.proveedor@example.com',
      'Efectivo',
      'mensual',
      false,
      true
    );
    expect(nuevoProveedor).toHaveProperty('id_proveedor');
    await Proveedor.delete(nuevoProveedor.id_proveedor); // Clean up
  });

  it('should retrieve all providers', async () => {
    const proveedores = await Proveedor.findAll();
    expect(proveedores).toBeInstanceOf(Array);
    expect(proveedores.length).toBeGreaterThan(0);
  });

  it('should retrieve a provider by ID', async () => {
    const proveedor = await Proveedor.findById(proveedorId);
    expect(proveedor).not.toBeNull();
    expect(proveedor).toHaveProperty('id_proveedor', proveedorId);
  });

  it('should update a provider', async () => {
    const updatedProveedor = await Proveedor.update(
      proveedorId,
      'Proveedor Actualizado',
      'Carlos Gómez',
      '999888777',
      '666555444',
      'actualizado.proveedor@example.com',
      'Cheque',
      'mensual',
      true,
      false
    );
    expect(updatedProveedor).not.toBeNull();
    expect(updatedProveedor).toHaveProperty('nombre', 'Proveedor Actualizado');
  });

  it('should toggle the active status of a provider', async () => {
    const proveedorInactivo = await Proveedor.toggleActiveStatus(proveedorId, false);
    expect(proveedorInactivo).toHaveProperty('activo', false);

    const proveedorActivo = await Proveedor.toggleActiveStatus(proveedorId, true);
    expect(proveedorActivo).toHaveProperty('activo', true);
  });

  it('should delete a provider', async () => {
    const nuevoProveedor = await Proveedor.create(
      'Proveedor a Eliminar',
      'Luis Martínez',
      '123123123',
      '321321321',
      'eliminar.proveedor@example.com',
      'Tarjeta',
      'semanal',
      true,
      false
    );
    const deletedProveedor = await Proveedor.delete(nuevoProveedor.id_proveedor);
    expect(deletedProveedor).toBeUndefined(); // No return value expected
    const proveedor = await Proveedor.findById(nuevoProveedor.id_proveedor);
    expect(proveedor).toBeUndefined();
  });
});
