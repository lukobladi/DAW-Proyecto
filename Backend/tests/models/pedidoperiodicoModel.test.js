const PedidoPeriodico = require('../../models/PedidoPeriodico');
const pool = require('../../db');

describe('PedidoPeriodico Model', () => {
  let pedidoPeriodicoId; // Para almacenar el ID del pedido periódico creado
  const pedidoPeriodicoData = {
    id_usuario: 1,
    id_producto: 1,
    cantidad: 5,
    fecha_fin: '2023-12-31T23:59:59Z',
    activo: true,
  };

  afterAll(async () => {
    await pool.end(); // Cierra la conexión a la base de datos después de las pruebas
  });

  afterEach(async () => {
    // Limpiar los pedidos periódicos creados durante los tests
    await pool.query('DELETE FROM pedido_periodico WHERE id_usuario = $1', [1]);
    const pedidosPeriodicos = await PedidoPeriodico.obtenerTodos();
    expect(pedidosPeriodicos.filter(p => p.id_usuario === 1)).toHaveLength(0); // Validar que no queden registros
  });

  it('Debería crear un nuevo pedido periódico', async () => {
    const nuevoPedidoPeriodico = await PedidoPeriodico.crear(pedidoPeriodicoData);
    expect(nuevoPedidoPeriodico).toHaveProperty('id_pedido_periodico');
    pedidoPeriodicoId = nuevoPedidoPeriodico.id_pedido_periodico; // Guardar el ID del pedido periódico creado
  });

  it('Debería obtener todos los pedidos periódicos', async () => {
    const pedidosPeriodicos = await PedidoPeriodico.obtenerTodos();
    expect(pedidosPeriodicos).toBeInstanceOf(Array);
    if (pedidosPeriodicos.length > 0) {
      expect(pedidosPeriodicos[0]).toHaveProperty('id_pedido_periodico');
      expect(pedidosPeriodicos[0]).toHaveProperty('cantidad');
    }
  });

  it('Debería actualizar un pedido periódico', async () => {
    const pedidoPeriodicoActualizado = await PedidoPeriodico.actualizar(pedidoPeriodicoId, {
      ...pedidoPeriodicoData,
      cantidad: 10,
    });
    expect(pedidoPeriodicoActualizado).toHaveProperty('cantidad', 10);
  });

  it('Debería eliminar un pedido periódico', async () => {
    const pedidoPeriodicoEliminado = await PedidoPeriodico.eliminar(pedidoPeriodicoId);
    expect(pedidoPeriodicoEliminado).toHaveProperty('id_pedido_periodico', pedidoPeriodicoId);
  });

  it('Debería manejar un caso de error al eliminar un pedido periódico inexistente', async () => {
    try {
      await PedidoPeriodico.eliminar(9999); // ID inexistente
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});


// Cerrar conexiones
afterAll(async () => {
  await pool.end(); // Cierra la conexión a la base de datos
});