<template>
  <div class="compras-page">
    <div class="page-content">
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
          <p class="proveedor-meta">
            <span v-if="grupo.fechaApertura" class="fecha-apertura">
              Abre: {{ formatoFechaLocal(grupo.fechaApertura) }}
            </span>
            <span v-if="grupo.fechaCierre" class="fecha-cierre">
              Cierra: {{ formatoFechaLocal(grupo.fechaCierre) }}
            </span>
            <span class="periodicidad">Periodicidad: {{ grupo.periodicidad }}</span>
          </p>
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
                :disabled="!productoDisponible(producto) || anadiendoProductoId === producto.id"
              >
                {{
                  anadiendoProductoId === producto.id
                    ? 'Anadiendo...'
                    : productoDisponible(producto)
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
  // ============================================
  // data()
  // Variables de estado del componente
  // ============================================
  data() {
    return {
      // Lista de productos cargados con información de pedidos
      productos: [],
      // Bandera que indica si se están cargando datos
      cargando: false,
      // Mensaje de error en caso de que la carga falle
      errorCarga: '',
      // ID del producto que se está añadiendo (para deshabilitar botón)
      anadiendoProductoId: null,
      // Filtro de estado actual ('todos', 'abierto', 'pendiente_entrega')
      filtroEstado: 'todos',
    };
  },
  // ============================================
  // computed
  // Propiedades calculadas del componente
  // ============================================
  computed: {
    // ============================================
    // isAdminOrGestor
    // Determina si el usuario es admin o gestor
    // Parámetros: Ninguno
    // Retorna: Boolean - true si es admin o gestor
    // ============================================
    isAdminOrGestor() {
      const authStore = useAuthStore();
      return authStore.user?.rol === 'admin' || authStore.user?.rol === 'gestor';
    },
    // ============================================
    // productosFiltrados
    // Filtra los productos según el filtro de estado seleccionado
    // Parámetros: Ninguno
    // Retorna: Array - Lista de productos filtrados
    // ============================================
    productosFiltrados() {
      if (this.filtroEstado === 'todos') {
        return this.productos;
      }
      if (this.filtroEstado === 'abierto') {
        return this.productos.filter(p => p.pedidoAbierto);
      }
      if (this.filtroEstado === 'pendiente_entrega') {
        return this.productos.filter(p => !p.pedidoAbierto && p.estadoPedido && ['pendiente', 'en proceso'].includes(p.estadoPedido));
      }
      return this.productos;
    },
    // ============================================
    // productosAgrupados
    // Agrupa los productos filtrados por proveedor
    // Parámetros: Ninguno
    // Retorna: Array - Lista de grupos con proveedor y sus productos
    // ============================================
    productosAgrupados() {
      const grupos = {};
      this.productosFiltrados.forEach(producto => {
        const proveedorKey = producto.proveedor;
        if (!grupos[proveedorKey]) {
          grupos[proveedorKey] = {
            proveedor: proveedorKey,
            periodicidad: producto.periodicidad,
            fechaApertura: producto.fechaApertura,
            fechaCierre: producto.fechaCierre,
            productos: [],
          };
        }
        grupos[proveedorKey].productos.push(producto);
      });
      return Object.values(grupos);
    },
  },
  // ============================================
  // created()
  // Hook que se ejecuta cuando el componente se crea
  // ============================================
  async created() {
    // Carga los productos disponibles
    await this.cargarProductos();
  },
  // ============================================
  // methods
  // Métodos del componente
  // ============================================
  methods: {
    // ============================================
    // getBackendOrigin
    // Obtiene el origen del backend para construir URLs completas
    // Parámetros: Ninguno
    // Retorna: String - Origen del backend
    // ============================================
    getBackendOrigin() {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';

      if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
        return new URL(apiUrl).origin;
      }

      return window.location.origin;
    },
    // ============================================
    // normalizarImagen
    // Normaliza la URL de una imagen para que sea accesible
    // Parámetros: imagen (String) - URL de la imagen
    // Retorna: String - URL normalizada
    // ============================================
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
    // ============================================
    // cargarProductos
    // Carga productos, pedidos y proveedores para mostrar el catálogo
    // Parámetros: Ninguno
    // Retorna: No retorna valor, actualiza la variable productos
    // Efectos secundarios: Llama a api.getProductos, api.getProveedores, api.getPedidos
    // ============================================
    async cargarProductos() {
      this.cargando = true;
      this.errorCarga = '';

      try {
        const [productosResponse, proveedoresResponse, pedidosResponse] = await Promise.all([
          api.getProductos(),
          api.getProveedores(),
          api.getPedidos(),
        ]);

        // Crea mapa de proveedores por ID
        const proveedorPorId = new Map(
          (proveedoresResponse.data || []).map((proveedor) => [proveedor.id_proveedor, proveedor])
        );

        const todosLosPedidos = pedidosResponse.data || [];
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Procesa cada producto activo
        this.productos = (productosResponse.data || [])
          .filter((producto) => producto.activo)
          .map((producto) => {
            // Busca pedidos del proveedor ordenados por fecha de cierre
            const pedidosDelProveedor = todosLosPedidos
              .filter(p => p.id_proveedor === producto.id_proveedor)
              .sort((a, b) => new Date(b.fecha_cierre || 0) - new Date(a.fecha_cierre || 0));

            const pedidoMasReciente = pedidosDelProveedor[0] || null;

            let pedidoAbierto = false;
            let pedidoAbiertoId = null;

            // Determina si hay un pedido abierto
            if (pedidoMasReciente) {
              const fechaCierre = pedidoMasReciente.fecha_cierre ? new Date(pedidoMasReciente.fecha_cierre) : null;
              fechaCierre?.setHours(0, 0, 0, 0);

              if (pedidoMasReciente.estado === 'pendiente' && fechaCierre && fechaCierre > hoy) {
                pedidoAbierto = true;
                pedidoAbiertoId = pedidoMasReciente.id_pedido;
              }
            }

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
              pedidoAbiertoId,
              pedidoAbierto,
              estadoPedido: pedidoMasReciente?.estado || null,
              fechaApertura: pedidoMasReciente?.fecha_apertura || null,
              fechaCierre: pedidoMasReciente?.fecha_cierre || null,
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
    // ============================================
    // esPedidoAbierto
    // Determina si un pedido está actualmente abierto
    // Parámetros: pedido (Object) - Objeto pedido con estado y fecha_cierre
    // Retorna: Boolean - true si el pedido está abierto
    // ============================================
    esPedidoAbierto(pedido) {
      if (pedido.estado !== 'pendiente') {
        return false;
      }

      const cierre = pedido.fecha_cierre ? new Date(pedido.fecha_cierre) : null;
      if (!cierre) {
        return false;
      }

      const ahora = new Date();
      const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
      const fechaCierre = new Date(cierre.getFullYear(), cierre.getMonth(), cierre.getDate());

      return fechaCierre > hoy;
    },
    // ============================================
    // formatoFechaLocal
    // Formatea una fecha a formato español (dd/mm/yyyy)
    // Parámetros: fecha (String/Date) - Fecha a formatear
    // Retorna: String - Fecha formateada o cadena vacía
    // ============================================
    formatoFechaLocal(fecha) {
      if (!fecha) return '';
      const d = new Date(fecha);
      return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    },
    // ============================================
    // productoDisponible
    // Determina si un producto puede añadirse a la cesta
    // Parámetros: producto (Object) - Producto a verificar
    // Retorna: Boolean - true si el producto está disponible
    // ============================================
    productoDisponible(producto) {
      if (!producto.pedidoAbierto) {
        return false;
      }
      if (this.filtroEstado === 'pendiente_entrega') {
        return false;
      }
      return true;
    },
    // ============================================
    // anadirACesta
    // Valida y prepara la adición de un producto a la cesta
    // Parámetros: producto (Object) - Producto a añadir
    // Retorna: No retorna valor
    // Efectos secundarios: Muestra alerta si no está disponible
    // ============================================
    anadirACesta(producto) {
      if (!this.productoDisponible(producto)) {
        alertStore.showAlert('Este producto no se puede pedir.', 'danger');
        return;
      }

      this.anadirACestaBackend(producto);
    },
    // ============================================
    // anadirACestaBackend
    // Añade o incrementa un producto en el pedido del usuario
    // Parámetros: producto (Object) - Producto a añadir
    // Retorna: No retorna valor
    // Efectos secundarios: Llama a api.getDetallesPedidoPorPedido, api.actualizarDetallePedido o api.crearDetallePedido
    // ============================================
    async anadirACestaBackend(producto) {
      const authStore = useAuthStore();
      const idUsuarioComprador = Number(authStore.user?.id_usuario);

      if (!idUsuarioComprador) {
        alertStore.showAlert('No se ha podido identificar el usuario actual.', 'danger');
        return;
      }

      this.anadiendoProductoId = producto.id;

      try {
        // Verifica si ya existe un detalle para este producto en este pedido
        const detallesResponse = await api.getDetallesPedidoPorPedido(producto.pedidoAbiertoId);
        const detalleExistente = (detallesResponse.data || []).find(
          (detalle) =>
            Number(detalle.id_producto) === producto.id &&
            Number(detalle.id_usuario_comprador) === idUsuarioComprador &&
            Number(detalle.cantidad) > 0
        );

        if (detalleExistente) {
          // Incrementa la cantidad si ya existe
          await api.actualizarDetallePedido(detalleExistente.id_detalle, {
            cantidad: Number(detalleExistente.cantidad) + 1,
          });
        } else {
          // Crea un nuevo detalle
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
    // ============================================
    // onImageError
    // Maneja errores de carga de imágenes
    // Parámetros: event (Event) - Evento de error
    // Retorna: No retorna valor
    // ============================================
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

.filtros {
  margin-bottom: var(--spacing-lg);
}

.filtros .form-label {
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  display: block;
}

.filtro-botones {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-sm);
}

.proveedores-lista {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.proveedor-seccion {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  background: var(--color-bg);
}

.proveedor-titulo {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-xs);
}

.proveedor-meta {
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-md);
}

.proveedor-meta .fecha-apertura {
  color: #28a745;
  font-weight: bold;
  margin-right: 12px;
}

.proveedor-meta .fecha-cierre {
  color: #dc3545;
  font-weight: bold;
  margin-right: 12px;
}

.proveedor-meta .periodicidad {
  color: var(--color-text-light);
}

.lista-productos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.producto-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-align: center;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-bg);
}

.producto-imagen {
  width: 100%;
  height: 140px;
  object-fit: cover;
  flex-shrink: 0;
}

.producto-card h4,
.producto-card p,
.producto-card button {
  padding: 0 var(--spacing-md);
}

.producto-card h4 {
  margin-top: var(--spacing-md);
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-base);
  color: var(--color-text);
}

.producto-card p {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

.producto-card p:last-of-type {
  margin-bottom: var(--spacing-md);
}

.producto-card button {
  margin-top: auto;
  width: calc(100% - var(--spacing-md) * 2);
  margin-bottom: var(--spacing-md);
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
