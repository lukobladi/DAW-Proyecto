require('dotenv').config({ quiet: true });
const request = require('supertest');
const app = require('../../index'); 
const pool = require('../../src/config/db');
const Usuario = require('../../src/models/Usuario');

describe('Usuario Routes', () => {
  let token;
  let adminToken;
  let testUserId;

  const testUserData = {
    nombre: 'Test User',
    correo: 'test.user@example.com',
    password: 'password123',
    rol: 'usuario',
    movil: '123456789',
  };

  beforeAll(async () => {
    // Create a test admin user and get a token
    const adminUser = await Usuario.create('Admin', 'admin@example.com', 'admin123', 'admin', '987654321');
    adminToken = 'Bearer ' + require('jsonwebtoken').sign({ id_usuario: adminUser.id_usuario, rol: 'admin' }, process.env.JWT_SECRET);

    // Create a test user and get a token
    const testUser = await Usuario.create(testUserData.nombre, testUserData.correo, testUserData.password, testUserData.rol, testUserData.movil);
    testUserId = testUser.id_usuario;
    token = 'Bearer ' + require('jsonwebtoken').sign({ id_usuario: testUser.id_usuario, rol: testUser.rol }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    if (testUserId) {
        await Usuario.delete(testUserId);
    }
    await pool.query('DELETE FROM Usuario WHERE correo = $1', ['admin@example.com']);
    await pool.end(); // Ensure pool is closed to prevent open handles
  });

  it('should list all users (admin only)', async () => {
    const res = await request(app)
      .get('/api/usuarios/obtenerTodos')
      .set('Authorization', adminToken);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should get a user by ID', async () => {
    const res = await request(app)
      .get(`/api/usuarios/obtener/${testUserId}`)
      .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id_usuario', testUserId);
  });

  it('should register a new user', async () => {
    const newUser = {
      nombre: 'New User',
      correo: 'new.user@example.com',
      password: 'newpassword123',
      rol: 'usuario',
      movil: '987654321',
    };

    const res = await request(app)
      .post('/api/usuarios/registrar')
      .send(newUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id_usuario');

    // Clean up
    await Usuario.delete(res.body.id_usuario);
  });

  it('should log in a user', async () => {
    const res = await request(app)
      .post('/api/usuarios/login')
      .send({ correoOMovil: testUserData.correo, password: testUserData.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should activate a user (admin only)', async () => {
    const res = await request(app)
      .patch(`/api/usuarios/activar/${testUserId}`)
      .set('Authorization', adminToken)
      .send({ activo: true });

    expect(res.status).toBe(200);
    expect(res.body.usuario).toHaveProperty('activo', true);
  });

  it('should calculate user balance', async () => {
    const res = await request(app)
        .get(`/api/usuarios/obtener/${testUserId}`)
        .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('saldo', "0.00"); // Ensure saldo is compared as a number
  });

  it('should delete a user (admin only)', async () => {
    const newUser = await Usuario.create('Delete Me', 'delete.me@example.com', 'delete123', 'usuario', '123123123');
    const res = await request(app)
      .delete(`/api/usuarios/eliminar/${newUser.id_usuario}`)
      .set('Authorization', adminToken);

    expect(res.status).toBe(204);
  });
});
