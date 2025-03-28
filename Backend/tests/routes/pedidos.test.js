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
  // Limpiar los pedidos creados durante los tests
  await pool.query('DELETE FROM pedido WHERE id_usuario = $1', [1]);
});

describe('Pedidos Endpoints', () => {
  let pedidoId; // Para almacenar el ID del pedido creado
  const pedidoData = {
    fecha: '2023-10-01T12:00:00Z',
    id_usuario: 1,
    estado: 'pendiente',
  };

  it('Debería crear un nuevo pedido', async () => {
    const res = await request(app).post('/api/pedidos/crear').send(pedidoData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id_pedido');
    pedidoId = res.body.id_pedido; // Guardar el ID del pedido creado
  });

  it('Debería obtener todos los pedidos', async () => {
    const res = await request(app).get('/api/pedidos/obtenerTodos');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('id_pedido');
      expect(res.body[0]).toHaveProperty('estado');
    }
  });

  it('Debería obtener un pedido por ID', async () => {
    const res = await request(app).get(`/api/pedidos/obtener/${pedidoId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id_pedido', pedidoId);
  });

  it('Debería actualizar un pedido', async () => {
    const updatedData = { ...pedidoData, estado: 'completado' };
    const res = await request(app).put(`/api/pedidos/actualizar/${pedidoId}`).send(updatedData);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('estado', 'completado');
  });

  it('Debería eliminar un pedido', async () => {
    const res = await request(app).delete(`/api/pedidos/eliminar/${pedidoId}`);
    expect(res.statusCode).toEqual(204);
  });

  it('Debería manejar un caso de error al obtener un pedido inexistente', async () => {
    const res = await request(app).get('/api/pedidos/obtener/9999');
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
