const Pedido = require('../../models/Pedido');
const pool = require('../../db');

describe('Pedido Model', () => {
  let pedidoId; // Para almacenar el ID del pedido creado
  const pedidoData = {
    fecha: '2023-10-01T12:00:00Z',
    id_usuario: 1,
    estado: 'pendiente',
  };

  afterEach(async () => {
    // Limpiar los pedidos creados durante los tests
    await pool.query('DELETE FROM pedido WHERE id_usuario = $1', [1]);
    const pedidos = await Pedido.findAll();
    expect(pedidos.filter(p => p.id_usuario === 1)).toHaveLength(0); // Validar que no queden registros
  });

  afterAll(async () => {
    await pool.end(); // Cierra la conexión a la base de datos después de las pruebas
  });

  it('Debería crear un nuevo pedido', async () => {
    const nuevoPedido = await Pedido.create(pedidoData.fecha, pedidoData.id_usuario, pedidoData.estado);
    expect(nuevoPedido).toHaveProperty('id_pedido');
    pedidoId = nuevoPedido.id_pedido; // Guardar el ID del pedido creado
  });

  it('Debería obtener todos los pedidos', async () => {
    const pedidos = await Pedido.findAll();
    expect(pedidos).toBeInstanceOf(Array);
    if (pedidos.length > 0) {
      expect(pedidos[0]).toHaveProperty('id_pedido');
      expect(pedidos[0]).toHaveProperty('estado');
    }
  });

  it('Debería obtener un pedido por ID', async () => {
    const pedido = await Pedido.findById(pedidoId);
    expect(pedido).toHaveProperty('id_pedido', pedidoId);
  });

  it('Debería actualizar un pedido', async () => {
    const pedidoActualizado = await Pedido.update(pedidoId, pedidoData.fecha, pedidoData.id_usuario, 'completado');
    expect(pedidoActualizado).toHaveProperty('estado', 'completado');
  });

  it('Debería eliminar un pedido', async () => {
    await Pedido.delete(pedidoId);
    const pedido = await Pedido.findById(pedidoId);
    expect(pedido).toBeUndefined();
  });

  it('Debería manejar un caso de error al eliminar un pedido inexistente', async () => {
    try {
      await Pedido.delete(9999); // ID inexistente
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});


// Cerrar conexiones
afterAll(async () => {
  await pool.end(); // Cierra la conexión a la base de datos
});