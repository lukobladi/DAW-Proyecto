<template>
  <div class="gestion-usuarios-page container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-0">Gestion de Usuarios</h2>
      <button class="btn btn-primary" @click="abrirModalCrear">Anadir usuario</button>
    </div>

    <div v-if="cargando" class="estado">Cargando usuarios...</div>
    <div v-else-if="errorCarga" class="estado error">{{ errorCarga }}</div>

    <div v-else class="table-responsive">
      <table class="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Movil</th>
            <th>Familia</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Saldo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.id_usuario">
            <td>{{ usuario.nombre }}</td>
            <td>{{ usuario.correo }}</td>
            <td>{{ usuario.movil || '-' }}</td>
            <td>{{ usuario.familia || '-' }}</td>
            <td>{{ usuario.rol }}</td>
            <td>
              <span :class="['estado-pill', usuario.activo ? 'activo' : 'inactivo']">
                {{ usuario.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>{{ Number(usuario.saldo || 0).toFixed(2) }} EUR</td>
            <td class="acciones">
              <button class="btn btn-sm btn-success" @click="abrirModalEditar(usuario)">
                Editar
              </button>
              <button
                class="btn btn-sm btn-warning"
                @click="cambiarEstado(usuario)"
                :disabled="accionandoId === usuario.id_usuario"
              >
                {{ usuario.activo ? 'Desactivar' : 'Activar' }}
              </button>
              <button
                class="btn btn-sm btn-danger"
                @click="eliminarUsuario(usuario.id_usuario)"
                :disabled="accionandoId === usuario.id_usuario"
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
        <h4>{{ modoEdicion ? 'Editar usuario' : 'Nuevo usuario' }}</h4>
        <form @submit.prevent="guardarUsuario">
          <div class="mb-2">
            <label class="form-label">Nombre</label>
            <input v-model="form.nombre" class="form-control" required :class="{ 'is-invalid': errors.nombre }" />
            <span v-if="errors.nombre" class="error-text">{{ errors.nombre }}</span>
          </div>
          <div class="mb-2">
            <label class="form-label">Correo</label>
            <input v-model="form.correo" type="email" class="form-control" required :class="{ 'is-invalid': errors.correo }" />
            <span v-if="errors.correo" class="error-text">{{ errors.correo }}</span>
          </div>
          <div class="mb-2">
            <label class="form-label">Movil</label>
            <input v-model="form.movil" class="form-control" :class="{ 'is-invalid': errors.movil }" />
            <span v-if="errors.movil" class="error-text">{{ errors.movil }}</span>
          </div>
          <div class="mb-2">
            <label class="form-label">Familia</label>
            <input v-model="form.familia" type="number" class="form-control" min="1" :class="{ 'is-invalid': errors.familia }" />
            <span v-if="errors.familia" class="error-text">{{ errors.familia }}</span>
          </div>
          <div class="mb-2">
            <label class="form-label">Rol</label>
            <select v-model="form.rol" class="form-select" required>
              <option value="usuario">Usuario</option>
              <option value="gestor">Gestor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div v-if="!modoEdicion" class="mb-3">
            <label class="form-label">Contrasena inicial</label>
            <input v-model="form.password" type="password" class="form-control" required :class="{ 'is-invalid': errors.password }" />
            <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
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

export default {
  data() {
    return {
      usuarios: [],
      cargando: false,
      errorCarga: '',
      accionandoId: null,
      mostrarModal: false,
      modoEdicion: false,
      guardando: false,
      form: {
        id_usuario: null,
        nombre: '',
        correo: '',
        movil: '',
        rol: 'usuario',
        password: '',
        familia: null,
      },
      errors: {},
    };
  },
  async created() {
    await this.cargarUsuarios();
  },
  methods: {
    async cargarUsuarios() {
      this.cargando = true;
      this.errorCarga = '';
      try {
        const response = await api.getUsuarios();
        this.usuarios = response.data || [];
      } catch {
        this.errorCarga = 'No se pudo cargar la lista de usuarios.';
      } finally {
        this.cargando = false;
      }
    },
    abrirModalCrear() {
      this.modoEdicion = false;
      this.errors = {};
      this.form = {
        id_usuario: null,
        nombre: '',
        correo: '',
        movil: '',
        rol: 'usuario',
        password: '',
        familia: null,
      };
      this.mostrarModal = true;
    },
    abrirModalEditar(usuario) {
      this.modoEdicion = true;
      this.errors = {};
      this.form = {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        movil: usuario.movil || '',
        rol: usuario.rol,
        password: '',
        familia: usuario.familia || null,
      };
      this.mostrarModal = true;
    },
    cerrarModal() {
      this.mostrarModal = false;
    },
    async guardarUsuario() {
      this.errors = {};
      this.guardando = true;
      try {
        if (this.modoEdicion) {
          await api.actualizarUsuario(this.form.id_usuario, {
            nombre: this.form.nombre,
            correo: this.form.correo,
            movil: this.form.movil,
            rol: this.form.rol,
            familia: this.form.familia || null,
          });
          alertStore.showAlert('Usuario actualizado correctamente.', 'success');
        } else {
          await api.registrar({
            nombre: this.form.nombre,
            correo: this.form.correo,
            movil: this.form.movil,
            rol: this.form.rol,
            password: this.form.password,
            familia: this.form.familia || null,
          });
          alertStore.showAlert('Usuario creado correctamente.', 'success');
        }
        await this.cargarUsuarios();
        this.cerrarModal();
      } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.errors) {
          error.response.data.errors.forEach(msg => {
            const msgLower = msg.toLowerCase();
            if (msgLower.includes('nombre')) this.errors.nombre = msg;
            else if (msgLower.includes('correo')) this.errors.correo = msg;
            else if (msgLower.includes('móvil') || msgLower.includes('movil')) this.errors.movil = msg;
            else if (msgLower.includes('familia')) this.errors.familia = msg;
            else if (msgLower.includes('contraseña')) this.errors.password = msg;
            else alertStore.showAlert(msg, 'danger');
          });
        } else {
          alertStore.showAlert('No se pudo guardar el usuario.', 'danger');
        }
      } finally {
        this.guardando = false;
      }
    },
    async cambiarEstado(usuario) {
      this.accionandoId = usuario.id_usuario;
      try {
        await api.cambiarEstadoUsuario(usuario.id_usuario, !usuario.activo);
        await this.cargarUsuarios();
      } catch {
        alertStore.showAlert('No se pudo cambiar el estado del usuario.', 'danger');
      } finally {
        this.accionandoId = null;
      }
    },
    async eliminarUsuario(idUsuario) {
      if (!window.confirm('Se eliminara el usuario. Quieres continuar?')) {
        return;
      }

      this.accionandoId = idUsuario;
      try {
        await api.eliminarUsuario(idUsuario);
        alertStore.showAlert('Usuario eliminado correctamente.', 'success');
        await this.cargarUsuarios();
      } catch {
        alertStore.showAlert('No se pudo eliminar el usuario.', 'danger');
      } finally {
        this.accionandoId = null;
      }
    },
  },
};
</script>

<style scoped>
.gestion-usuarios-page {
  animation: fadeIn 0.3s ease;
}
</style>
