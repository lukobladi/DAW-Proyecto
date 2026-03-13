// Tests de integracion para las rutas de proveedores
// Prueban los endpoints de la API relacionados con proveedores

require('dotenv').config({ quiet: true });
const request = require('supertest');
const app = require('../../index');
const pool = require('../../src/config/db');
const Proveedor = require('../../src/models/Proveedor');

describe('Proveedor Routes', () => {
  let adminToken;
  let testProveedorId;

  // Datos del proveedor de prueba
  const testProveedorData = {
    nombre: 'Proveedor de Prueba',
    contacto: 'Juan Perez',
    telefono: '123456789',
    movil: '987654321',
    correo: 'test.proveedor@example.com',
    metodo_pago: 'Transferencia',
    frecuencia_pedido_aproximada: 'semanal', // Tiene que ser un valor valido
    envio_movil: true,
    envio_mail: true,
  };

  beforeAll(async () => {
    // Creo un token de administrador para la autenticacion
    adminToken =
      'Bearer ' +
      require('jsonwebtoken').sign({ rol: 'admin' }, process.env.JWT_SECRET);

    // Creo un proveedor de prueba
    const testProveedor = await Proveedor.create(
      testProveedorData.nombre,
      testProveedorData.contacto,
      testProveedorData.telefono,
      testProveedorData.movil,
      testProveedorData.correo,
      testProveedorData.metodo_pago,
      testProveedorData.frecuencia_pedido_aproximada,
      testProveedorData.envio_movil,
      testProveedorData.envio_mail
    );
    testProveedorId = testProveedor.id_proveedor;
  });

  afterAll(async () => {
    // Limpio el proveedor de prueba
    if (testProveedorId) {
      await Proveedor.delete(testProveedorId);
    }
    await pool.end(); // Cierro el pool para evitar handles abiertos
  });

  // Test: crear un nuevo proveedor
  it('deberia crear un nuevo proveedor', async () => {
    const newProveedor = {
      nombre: 'Nuevo Proveedor',
      contacto: 'Maria Lopez',
      telefono: '111222333',
      movil: '444555666',
      correo: 'new.proveedor@example.com',
      metodo_pago: 'Efectivo',
      frecuencia_pedido_aproximada: 'mensual', // Tiene que ser un valor valido
      envio_movil: false,
      envio_mail: true,
    };

    const res = await request(app)
      .post('/api/proveedores/crear')
      .set('Authorization', adminToken)
      .send(newProveedor);

    if (res.status !== 201) {
      console.error('Error en la respuesta:', res.body);
    }

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id_proveedor');

    // Limpio el proveedor creado
    await Proveedor.delete(res.body.id_proveedor);
  });

  // Test: listar todos los proveedores
  it('deberia listar todos los proveedores', async () => {
    const res = await request(app)
      .get('/api/proveedores/obtenerTodos')
      .set('Authorization', adminToken);

    if (res.status !== 200) {
      console.error('Error en la respuesta:', res.body);
    }
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  // Test: obtener un proveedor por ID
  it('deberia obtener un proveedor por ID', async () => {
    const res = await request(app)
      .get(`/api/proveedores/obtener/${testProveedorId}`)
      .set('Authorization', adminToken);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id_proveedor', testProveedorId);
  });

  // Test: actualizar un proveedor
  it('deberia actualizar un proveedor', async () => {
    const updatedData = {
      nombre: 'Proveedor Actualizado',
      contacto: 'Carlos Gomez',
      telefono: '999888777',
      movil: '666555444',
      correo: 'updated.proveedor@example.com',
      metodo_pago: 'Cheque',
      frecuencia_pedido_aproximada: 'anual', // Tiene que ser un valor valido
      envio_movil: true,
      envio_mail: false,
    };

    const res = await request(app)
      .patch(`/api/proveedores/actualizar/${testProveedorId}`)
      .set('Authorization', adminToken)
      .send(updatedData);

    if (res.status !== 200) {
      console.error('Error en la respuesta:', res.body);
    }

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('nombre', 'Proveedor Actualizado');
  });

  // Test: cambiar el estado activo de un proveedor
  it('deberia cambiar el estado activo de un proveedor', async () => {
    const res = await request(app)
      .patch(`/api/proveedores/cambiarEstadoActivo/${testProveedorId}`)
      .set('Authorization', adminToken)
      .send({ activo: false });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('activo', false);
  });

  // Test: eliminar un proveedor
  it('deberia eliminar un proveedor', async () => {
    const newProveedor = await Proveedor.create(
      'Proveedor a Eliminar',
      'Luis Martinez',
      '123123123',
      '321321321',
      'delete.proveedor@example.com',
      'Tarjeta',
      'semanal', // Tiene que coincidir con el constraint de la base de datos
      true,
      false
    );

    // Compruebo que el proveedor se creo correctamente
    expect(newProveedor).toHaveProperty('id_proveedor');

    const res = await request(app)
      .delete(`/api/proveedores/eliminar/${newProveedor.id_proveedor}`)
      .set('Authorization', adminToken);

    if (res.status !== 204) {
      console.error('Error en la respuesta:', res.body);
    }

    expect(res.status).toBe(204);
  });
});