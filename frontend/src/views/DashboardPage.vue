<template>
  <div class="dashboard-page">
    <div class="dashboard-content container">
      <h2>Hola, {{ usuarioNombre }}!</h2>

      <section class="cesta-mensual">
        <h3>Productos comprados pendientes de entrega</h3>
        <p>Listado de productos que ya has pedido y aun no estan repartidos.</p>

        <div v-if="cargando" class="estado">Cargando dashboard...</div>
        <div v-else-if="errorCarga" class="estado error">{{ errorCarga }}</div>

        <div v-else-if="!productosPendientesEntrega.length" class="estado">
          No tienes productos pendientes de entrega.
        </div>

        <div v-else class="lista-productos">
          <div
            v-for="producto in productosPendientesEntrega"
            :key="`${producto.id_detalle}-${producto.id_pedido}`"
            class="producto-card"
          >
            <img
              :src="producto.imagen"
              alt="Imagen del producto"
              class="producto-imagen"
              @error="onImageError"
            />
            <h3>{{ producto.nombre }}</h3>
            <p>{{ producto.proveedor }}</p>
            <div class="cantidad-control">
              <span>Unidades pedidas:</span>
              <button
                class="btn-unidad"
                :disabled="actualizandoDetalleId === producto.id_detalle || !producto.pedido_abierto"
                @click="decrementarUnidades(producto)"
              >
                -
              </button>
              <strong>{{ producto.cantidad }}</strong>
              <button
                class="btn-unidad"
                :disabled="actualizandoDetalleId === producto.id_detalle || !producto.pedido_abierto"
                @click="incrementarUnidades(producto)"
              >
                +
              </button>
            </div>
            <p v-if="!producto.pedido_abierto" class="aviso-edicion">
              Solo puedes modificar unidades mientras el pedido este abierto.
            </p>
            <p>Precio unidad: {{ producto.precio_unitario }} EUR</p>
            <p>Total: {{ producto.total }} EUR</p>
            <p>
              <span :class="['estado-pill', estadoClass(producto.estado_pedido)]">
                {{ estadoLabel(producto.estado_pedido) }}
              </span>
            </p>
          </div>
        </div>
      </section>

      <section class="acceso-rapido">
        <router-link to="/compras" class="btn btn-primary">Adquirir Productos</router-link>
      </section>

      <section class="pedidos-abiertos">
        <h3>Pedidos abiertos</h3>
        <div v-if="!pedidosAbiertos.length" class="estado">No hay pedidos abiertos ahora mismo.</div>
        <div v-else class="lista-pedidos">
          <div v-for="pedido in pedidosAbiertos" :key="pedido.id_pedido" class="pedido-card">
            <h4>{{ pedido.proveedor }}</h4>
            <p>Apertura: {{ formatFecha(pedido.fecha_apertura) }}</p>
            <p>Cierre: {{ formatFecha(pedido.fecha_cierre) }}</p>
            <p>Entrega aprox: {{ formatFecha(pedido.fecha_entrega) }}</p>
            <p>
              <span :class="['estado-pill', estadoClass(pedido.estado)]">
                {{ estadoLabel(pedido.estado) }}
              </span>
            </p>
          </div>
        </div>
      </section>
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
      cargando: false,
      errorCarga: '',
      productosPendientesEntrega: [],
      pedidosAbiertos: [],
      actualizandoDetalleId: null,
    };
  },
  computed: {
    usuarioNombre() {
      const authStore = useAuthStore();
      return authStore.user?.nombre || 'usuario';
    },
  },
  async created() {
    await this.cargarDashboard();
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
    formatFecha(fechaIso) {
      if (!fechaIso) {
        return 'Sin fecha';
      }

      return new Date(fechaIso).toLocaleString('es-ES');
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
    esEstadoPendienteEntrega(estadoPedido) {
      return !['repartido', 'cancelado'].includes(estadoPedido);
    },
    estadoLabel(estado) {
      const labels = {
        pendiente: 'Pendiente',
        'en proceso': 'En proceso',
        entregado: 'Entregado',
        repartido: 'Repartido',
        cancelado: 'Cancelado',
      };
      return labels[estado] || estado;
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
    async cargarDashboard() {
      this.cargando = true;
      this.errorCarga = '';

      try {
        const authStore = useAuthStore();
        const userId = Number(authStore.user?.id_usuario);

        if (!authStore.user?.nombre && userId) {
          const usuario = await api.getUsuario(userId);
          authStore.login({
            token: localStorage.getItem('authToken'),
            user: {
              ...authStore.user,
              ...usuario.data,
            },
          });
        }

        const [pedidosResponse, productosResponse, proveedoresResponse] = await Promise.all([
          api.getPedidos(),
          api.getProductos(),
          api.getProveedores(),
        ]);

        const pedidos = pedidosResponse.data || [];
        const productos = productosResponse.data || [];
        const proveedores = proveedoresResponse.data || [];

        const proveedorPorId = new Map(
          proveedores.map((proveedor) => [proveedor.id_proveedor, proveedor.nombre])
        );

        const productoPorId = new Map(
          productos.map((producto) => [producto.id_producto, producto])
        );

        this.pedidosAbiertos = pedidos
          .filter((pedido) => this.esPedidoAbierto(pedido))
          .map((pedido) => ({
            ...pedido,
            proveedor: proveedorPorId.get(pedido.id_proveedor) || 'Proveedor sin nombre',
          }));

        const pedidosPendientes = pedidos.filter((pedido) =>
          this.esEstadoPendienteEntrega(pedido.estado)
        );

        const detallesPorPedido = await Promise.all(
          pedidosPendientes.map((pedido) => api.getDetallesPedidoPorPedido(pedido.id_pedido))
        );

        const detallesNormalizados = [];
        detallesPorPedido.forEach((response, index) => {
          const pedido = pedidosPendientes[index];
          const detalles = response.data || [];

          detalles.forEach((detalle) => {
            if (!userId || Number(detalle.id_usuario_comprador) !== userId || detalle.cantidad <= 0) {
              return;
            }

            const producto = productoPorId.get(detalle.id_producto) || {};

            detallesNormalizados.push({
              id_detalle: detalle.id_detalle,
              id_pedido: detalle.id_pedido,
              id_producto: detalle.id_producto,
              id_usuario_comprador: detalle.id_usuario_comprador,
              nombre: producto.nombre || `Producto #${detalle.id_producto}`,
              imagen: this.normalizarImagen(producto.imagen),
              proveedor: proveedorPorId.get(pedido.id_proveedor) || 'Proveedor sin nombre',
              cantidad: Number(detalle.cantidad),
              precio_unitario: Number(detalle.precio_unitario || 0).toFixed(2),
              total: Number((detalle.precio_unitario || 0) * detalle.cantidad).toFixed(2),
              estado_pedido: pedido.estado,
              pedido_abierto: this.esPedidoAbierto(pedido),
            });
          });
        });

        this.productosPendientesEntrega = detallesNormalizados;
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          localStorage.removeItem('authUser');
          alertStore.showAlert('Tu sesion ha caducado. Inicia sesion de nuevo.', 'danger');
          this.$router.push({ name: 'Login' });
          return;
        }

        this.errorCarga = 'No se pudo cargar la informacion del dashboard.';
      } finally {
        this.cargando = false;
      }
    },
    async actualizarUnidades(producto, nuevaCantidad) {
      if (!producto.pedido_abierto) {
        alertStore.showAlert('Este pedido ya no esta abierto. No puedes modificar unidades.', 'danger');
        return;
      }

      if (nuevaCantidad < 0) {
        return;
      }

      this.actualizandoDetalleId = producto.id_detalle;

      try {
        if (nuevaCantidad === 0) {
          await api.eliminarDetallePedido(producto.id_detalle);
          this.productosPendientesEntrega = this.productosPendientesEntrega.filter(
            (item) => item.id_detalle !== producto.id_detalle
          );
          alertStore.showAlert(`Has eliminado ${producto.nombre} de tus pendientes.`, 'success');
          return;
        }

        await api.actualizarDetallePedido(producto.id_detalle, {
          cantidad: nuevaCantidad,
        });

        producto.cantidad = nuevaCantidad;
        producto.total = Number(Number(producto.precio_unitario) * nuevaCantidad).toFixed(2);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userRole');
          localStorage.removeItem('authUser');
          alertStore.showAlert('Tu sesion ha caducado. Inicia sesion de nuevo.', 'danger');
          this.$router.push({ name: 'Login' });
          return;
        }

        alertStore.showAlert('No se pudieron actualizar las unidades.', 'danger');
      } finally {
        this.actualizandoDetalleId = null;
      }
    },
    async incrementarUnidades(producto) {
      await this.actualizarUnidades(producto, producto.cantidad + 1);
    },
    async decrementarUnidades(producto) {
      await this.actualizarUnidades(producto, producto.cantidad - 1);
    },
    onImageError(event) {
      event.target.src = '/favicon.ico';
    },
  },
};
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
}

.cesta-mensual,
.pedidos-abiertos {
  margin-bottom: 2rem;
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

.lista-pedidos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.pedido-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  background: #fff;
}

.producto-imagen {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.estado {
  padding: 1rem 0;
  color: #495057;
}

.estado.error {
  color: #dc3545;
}

.cantidad-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.btn-unidad {
  border: 1px solid #ced4da;
  background: #fff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  line-height: 1;
}

.aviso-edicion {
  color: #842029;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.estado-pill {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
}

.estado-pendiente {
  color: #664d03;
  background-color: #fff3cd;
}

.estado-proceso {
  color: #055160;
  background-color: #cff4fc;
}

.estado-entregado {
  color: #0f5132;
  background-color: #d1e7dd;
}

.estado-repartido {
  color: #0f5132;
  background-color: #d1e7dd;
}

.estado-cancelado {
  color: #842029;
  background-color: #f8d7da;
}

.btn {
  margin-top: 1rem;
}
</style>
