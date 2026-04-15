// Tests unitarios para el modelo Pedido
// Prueban las operaciones CRUD del modelo

const Pedido = require('../../src/models/Pedido');
const Proveedor = require('../../src/models/Proveedor');
const Usuario = require('../../src/models/Usuario');
const pool = require('../../src/config/db');

describe('Modelo Pedido', () => {
  let proveedorId;
  let usuarioId;
  let pedidoId;

  // Datos del proveedor de prueba
  const proveedorData = {
    nombre: 'Proveedor Test Pedido',
    contacto: 'Maria Garcia',
    telefono: '123123123',
    movil: '321321321',
    correo: 'proveedor.pedido@test.com',
    metodo_pago: 'Transferencia',
    frecuencia_pedido_aproximada: 'mensual',
    envio_movil: true,
    envio_mail: false,
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

    // Crear usuario para ser el encargado del pedido
    const usuario = await Usuario.create(
      'Usuario Encargado Test',
      `usuario.encargado+${Date.now()}@test.com`,
      'password123',
      'usuario',
      '999888777'
    );
    usuarioId = usuario.id_usuario;
  });

  beforeEach(async () => {
    const pedido = await Pedido.create(
      proveedorId,
      new Date().toISOString(),
      new Date(Date.now() + 86400000).toISOString(),
      new Date(Date.now() + 172800000).toISOString(),
      'pendiente'
    );
    pedidoId = pedido.id_pedido;
  });

  afterEach(async () => {
    // Limpiar el pedido despues de cada prueba
    if (pedidoId) {
      await Pedido.delete(pedidoId);
      pedidoId = null;
    }
  });

  afterAll(async () => {
    // Limpiar proveedor y usuario al terminar
    if (proveedorId) {
      await Proveedor.delete(proveedorId);
    }
    if (usuarioId) {
      await Usuario.delete(usuarioId);
    }
    await pool.end();
  });

  // Test: crear un nuevo pedido
  it('deberia crear un nuevo pedido', async () => {
    const nuevoPedido = await Pedido.create(
      proveedorId,
      new Date().toISOString(),
      new Date(Date.now() + 86400000).toISOString(),
      new Date(Date.now() + 172800000).toISOString(),
      'pendiente'
    );
    expect(nuevoPedido).toHaveProperty('id_pedido');
    expect(nuevoPedido.estado).toBe('pendiente');
    await Pedido.delete(nuevoPedido.id_pedido);
  });

  // Test: obtener todos los pedidos
  it('deberia obtener todos los pedidos', async () => {
    const pedidos = await Pedido.findAll();
    expect(pedidos).toBeInstanceOf(Array);
  });

  // Test: obtener un pedido por ID
  it('deberia obtener un pedido por ID', async () => {
    const pedido = await Pedido.findById(pedidoId);
    expect(pedido).not.toBeNull();
    expect(pedido).toHaveProperty('id_pedido', pedidoId);
  });

  // Test: obtener pedidos por proveedor
  it('deberia obtener pedidos por proveedor', async () => {
    const pedidos = await Pedido.findByProveedor(proveedorId);
    expect(pedidos).toBeInstanceOf(Array);
  });

  // Test: actualizar un pedido
  it('deberia actualizar un pedido', async () => {
    const pedidoActualizado = await Pedido.update(
      pedidoId,
      proveedorId,
      new Date().toISOString(),
      new Date(Date.now() + 86400000).toISOString(),
      new Date(Date.now() + 172800000).toISOString(),
      'en proceso'
    );
    expect(pedidoActualizado).not.toBeNull();
    expect(pedidoActualizado.estado).toBe('en proceso');
  });

  // Test: cambiar estado de un pedido
  it('deberia cambiar el estado de un pedido', async () => {
    const pedidoActualizado = await Pedido.changeStatus(pedidoId, 'entregado');
    expect(pedidoActualizado).toHaveProperty('estado', 'entregado');
  });

  // Test: eliminar un pedido
  it('deberia eliminar un pedido', async () => {
    const nuevoPedido = await Pedido.create(
      proveedorId,
      new Date().toISOString(),
      new Date(Date.now() + 86400000).toISOString(),
      new Date(Date.now() + 172800000).toISOString(),
      'pendiente'
    );
    
    await Pedido.delete(nuevoPedido.id_pedido);
    
    const pedidoEliminado = await Pedido.findById(nuevoPedido.id_pedido);
    expect(pedidoEliminado).toBeUndefined();
  });
});