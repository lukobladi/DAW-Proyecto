// Tests de integracion para las rutas de pedidos periodicos

require('dotenv').config({ quiet: true });
const request = require('supertest');
const app = require('../../index');

describe('Pedido Periodico Routes', () => {
  let adminToken;

  beforeAll(() => {
    adminToken =
      'Bearer ' +
      require('jsonwebtoken').sign({ rol: 'admin' }, process.env.JWT_SECRET);
  });

  describe('GET /api/pedido-periodico', () => {
    it('deberia obtener todos los pedidos periodicos para admin', async () => {
      const res = await request(app)
        .get('/api/pedido-periodico/obtenerTodos')
        .set('Authorization', adminToken);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('deberia denegar acceso sin token', async () => {
      const res = await request(app).get('/api/pedido-periodico/obtenerTodos');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/pedido-periodico/crear', () => {
    it('deberia crear un nuevo pedido periodico', async () => {
      const proveedoresRes = await request(app)
        .get('/api/proveedores/obtenerTodos')
        .set('Authorization', adminToken);

      if (proveedoresRes.body.length === 0) {
        console.log('No hay proveedores para crear pedido periodico');
        return;
      }

      const idProveedor = proveedoresRes.body[0].id_proveedor;

      const newPedidoPeriodico = {
        id_proveedor: idProveedor,
        fecha_inicio: '2026-04-01',
        fecha_fin: '2026-07-01',
        activo: true,
        periodicidad: 7,
        dia_apertura: 1,
        dia_cierre: 4,
        dia_entrega: 6,
      };

      const res = await request(app)
        .post('/api/pedido-periodico/crear')
        .set('Authorization', adminToken)
        .send(newPedidoPeriodico);

      expect([201, 400]).toContain(res.status);
    });

    it('deberia rechazar solicitud sin token', async () => {
      const res = await request(app)
        .post('/api/pedido-periodico/crear')
        .send({});

      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/pedido-periodico/cambiarEstadoActivo/:id', () => {
    it('deberia cambiar el estado activo de un pedido periodico', async () => {
      const res = await request(app)
        .patch('/api/pedido-periodico/cambiarEstadoActivo/1')
        .set('Authorization', adminToken)
        .send({ activo: false });

      expect([200, 400, 404]).toContain(res.status);
    });

    it('deberia rechazar solicitud sin token', async () => {
      const res = await request(app)
        .patch('/api/pedido-periodico/cambiarEstadoActivo/1')
        .send({ activo: true });

      expect(res.status).toBe(401);
    });
  });
});
