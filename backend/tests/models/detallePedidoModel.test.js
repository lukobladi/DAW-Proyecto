// Tests unitarios para el modelo DetallePedido
// Prueban las operaciones CRUD del modelo

const DetallePedido = require('../../src/models/DetallePedido');
const Pedido = require('../../src/models/Pedido');
const Producto = require('../../src/models/Producto');
const Proveedor = require('../../src/models/Proveedor');
const Usuario = require('../../src/models/Usuario');
const pool = require('../../src/config/db');

describe('Modelo DetallePedido', () => {
  let pedidoId;
  let productoId;
  let proveedorId;
  let usuarioId;

  // Datos de prueba
  const proveedorData = {
    nombre: 'Proveedor Test Detalle',
    contacto: 'Pedro Martinez',
    telefono: '555666777',
    movil: '777888999',
    correo: 'johiwa3415@soco7.com',
    metodo_pago: 'Efectivo',
    frecuencia_pedido_aproximada: 'semanal',
    envio_movil: true,
    envio_mail: true,
  };

  beforeAll(async () => {
    // Crear proveedor
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

    // Crear producto
    const producto = await Producto.create(
      'Producto Test Detalle',
      'Descripcion producto test',
      5.50,
      proveedorId,
      null
    );
    productoId = producto.id_producto;

    // Crear usuario encargado
    const usuarioEncargado = await Usuario.create(
      'Usuario Encargado Detalle',
      `usuario.encargado.detalle+${Date.now()}@test.com`,
      'password123',
      'usuario',
      '111222333'
    );

    // Crear usuario comprador
    const usuarioComprador = await Usuario.create(
      'Usuario Comprador Detalle',
      `usuario.comprador.detalle+${Date.now()}@test.com`,
      'password123',
      'usuario',
      '123456789'
    );
    usuarioId = usuarioComprador.id_usuario;

// Crear pedido
    const pedido = await Pedido.create(
      usuarioEncargado.id_usuario, // id_usuario_encargado
      proveedorId,
      new Date().toISOString(),
      new Date(Date.now() + 86400000).toISOString(),
      new Date(Date.now() + 172800000).toISOString(),
      'pendiente' // tiene que ser uno de: pendiente, en proceso, entregado, repartido, cancelado
    );
    pedidoId = pedido.id_pedido;
  });

  afterAll(async () => {
    // Limpiar todo al terminar
    if (productoId) await Producto.delete(productoId);
    if (pedidoId) await Pedido.delete(pedidoId);
    if (proveedorId) await Proveedor.delete(proveedorId);
    if (usuarioId) await Usuario.delete(usuarioId);
    await pool.end();
  });

  // Test: crear un detalle de pedido
  it('deberia crear un nuevo detalle de pedido', async () => {
    const detalle = await DetallePedido.create(
      pedidoId,
      productoId,
      2, // cantidad
      5.50, // precio_unitario
      usuarioId
    );
    expect(detalle).toHaveProperty('id_detalle');
    expect(detalle.cantidad).toBe(2);
    
    // Limpiar
    await DetallePedido.delete(detalle.id_detalle);
  });

  // Test: obtener detalles por pedido
  it('deberia obtener detalles por pedido', async () => {
    // Crear detalle primero
    const detalle = await DetallePedido.create(
      pedidoId,
      productoId,
      3,
      5.50,
      usuarioId
    );

    const detalles = await DetallePedido.findByPedidoId(pedidoId);
    expect(detalles).toBeInstanceOf(Array);
    expect(detalles.length).toBeGreaterThan(0);

    // Limpiar
    await DetallePedido.delete(detalle.id_detalle);
  });

  // Test: obtener detalle por ID
  it('deberia obtener un detalle por ID', async () => {
    const detalle = await DetallePedido.create(
      pedidoId,
      productoId,
      1,
      5.50,
      usuarioId
    );

    const detalleObtenido = await DetallePedido.findById(detalle.id_detalle);
    expect(detalleObtenido).not.toBeNull();
    expect(detalleObtenido).toHaveProperty('id_detalle', detalle.id_detalle);

    // Limpiar
    await DetallePedido.delete(detalle.id_detalle);
  });

  // Test: actualizar cantidad de un detalle
  it('deberia actualizar la cantidad de un detalle', async () => {
    const detalle = await DetallePedido.create(
      pedidoId,
      productoId,
      2,
      5.50,
      usuarioId
    );

    const detalleActualizado = await DetallePedido.updateCantidad(detalle.id_detalle, 5);
    expect(detalleActualizado).toHaveProperty('cantidad', 5);

    // Limpiar
    await DetallePedido.delete(detalle.id_detalle);
  });

  // Test: actualizar un detalle completo
  it('deberia actualizar un detalle completo', async () => {
    const detalle = await DetallePedido.create(
      pedidoId,
      productoId,
      2,
      5.50,
      usuarioId
    );

    const detalleActualizado = await DetallePedido.update(
      detalle.id_detalle,
      pedidoId,
      productoId,
      10,
      5.50,
      usuarioId
    );
    expect(detalleActualizado).toHaveProperty('cantidad', 10);

    // Limpiar
    await DetallePedido.delete(detalle.id_detalle);
  });

  // Test: eliminar un detalle (pone cantidad a 0)
  it('deberia eliminar un detalle (poner cantidad a 0)', async () => {
    const detalle = await DetallePedido.create(
      pedidoId,
      productoId,
      1,
      5.50,
      usuarioId
    );

    const detalleEliminado = await DetallePedido.delete(detalle.id_detalle);
    // El delete en este modelo pone la cantidad a 0, no borra el registro
    expect(detalleEliminado).toHaveProperty('cantidad', 0);
  });
});