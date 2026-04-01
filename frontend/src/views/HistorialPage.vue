<template>
  <div class="page-content container">
    <h2>Historial de Pedidos</h2>
    <p>Pedidos en los que has realizado alguna compra.</p>

    <div v-if="cargando" class="estado">Cargando pedidos...</div>
    <div v-else-if="errorCarga" class="estado error">{{ errorCarga }}</div>
    <div v-else-if="!pedidos.length" class="estado">No has realizado ninguna compra todavia.</div>

    <template v-else>
      <div class="table-responsive d-none d-md-block">
        <table class="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Proveedor</th>
              <th>Apertura</th>
              <th>Cierre</th>
              <th>Entrega</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pedido in pedidos" :key="pedido.id_pedido">
              <td>{{ pedido.id_pedido }}</td>
              <td>{{ pedido.proveedor }}</td>
              <td>{{ formatFecha(pedido.fecha_apertura) }}</td>
              <td>{{ formatFecha(pedido.fecha_cierre) }}</td>
              <td>{{ formatFecha(pedido.fecha_entrega) }}</td>
              <td>
                <span :class="['estado-pill', estadoClass(pedido.estado)]">{{ pedido.estado }}</span>
              </td>
              <td>
                <button class="btn btn-sm btn-info" @click="verDetalles(pedido.id_pedido)">Ver detalles</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-md-none">
        <div v-for="pedido in pedidos" :key="pedido.id_pedido" class="pedido-card-mobile">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="mb-0">Pedido #{{ pedido.id_pedido }}</h5>
            <span :class="['estado-pill', 'sm', estadoClass(pedido.estado)]">{{ pedido.estado }}</span>
          </div>
          <p class="mb-1"><strong>Proveedor:</strong> {{ pedido.proveedor }}</p>
          <p class="mb-1"><strong>Apertura:</strong> {{ formatFecha(pedido.fecha_apertura) }}</p>
          <p class="mb-1"><strong>Cierre:</strong> {{ formatFecha(pedido.fecha_cierre) }}</p>
          <p class="mb-1"><strong>Entrega:</strong> {{ formatFecha(pedido.fecha_entrega) }}</p>
          <div class="d-flex gap-2 flex-nowrap mt-2">
            <button class="btn btn-sm btn-info" @click="verDetalles(pedido.id_pedido)">Ver detalles</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import api from '@/services/api';
import { useAuthStore } from '@/store';

export default {
  data() {
    return {
      pedidos: [],
      cargando: false,
      errorCarga: '',
    };
  },
  async created() {
    await this.cargarDatos();
  },
  methods: {
    formatFecha(fechaIso) {
      if (!fechaIso) {
        return '-';
      }
      return new Date(fechaIso).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    },
    estadoClass(estado) {
      const classes = {
        pendiente: 'estado-pendiente',
        'en proceso': 'estado-proceso',
        entregado: 'estado-entregado',
        repartido: 'estado-repartido',
        cancelado: 'estado-cancelado',
      };
      return classes[estado] || 'estado-pendiente';
    },
    async cargarDatos() {
      this.cargando = true;
      this.errorCarga = '';

      try {
        const authStore = useAuthStore();
        const userId = Number(authStore.user?.id_usuario);
        if (!userId) {
          this.errorCarga = 'No se pudo identificar al usuario.';
          this.cargando = false;
          return;
        }

        const [pedidosResponse, proveedoresResponse] = await Promise.all([
          api.getPedidos(),
          api.getProveedores(),
        ]);

        const proveedores = proveedoresResponse.data || [];
        const proveedorPorId = new Map(
          proveedores.map((p) => [p.id_proveedor, p.nombre])
        );

        const todosPedidos = pedidosResponse.data || [];

        const pedidosConCompra = [];

        for (const pedido of todosPedidos) {
          try {
            const detallesResponse = await api.getDetallesPedidoPorPedido(pedido.id_pedido);
            const detalles = detallesResponse.data || [];
            const tieneCompra = detalles.some(
              (d) => Number(d.id_usuario_comprador) === userId && Number(d.cantidad) > 0
            );
            if (tieneCompra) {
              pedidosConCompra.push({
                ...pedido,
                proveedor: proveedorPorId.get(pedido.id_proveedor) || 'Proveedor sin nombre',
              });
            }
          } catch {
            // Skip errors for individual pedido details
          }
        }

        this.pedidos = pedidosConCompra.sort((a, b) => {
          const fechaA = a.fecha_cierre || '9999-12-31';
          const fechaB = b.fecha_cierre || '9999-12-31';
          return new Date(fechaB) - new Date(fechaA);
        });
      } catch {
        this.errorCarga = 'No se pudieron cargar los pedidos.';
      } finally {
        this.cargando = false;
      }
    },
    verDetalles(idPedido) {
      this.$router.push({ name: 'DetallesPedido', params: { id: idPedido }, query: { from: 'historial' } });
    },
  },
};
</script>

<style scoped>
.pedido-card-mobile {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  background: var(--color-bg);
}
</style>
