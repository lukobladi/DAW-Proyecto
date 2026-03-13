// Tests unitarios para el modelo Proveedor
// Prueban las operaciones CRUD y funciones adicionales del modelo

const Proveedor = require('../../src/models/Proveedor');
const pool = require('../../src/config/db');

describe('Modelo Proveedor', () => {
  let proveedorId;
  const proveedorData = {
    nombre: 'Proveedor de Prueba',
    contacto: 'Juan Perez',
    telefono: '123456789',
    movil: '987654321',
    correo: 'test.proveedor@example.com',
    metodo_pago: 'Transferencia',
    frecuencia_pedido_aproximada: 'semanal',
    envio_movil: true,
    envio_mail: true,
  };

  beforeEach(async () => {
    // Crear un proveedor para cada prueba
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
    // Limpia el proveedor despues de cada prueba
    if (proveedorId) {
      await Proveedor.delete(proveedorId);
      proveedorId = null;
    }
  });

  afterAll(async () => {
    // Cerrar el pool para evitar handles abiertos
    await pool.end();
  });

  // Test: crear un nuevo proveedor
  it('deberia crear un nuevo proveedor', async () => {
    const nuevoProveedor = await Proveedor.create(
      'Nuevo Proveedor',
      'Maria Lopez',
      '111222333',
      '444555666',
      'nuevo.proveedor@example.com',
      'Efectivo',
      'mensual',
      false,
      true
    );
    expect(nuevoProveedor).toHaveProperty('id_proveedor');
    await Proveedor.delete(nuevoProveedor.id_proveedor); // Limpio el proveedor creado
  });

  // Test: obtener todos los proveedores
  it('deberia obtener todos los proveedores', async () => {
    const proveedores = await Proveedor.findAll();
    expect(proveedores).toBeInstanceOf(Array);
    expect(proveedores.length).toBeGreaterThan(0);
  });

  // Test: obtener un proveedor por ID
  it('deberia obtener un proveedor por ID', async () => {
    const proveedor = await Proveedor.findById(proveedorId);
    expect(proveedor).not.toBeNull();
    expect(proveedor).toHaveProperty('id_proveedor', proveedorId);
  });

  // Test: actualizar un proveedor
  it('deberia actualizar un proveedor', async () => {
    const updatedProveedor = await Proveedor.update(
      proveedorId,
      'Proveedor Actualizado',
      'Carlos Gomez',
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

  // Test: cambiar el estado activo de un proveedor
  it('deberia cambiar el estado activo de un proveedor', async () => {
    const proveedorInactivo = await Proveedor.toggleActiveStatus(
      proveedorId,
      false
    );
    expect(proveedorInactivo).toHaveProperty('activo', false);

    const proveedorActivo = await Proveedor.toggleActiveStatus(
      proveedorId,
      true
    );
    expect(proveedorActivo).toHaveProperty('activo', true);
  });

  // Test: eliminar un proveedor
  it('deberia eliminar un proveedor', async () => {
    const nuevoProveedor = await Proveedor.create(
      'Proveedor a Eliminar',
      'Luis Martinez',
      '123123123',
      '321321321',
      'eliminar.proveedor@example.com',
      'Tarjeta',
      'semanal',
      true,
      false
    );
    const deletedProveedor = await Proveedor.delete(
      nuevoProveedor.id_proveedor
    );
    expect(deletedProveedor).toBeUndefined(); // No se espera valor de retorno
    const proveedor = await Proveedor.findById(nuevoProveedor.id_proveedor);
    expect(proveedor).toBeUndefined();
  });
});