<template>
  <div class="compras-page">
    <div class="compras-content">
      <h2>Compras</h2>

      <div class="filtros">
        <label class="form-label">Filtrar por estado:</label>
        <div class="filtro-botones">
          <button
            :class="['btn', filtroEstado === 'todos' ? 'btn-primary' : 'btn-outline-secondary']"
            @click="filtroEstado = 'todos'"
          >
            Todos
          </button>
          <button
            :class="['btn', filtroEstado === 'abierto' ? 'btn-primary' : 'btn-outline-secondary']"
            @click="filtroEstado = 'abierto'"
          >
            Pedido abierto
          </button>
          <button
            :class="['btn', filtroEstado === 'cerrado' ? 'btn-primary' : 'btn-outline-secondary']"
            @click="filtroEstado = 'cerrado'"
          >
            Pedido cerrado
          </button>
          <button
            :class="['btn', filtroEstado === 'pendiente_entrega' ? 'btn-primary' : 'btn-outline-secondary']"
            @click="filtroEstado = 'pendiente_entrega'"
          >
            Pendiente de entrega
          </button>
        </div>
      </div>

      <div v-if="cargando" class="estado">Cargando productos...</div>
      <div v-else-if="errorCarga" class="estado error">{{ errorCarga }}</div>
      <div v-else-if="!productosFiltrados.length" class="estado">
        No hay productos disponibles con el filtro seleccionado.
      </div>

      <div v-else class="proveedores-lista">
        <section v-for="grupo in productosAgrupados" :key="grupo.proveedor" class="proveedor-seccion">
          <h3 class="proveedor-titulo">{{ grupo.proveedor }}</h3>
          <p class="proveedor-meta">Periodicidad: {{ grupo.periodicidad }}</p>
          <div class="lista-productos">
            <div v-for="producto in grupo.productos" :key="producto.id" class="producto-card">
              <img
                :src="producto.imagen"
                alt="Imagen del producto"
                class="producto-imagen"
                @error="onImageError"
              />
              <h4>{{ producto.nombre }}</h4>
              <p>{{ producto.descripcion }}</p>
              <p>Precio: {{ producto.precio }}€</p>
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
        </section>
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
      filtroEstado: 'todos',
    };
  },
  computed: {
    productosFiltrados() {
      if (this.filtroEstado === 'todos') {
        return this.productos;
      }
      if (this.filtroEstado === 'abierto') {
        return this.productos.filter(p => p.pedidoAbierto);
      }
      if (this.filtroEstado === 'cerrado') {
        return this.productos.filter(p => !p.pedidoAbierto);
      }
      if (this.filtroEstado === 'pendiente_entrega') {
        return this.productos.filter(p => p.estadoPedido && !['repartido', 'cancelado'].includes(p.estadoPedido));
      }
      return this.productos;
    },
    productosAgrupados() {
      const grupos = {};
      this.productosFiltrados.forEach(producto => {
        const proveedorKey = producto.proveedor;
        if (!grupos[proveedorKey]) {
          grupos[proveedorKey] = {
            proveedor: proveedorKey,
            periodicidad: producto.periodicidad,
            productos: [],
          };
        }
        grupos[proveedorKey].productos.push(producto);
      });
      return Object.values(grupos);
    },
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

        const pedidosPorProveedor = new Map();
        (pedidosResponse.data || []).forEach((pedido) => {
          if (!pedidosPorProveedor.has(pedido.id_proveedor)) {
            pedidosPorProveedor.set(pedido.id_proveedor, pedido);
          }
        });

        this.productos = (productosResponse.data || [])
          .filter((producto) => producto.activo)
          .map((producto) => {
            const pedidoDelProveedor = pedidosPorProveedor.get(producto.id_proveedor);
            return {
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
              estadoPedido: pedidoDelProveedor?.estado || null,
            };
          });
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

.filtros {
  margin-bottom: 1.5rem;
}

.filtros .form-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
}

.filtro-botones {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.estado {
  padding: 1rem 0;
  color: #495057;
}

.estado.error {
  color: #dc3545;
}

.proveedores-lista {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.proveedor-seccion {
  border: 1px solid #dee2e6;
  border-radius: 10px;
  padding: 1.25rem;
  background: #fff;
}

.proveedor-titulo {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.proveedor-meta {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
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

@media (max-width: 576px) {
  .filtro-botones {
    flex-direction: column;
  }

  .filtro-botones .btn {
    width: 100%;
  }
}
</style>
