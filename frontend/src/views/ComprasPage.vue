<template>
  <div class="compras-page">
    <div class="compras-content">
      <h2>Compras</h2>
      <div v-if="cargando" class="estado">Cargando productos...</div>
      <div v-else-if="errorCarga" class="estado error">{{ errorCarga }}</div>
      <div v-else-if="!productos.length" class="estado">
        No hay productos disponibles en este momento.
      </div>
      <div v-else class="lista-productos">
        <div v-for="producto in productos" :key="producto.id" class="producto-card">
          <img
            :src="producto.imagen"
            alt="Imagen del producto"
            class="producto-imagen"
            @error="onImageError"
          />
          <h3>{{ producto.nombre }}</h3>
          <p>{{ producto.descripcion }}</p>
          <p>Precio: {{ producto.precio }}€</p>
          <p class="meta"><strong>Productor:</strong> {{ producto.proveedor }}</p>
          <p class="meta"><strong>Periodicidad:</strong> {{ producto.periodicidad }}</p>
          <p>
            <span :class="['estado-pill', producto.pedidoAbierto ? 'abierto' : 'cerrado']">
              {{ producto.pedidoAbierto ? 'Pedido abierto' : 'Pedido cerrado' }}
            </span>
          </p>
          <button
            @click="anadirACesta(producto)"
            class="btn btn-primary"
            :disabled="!producto.pedidoAbierto || anadiendoProductoId === producto.id"
          >
            {{
              anadiendoProductoId === producto.id
                ? 'Anadiendo...'
                : producto.pedidoAbierto
                  ? 'Anadir a la cesta'
                  : 'No disponible'
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import { useAuthStore } from '@/store';
import { alertStore } from '@/store/alertStore';

export default {
  data() {
    return {
      productos: [],
      cargando: false,
      errorCarga: '',
      anadiendoProductoId: null,
    };
  },
  async created() {
    await this.cargarProductos();
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
      if (!imagen) {
        return '/favicon.ico';
      }

      if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
        return imagen;
      }

      if (imagen.startsWith('/')) {
        return `${this.getBackendOrigin()}${imagen}`;
      }

      return `${this.getBackendOrigin()}/${imagen}`;
    },
    async cargarProductos() {
      this.cargando = true;
      this.errorCarga = '';

      try {
        const [productosResponse, proveedoresResponse, pedidosResponse] = await Promise.all([
          api.getProductos(),
          api.getProveedores(),
          api.getPedidos(),
        ]);

        const proveedorPorId = new Map(
          (proveedoresResponse.data || []).map((proveedor) => [proveedor.id_proveedor, proveedor])
        );

        const pedidosAbiertos = (pedidosResponse.data || []).filter((pedido) =>
          this.esPedidoAbierto(pedido)
        );

        pedidosAbiertos.sort(
          (a, b) => new Date(a.fecha_cierre || '2999-12-31') - new Date(b.fecha_cierre || '2999-12-31')
        );

        const pedidoAbiertoPorProveedor = new Map();
        pedidosAbiertos.forEach((pedido) => {
          if (!pedidoAbiertoPorProveedor.has(pedido.id_proveedor)) {
            pedidoAbiertoPorProveedor.set(pedido.id_proveedor, pedido.id_pedido);
          }
        });

        this.productos = (productosResponse.data || [])
          .filter((producto) => producto.activo)
          .map((producto) => ({
            id: producto.id_producto,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: Number(producto.precio),
            imagen: this.normalizarImagen(producto.imagen),
            proveedor:
              proveedorPorId.get(producto.id_proveedor)?.nombre || 'Proveedor sin asignar',
            periodicidad:
              proveedorPorId.get(producto.id_proveedor)?.frecuencia_pedido_aproximada ||
              'Sin periodicidad',
            pedidoAbiertoId: pedidoAbiertoPorProveedor.get(producto.id_proveedor) || null,
            pedidoAbierto: pedidoAbiertoPorProveedor.has(producto.id_proveedor),
          }));
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          alertStore.showAlert('Tu sesion ha caducado. Inicia sesion de nuevo.', 'danger');
          this.$router.push({ name: 'Login' });
          return;
        }

        this.errorCarga = 'No se pudo cargar el listado de productos.';
      } finally {
        this.cargando = false;
      }
    },
    esPedidoAbierto(pedido) {
      if (pedido.estado !== 'pendiente') {
        return false;
      }

      const ahora = new Date();
      const apertura = pedido.fecha_apertura ? new Date(pedido.fecha_apertura) : null;
      const cierre = pedido.fecha_cierre ? new Date(pedido.fecha_cierre) : null;

      if (apertura && ahora < apertura) {
        return false;
      }

      if (cierre && ahora > cierre) {
        return false;
      }

      return true;
    },
    anadirACesta(producto) {
      if (!producto.pedidoAbierto) {
        alertStore.showAlert('Este producto no se puede pedir porque no hay pedido abierto.', 'danger');
        return;
      }

      this.anadirACestaBackend(producto);
    },
    async anadirACestaBackend(producto) {
      const authStore = useAuthStore();
      const idUsuarioComprador = Number(authStore.user?.id_usuario);

      if (!idUsuarioComprador) {
        alertStore.showAlert('No se ha podido identificar el usuario actual.', 'danger');
        return;
      }

      this.anadiendoProductoId = producto.id;

      try {
        const detallesResponse = await api.getDetallesPedidoPorPedido(producto.pedidoAbiertoId);
        const detalleExistente = (detallesResponse.data || []).find(
          (detalle) =>
            Number(detalle.id_producto) === producto.id &&
            Number(detalle.id_usuario_comprador) === idUsuarioComprador &&
            Number(detalle.cantidad) > 0
        );

        if (detalleExistente) {
          await api.actualizarDetallePedido(detalleExistente.id_detalle, {
            cantidad: Number(detalleExistente.cantidad) + 1,
          });
        } else {
          await api.crearDetallePedido({
            id_pedido: producto.pedidoAbiertoId,
            id_producto: producto.id,
            cantidad: 1,
            precio_unitario: producto.precio,
            id_usuario_comprador: idUsuarioComprador,
          });
        }

        alertStore.showAlert(`${producto.nombre} se ha anadido a tu pedido.`, 'success');
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          localStorage.removeItem('authUser');
          alertStore.showAlert('Tu sesion ha caducado. Inicia sesion de nuevo.', 'danger');
          this.$router.push({ name: 'Login' });
          return;
        }

        alertStore.showAlert('No se pudo anadir el producto al pedido.', 'danger');
      } finally {
        this.anadiendoProductoId = null;
      }
    },
    onImageError(event) {
      event.target.src = '/favicon.ico';
    },
  },
};
</script>

<style scoped>
.compras-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.compras-content {
  flex: 1;
  padding: 2rem;
}

.estado {
  padding: 1rem 0;
  color: #495057;
}

.estado.error {
  color: #dc3545;
}

.lista-productos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.producto-card {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.meta {
  margin-bottom: 0.25rem;
}

.estado-pill {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
}

.estado-pill.abierto {
  color: #0f5132;
  background-color: #d1e7dd;
}

.estado-pill.cerrado {
  color: #842029;
  background-color: #f8d7da;
}

.producto-imagen {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.btn {
  margin-top: 1rem;
}
</style>
