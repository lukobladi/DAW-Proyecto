<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-0">Historial de Pedidos</h2>
      <button class="btn btn-outline-primary" @click="cargarHistorial" :disabled="cargando">
        {{ cargando ? 'Actualizando...' : 'Actualizar' }}
      </button>
    </div>

    <div v-if="cargando" class="estado">Cargando historial...</div>
    <div v-else-if="errorCarga" class="estado error">{{ errorCarga }}</div>
    <div v-else-if="!pedidosHistorial.length" class="estado">
      Todavia no tienes pedidos en tu historial.
    </div>

    <div v-else class="row g-3">
      <div v-for="pedido in pedidosHistorial" :key="pedido.id_pedido" class="col-12 col-md-6 col-lg-4">
        <div class="pedido-card h-100">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="mb-0">Pedido #{{ pedido.id_pedido }}</h5>
            <span :class="['estado-pill', estadoClass(pedido.estado)]">{{ pedido.estado }}</span>
          </div>
          <p class="mb-1"><strong>Proveedor:</strong> {{ pedido.proveedor }}</p>
          <p class="mb-1"><strong>Productos:</strong> {{ pedido.num_lineas }}</p>
          <p class="mb-1"><strong>Unidades:</strong> {{ pedido.unidades_total }}</p>
          <p class="mb-1"><strong>Importe:</strong> {{ pedido.importe_total }} EUR</p>
          <p class="mb-3"><strong>Entrega:</strong> {{ formatFecha(pedido.fecha_entrega) }}</p>
          <button class="btn btn-primary btn-sm" @click="verDetalles(pedido.id_pedido)">
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import { useAuthStore } from '@/store';

export default {
  data() {
    return {
      cargando: false,
      errorCarga: '',
      pedidosHistorial: [],
    };
  },
  computed: {
    isAdminOrGestor() {
      const authStore = useAuthStore();
      return authStore.user?.rol === 'admin' || authStore.user?.rol === 'gestor';
    },
  },
  async created() {
    await this.cargarHistorial();
  },
  methods: {
    formatFecha(fechaIso) {
      if (!fechaIso) {
        return '-';
      }
      return new Date(fechaIso).toLocaleString('es-ES');
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
    async cargarHistorial() {
      this.cargando = true;
      this.errorCarga = '';

      try {
        const authStore = useAuthStore();
        const userId = Number(authStore.user?.id_usuario);
        if (!userId) {
          this.errorCarga = 'No se pudo identificar el usuario actual.';
          return;
        }

        const pedidosPromise = this.isAdmin ? api.getPedidos() : api.getMisPedidos();
        const [pedidosResponse, proveedoresResponse] = await Promise.all([
          pedidosPromise,
          api.getProveedores(),
        ]);

        const pedidos = pedidosResponse.data || [];
        const proveedores = proveedoresResponse.data || [];
        const proveedorPorId = new Map(
          proveedores.map((proveedor) => [proveedor.id_proveedor, proveedor.nombre])
        );

        const detallesResponse = await Promise.all(
          pedidos.map((pedido) => api.getDetallesPedidoPorPedido(pedido.id_pedido))
        );

        const historial = [];
        detallesResponse.forEach((response, index) => {
          const pedido = pedidos[index];
          const detallesUsuario = (response.data || []).filter(
            (detalle) =>
              Number(detalle.id_usuario_comprador) === userId && Number(detalle.cantidad || 0) > 0
          );

          if (!detallesUsuario.length) {
            return;
          }

          const unidadesTotal = detallesUsuario.reduce(
            (total, detalle) => total + Number(detalle.cantidad || 0),
            0
          );

          const importeTotal = detallesUsuario.reduce(
            (total, detalle) => total + Number(detalle.cantidad || 0) * Number(detalle.precio_unitario || 0),
            0
          );

          historial.push({
            id_pedido: pedido.id_pedido,
            proveedor: proveedorPorId.get(pedido.id_proveedor) || 'Proveedor sin nombre',
            estado: pedido.estado,
            fecha_entrega: pedido.fecha_entrega,
            num_lineas: detallesUsuario.length,
            unidades_total: unidadesTotal,
            importe_total: importeTotal.toFixed(2),
          });
        });

        this.pedidosHistorial = historial.sort(
          (a, b) => new Date(b.fecha_entrega || 0) - new Date(a.fecha_entrega || 0)
        );
      } catch {
        this.errorCarga = 'No se pudo cargar el historial de pedidos.';
      } finally {
        this.cargando = false;
      }
    },
    verDetalles(pedidoId) {
      this.$router.push({ name: 'DetallesPedido', params: { id: pedidoId } });
    },
  },
};
</script>

<style scoped>
.estado {
  padding: 1rem 0;
}

.estado.error {
  color: #dc3545;
}

.pedido-card {
  border: 1px solid #dee2e6;
  border-radius: 10px;
  padding: 1rem;
  background: #fff;
}

.estado-pill {
  display: inline-block;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.8rem;
}

.estado-pendiente {
  color: #664d03;
  background-color: #fff3cd;
}

.estado-proceso {
  color: #055160;
  background-color: #cff4fc;
}

.estado-entregado,
.estado-repartido {
  color: #0f5132;
  background-color: #d1e7dd;
}

.estado-cancelado {
  color: #842029;
  background-color: #f8d7da;
}
</style>
