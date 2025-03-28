const request = require('supertest');
const app = require('../../index'); // Importa la app sin iniciar el servidor
const pool = require('../../db'); // Importa la conexión a la base de datos
const { getAuthToken } = require('../testUtils'); // Importa la utilidad para obtener el token

let token; // Variable para almacenar el token de autenticación

afterAll(async () => {
  await pool.end(); // Cierra la conexión a la base de datos
});

beforeAll(async () => {
  token = await getAuthToken(); // Obtén el token antes de los tests
});

beforeEach(async () => {
  // Limpiar los datos de prueba antes de cada test
  await pool.query('DELETE FROM usuario WHERE correo = $1', ['enekoloko7@hotmail.com']);
});

afterEach(async () => {
  // Limpiar los datos de prueba después de cada test
  await pool.query('DELETE FROM usuario WHERE correo = $1', ['enekoloko7@hotmail.com']);
});

describe('Usuarios Endpoints', () => {
  let usuarioId; // Para almacenar el ID del usuario creado
  const usuarioData = {
    nombre: 'Eneko',
    correo: 'enekoloko7@hotmail.com',
    password: '1234',
    rol: 'usuario',
    movil: '123456789',
  };

  it('Debería registrar un nuevo usuario', async () => {
    const res = await request(app)
      .post('/api/usuarios/registrar')
      .send(usuarioData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id_usuario');
    usuarioId = res.body.id_usuario; // Guardar el ID del usuario creado
  });

  it('Debería obtener todos los usuarios', async () => {
    const res = await request(app)
      .get('/api/usuarios/obtenerTodos')
      .set('Authorization', `Bearer ${token}`); // Ensure token is included
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('Debería obtener un usuario por ID', async () => {
    const res = await request(app)
      .get(`/api/usuarios/obtener/${usuarioId}`)
      .set('Authorization', `Bearer ${token}`); // Ensure token is included
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id_usuario', usuarioId);
  });

  it('Debería actualizar un usuario', async () => {
    const updatedData = { ...usuarioData, nombre: 'Juan Actualizado' };
    const res = await request(app)
      .put(`/api/usuarios/actualizar/${usuarioId}`)
      .set('Authorization', `Bearer ${token}`) // Ensure token is included
      .send(updatedData);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('nombre', 'Juan Actualizado');
  });

  it('Debería eliminar un usuario', async () => {
    const res = await request(app)
      .delete(`/api/usuarios/eliminar/${usuarioId}`)
      .set('Authorization', `Bearer ${token}`); // Ensure token is included
    expect(res.statusCode).toEqual(204);
  });

  it('Debería manejar un caso de error al obtener un usuario inexistente', async () => {
    const res = await request(app)
      .get('/api/usuarios/obtener/9999')
      .set('Authorization', `Bearer ${token}`); // Agregar el token en los headers
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});