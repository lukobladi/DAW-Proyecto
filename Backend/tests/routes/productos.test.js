const request = require('supertest');
const app = require('../../index'); // Importa la app sin iniciar el servidor


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
  // Limpiar los productos creados durante los tests
  await pool.query('DELETE FROM producto WHERE nombre = $1', ['Manzana']);
});

describe('Productos Endpoints', () => {
  let productoId; // Para almacenar el ID del producto creado
  const productoData = {
    nombre: 'Manzana',
    descripcion: 'Manzana roja orgánica',
    precio: 1.50,
    id_proveedor: 1,
  };

  it('Debería crear un nuevo producto', async () => {
    const res = await request(app)
      .post('/api/productos/crear')
      .set('Authorization', `Bearer ${token}`) // Ensure token is included
      .field('nombre', productoData.nombre)
      .field('descripcion', productoData.descripcion)
      .field('precio', productoData.precio)
      .field('id_proveedor', productoData.id_proveedor);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id_producto');
    productoId = res.body.id_producto; // Guardar el ID del producto creado
  });

  it('Debería obtener todos los productos', async () => {
    const res = await request(app)
      .get('/api/productos/obtenerTodos')
      .set('Authorization', `Bearer ${token}`); // Add token
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('id_producto');
      expect(res.body[0]).toHaveProperty('nombre');
    }
  });

  it('Debería obtener un producto por ID', async () => {
    const res = await request(app)
      .get(`/api/productos/obtener/${productoId}`)
      .set('Authorization', `Bearer ${token}`); // Add token
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id_producto', productoId);
  });

  it('Debería actualizar un producto', async () => {
    const updatedData = { ...productoData, nombre: 'Manzana Verde' };
    const res = await request(app)
      .put(`/api/productos/actualizar/${productoId}`)
      .set('Authorization', `Bearer ${token}`) // Add token
      .field('nombre', updatedData.nombre)
      .field('descripcion', updatedData.descripcion)
      .field('precio', updatedData.precio)
      .field('id_proveedor', updatedData.id_proveedor);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('nombre', 'Manzana Verde');
  });

  it('Debería eliminar un producto', async () => {
    const res = await request(app)
      .delete(`/api/productos/eliminar/${productoId}`)
      .set('Authorization', `Bearer ${token}`); // Add token
    expect(res.statusCode).toEqual(204);
  });

  it('Debería manejar un caso de error al obtener un producto inexistente', async () => {
    const res = await request(app)
      .get('/api/productos/obtener/9999')
      .set('Authorization', `Bearer ${token}`); // Add token
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});


