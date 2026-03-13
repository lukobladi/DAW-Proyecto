// Tests de integracion para las rutas de usuarios
// Prueban los endpoints de la API relacionados con usuarios

require('dotenv').config({ quiet: true });
const request = require('supertest');
const app = require('../../index');
const pool = require('../../src/config/db');
const Usuario = require('../../src/models/Usuario');

describe('Usuario Routes', () => {
  let token;
  let adminToken;
  let testUserId;

  // Datos del usuario de prueba
  const testUserData = {
    nombre: 'Usuario de Prueba',
    correo: 'test.user@example.com',
    password: 'password123',
    rol: 'usuario',
    movil: '123456789',
  };

  beforeAll(async () => {
    // Creo un usuario administrador y obtengo su token
    const adminUser = await Usuario.create(
      'Admin',
      'admin@example.com',
      'admin123',
      'admin',
      '987654321'
    );
    
    // Activo el usuario administrador
    await Usuario.toggleActivation(adminUser.id_usuario, true);
    
    adminToken =
      'Bearer ' +
      require('jsonwebtoken').sign(
        { id_usuario: adminUser.id_usuario, rol: 'admin' },
        process.env.JWT_SECRET
      );

    // Creo un usuario de prueba y obtengo su token
    const testUser = await Usuario.create(
      testUserData.nombre,
      testUserData.correo,
      testUserData.password,
      testUserData.rol,
      testUserData.movil
    );
    testUserId = testUser.id_usuario;
    
    // Activo el usuario de prueba para el test de login
    await Usuario.toggleActivation(testUserId, true);
    
    token =
      'Bearer ' +
      require('jsonwebtoken').sign(
        { id_usuario: testUser.id_usuario, rol: testUser.rol },
        process.env.JWT_SECRET
      );
  });

  afterAll(async () => {
    // Limpio los usuarios de prueba
    if (testUserId) {
      await Usuario.delete(testUserId);
    }
    await pool.query('DELETE FROM Usuario WHERE correo = $1', [
      'admin@example.com',
    ]);
    await pool.end(); // Cierro el pool para evitar handles abiertos
  });

  // Test: listar todos los usuarios (solo admin)
  it('deberia listar todos los usuarios (solo admin)', async () => {
    const res = await request(app)
      .get('/api/usuarios/obtenerTodos')
      .set('Authorization', adminToken);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  // Test: obtener un usuario por ID
  it('deberia obtener un usuario por ID', async () => {
    const res = await request(app)
      .get(`/api/usuarios/obtener/${testUserId}`)
      .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id_usuario', testUserId);
  });

  // Test: registrar un nuevo usuario
  it('deberia registrar un nuevo usuario', async () => {
    const newUser = {
      nombre: 'Nuevo Usuario',
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

    // Limpio el usuario creado
    await Usuario.delete(res.body.id_usuario);
  });

  // Test: hacer login con un usuario
  it('deberia hacer login con un usuario', async () => {
    const res = await request(app)
      .post('/api/usuarios/login')
      .send({
        correoOMovil: testUserData.correo,
        password: testUserData.password,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  // Test: activar un usuario (solo admin)
  it('deberia activar un usuario (solo admin)', async () => {
    const res = await request(app)
      .patch(`/api/usuarios/activar/${testUserId}`)
      .set('Authorization', adminToken)
      .send({ activo: true });

    expect(res.status).toBe(200);
    expect(res.body.usuario).toHaveProperty('activo', true);
  });

  // Test: calcular el saldo de un usuario
  it('deberia calcular el saldo de un usuario', async () => {
    const res = await request(app)
      .get(`/api/usuarios/obtener/${testUserId}`)
      .set('Authorization', token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('saldo', '0.00'); // Compruebo que el saldo es correcto
  });

  // Test: eliminar un usuario (solo admin)
  it('deberia eliminar un usuario (solo admin)', async () => {
    const newUser = await Usuario.create(
      'Usuario a Eliminar',
      'delete.me@example.com',
      'delete123',
      'usuario',
      '123123123'
    );
    const res = await request(app)
      .delete(`/api/usuarios/eliminar/${newUser.id_usuario}`)
      .set('Authorization', adminToken);

    expect(res.status).toBe(204);
  });
});