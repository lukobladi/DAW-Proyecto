const request = require('supertest');
const app = require('../../index'); // Importa la app sin iniciar el servidor


// Cerrar conexiones anteriore
const pool = require('../../db'); // Importa la conexión a la base de datos
const { getAuthToken } = require('../testUtils'); // Importa la utilidad para obtener el token

let token; // Variable para almacenar el token de autenticación

afterAll(async () => {
  await pool.end(); // Cierra la conexión a la base de datos
});

beforeAll(async () => {
  token = await getAuthToken(); // Obtén el token antes de los tests
});

afterEach(async () => {
  // Limpiar los proveedores creados durante los tests
  await pool.query('DELETE FROM proveedor WHERE nombre = $1', ['Proveedor Ejemplo']);
});

describe('Proveedores Endpoints', () => {
  let proveedorId; // Para almacenar el ID del proveedor creado
  const proveedorData = {
    nombre: 'Proveedor Ejemplo',
    direccion: 'Calle Falsa 123',
    telefono: '123456789',
    email: 'proveedor@ejemplo.com',
  };

  it('Debería crear un nuevo proveedor', async () => {
    const res = await request(app).post('/api/proveedores/crear').send(proveedorData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id_proveedor');
    proveedorId = res.body.id_proveedor; // Guardar el ID del proveedor creado
  });

  it('Debería obtener todos los proveedores', async () => {
    const res = await request(app).get('/api/proveedores/obtenerTodos');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('id_proveedor');
      expect(res.body[0]).toHaveProperty('nombre');
    }
  });

  it('Debería obtener un proveedor por ID', async () => {
    const res = await request(app).get(`/api/proveedores/obtener/${proveedorId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id_proveedor', proveedorId);
  });

  it('Debería actualizar un proveedor', async () => {
    const updatedData = { ...proveedorData, nombre: 'Proveedor Actualizado' };
    const res = await request(app).put(`/api/proveedores/actualizar/${proveedorId}`).send(updatedData);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('nombre', 'Proveedor Actualizado');
  });

  it('Debería eliminar un proveedor', async () => {
    const res = await request(app).delete(`/api/proveedores/eliminar/${proveedorId}`);
    expect(res.statusCode).toEqual(204);
  });

  it('Debería manejar un caso de error al obtener un proveedor inexistente', async () => {
    const res = await request(app).get('/api/proveedores/obtener/9999');
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
