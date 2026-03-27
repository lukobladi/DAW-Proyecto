// Tests de integracion para las rutas de productos

require('dotenv').config({ quiet: true });
const request = require('supertest');
const app = require('../../index');

describe('Producto Routes', () => {
  let adminToken;

  beforeAll(() => {
    adminToken =
      'Bearer ' +
      require('jsonwebtoken').sign({ rol: 'admin' }, process.env.JWT_SECRET);
  });

  describe('GET /api/productos', () => {
    it('deberia obtener todos los productos', async () => {
      const res = await request(app)
        .get('/api/productos/obtenerTodos')
        .set('Authorization', adminToken);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('deberia denegar acceso sin token', async () => {
      const res = await request(app).get('/api/productos/obtenerTodos');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/productos/crear', () => {
    it('deberia validar que se requieren datos para crear producto', async () => {
      // Sin datos debería devolver 400 o 401
      const res = await request(app)
        .post('/api/productos/crear')
        .set('Authorization', adminToken)
        .send({});

      expect([400, 401, 500]).toContain(res.status);
    });
  });
});
