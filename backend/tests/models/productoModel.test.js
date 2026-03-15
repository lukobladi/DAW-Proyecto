// Tests unitarios para el modelo Producto
// Prueban las operaciones CRUD del modelo

const Producto = require('../../src/models/Producto');
const Proveedor = require('../../src/models/Proveedor');
const pool = require('../../src/config/db');

describe('Modelo Producto', () => {
  let proveedorId;
  let productoId;

  // Datos del proveedor de prueba
  const proveedorData = {
    nombre: 'Proveedor Test Producto',
    contacto: 'Juan Lopez',
    telefono: '111222333',
    movil: '444555666',
    correo: 'proveedor.producto@test.com',
    metodo_pago: 'Transferencia',
    frecuencia_pedido_aproximada: 'semanal',
    envio_movil: true,
    envio_mail: true,
  };

  // Datos del producto de prueba
  const productoData = {
    nombre: 'Producto Test',
    descripcion: 'Descripcion del producto de prueba',
    precio: 10.50,
    imagen: null,
  };

  beforeAll(async () => {
    // Crear proveedor para asociar los productos
    const proveedor = await Proveedor.create(
      proveedorData.nombre,
      proveedorData.contacto,
      proveedorData.telefono,
      proveedorData.movil,
      proveedorData.correo,
      proveedorData.metodo_pago,
      proveedorData.frecuencia_pedido_aproximada,
      proveedorData.envio_movil,
      proveedorData.envio_mail
    );
    proveedorId = proveedor.id_proveedor;
  });

  beforeEach(async () => {
    // Crear producto para cada prueba
    const producto = await Producto.create(
      productoData.nombre,
      productoData.descripcion,
      productoData.precio,
      proveedorId,
      productoData.imagen
    );
    productoId = producto.id_producto;
  });

  afterEach(async () => {
    // Limpiar producto despues de cada prueba
    if (productoId) {
      await Producto.delete(productoId);
      productoId = null;
    }
  });

  afterAll(async () => {
    // Limpiar proveedor al terminar
    if (proveedorId) {
      await Proveedor.delete(proveedorId);
    }
    await pool.end();
  });

  // Test: crear un nuevo producto
  it('deberia crear un nuevo producto', async () => {
    const nuevoProducto = await Producto.create(
      'Nuevo Producto Test',
      'Descripcion nueva',
      25.99,
      proveedorId,
      null
    );
    expect(nuevoProducto).toHaveProperty('id_producto');
    expect(nuevoProducto.nombre).toBe('Nuevo Producto Test');
    expect(parseFloat(nuevoProducto.precio)).toBe(25.99);
    await Producto.delete(nuevoProducto.id_producto);
  });

  // Test: obtener todos los productos
  it('deberia obtener todos los productos', async () => {
    const productos = await Producto.findAll();
    expect(productos).toBeInstanceOf(Array);
    expect(productos.length).toBeGreaterThan(0);
  });

  // Test: obtener un producto por ID
  it('deberia obtener un producto por ID', async () => {
    const producto = await Producto.findById(productoId);
    expect(producto).not.toBeNull();
    expect(producto).toHaveProperty('id_producto', productoId);
    expect(producto).toHaveProperty('nombre', productoData.nombre);
  });

  // Test: obtener productos por proveedor
  it('deberia obtener productos por proveedor', async () => {
    const productos = await Producto.findByProveedor(proveedorId);
    expect(productos).toBeInstanceOf(Array);
    expect(productos.length).toBeGreaterThan(0);
    productos.forEach(p => {
      expect(p.id_proveedor).toBe(proveedorId);
    });
  });

  // Test: actualizar un producto
  it('deberia actualizar un producto', async () => {
    const productoActualizado = await Producto.update(
      productoId,
      'Producto Actualizado',
      'Nueva descripcion',
      99.99,
      proveedorId,
      null
    );
    expect(productoActualizado).not.toBeNull();
    expect(productoActualizado.nombre).toBe('Producto Actualizado');
    expect(parseFloat(productoActualizado.precio)).toBe(99.99);
  });

  // Test: cambiar estado activo de un producto
  it('deberia cambiar el estado activo de un producto', async () => {
    const productoDesactivado = await Producto.updateActivo(productoId, false);
    expect(productoDesactivado).toHaveProperty('activo', false);

    const productoActivado = await Producto.updateActivo(productoId, true);
    expect(productoActivado).toHaveProperty('activo', true);
  });

  // Test: eliminar un producto
  it('deberia eliminar un producto', async () => {
    const nuevoProducto = await Producto.create(
      'Producto a Eliminar',
      'Descripcion',
      15.00,
      proveedorId,
      null
    );
    
    await Producto.delete(nuevoProducto.id_producto);
    
    const productoEliminado = await Producto.findById(nuevoProducto.id_producto);
    expect(productoEliminado).toBeUndefined();
  });
});