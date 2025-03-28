const DetallePedido = require('../../models/DetallePedido');
const pool = require('../../db');


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


describe('DetallePedido Model', () => {
  let detalleId; // Para almacenar el ID del detalle creado
  const detalleData = {
    id_pedido: 1,
    id_producto: 1,
    cantidad: 2,
    precio_total: 20.50,
  };

  afterAll(async () => {
    await pool.end(); // Cierra la conexión a la base de datos después de las pruebas
  });

  it('Debería crear un nuevo detalle de pedido', async () => {
    const nuevoDetalle = await DetallePedido.create(
      detalleData.id_pedido,
      detalleData.id_producto,
      detalleData.cantidad,
      detalleData.precio_total
    );
    expect(nuevoDetalle).toHaveProperty('id_detalle');
    detalleId = nuevoDetalle.id_detalle; // Guardar el ID del detalle creado
  });

  it('Debería obtener todos los detalles de un pedido', async () => {
    const detalles = await DetallePedido.findByPedidoId(detalleData.id_pedido);
    expect(detalles).toBeInstanceOf(Array);
    if (detalles.length > 0) {
      expect(detalles[0]).toHaveProperty('id_detalle');
      expect(detalles[0]).toHaveProperty('id_pedido');
    }
  });

  it('Debería actualizar un detalle de pedido', async () => {
    const updatedDetalle = await DetallePedido.update(
      detalleId,
      detalleData.id_pedido,
      detalleData.id_producto,
      3, // Nueva cantidad
      30.75 // Nuevo precio total
    );
    expect(updatedDetalle).toHaveProperty('cantidad', 3);
    expect(updatedDetalle).toHaveProperty('precio_total', 30.75);
  });

  it('Debería eliminar un detalle de pedido', async () => {
    await DetallePedido.delete(detalleId);
    const detalles = await DetallePedido.findByPedidoId(detalleData.id_pedido);
    expect(detalles.find((detalle) => detalle.id_detalle === detalleId)).toBeUndefined();
  });

  it('Debería manejar un caso de error al buscar un detalle inexistente', async () => {
    try {
      await DetallePedido.findByPedidoId(9999); // ID inexistente
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

