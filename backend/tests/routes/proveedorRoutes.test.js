require('dotenv').config({ quiet: true });
const request = require('supertest');
const app = require('../../index');
const pool = require('../../src/config/db');
const Proveedor = require('../../src/models/Proveedor');

describe('Proveedor Routes', () => {
  let adminToken;
  let testProveedorId;

  const testProveedorData = {
    nombre: 'Test Proveedor',
    contacto: 'Juan Pérez',
    telefono: '123456789',
    movil: '987654321',
    correo: 'test.proveedor@example.com',
    metodo_pago: 'Transferencia',
    frecuencia_pedido_aproximada: 'semanal', // Ensure valid value
    envio_movil: true,
    envio_mail: true,
  };

  beforeAll(async () => {
    // Create an admin token for authentication
    adminToken = 'Bearer ' + require('jsonwebtoken').sign({ rol: 'admin' }, process.env.JWT_SECRET);

    // Create a test provider
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
    if (testProveedorId) {
      await Proveedor.delete(testProveedorId);
    }
    await pool.end(); // Ensure pool is closed to prevent open handles
  });

  it('should create a new provider', async () => {
    const newProveedor = {
      nombre: 'New Proveedor',
      contacto: 'Maria López',
      telefono: '111222333',
      movil: '444555666',
      correo: 'new.proveedor@example.com',
      metodo_pago: 'Efectivo',
      frecuencia_pedido_aproximada: 'mensual', // Ensure valid value
      envio_movil: false,
      envio_mail: true,
    };

    const res = await request(app)
      .post('/api/proveedores/crear')
      .set('Authorization', adminToken)
      .send(newProveedor);

    if (res.status !== 201) {
      console.error('Error response:', res.body);
    }

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id_proveedor');

    // Clean up
    await Proveedor.delete(res.body.id_proveedor);
  });

  it('should list all providers', async () => {
    const res = await request(app)
      .get('/api/proveedores/obtenerTodos')
      .set('Authorization', adminToken);

    if (res.status !== 200) {
      console.error('Error response:', res.body);
    }
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should get a provider by ID', async () => {
    const res = await request(app)
      .get(`/api/proveedores/obtener/${testProveedorId}`)
      .set('Authorization', adminToken);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id_proveedor', testProveedorId);
  });

  it('should update a provider', async () => {
    const updatedData = {
      nombre: 'Updated Proveedor',
      contacto: 'Carlos Gómez',
      telefono: '999888777',
      movil: '666555444',
      correo: 'updated.proveedor@example.com',
      metodo_pago: 'Cheque',
      frecuencia_pedido_aproximada: 'anual', // Ensure valid value
      envio_movil: true,
      envio_mail: false,
    };

    const res = await request(app)
      .patch(`/api/proveedores/actualizar/${testProveedorId}`)
      .set('Authorization', adminToken)
      .send(updatedData);

    if (res.status !== 200) {
      console.error('Error response:', res.body);
    }

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('nombre', 'Updated Proveedor');
  });

  it('should toggle the active status of a provider', async () => {
    const res = await request(app)
      .patch(`/api/proveedores/cambiarEstadoActivo/${testProveedorId}`)
      .set('Authorization', adminToken)
      .send({ activo: false });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('activo', false);
  });

  it('should delete a provider', async () => {
    const newProveedor = await Proveedor.create(
      'Delete Proveedor',
      'Luis Martínez',
      '123123123',
      '321321321',
      'delete.proveedor@example.com',
      'Tarjeta',
      'semanal', // Ensure this value matches the database constraint
      true,
      false
    );

    // Verify the provider was created successfully
    expect(newProveedor).toHaveProperty('id_proveedor');

    const res = await request(app)
      .delete(`/api/proveedores/eliminar/${newProveedor.id_proveedor}`)
      .set('Authorization', adminToken);

    if (res.status !== 204) {
      console.error('Error response:', res.body);
    }

    expect(res.status).toBe(204);
  });
});
