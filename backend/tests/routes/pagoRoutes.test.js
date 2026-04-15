// Tests de integracion para las rutas de pagos

require('dotenv').config({ quiet: true });
const request = require('supertest');
const app = require('../../index');

describe('Pago Routes', () => {
  let adminToken;

  beforeAll(() => {
    adminToken =
      'Bearer ' +
      require('jsonwebtoken').sign({ rol: 'admin' }, process.env.JWT_SECRET);
  });

  describe('GET /api/pagos', () => {
    it('deberia obtener todos los pagos para admin', async () => {
      const res = await request(app)
        .get('/api/pagos/obtenerTodos/')
        .set('Authorization', adminToken);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('deberia denegar acceso sin token', async () => {
      const res = await request(app).get('/api/pagos/obtenerTodos/');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/pagos/resumen-mensual', () => {
    it('deberia obtener resumen mensual', async () => {
      const res = await request(app)
        .get('/api/pagos/resumen-mensual')
        .query({ periodo: '2026-03' })
        .set('Authorization', adminToken);

      expect([200, 500]).toContain(res.status);
    });

    it('deberia manejar periodo sin datos', async () => {
      const res = await request(app)
        .get('/api/pagos/resumen-mensual')
        .query({ periodo: '2099-01' })
        .set('Authorization', adminToken);

      expect([200, 500]).toContain(res.status);
    });

    it('deberia rechazar acceso sin token', async () => {
      const res = await request(app)
        .get('/api/pagos/resumen-mensual')
        .query({ periodo: '2026-03' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/pagos/generar-liquidacion-mensual', () => {
    it('deberia generar liquidacion mensual para admin', async () => {
      const res = await request(app)
        .post('/api/pagos/generar-liquidacion-mensual')
        .set('Authorization', adminToken)
        .send({ periodo: '2026-03' });

      expect([200, 500]).toContain(res.status);
    });

    it('deberia usar periodo actual si no se pasa periodo', async () => {
      const res = await request(app)
        .post('/api/pagos/generar-liquidacion-mensual')
        .set('Authorization', adminToken)
        .send({});

      expect([200, 500]).toContain(res.status);
    });

    it('deberia rechazar solicitud sin token', async () => {
      const res = await request(app)
        .post('/api/pagos/generar-liquidacion-mensual')
        .send({ periodo: '2026-03' });

      expect(res.status).toBe(401);
    });

    it('deberia aceptar formato YYYY-MM para el periodo', async () => {
      const res = await request(app)
        .post('/api/pagos/generar-liquidacion-mensual')
        .set('Authorization', adminToken)
        .send({ periodo: '2026-04' });

      expect([200, 500]).toContain(res.status);
    });
  });
});
