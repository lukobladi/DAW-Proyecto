<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-0">Gestion de Proveedores</h2>
      <button class="btn btn-primary" @click="abrirModalCrear">Anadir proveedor</button>
    </div>

    <div v-if="cargando" class="estado">Cargando proveedores...</div>
    <div v-else-if="errorCarga" class="estado error">{{ errorCarga }}</div>

    <div v-else class="table-responsive">
      <table class="table table-striped align-middle">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Correo</th>
            <th>Familia Gestora</th>
            <th>Frecuencia</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="proveedor in proveedores" :key="proveedor.id_proveedor">
            <td>{{ proveedor.nombre }}</td>
            <td>{{ proveedor.contacto || '-' }}</td>
            <td>{{ proveedor.correo || '-' }}</td>
            <td>Familia {{ proveedor.familia_gestora || '-' }}</td>
            <td>{{ proveedor.frecuencia_pedido_aproximada || '-' }}</td>
            <td>
              <span :class="['estado-pill', proveedor.activo ? 'activo' : 'inactivo']">
                {{ proveedor.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="acciones">
              <button class="btn btn-sm btn-success" @click="abrirModalEditar(proveedor)">
                Editar
              </button>
              <button
                class="btn btn-sm btn-warning"
                @click="cambiarEstado(proveedor)"
                :disabled="accionandoId === proveedor.id_proveedor"
              >
                {{ proveedor.activo ? 'Desactivar' : 'Activar' }}
              </button>
              <button
                class="btn btn-sm btn-danger"
                @click="eliminarProveedor(proveedor.id_proveedor)"
                :disabled="accionandoId === proveedor.id_proveedor"
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
        <h4>{{ modoEdicion ? 'Editar proveedor' : 'Nuevo proveedor' }}</h4>
        <form @submit.prevent="guardarProveedor">
          <div class="mb-2">
            <label class="form-label">Nombre</label>
            <input v-model="form.nombre" class="form-control" required />
          </div>
          <div class="mb-2">
            <label class="form-label">Contacto</label>
            <input v-model="form.contacto" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="form-label">Telefono</label>
            <input v-model="form.telefono" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="form-label">Movil</label>
            <input v-model="form.movil" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="form-label">Correo</label>
            <input v-model="form.correo" type="email" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="form-label">Metodo de pago</label>
            <input v-model="form.metodo_pago" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="form-label">Frecuencia</label>
            <select v-model="form.frecuencia_pedido_aproximada" class="form-select" required>
              <option value="semanal">semanal</option>
              <option value="mensual">mensual</option>
              <option value="bimestral">bimestral</option>
              <option value="trimestral">trimestral</option>
              <option value="semestral">semestral</option>
              <option value="anual">anual</option>
            </select>
          </div>
          <div class="form-check mb-1">
            <input id="envioMovil" v-model="form.envio_movil" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="envioMovil">Aviso movil</label>
          </div>
          <div class="form-check mb-3">
            <input id="envioMail" v-model="form.envio_mail" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="envioMail">Aviso email</label>
          </div>
          <div class="mb-2">
            <label class="form-label">Familia Gestora</label>
            <select v-model.number="form.familia" class="form-select">
              <option :value="null">Selecciona una familia (opcional)</option>
              <option v-for="familia in familiasDisponibles" :key="familia" :value="familia">
                Familia {{ familia }}
              </option>
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

function proveedorVacio() {
  return {
    id_proveedor: null,
    nombre: '',
    contacto: '',
    telefono: '',
    movil: '',
    correo: '',
    metodo_pago: '',
    frecuencia_pedido_aproximada: 'semanal',
    envio_movil: false,
    envio_mail: true,
    familia: null,
  };
}

export default {
  data() {
    return {
      proveedores: [],
      usuarios: [],
      familias: [],
      cargando: false,
      errorCarga: '',
      accionandoId: null,
      mostrarModal: false,
      modoEdicion: false,
      guardando: false,
      form: proveedorVacio(),
    };
  },
  computed: {
    familiasDisponibles() {
      return this.familias.filter(f => {
        const proveedorAsignado = this.proveedores.find(p => p.familia_gestora === f);
        if (!proveedorAsignado) return true;
        if (this.modoEdicion && proveedorAsignado.id_proveedor === this.form.id_proveedor) return true;
        return false;
      });
    },
  },
  async created() {
    await this.cargarProveedores();
    await this.cargarUsuarios();
    this.generarFamilias();
  },
  methods: {
    generarFamilias() {
      const familiasSet = new Set();
      this.usuarios.forEach(u => {
        if (u.familia) {
          familiasSet.add(u.familia);
        }
      });
      this.familias = Array.from(familiasSet).sort((a, b) => a - b);
    },
    async cargarProveedores() {
      this.cargando = true;
      this.errorCarga = '';
      try {
        const response = await api.getProveedores();
        this.proveedores = response.data || [];
      } catch {
        this.errorCarga = 'No se pudo cargar la lista de proveedores.';
      } finally {
        this.cargando = false;
      }
    },
    async cargarUsuarios() {
      try {
        const response = await api.getUsuarios();
        this.usuarios = response.data || [];
        this.generarFamilias();
      } catch {
        this.errorCarga = 'No se pudo cargar la lista de usuarios.';
      }
    },
    abrirModalCrear() {
      this.modoEdicion = false;
      this.form = proveedorVacio();
      this.mostrarModal = true;
    },
    abrirModalEditar(proveedor) {
      this.modoEdicion = true;
      this.form = { 
        ...proveedor,
        familia: proveedor.familia_gestora || null 
      };
      this.mostrarModal = true;
    },
    cerrarModal() {
      this.mostrarModal = false;
    },
    async guardarProveedor() {
      this.guardando = true;
      try {
        const payload = {
          nombre: this.form.nombre,
          contacto: this.form.contacto,
          telefono: this.form.telefono,
          movil: this.form.movil,
          correo: this.form.correo,
          metodo_pago: this.form.metodo_pago,
          frecuencia_pedido_aproximada: this.form.frecuencia_pedido_aproximada,
          envio_movil: Boolean(this.form.envio_movil),
          envio_mail: Boolean(this.form.envio_mail),
          familia: this.form.familia,
        };

        if (this.modoEdicion) {
          await api.actualizarProveedor(this.form.id_proveedor, payload);
          alertStore.showAlert('Proveedor actualizado correctamente.', 'success');
        } else {
          await api.crearProveedor(payload);
          alertStore.showAlert('Proveedor creado correctamente.', 'success');
        }

        await this.cargarProveedores();
        this.cerrarModal();
      } catch {
        alertStore.showAlert('No se pudo guardar el proveedor.', 'danger');
      } finally {
        this.guardando = false;
      }
    },
    async cambiarEstado(proveedor) {
      this.accionandoId = proveedor.id_proveedor;
      try {
        await api.cambiarEstadoProveedor(proveedor.id_proveedor, !proveedor.activo);
        await this.cargarProveedores();
      } catch {
        alertStore.showAlert('No se pudo cambiar el estado del proveedor.', 'danger');
      } finally {
        this.accionandoId = null;
      }
    },
    async eliminarProveedor(idProveedor) {
      if (!window.confirm('Se eliminara el proveedor. Quieres continuar?')) {
        return;
      }

      this.accionandoId = idProveedor;
      try {
        await api.eliminarProveedor(idProveedor);
        alertStore.showAlert('Proveedor eliminado correctamente.', 'success');
        await this.cargarProveedores();
      } catch {
        alertStore.showAlert('No se pudo eliminar el proveedor.', 'danger');
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

.estado-pill.activo {
  background: #d1e7dd;
  color: #0f5132;
}

.estado-pill.inactivo {
  background: #f8d7da;
  color: #842029;
}

.proveedor-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
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
  width: min(92vw, 520px);
  max-height: 90vh;
  overflow: auto;
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
}
</style>
