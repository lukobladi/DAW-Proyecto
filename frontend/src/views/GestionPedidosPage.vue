<template>
  <div class="page-content container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-0">Gestion de Pedidos</h2>
      <button class="btn btn-primary" @click="abrirModalCrear">Crear pedido</button>
    </div>

    <div v-if="cargando" class="estado">Cargando pedidos...</div>
    <div v-else-if="errorCarga" class="estado error">{{ errorCarga }}</div>

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
              <td>{{ nombreProveedor(pedido.id_proveedor) }}</td>
              <td>{{ formatFecha(pedido.fecha_apertura) }}</td>
              <td>{{ formatFecha(pedido.fecha_cierre) }}</td>
              <td>{{ formatFecha(pedido.fecha_entrega) }}</td>
              <td>
                <span :class="['estado-pill', estadoClass(pedido.estado)]">{{ pedido.estado }}</span>
              </td>
              <td class="acciones acciones-cell">
                <button class="btn btn-sm btn-info" @click="verDetalles(pedido.id_pedido)">Ver detalles</button>
                <button class="btn btn-sm btn-success" @click="abrirModalEditar(pedido)">Editar</button>
                <button
                  class="btn btn-sm btn-danger"
                  @click="eliminarPedido(pedido.id_pedido)"
                  :disabled="accionandoId === pedido.id_pedido"
                >
                  Eliminar
                </button>
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
          <p class="mb-1"><strong>Proveedor:</strong> {{ nombreProveedor(pedido.id_proveedor) }}</p>
          <p class="mb-1"><strong>Apertura:</strong> {{ formatFecha(pedido.fecha_apertura) }}</p>
          <p class="mb-1"><strong>Cierre:</strong> {{ formatFecha(pedido.fecha_cierre) }}</p>
          <p class="mb-1"><strong>Entrega:</strong> {{ formatFecha(pedido.fecha_entrega) }}</p>
          <div class="d-flex gap-2 flex-nowrap mt-2">
            <button class="btn btn-sm btn-info" @click="verDetalles(pedido.id_pedido)">Ver detalles</button>
            <button class="btn btn-sm btn-success" @click="abrirModalEditar(pedido)">Editar</button>
            <button
              class="btn btn-sm btn-danger"
              @click="eliminarPedido(pedido.id_pedido)"
              :disabled="accionandoId === pedido.id_pedido"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </template>

    <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-card">
        <h4>{{ modoEdicion ? 'Editar pedido' : 'Nuevo pedido' }}</h4>
        <form @submit.prevent="guardarPedido">
          <div v-if="isAdmin" class="mb-2">
            <label class="form-label">Proveedor</label>
            <select v-model.number="form.id_proveedor" class="form-select" required>
              <option disabled :value="null">Selecciona proveedor</option>
              <option
                v-for="proveedor in proveedores"
                :key="proveedor.id_proveedor"
                :value="proveedor.id_proveedor"
              >
                {{ proveedor.nombre }}
              </option>
            </select>
          </div>
          <div class="mb-2">
            <label class="form-label">Fecha apertura</label>
            <input v-model="form.fecha_apertura" v-autoblur type="date" class="form-control" required />
          </div>
          <div class="mb-2">
            <label class="form-label">Fecha cierre</label>
            <input v-model="form.fecha_cierre" v-autoblur type="date" class="form-control" required />
          </div>
          <div class="mb-2">
            <label class="form-label">Fecha entrega</label>
            <input v-model="form.fecha_entrega" v-autoblur type="date" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">Estado</label>
            <select v-model="form.estado" class="form-select" required>
              <option value="pendiente">pendiente</option>
              <option value="en proceso">en proceso</option>
              <option value="entregado">entregado</option>
              <option value="repartido">repartido</option>
              <option value="cancelado">cancelado</option>
            </select>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-primary" type="submit" :disabled="guardando">
              {{ guardando ? 'Guardando...' : 'Guardar' }}
            </button>
            <button class="btn btn-secondary" type="button" @click="cerrarModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import { alertStore } from '@/store/alertStore';
import { useAuthStore } from '@/store';

// ============================================
// FUNCION AUXILIAR: pedidoVacio
// Crea un objeto de pedido vacío con valores por defecto
// Parámetros: Ninguno
// Retorna: Object - Objeto con estructura de pedido vacía
// ============================================
function pedidoVacio() {
  return {
    id_pedido: null,
    id_proveedor: null,
    fecha_apertura: '',
    fecha_cierre: '',
    fecha_entrega: '',
    estado: 'pendiente',
  };
}

export default {
  // ============================================
  // data()
  // Variables de estado del componente
  // ============================================
  data() {
    return {
      // Lista de pedidos cargados
      pedidos: [],
      // Lista de proveedores disponibles
      proveedores: [],
      // Bandera que indica si se están cargando datos
      cargando: false,
      // Mensaje de error en caso de que la carga falle
      errorCarga: '',
      // ID del pedido que se está eliminando (para deshabilitar botón)
      accionandoId: null,
      // Bandera que controla la visibilidad del modal
      mostrarModal: false,
      // Bandera que indica si estamos editando (true) o creando (false)
      modoEdicion: false,
      // Bandera que indica si se está guardando el formulario
      guardando: false,
      // Formulario de pedido (para crear/editar)
      form: pedidoVacio(),
    };
  },
  // ============================================
  // computed
  // Propiedades calculadas del componente
  // ============================================
  computed: {
    // ============================================
    // isAdmin
    // Determina si el usuario tiene rol de administrador
    // Parámetros: Ninguno
    // Retorna: Boolean - true si es admin
    // ============================================
    isAdmin() {
      const authStore = useAuthStore();
      return authStore.user?.rol === 'admin';
    },
    // ============================================
    // isGestor
    // Determina si el usuario tiene rol de gestor
    // Parámetros: Ninguno
    // Retorna: Boolean - true si es gestor
    // ============================================
    isGestor() {
      const authStore = useAuthStore();
      return authStore.user?.rol === 'gestor';
    },
  },
  // ============================================
  // created()
  // Hook que se ejecuta cuando el componente se crea
  // ============================================
  async created() {
    // Carga pedidos y proveedores
    await this.cargarDatos();
  },
  // ============================================
  // methods
  // Métodos del componente
  // ============================================
  methods: {
    // ============================================
    // toInputDate
    // Convierte una fecha ISO a formato YYYY-MM-DD para inputs de fecha
    // Parámetros: fechaIso (String) - Fecha en formato ISO
    // Retorna: String - Fecha en formato YYYY-MM-DD o cadena vacía
    // ============================================
    toInputDate(fechaIso) {
      if (!fechaIso) {
        return '';
      }
      return new Date(fechaIso).toISOString().slice(0, 10);
    },
    // ============================================
    // formatFecha
    // Formatea una fecha ISO a formato español (dd/mm/yyyy)
    // Parámetros: fechaIso (String) - Fecha en formato ISO
    // Retorna: String - Fecha formateada o '-' si no hay fecha
    // ============================================
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
    // ============================================
    // nombreProveedor
    // Busca el nombre de un proveedor por su ID
    // Parámetros: idProveedor (Number) - ID del proveedor
    // Retorna: String - Nombre del proveedor o '-'
    // ============================================
    nombreProveedor(idProveedor) {
      return this.proveedores.find((item) => item.id_proveedor === idProveedor)?.nombre || '-';
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
    // cargarDatos
    // Carga la lista de pedidos y proveedores
    // Parámetros: Ninguno
    // Retorna: No retorna valor, actualiza pedidos y proveedores
    // Efectos secundarios: Llama a api.getPedidos/getMisPedidos y api.getProveedores
    // ============================================
    async cargarDatos() {
      this.cargando = true;
      this.errorCarga = '';
      try {
        const [pedidosResponse, proveedoresResponse] = await Promise.all([
          this.isGestor ? api.getMisPedidos() : api.getPedidos(),
          api.getProveedores(),
        ]);

        this.pedidos = pedidosResponse.data || [];
        this.proveedores = proveedoresResponse.data || [];
      } catch (error) {
        if (error.response?.status === 403) {
          this.errorCarga = error.response.data.error || 'No tienes acceso a pedidos.';
        } else {
          this.errorCarga = 'No se pudieron cargar pedidos y proveedores.';
        }
      } finally {
        this.cargando = false;
      }
    },
    // ============================================
    // verDetalles
    // Navega a la página de detalles del pedido seleccionado
    // Parámetros: idPedido (Number) - ID del pedido a ver
    // Retorna: No retorna valor
    // Efectos secundarios: Redirige a la página de detalles
    // ============================================
    verDetalles(idPedido) {
      this.$router.push({ name: 'DetallesPedido', params: { id: idPedido }, query: { from: 'gestion-pedidos' } });
    },
    // ============================================
    // abrirModalCrear
    // Abre el modal para crear un nuevo pedido
    // Parámetros: Ninguno
    // Retorna: No retorna valor
    // Efectos secundarios: Resetea el formulario y muestra el modal
    // ============================================
    abrirModalCrear() {
      this.modoEdicion = false;
      this.form = pedidoVacio();
      this.mostrarModal = true;
    },
    // ============================================
    // abrirModalEditar
    // Abre el modal para editar un pedido existente
    // Parámetros: pedido (Object) - Pedido a editar
    // Retorna: No retorna valor
    // Efectos secundarios: Prepara el formulario con datos del pedido
    // ============================================
    abrirModalEditar(pedido) {
      this.modoEdicion = true;
      this.form = {
        id_pedido: pedido.id_pedido,
        id_proveedor: pedido.id_proveedor,
        fecha_apertura: this.toInputDate(pedido.fecha_apertura),
        fecha_cierre: this.toInputDate(pedido.fecha_cierre),
        fecha_entrega: this.toInputDate(pedido.fecha_entrega),
        estado: pedido.estado,
      };
      this.mostrarModal = true;
    },
    // ============================================
    // cerrarModal
    // Cierra el modal de crear/editar pedido
    // Parámetros: Ninguno
    // Retorna: No retorna valor
    // Efectos secundarios: Oculta el modal
    // ============================================
    cerrarModal() {
      this.mostrarModal = false;
    },
    // ============================================
    // guardarPedido
    // Guarda el pedido (crea nuevo o actualiza existente)
    // Parámetros: Ninguno (obtiene datos del formulario via v-model)
    // Retorna: No retorna valor
    // Efectos secundarios: Llama a api.crearPedido o api.actualizarPedido
    // ============================================
    async guardarPedido() {
      this.guardando = true;
      try {
        const payload = {
          id_proveedor: this.form.id_proveedor,
          fecha_apertura: this.form.fecha_apertura,
          fecha_cierre: this.form.fecha_cierre,
          fecha_entrega: this.form.fecha_entrega || null,
          estado: this.form.estado,
        };

        if (this.modoEdicion) {
          await api.actualizarPedido(this.form.id_pedido, payload);
          alertStore.showAlert('Pedido actualizado correctamente.', 'success');
        } else {
          await api.crearPedido(payload);
          alertStore.showAlert('Pedido creado correctamente.', 'success');
        }

        await this.cargarDatos();
        this.cerrarModal();
      } catch {
        alertStore.showAlert('No se pudo guardar el pedido.', 'danger');
      } finally {
        this.guardando = false;
      }
    },
    // ============================================
    // eliminarPedido
    // Elimina un pedido existente tras confirmación
    // Parámetros: idPedido (Number) - ID del pedido a eliminar
    // Retorna: No retorna valor
    // Efectos secundarios: Llama a api.eliminarPedido, actualiza lista
    // ============================================
    async eliminarPedido(idPedido) {
      if (!window.confirm('Se eliminara el pedido. Quieres continuar?')) {
        return;
      }

      this.accionandoId = idPedido;
      try {
        await api.eliminarPedido(idPedido);
        alertStore.showAlert('Pedido eliminado correctamente.', 'success');
        await this.cargarDatos();
      } catch {
        alertStore.showAlert('No se pudo eliminar el pedido.', 'danger');
      } finally {
        this.accionandoId = null;
      }
    },
  },
};
</script>

<style scoped>
/* Componente específico */
.page-container {
  padding: var(--spacing-xl) var(--spacing-lg);
}
</style>
