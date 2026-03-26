<template>
  <div class="container py-4">
    <h2 class="mb-3">Configuracion de Cuenta</h2>

    <div v-if="cargando" class="estado">Cargando datos de cuenta...</div>
    <div v-else-if="errorCarga" class="estado error">{{ errorCarga }}</div>

    <form v-else class="card p-3" @submit.prevent="guardarCambios">
      <div class="row g-3">
        <div class="col-12 col-md-6">
          <label class="form-label" for="nombre">Nombre</label>
          <input id="nombre" v-model="form.nombre" class="form-control" required />
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label" for="correo">Correo</label>
          <input id="correo" v-model="form.correo" type="email" class="form-control" required />
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label" for="movil">Movil</label>
          <input id="movil" v-model="form.movil" class="form-control" />
        </div>
        <div class="col-12 col-md-6">
          <label class="form-label" for="rol">Rol</label>
          <input id="rol" :value="form.rol" class="form-control" disabled />
        </div>
      </div>

      <hr />
      <p class="text-muted mb-3">
        Cambio de contrasena pendiente de implementar en backend. Actualmente solo se pueden
        actualizar datos de perfil.
      </p>

      <div class="d-flex gap-2">
        <button class="btn btn-primary" type="submit" :disabled="guardando">
          {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
        </button>
        <button class="btn btn-secondary" type="button" @click="cargarPerfil" :disabled="guardando">
          Restaurar
        </button>
      </div>
    </form>
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
      guardando: false,
      errorCarga: '',
      form: {
        id_usuario: null,
        nombre: '',
        correo: '',
        movil: '',
        rol: '',
      },
    };
  },
  async created() {
    await this.cargarPerfil();
  },
  methods: {
    async cargarPerfil() {
      this.cargando = true;
      this.errorCarga = '';
      try {
        const authStore = useAuthStore();
        const idUsuario = Number(authStore.user?.id_usuario);

        if (!idUsuario) {
          this.errorCarga = 'No se pudo identificar el usuario logueado.';
          return;
        }

        const response = await api.getUsuario(idUsuario);
        const usuario = response.data;

        this.form = {
          id_usuario: usuario.id_usuario,
          nombre: usuario.nombre || '',
          correo: usuario.correo || '',
          movil: usuario.movil || '',
          rol: usuario.rol || '',
        };

        authStore.login({
          token: localStorage.getItem('authToken'),
          user: {
            ...authStore.user,
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            correo: usuario.correo,
            movil: usuario.movil,
            rol: usuario.rol,
            familia: usuario.familia ?? authStore.user?.familia,
            proveedor_gestionado: usuario.proveedor_gestionado ?? authStore.user?.proveedor_gestionado,
          },
        });
      } catch {
        this.errorCarga = 'No se pudieron cargar los datos del perfil.';
      } finally {
        this.cargando = false;
      }
    },
    async guardarCambios() {
      this.guardando = true;
      try {
        await api.actualizarUsuario(this.form.id_usuario, {
          nombre: this.form.nombre,
          correo: this.form.correo,
          movil: this.form.movil,
          rol: this.form.rol,
        });

        const authStore = useAuthStore();
        authStore.login({
          token: localStorage.getItem('authToken'),
          user: {
            ...authStore.user,
            id_usuario: this.form.id_usuario,
            nombre: this.form.nombre,
            correo: this.form.correo,
            movil: this.form.movil,
            rol: this.form.rol,
          },
        });

        alertStore.showAlert('Perfil actualizado correctamente.', 'success');
      } catch {
        alertStore.showAlert('No se pudo actualizar el perfil.', 'danger');
      } finally {
        this.guardando = false;
      }
    },
  },
};
</script>

<style scoped>
/* Usa clases globales */
</style>
