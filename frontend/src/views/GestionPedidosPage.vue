<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-0">Gestion de Pedidos</h2>
      <button class="btn btn-primary" @click="abrirModalCrear">Crear pedido</button>
    </div>

    <div v-if="cargando" class="estado">Cargando pedidos...</div>
    <div v-else-if="errorCarga" class="estado error">{{ errorCarga }}</div>

    <div v-else class="table-responsive">
      <table class="table table-striped align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Proveedor</th>
            <th>Familia</th>
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
            <td>{{ familiaPorProveedor[pedido.id_proveedor] || '-' }}</td>
            <td>{{ formatFecha(pedido.fecha_apertura) }}</td>
            <td>{{ formatFecha(pedido.fecha_cierre) }}</td>
            <td>{{ formatFecha(pedido.fecha_entrega) }}</td>
            <td>
              <span :class="['estado-pill', estadoClass(pedido.estado)]">{{ pedido.estado }}</span>
            </td>
            <td class="acciones">
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
  data() {
    return {
      pedidos: [],
      proveedores: [],
      familias: [],
      cargando: false,
      errorCarga: '',
      accionandoId: null,
      mostrarModal: false,
      modoEdicion: false,
      guardando: false,
      form: pedidoVacio(),
    };
  },
  computed: {
    isAdmin() {
      const authStore = useAuthStore();
      return authStore.user?.rol === 'admin';
    },
    familiaPorProveedor() {
      const map = {};
      this.proveedores.forEach((p) => {
        if (p.familia) {
          map[p.id_proveedor] = p.familia;
        }
      });
      return map;
    },
  },
  async created() {
    await this.cargarDatos();
  },
  methods: {
    toInputDate(fechaIso) {
      if (!fechaIso) {
        return '';
      }
      return new Date(fechaIso).toISOString().slice(0, 10);
    },
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
    nombreProveedor(idProveedor) {
      return this.proveedores.find((item) => item.id_proveedor === idProveedor)?.nombre || '-';
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
        const pedidosPromise = this.isAdmin ? api.getPedidos() : api.getMisPedidos();
        const proveedoresPromise = api.getProveedores();
        const promises = [pedidosPromise, proveedoresPromise];

        if (this.isAdmin) {
          promises.push(api.getUsuarios());
        }

        const [pedidosResponse, proveedoresResponse, usuariosResponse] = await Promise.all(promises);

        this.pedidos = pedidosResponse.data || [];
        this.proveedores = proveedoresResponse.data || [];

        if (this.isAdmin && usuariosResponse) {
          const usuarios = usuariosResponse.data || [];
          const familiasSet = new Set();
          usuarios.forEach((u) => {
            if (u.familia) familiasSet.add(u.familia);
          });
          this.familias = Array.from(familiasSet).sort((a, b) => a - b);
        }
      } catch (error) {
        if (error.response?.status === 403) {
          this.errorCarga = error.response.data.error || 'No tienes acceso a pedidos.';
        } else {
          this.errorCarga = 'No se pudieron cargar pedidos, proveedores y familias.';
        }
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
        id_pedido: pedido.id_pedido,
        id_proveedor: pedido.id_proveedor,
        fecha_apertura: this.toInputDate(pedido.fecha_apertura),
        fecha_cierre: this.toInputDate(pedido.fecha_cierre),
        fecha_entrega: this.toInputDate(pedido.fecha_entrega),
        estado: pedido.estado,
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
