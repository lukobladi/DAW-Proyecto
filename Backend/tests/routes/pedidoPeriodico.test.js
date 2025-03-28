const request = require('supertest');
const app = require('../../index'); // Importa la app sin iniciar el servidor


// Cerrar conexiones anteriore
const pool = require('../../db'); // Importa la conexión a la base de datos
const { getAuthToken } = require('../testUtils'); // Importa la utilidad para obtener el token

let token; // Variable para almacenar el token de autenticación

afterAll(async () => {
  await pool.end(); // Cierra la conexión a la base de datos
});

afterEach(async () => {
  // Limpiar los pedidos periódicos creados durante los tests
  await pool.query('DELETE FROM pedido_periodico WHERE id_usuario = $1', [1]);
});

beforeAll(async () => {
  token = await getAuthToken(); // Obtén el token antes de los tests
});

describe('PedidoPeriodico Endpoints', () => {
  let pedidoPeriodicoId; // Para almacenar el ID del pedido periódico creado
  const pedidoPeriodicoData = {
    id_usuario: 1,
    id_producto: 1,
    cantidad: 5,
    fecha_fin: '2023-12-31T23:59:59Z',
    activo: true,
  };

  it('Debería crear un nuevo pedido periódico', async () => {
    const res = await request(app)
      .post('/api/pedido-periodico/crear')
      .set('Authorization', `Bearer ${token}`) // Add token
      .send(pedidoPeriodicoData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id_pedido_periodico');
    pedidoPeriodicoId = res.body.id_pedido_periodico; // Guardar el ID del pedido periódico creado
  });

  it('Debería obtener todos los pedidos periódicos', async () => {
    const res = await request(app)
      .get('/api/pedido-periodico/obtenerTodos')
      .set('Authorization', `Bearer ${token}`); // Add token
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('id_pedido_periodico');
      expect(res.body[0]).toHaveProperty('cantidad');
    }
  });

  it('Debería actualizar un pedido periódico', async () => {
    const res = await request(app)
      .put(`/api/pedido-periodico/actualizar/${pedidoPeriodicoId}`)
      .set('Authorization', `Bearer ${token}`) // Add token
      .send({ ...pedidoPeriodicoData, cantidad: 10 });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('cantidad', 10);
  });

  it('Debería eliminar un pedido periódico', async () => {
    const res = await request(app)
      .delete(`/api/pedido-periodico/eliminar/${pedidoPeriodicoId}`)
      .set('Authorization', `Bearer ${token}`); // Add token
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Pedido periódico eliminado correctamente');
  });

  it('Debería manejar un caso de error al eliminar un pedido periódico inexistente', async () => {
    const res = await request(app).delete('/api/pedido-periodico/eliminar/9999');
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
