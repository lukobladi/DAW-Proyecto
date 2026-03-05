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
            <th>Encargado</th>
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
            <td>{{ nombreUsuario(pedido.id_usuario_encargado) }}</td>
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
          <div class="mb-2">
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
            <label class="form-label">Usuario encargado</label>
            <select v-model.number="form.id_usuario_encargado" class="form-select" required>
              <option disabled :value="null">Selecciona usuario</option>
              <option
                v-for="usuario in usuarios"
                :key="usuario.id_usuario"
                :value="usuario.id_usuario"
              >
                {{ usuario.nombre }}
              </option>
            </select>
          </div>
          <div class="mb-2">
            <label class="form-label">Fecha apertura</label>
            <input v-model="form.fecha_apertura" type="datetime-local" class="form-control" required />
          </div>
          <div class="mb-2">
            <label class="form-label">Fecha cierre</label>
            <input v-model="form.fecha_cierre" type="datetime-local" class="form-control" required />
          </div>
          <div class="mb-2">
            <label class="form-label">Fecha entrega</label>
            <input v-model="form.fecha_entrega" type="datetime-local" class="form-control" />
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

function pedidoVacio() {
  return {
    id_pedido: null,
    id_proveedor: null,
    id_usuario_encargado: null,
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
      usuarios: [],
      cargando: false,
      errorCarga: '',
      accionandoId: null,
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
    toInputDate(fechaIso) {
      if (!fechaIso) {
        return '';
      }
      const date = new Date(fechaIso);
      const tzOffset = date.getTimezoneOffset() * 60000;
      return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    },
    formatFecha(fechaIso) {
      if (!fechaIso) {
        return '-';
      }
      return new Date(fechaIso).toLocaleString('es-ES');
    },
    nombreProveedor(idProveedor) {
      return this.proveedores.find((item) => item.id_proveedor === idProveedor)?.nombre || '-';
    },
    nombreUsuario(idUsuario) {
      return this.usuarios.find((item) => item.id_usuario === idUsuario)?.nombre || '-';
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
        const [pedidosResponse, proveedoresResponse, usuariosResponse] = await Promise.all([
          api.getPedidos(),
          api.getProveedores(),
          api.getUsuarios(),
        ]);
        this.pedidos = pedidosResponse.data || [];
        this.proveedores = proveedoresResponse.data || [];
        this.usuarios = usuariosResponse.data || [];
      } catch {
        this.errorCarga = 'No se pudieron cargar pedidos, proveedores y usuarios.';
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
        id_usuario_encargado: pedido.id_usuario_encargado,
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
          id_usuario_encargado: this.form.id_usuario_encargado,
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
.estado {
  padding: 1rem 0;
}

.estado.error {
  color: #dc3545;
}

.acciones {
  display: flex;
  gap: 0.4rem;
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

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-card {
  width: min(92vw, 560px);
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
}
</style>
