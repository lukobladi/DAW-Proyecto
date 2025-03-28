const UsuarioProveedor = require('../../models/UsuarioProveedor');
const pool = require('../../db');

describe('UsuarioProveedor Model', () => {
  const relacionData = {
    id_usuario: 1,
    id_proveedor: 1,
  };

  afterEach(async () => {
    // Limpiar las relaciones creadas durante los tests
    await pool.query('DELETE FROM usuario_proveedor WHERE id_usuario = $1 AND id_proveedor = $2', [1, 1]);
    const relaciones = await UsuarioProveedor.obtenerPorUsuario(1);
    expect(relaciones).toHaveLength(0); // Validar que no queden registros
  });

  afterAll(async () => {
    await pool.end(); // Cierra la conexión a la base de datos después de las pruebas
  });

  it('Debería crear una nueva relación entre usuario y proveedor', async () => {
    const nuevaRelacion = await UsuarioProveedor.crear(relacionData);
    expect(nuevaRelacion).toHaveProperty('id_usuario', relacionData.id_usuario);
    expect(nuevaRelacion).toHaveProperty('id_proveedor', relacionData.id_proveedor);
  });

  it('Debería obtener todas las relaciones de un usuario', async () => {
    const relaciones = await UsuarioProveedor.obtenerPorUsuario(relacionData.id_usuario);
    expect(relaciones).toBeInstanceOf(Array);
  });

  it('Debería eliminar una relación entre usuario y proveedor', async () => {
    const relacionEliminada = await UsuarioProveedor.eliminar(relacionData);
    expect(relacionEliminada).toHaveProperty('id_usuario', relacionData.id_usuario);
    expect(relacionEliminada).toHaveProperty('id_proveedor', relacionData.id_proveedor);
  });
});


// Cerrar conexiones

afterAll(async () => {
  await pool.end(); // Cierra la conexión a la base de datos
});