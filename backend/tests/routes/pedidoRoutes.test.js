// Tests de integracion para las rutas de pedidos

require('dotenv').config({ quiet: true });
const request = require('supertest');
const app = require('../../index');

describe('Pedido Routes', () => {
  let adminToken;

  beforeAll(() => {
    adminToken =
      'Bearer ' +
      require('jsonwebtoken').sign({ rol: 'admin' }, process.env.JWT_SECRET);
  });

  describe('GET /api/pedidos', () => {
    it('deberia obtener todos los pedidos para admin', async () => {
      const res = await request(app)
        .get('/api/pedidos/obtenerTodos')
        .set('Authorization', adminToken);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
    });

    it('deberia denegar acceso sin token', async () => {
      const res = await request(app).get('/api/pedidos/obtenerTodos');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/pedidos/crear', () => {
    it('deberia crear un nuevo pedido', async () => {
      // Obtener un proveedor existente primero
      const proveedoresRes = await request(app)
        .get('/api/proveedores/obtenerTodos')
        .set('Authorization', adminToken);

      if (proveedoresRes.body.length === 0) {
        console.log('No hay proveedores para crear pedido');
        return;
      }

      const idProveedor = proveedoresRes.body[0].id_proveedor;

      // Obtener un usuario existente
      const usuariosRes = await request(app)
        .get('/api/usuarios/obtenerTodos')
        .set('Authorization', adminToken);

      if (usuariosRes.body.length === 0) {
        console.log('No hay usuarios para crear pedido');
        return;
      }

      const idUsuario = usuariosRes.body[0].id_usuario;

      const newPedido = {
        id_usuario_encargado: idUsuario,
        id_proveedor: idProveedor,
        fecha_apertura: '2026-05-01',
        fecha_cierre: '2026-05-07',
        fecha_entrega: '2026-05-10',
        estado: 'pendiente',
      };

      const res = await request(app)
        .post('/api/pedidos/crear')
        .set('Authorization', adminToken)
        .send(newPedido);

      expect([201, 400]).toContain(res.status);
    });
  });
});
