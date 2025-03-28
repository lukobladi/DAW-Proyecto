const Producto = require('../../models/Producto');
const pool = require('../../db');

describe('Producto Model', () => {
  let productoId; // Para almacenar el ID del producto creado
  const productoData = {
    nombre: 'Manzana',
    descripcion: 'Manzana roja orgánica',
    precio: 1.50,
    id_proveedor: 1,
    imagen: null,
  };

  afterAll(async () => {
    await pool.end(); // Cierra la conexión a la base de datos después de las pruebas
  });

  afterEach(async () => {
    // Limpiar los productos creados durante los tests
    await pool.query('DELETE FROM producto WHERE nombre = $1', ['Manzana']);
    const productos = await Producto.findAll();
    expect(productos.filter(p => p.nombre === 'Manzana')).toHaveLength(0); // Validar que no queden registros
  });

  it('Debería crear un nuevo producto', async () => {
    const nuevoProducto = await Producto.create(
      productoData.nombre,
      productoData.descripcion,
      productoData.precio,
      productoData.id_proveedor,
      productoData.imagen
    );
    expect(nuevoProducto).toHaveProperty('id_producto');
    productoId = nuevoProducto.id_producto; // Guardar el ID del producto creado
  });

  it('Debería obtener todos los productos', async () => {
    const productos = await Producto.findAll();
    expect(productos).toBeInstanceOf(Array);
    if (productos.length > 0) {
      expect(productos[0]).toHaveProperty('id_producto');
      expect(productos[0]).toHaveProperty('nombre');
    }
  });

  it('Debería obtener un producto por ID', async () => {
    const producto = await Producto.findById(productoId);
    expect(producto).toHaveProperty('id_producto', productoId);
  });

  it('Debería actualizar un producto', async () => {
    const productoActualizado = await Producto.update(
      productoId,
      'Manzana Verde',
      productoData.descripcion,
      productoData.precio,
      productoData.id_proveedor,
      productoData.imagen
    );
    expect(productoActualizado).toHaveProperty('nombre', 'Manzana Verde');
  });

  it('Debería eliminar un producto', async () => {
    await Producto.delete(productoId);
    const producto = await Producto.findById(productoId);
    expect(producto).toBeUndefined();
  });

  it('Debería manejar un caso de error al eliminar un producto inexistente', async () => {
    try {
      await Producto.delete(9999); // ID inexistente
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});


// Cerrar conexiones
afterAll(async () => {
  await pool.end(); // Cierra la conexión a la base de datos
});