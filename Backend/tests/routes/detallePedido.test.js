const request = require('supertest');
const app = require('../../index'); // Asegúrate de que apunta a tu aplicación Express


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
  // Limpiar los detalles de pedido creados durante los tests
  await pool.query('DELETE FROM detalle_pedido WHERE id_pedido = $1', [1]);
});

describe('DetallePedido Endpoints', () => {
  let detalleId; // Para almacenar el ID del detalle creado
  const detalleData = {
    id_pedido: 1,
    id_producto: 1,
    cantidad: 2,
    precio_total: 20.50,
  };

  it('Debería crear un nuevo detalle de pedido', async () => {
    const res = await request(app)
      .post('/api/detalle-pedido/crear/')
      .set('Authorization', `Bearer ${token}`) // Add token
      .send(detalleData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id_detalle');
    detalleId = res.body.id_detalle; // Guardar el ID del detalle creado
  });

  it('Debería obtener todos los detalles de un pedido', async () => {
    const res = await request(app)
      .get(`/api/detalle-pedido/pedido/${detalleData.id_pedido}`)
      .set('Authorization', `Bearer ${token}`); // Add token
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('id_detalle');
      expect(res.body[0]).toHaveProperty('id_pedido');
    }
  });

  it('Debería actualizar un detalle de pedido', async () => {
    const updatedData = { ...detalleData, cantidad: 3, precio_total: 30.75 };
    const res = await request(app)
      .put(`/api/detalle-pedido/actualizar/${detalleId}`)
      .set('Authorization', `Bearer ${token}`) // Add token
      .send(updatedData);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('cantidad', 3);
    expect(res.body).toHaveProperty('precio_total', 30.75);
  });

  it('Debería eliminar un detalle de pedido', async () => {
    const res = await request(app)
      .delete(`/api/detalle-pedido/eliminar/${detalleId}`)
      .set('Authorization', `Bearer ${token}`); // Add token
    expect(res.statusCode).toEqual(204);
  });

  it('Debería manejar un caso de error al obtener un detalle inexistente', async () => {
    const res = await request(app).get('/api/detalle-pedido/pedido/9999');
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});

