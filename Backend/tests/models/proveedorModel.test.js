const Proveedor = require('../../models/Proveedor');
const pool = require('../../db');

describe('Proveedor Model', () => {
  let proveedorId; // Para almacenar el ID del proveedor creado
  const proveedorData = {
    nombre: 'Proveedor Ejemplo',
    direccion: 'Calle Falsa 123',
    telefono: '123456789',
    email: 'proveedor@ejemplo.com',
  };

  afterAll(async () => {
    await pool.end(); // Cierra la conexión a la base de datos después de las pruebas
  });

  afterEach(async () => {
    // Limpiar los proveedores creados durante los tests
    await pool.query('DELETE FROM proveedor WHERE nombre = $1', ['Proveedor Ejemplo']);
    const proveedores = await Proveedor.findAll();
    expect(proveedores.filter(p => p.nombre === 'Proveedor Ejemplo')).toHaveLength(0); // Validar que no queden registros
  });

  it('Debería crear un nuevo proveedor', async () => {
    const nuevoProveedor = await Proveedor.create(
      proveedorData.nombre,
      proveedorData.direccion,
      proveedorData.telefono,
      proveedorData.email
    );
    expect(nuevoProveedor).toHaveProperty('id_proveedor');
    proveedorId = nuevoProveedor.id_proveedor; // Guardar el ID del proveedor creado
  });

  it('Debería obtener todos los proveedores', async () => {
    const proveedores = await Proveedor.findAll();
    expect(proveedores).toBeInstanceOf(Array);
    if (proveedores.length > 0) {
      expect(proveedores[0]).toHaveProperty('id_proveedor');
      expect(proveedores[0]).toHaveProperty('nombre');
    }
  });

  it('Debería obtener un proveedor por ID', async () => {
    const proveedor = await Proveedor.findById(proveedorId);
    expect(proveedor).toHaveProperty('id_proveedor', proveedorId);
  });

  it('Debería actualizar un proveedor', async () => {
    const proveedorActualizado = await Proveedor.update(
      proveedorId,
      'Proveedor Actualizado',
      proveedorData.direccion,
      proveedorData.telefono,
      proveedorData.email
    );
    expect(proveedorActualizado).toHaveProperty('nombre', 'Proveedor Actualizado');
  });

  it('Debería eliminar un proveedor', async () => {
    await Proveedor.delete(proveedorId);
    const proveedor = await Proveedor.findById(proveedorId);
    expect(proveedor).toBeUndefined();
  });

  it('Debería manejar un caso de error al eliminar un proveedor inexistente', async () => {
    try {
      await Proveedor.delete(9999); // ID inexistente
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});


// Cerrar conexiones
afterAll(async () => {
  await pool.end(); // Cierra la conexión a la base de datos
});