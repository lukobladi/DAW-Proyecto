<template>
  <div class="detalles-pedido-page">
    <div class="page-content container">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2>Detalles del Pedido #{{ pedidoId }}</h2>
        <router-link :to="volverRuta" class="btn btn-outline-secondary">Volver</router-link>
      </div>

      <div v-if="cargando" class="estado">Cargando detalles...</div>
      <div v-else-if="errorCarga" class="estado error">{{ errorCarga }}</div>

      <template v-else>
        <div class="info-pedido mb-4">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Proveedor</span>
              <span class="info-value">{{ pedidoInfo.proveedor }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Estado</span>
              <span :class="['estado-pill', estadoClass(pedidoInfo.estado)]">{{ pedidoInfo.estado }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Fecha Apertura</span>
              <span class="info-value fecha-apertura">{{ formatFecha(pedidoInfo.fecha_apertura) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Fecha Cierre</span>
              <span class="info-value fecha-cierre">{{ formatFecha(pedidoInfo.fecha_cierre) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Fecha Entrega</span>
              <span class="info-value">{{ formatFecha(pedidoInfo.fecha_entrega) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Total Pedido</span>
              <span class="info-value total">{{ totalPedido }} EUR</span>
            </div>
          </div>
        </div>

        <h4 class="mb-3">Productos por Usuario</h4>
        <div v-if="!usuariosConProductos.length" class="estado">No hay productos en este pedido.</div>
        <div v-else class="usuarios-lista">
          <div v-for="usuario in usuariosConProductos" :key="usuario.id_usuario" class="usuario-seccion">
            <div class="usuario-header">
              <h5>{{ usuario.nombre }}</h5>
              <span class="usuario-total">Total: {{ usuario.totalUsuario }} EUR</span>
            </div>
            <div class="productos-table-responsive">
              <table class="table table-sm table-striped">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="producto in usuario.productos" :key="producto.id_detalle">
                    <td>{{ producto.nombre }}</td>
                    <td>{{ producto.cantidad }}</td>
                    <td>{{ producto.precio_unitario }} EUR</td>
                    <td>{{ producto.total }} EUR</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  // ============================================
  // data()
  // Variables de estado del componente
  // ============================================
  data() {
    return {
      // Bandera que indica si se están cargando los datos
      cargando: false,
      // Mensaje de error en caso de que la carga falle
      errorCarga: '',
      // ID del pedido cuyos detalles se están visualizando
      pedidoId: null,
      // Información general del pedido (proveedor, estado, fechas)
      pedidoInfo: {
        proveedor: '',
        estado: '',
        fecha_apertura: null,
        fecha_cierre: null,
        fecha_entrega: null,
      },
      // Lista de usuarios con sus productos agrupados para este pedido
      usuariosConProductos: [],
    };
  },
  // ============================================
  // computed
  // Propiedades calculadas del componente
  // ============================================
  computed: {
    // ============================================
    // volverRuta
    // Determina la ruta para el botón "Volver" según el origen
    // Parámetros: Ninguno
    // Retorna: Object - Objeto de ruta para router-link
    // ============================================
    volverRuta() {
      const from = this.$route.query.from;
      if (from === 'historial') {
        return { name: 'Historial' };
      }
      return { name: 'GestionPedidos' };
    },
    // ============================================
    // totalPedido
    // Calcula el total del pedido sumando los totales de todos los usuarios
    // Parámetros: Ninguno
    // Retorna: String - Total del pedido formateado con 2 decimales
    // ============================================
    totalPedido() {
      return this.usuariosConProductos.reduce((total, u) => total + Number(u.totalUsuario), 0).toFixed(2);
    },
  },
  // ============================================
  // created()
  // Hook que se ejecuta cuando el componente se crea
  // ============================================
  async created() {
    // Obtiene el ID del pedido de los parámetros de la ruta
    this.pedidoId = this.$route.params.id;
    // Carga los detalles del pedido
    await this.cargarDetalles();
  },
  // ============================================
  // methods
  // Métodos del componente
  // ============================================
  methods: {
    // ============================================
    // getBackendOrigin
    // Obtiene el origen del backend para construir URLs completas de imágenes
    // Parámetros: Ninguno
    // Retorna: String - Origen del backend (protocolo + host)
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
    // Parámetros: imagen (String) - URL de la imagen a normalizar
    // Retorna: String - URL normalizada de la imagen
    // ============================================
    normalizarImagen(imagen) {
      if (!imagen) return '/favicon.ico';
      if (imagen.startsWith('http://') || imagen.startsWith('https://')) return imagen;
      if (imagen.startsWith('/')) return `${this.getBackendOrigin()}${imagen}`;
      return `${this.getBackendOrigin()}/${imagen}`;
    },
    // ============================================
    // formatFecha
    // Formatea una fecha ISO a formato español (dd/mm/yyyy)
    // Parámetros: fechaIso (String) - Fecha en formato ISO
    // Retorna: String - Fecha formateada o '-' si no hay fecha
    // ============================================
    formatFecha(fechaIso) {
      if (!fechaIso) return '-';
      return new Date(fechaIso).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    },
    // ============================================
    // estadoClass
    // Devuelve la clase CSS para el badge de estado del pedido
    // Parámetros: estado (String) - Estado del pedido
    // Retorna: String - Nombre de la clase CSS
    // ============================================
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
    // ============================================
    // cargarDetalles
    // Carga todos los datos del pedido: info general, productos agrupados por usuario
    // Parámetros: Ninguno
    // Retorna: No retorna valor, actualiza las variables de estado
    // Efectos secundarios: Llama a múltiples APIs (getPedidos, getDetallesPedidoPorPedido, etc.)
    // ============================================
    async cargarDetalles() {
      this.cargando = true;
      this.errorCarga = '';

      try {
        const [pedidoResponse, detallesResponse, proveedoresResponse, productosResponse, usuariosResponse] = await Promise.all([
          api.getPedidos(),
          api.getDetallesPedidoPorPedido(this.pedidoId),
          api.getProveedores(),
          api.getProductos(),
          api.getUsuarios(),
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
          fecha_apertura: pedido.fecha_apertura,
          fecha_cierre: pedido.fecha_cierre,
          fecha_entrega: pedido.fecha_entrega,
        };

        const productosMap = new Map(
          (productosResponse.data || []).map(p => [p.id_producto, p])
        );

        const usuariosMap = new Map(
          (usuariosResponse.data || []).map(u => [u.id_usuario, u])
        );

        const detalles = detallesResponse.data || [];
        const productosAgrupados = {};

        detalles.forEach(detalle => {
          const usuarioId = detalle.id_usuario_comprador;
          if (!productosAgrupados[usuarioId]) {
            productosAgrupados[usuarioId] = [];
          }
          const producto = productosMap.get(detalle.id_producto) || {};
          productosAgrupados[usuarioId].push({
            id_detalle: detalle.id_detalle,
            nombre: producto.nombre || `Producto #${detalle.id_producto}`,
            cantidad: Number(detalle.cantidad),
            precio_unitario: Number(detalle.precio_unitario || 0).toFixed(2),
            total: (Number(detalle.precio_unitario || 0) * Number(detalle.cantidad || 0)).toFixed(2),
          });
        });

        this.usuariosConProductos = Object.entries(productosAgrupados).map(([usuarioId, productos]) => {
          const usuario = usuariosMap.get(Number(usuarioId)) || { nombre: `Usuario #${usuarioId}` };
          const totalUsuario = productos.reduce((sum, p) => sum + Number(p.total), 0).toFixed(2);
          return {
            id_usuario: Number(usuarioId),
            nombre: usuario.nombre,
            productos,
            totalUsuario,
          };
        }).sort((a, b) => a.nombre.localeCompare(b.nombre));

      } catch (error) {
        console.error('Error cargando detalles:', error);
        this.errorCarga = 'No se pudieron cargar los detalles del pedido.';
      } finally {
        this.cargando = false;
      }
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

.info-pedido {
  background: var(--color-bg-secondary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--spacing-md);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

.info-value {
  font-size: var(--font-size-md);
  font-weight: 600;
}

.info-value.fecha-apertura {
  color: #28a745;
}

.info-value.fecha-cierre {
  color: #dc3545;
}

.info-value.total {
  font-size: var(--font-size-lg);
  color: var(--color-primary);
}

.usuarios-lista {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.usuario-seccion {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.usuario-header {
  background: var(--color-bg-secondary);
  padding: var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.usuario-header h5 {
  margin: 0;
}

.usuario-total {
  font-weight: 600;
  color: var(--color-primary);
}

.productos-table-responsive {
  padding: var(--spacing-sm);
}
</style>
