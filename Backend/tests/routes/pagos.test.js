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
  // Limpiar los pagos creados durante los tests
  await pool.query('DELETE FROM pago WHERE id_usuario_deudor = $1', [1]);
});

describe('Pagos Endpoints', () => {
  let pagoId; // Para almacenar el ID del pago creado
  const pagoData = {
    id_usuario_deudor: 1,
    id_usuario_creditor: 2,
    monto: 100.50,
    estado: 'pendiente',
  };

  it('Debería crear un nuevo pago', async () => {
    const res = await request(app)
      .post('/api/pagos/crear/')
      .set('Authorization', `Bearer ${token}`) // Ensure token is included
      .send(pagoData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id_pago');
    pagoId = res.body.id_pago; // Guardar el ID del pago creado
  });

  it('Debería obtener todos los pagos', async () => {
    const res = await request(app)
      .get('/api/pagos/obtenerTodos/')
      .set('Authorization', `Bearer ${token}`); // Ensure token is included
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('Debería cambiar el estado de un pago', async () => {
    const res = await request(app)
      .put(`/api/pagos/cambiar-estado/${pagoId}`)
      .set('Authorization', `Bearer ${token}`) // Ensure token is included
      .send({ estado: 'completado' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('estado', 'completado');
  });

  it('Debería obtener pagos pendientes de un usuario deudor', async () => {
    const res = await request(app)
      .get(`/api/pagos/pendientes-deudor/${pagoData.id_usuario_deudor}`)
      .set('Authorization', `Bearer ${token}`); // Ensure token is included
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('Debería obtener pagos pendientes de un usuario acreedor', async () => {
    const res = await request(app)
      .get(`/api/pagos/pendientes-creditor/${pagoData.id_usuario_creditor}`)
      .set('Authorization', `Bearer ${token}`); // Ensure token is included
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('Debería manejar un caso de error al cambiar el estado de un pago inexistente', async () => {
    const res = await request(app).put('/api/pagos/cambiar-estado/9999').send({ estado: 'completado' });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});


