<template>
  <div class="detalles-pedido-page">
    <div class="detalles-pedido-content container">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Detalles del Pedido #{{ pedidoId }}</h2>
        <router-link to="/historial" class="btn btn-outline-secondary">Volver al historial</router-link>
      </div>

      <div v-if="cargando" class="estado">Cargando detalles...</div>
      <div v-else-if="errorCarga" class="estado error">{{ errorCarga }}</div>

      <template v-else>
        <div class="info-pedido mb-4">
          <p><strong>Proveedor:</strong> {{ pedidoInfo.proveedor }}</p>
          <p><strong>Estado:</strong> <span :class="['estado-pill', estadoClass(pedidoInfo.estado)]">{{ pedidoInfo.estado }}</span></p>
          <p><strong>Fecha de entrega:</strong> {{ formatFecha(pedidoInfo.fecha_entrega) }}</p>
          <p><strong>Total:</strong> {{ totalPedido }} EUR</p>
        </div>

        <h4>Productos</h4>
        <div v-if="!productos.length" class="estado">No hay productos en este pedido.</div>
        <div v-else class="lista-productos">
          <div v-for="producto in productos" :key="producto.id_detalle" class="producto-card">
            <img
              :src="producto.imagen"
              alt="Imagen del producto"
              class="producto-imagen"
              @error="onImageError"
            />
            <h5>{{ producto.nombre }}</h5>
            <p>Cantidad: {{ producto.cantidad }}</p>
            <p>Precio Unitario: {{ producto.precio_unitario }} EUR</p>
            <p><strong>Total: {{ producto.total }} EUR</strong></p>
          </div>
        </div>
      </template>
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
      pedidoId: null,
      pedidoInfo: {
        proveedor: '',
        estado: '',
        fecha_entrega: null,
      },
      productos: [],
    };
  },
  computed: {
    totalPedido() {
      return this.productos.reduce((total, p) => total + Number(p.total || 0), 0).toFixed(2);
    },
  },
  async created() {
    this.pedidoId = this.$route.params.id;
    await this.cargarDetalles();
  },
  methods: {
    getBackendOrigin() {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
        return new URL(apiUrl).origin;
      }
      return window.location.origin;
    },
    normalizarImagen(imagen) {
      if (!imagen) return '/favicon.ico';
      if (imagen.startsWith('http://') || imagen.startsWith('https://')) return imagen;
      if (imagen.startsWith('/')) return `${this.getBackendOrigin()}${imagen}`;
      return `${this.getBackendOrigin()}/${imagen}`;
    },
    formatFecha(fechaIso) {
      if (!fechaIso) return '-';
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
    async cargarDetalles() {
      this.cargando = true;
      this.errorCarga = '';

      try {
        const authStore = useAuthStore();
        const userId = Number(authStore.user?.id_usuario);

        const [pedidoResponse, detallesResponse, proveedoresResponse, productosResponse] = await Promise.all([
          api.getPedidos(),
          api.getDetallesPedidoPorPedido(this.pedidoId),
          api.getProveedores(),
          api.getProductos(),
        ]);

        const pedido = (pedidoResponse.data || []).find(p => p.id_pedido === Number(this.pedidoId));
        if (!pedido) {
          this.errorCarga = 'Pedido no encontrado.';
          return;
        }

        const proveedor = (proveedoresResponse.data || []).find(
          p => p.id_proveedor === pedido.id_proveedor
        );
        this.pedidoInfo = {
          proveedor: proveedor?.nombre || 'Proveedor sin nombre',
          estado: pedido.estado,
          fecha_entrega: pedido.fecha_entrega,
        };

        const productosMap = new Map(
          (productosResponse.data || []).map(p => [p.id_producto, p])
        );

        this.productos = (detallesResponse.data || [])
          .filter(d => Number(d.id_usuario_comprador) === userId && Number(d.cantidad || 0) > 0)
          .map(detalle => {
            const producto = productosMap.get(detalle.id_producto) || {};
            return {
              id_detalle: detalle.id_detalle,
              nombre: producto.nombre || `Producto #${detalle.id_producto}`,
              imagen: this.normalizarImagen(producto.imagen),
              cantidad: Number(detalle.cantidad),
              precio_unitario: Number(detalle.precio_unitario || 0).toFixed(2),
              total: (Number(detalle.precio_unitario || 0) * Number(detalle.cantidad || 0)).toFixed(2),
            };
          });
      } catch (error) {
        console.error('Error cargando detalles:', error);
        this.errorCarga = 'No se pudieron cargar los detalles del pedido.';
      } finally {
        this.cargando = false;
      }
    },
    onImageError(event) {
      event.target.src = '/favicon.ico';
    },
  },
};
</script>

<style scoped>
.detalles-pedido-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.detalles-pedido-content {
  flex: 1;
  padding: var(--spacing-xl);
}

.info-pedido {
  background: var(--color-bg-secondary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

.info-pedido p {
  margin-bottom: var(--spacing-xs);
}

.lista-productos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.producto-card {
  border: 1px solid var(--color-border);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  text-align: center;
  background: var(--color-bg);
}

.producto-imagen {
  max-width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}
</style>