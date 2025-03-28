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
  // Limpiar las relaciones creadas durante los tests
  await pool.query('DELETE FROM usuario_proveedor WHERE id_usuario = $1 AND id_proveedor = $2', [1, 1]);
});

beforeAll(async () => {
  token = await getAuthToken(); // Obtén el token antes de los tests
});


describe('UsuarioProveedor Endpoints', () => {
  let relacionId; // Para almacenar la relación creada
  const relacionData = {
    id_usuario: 1,
    id_proveedor: 1,
  };

  it('Debería crear una nueva relación entre usuario y proveedor', async () => {
    const res = await request(app).post('/api/usuario-proveedor/crear').send(relacionData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id_usuario', relacionData.id_usuario);
    expect(res.body).toHaveProperty('id_proveedor', relacionData.id_proveedor);
  });

  it('Debería obtener todas las relaciones de un usuario', async () => {
    const res = await request(app).get(`/api/usuario-proveedor/obtenerProveedoresUsuario/${relacionData.id_usuario}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('Debería eliminar una relación entre usuario y proveedor', async () => {
    const res = await request(app)
      .delete('/api/usuario-proveedor')
      .query({ id_usuario: relacionData.id_usuario, id_proveedor: relacionData.id_proveedor });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Relación eliminada correctamente');
  });

  it('Debería manejar un caso de error al eliminar una relación inexistente', async () => {
    const res = await request(app)
      .delete('/api/usuario-proveedor')
      .query({ id_usuario: 9999, id_proveedor: 9999 });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});


