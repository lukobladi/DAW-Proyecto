<template>
  <div class="page-content container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-0">Gestion de Pedidos Periodicos</h2>
      <button class="btn btn-primary" @click="abrirModalCrear">Crear pedido periodico</button>
    </div>

    <div v-if="cargando" class="estado">Cargando pedidos periodicos...</div>
    <div v-else-if="errorCarga" class="estado error">{{ errorCarga }}</div>

    <div v-else-if="pedidosPeriodicos.length === 0" class="estado">No hay pedidos periodicos.</div>

    <div v-else class="table-responsive">
      <table class="table table-striped align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Proveedor</th>
            <th>Periodicidad</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pedido in pedidosPeriodicos" :key="pedido.id_pedido_periodico">
            <td>{{ pedido.id_pedido_periodico }}</td>
            <td>{{ nombreProveedor(pedido.id_proveedor) }}</td>
            <td>{{ pedido.periodicidad }} dias</td>
            <td>{{ formatFecha(pedido.fecha_inicio) }}</td>
            <td>{{ formatFecha(pedido.fecha_fin) }}</td>
            <td>
              <span :class="['estado-pill', pedido.activo ? 'activo' : 'inactivo']">
                {{ pedido.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="acciones">
              <button class="btn btn-sm btn-success" @click="abrirModalEditar(pedido)">Editar</button>
              <button class="btn btn-sm btn-danger" @click="eliminarPedido(pedido.id_pedido_periodico)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-card">
        <h4>{{ modoEdicion ? 'Editar pedido periodico' : 'Nuevo pedido periodico' }}</h4>
        <form @submit.prevent="guardarPedido">
          <div class="mb-2">
            <label class="form-label">Proveedor</label>
            <select v-model.number="form.id_proveedor" class="form-select" required>
              <option disabled :value="null">Selecciona proveedor</option>
              <option v-for="proveedor in proveedores" :key="proveedor.id_proveedor" :value="proveedor.id_proveedor">
                {{ proveedor.nombre }}
              </option>
            </select>
          </div>
          <div class="mb-2">
            <label class="form-label">Periodicidad (dias)</label>
            <input v-model.number="form.periodicidad" type="number" min="1" class="form-control" required />
          </div>
          <div class="mb-2">
            <label class="form-label">Fecha Inicio</label>
            <input v-model="form.fecha_inicio" type="date" class="form-control" required />
          </div>
          <div class="mb-2">
            <label class="form-label">Fecha Fin</label>
            <input v-model="form.fecha_fin" type="date" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="form-label">Dia Apertura Pedido</label>
            <input v-model.number="form.dia_apertura" type="number" min="1" max="31" class="form-control" placeholder="Dia del mes (1-31)" />
          </div>
          <div class="mb-2">
            <label class="form-label">Dia Cierre Pedido</label>
            <input v-model.number="form.dia_cierre" type="number" min="1" max="31" class="form-control" placeholder="Dia del mes (1-31)" />
          </div>
          <div class="mb-2">
            <label class="form-label">Dia Entrega</label>
            <input v-model.number="form.dia_entrega" type="number" min="1" max="31" class="form-control" placeholder="Dia del mes (1-31)" />
          </div>
          <div class="form-check mb-3">
            <input id="activo" v-model="form.activo" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="activo">Activo</label>
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

// Auxiliar: Crea un objeto de pedido periodico vacío con valores por defecto
function pedidoVacio() {
  return {
    id_pedido_periodico: null,
    id_proveedor: null,
    periodicidad: 7,
    fecha_inicio: '',
    fecha_fin: '',
    dia_apertura: null,
    dia_cierre: null,
    dia_entrega: null,
    activo: true,
  };
}

export default {
  
  data() {
    return {
      pedidosPeriodicos: [],
      proveedores: [],
      cargando: false,
      errorCarga: '',
      mostrarModal: false,
      modoEdicion: false,
      guardando: false,
      form: pedidoVacio(),
    };
  },

  async created() {
    await this.cargarDatos();
  },

  methods: {

    formatFecha(fecha) {
      if (!fecha) return '-';
      return new Date(fecha).toLocaleDateString('es-ES');
    },

    nombreProveedor(idProveedor) {
      return this.proveedores.find(p => p.id_proveedor === idProveedor)?.nombre || '-';
    },

    async cargarDatos() {
      this.cargando = true;
      this.errorCarga = '';
      try {
        const [pedidosResponse, proveedoresResponse] = await Promise.all([
          api.getPedidosPeriodicos(),
          api.getProveedores(),
        ]);
        this.pedidosPeriodicos = pedidosResponse.data || [];
        this.proveedores = proveedoresResponse.data || [];
      } catch {
        this.errorCarga = 'No se pudieron cargar los datos.';
      } finally {
        this.cargando = false;
      }
    },

    abrirModalCrear() {
      this.modoEdicion = false;
      this.form = pedidoVacio();
      this.mostrarModal = true;
    },

    abrirModalEditar(pedido) {
      this.modoEdicion = true;
      this.form = {
        id_pedido_periodico: pedido.id_pedido_periodico,
        id_proveedor: pedido.id_proveedor,
        periodicidad: pedido.periodicidad,
        fecha_inicio: pedido.fecha_inicio ? pedido.fecha_inicio.split('T')[0] : '',
        fecha_fin: pedido.fecha_fin ? pedido.fecha_fin.split('T')[0] : '',
        dia_apertura: pedido.dia_apertura,
        dia_cierre: pedido.dia_cierre,
        dia_entrega: pedido.dia_entrega,
        activo: pedido.activo,
      };
      this.mostrarModal = true;
    },

    cerrarModal() {
      this.mostrarModal = false;
    },

    async guardarPedido() {
      this.guardando = true;
      try {
        const payload = {
          id_proveedor: this.form.id_proveedor,
          periodicidad: this.form.periodicidad,
          fecha_inicio: this.form.fecha_inicio || null,
          fecha_fin: this.form.fecha_fin || null,
          dia_apertura: this.form.dia_apertura || null,
          dia_cierre: this.form.dia_cierre || null,
          dia_entrega: this.form.dia_entrega || null,
          activo: Boolean(this.form.activo),
        };

        if (this.modoEdicion) {
          await api.actualizarPedidoPeriodico(this.form.id_pedido_periodico, payload);
          alertStore.showAlert('Pedido periodico actualizado correctamente.', 'success');
        } else {
          await api.crearPedidoPeriodico(payload);
          alertStore.showAlert('Pedido periodico creado correctamente.', 'success');
        }

        await this.cargarDatos();
        this.cerrarModal();
      } catch {
        alertStore.showAlert('No se pudo guardar el pedido periodico.', 'danger');
      } finally {
        this.guardando = false;
      }
    },

    async eliminarPedido(id) {
      if (!window.confirm('Se eliminara el pedido periodico. Quieres continuar?')) {
        return;
      }
      try {
        await api.eliminarPedidoPeriodico(id);
        alertStore.showAlert('Pedido periodico eliminado correctamente.', 'success');
        await this.cargarDatos();
      } catch {
        alertStore.showAlert('No se pudo eliminar el pedido periodico.', 'danger');
      }
    },
  },
};
</script>

<style scoped>
/* Usa clases globales */
</style>
