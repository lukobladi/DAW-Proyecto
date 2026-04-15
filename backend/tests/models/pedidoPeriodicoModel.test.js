// Tests unitarios para el modelo PedidoPeriodico

const PedidoPeriodico = require('../../src/models/PedidoPeriodico');
const Proveedor = require('../../src/models/Proveedor');
const pool = require('../../src/config/db');

describe('Modelo PedidoPeriodico', () => {
  let proveedorId;
  let pedidoPeriodicoId;

  beforeAll(async () => {
    const proveedor = await Proveedor.create(
      'Proveedor Pedido Periodico Test',
      'Contacto PP Test',
      '123456789',
      '321654987',
      'pedidoperiodico@test.com',
      'Transferencia',
      'mensual',
      true,
      true
    );
    proveedorId = proveedor.id_proveedor;
  });

  afterAll(async () => {
    if (proveedorId) {
      await Proveedor.delete(proveedorId);
    }
    await pool.end();
  });

  describe('crear', () => {
    it('deberia crear un pedido periodico', async () => {
      const pedido = await PedidoPeriodico.crear({
        id_proveedor: proveedorId,
        fecha_inicio: new Date().toISOString(),
        fecha_fin: null,
        activo: true,
        periodicidad: 7,
        dia_apertura: 1,
        dia_cierre: 4,
        dia_entrega: 6,
      });

      pedidoPeriodicoId = pedido.id_pedido_periodico;
      expect(pedido).toHaveProperty('id_pedido_periodico');
      expect(pedido.id_proveedor).toBe(proveedorId);
      expect(pedido.activo).toBe(true);
      expect(pedido.periodicidad).toBe(7);
    });
  });

  describe('obtenerTodos', () => {
    it('deberia obtener todos los pedidos periodicos', async () => {
      const pedidos = await PedidoPeriodico.obtenerTodos();
      expect(pedidos).toBeInstanceOf(Array);
    });
  });

  describe('obtenerPorProveedor', () => {
    it('deberia obtener pedidos periodicos por proveedor', async () => {
      const pedidos = await PedidoPeriodico.obtenerPorProveedor(proveedorId);
      expect(pedidos).toBeInstanceOf(Array);
      expect(pedidos.length).toBeGreaterThan(0);
    });

    it('deberia retornar array vacio si no hay pedidos para proveedor', async () => {
      const pedidos = await PedidoPeriodico.obtenerPorProveedor(99999);
      expect(pedidos).toBeInstanceOf(Array);
      expect(pedidos.length).toBe(0);
    });
  });

  describe('actualizar', () => {
    it('deberia actualizar un pedido periodico', async () => {
      if (!pedidoPeriodicoId) {
        const pedido = await PedidoPeriodico.crear({
          id_proveedor: proveedorId,
          fecha_inicio: new Date().toISOString(),
          fecha_fin: null,
          activo: true,
          periodicidad: 7,
          dia_apertura: 1,
          dia_cierre: 4,
          dia_entrega: 6,
        });
        pedidoPeriodicoId = pedido.id_pedido_periodico;
      }

      const actualizado = await PedidoPeriodico.actualizar(pedidoPeriodicoId, {
        id_proveedor: proveedorId,
        fecha_inicio: new Date().toISOString(),
        fecha_fin: null,
        activo: false,
        periodicidad: 14,
        dia_apertura: 2,
        dia_cierre: 5,
        dia_entrega: 7,
      });

      expect(actualizado).not.toBeNull();
      expect(actualizado.activo).toBe(false);
      expect(actualizado.periodicidad).toBe(14);
    });
  });

  describe('cambiarEstado', () => {
    it('deberia cambiar el estado activo/inactivo', async () => {
      if (!pedidoPeriodicoId) {
        const pedido = await PedidoPeriodico.crear({
          id_proveedor: proveedorId,
          fecha_inicio: new Date().toISOString(),
          fecha_fin: null,
          activo: true,
          periodicidad: 7,
          dia_apertura: 1,
          dia_cierre: 4,
          dia_entrega: 6,
        });
        pedidoPeriodicoId = pedido.id_pedido_periodico;
      }

      const desactivado = await PedidoPeriodico.cambiarEstado(pedidoPeriodicoId, false);
      expect(desactivado).toHaveProperty('activo', false);

      const reactivado = await PedidoPeriodico.cambiarEstado(pedidoPeriodicoId, true);
      expect(reactivado).toHaveProperty('activo', true);
    });
  });

  describe('eliminar', () => {
    it('deberia eliminar un pedido periodico', async () => {
      const pedido = await PedidoPeriodico.crear({
        id_proveedor: proveedorId,
        fecha_inicio: new Date().toISOString(),
        fecha_fin: null,
        activo: true,
        periodicidad: 7,
        dia_apertura: 1,
        dia_cierre: 4,
        dia_entrega: 6,
      });

      const eliminado = await PedidoPeriodico.eliminar(pedido.id_pedido_periodico);
      expect(eliminado).toHaveProperty('id_pedido_periodico');
    });
  });
});
