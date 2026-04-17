<template>
  <!-- Pagina de inicio de sesion para usuarios existentes -->
  <div class="login-page">
    <div class="auth-card">
      <h2 class="auth-title">Iniciar Sesión</h2>
      <form @submit.prevent="login" class="auth-form">
        <div class="mb-3">
          <label for="correoOMovil" class="form-label">Correo Electrónico o Móvil</label>
          <input type="text" id="correoOMovil" v-model="correoOMovil" class="form-control" placeholder="Ingresa tu correo o móvil" required>
        </div>
        <div class="mb-3">
          <label for="contraseña" class="form-label">Contraseña</label>
          <input type="password" id="contraseña" v-model="contraseña" class="form-control" placeholder="Ingresa tu contraseña" autocomplete="current-password" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">Iniciar Sesión</button>
      </form>
      <p class="auth-link">
        ¿Olvidaste tu contraseña? <router-link to="/recuperar-password">Recupérala aquí</router-link>
      </p>
      <div class="auth-divider">
        <span>¿No tienes una cuenta?</span>
      </div>
      <router-link to="/registrar" class="btn btn-secondary w-100">Registrarse</router-link>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import { alertStore } from '@/store/alertStore';
import { useAuthStore } from '@/store';

export default {
  data() {
    return {
      correoOMovil: '',
      contraseña: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await api.login({
          correoOMovil: this.correoOMovil,
          password: this.contraseña,
        });

        const authStore = useAuthStore();
        authStore.login({
          token: response.data.token,
          user: {
            id_usuario: response.data.id_usuario,
            nombre: response.data.nombre,
            correo: response.data.correo,
            movil: response.data.movil,
            rol: response.data.rol,
            familia: response.data.familia,
            proveedor_gestionado: response.data.proveedor_gestionado,
          },
        });

        this.$router.push({ name: 'Dashboard' });
        alertStore.showAlert('Inicio de sesión exitoso.', 'success');
      } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        // Manejar diferentes códigos de estado HTTP
        if (error.response?.status === 403) {
          alertStore.showAlert('El usuario no está activo. Contacta al administrador.', 'danger');
        } else if (error.response?.status === 401) {
          alertStore.showAlert('Credenciales incorrectas. Por favor, inténtalo de nuevo.', 'danger');
        } else {
          alertStore.showAlert('Ocurrió un error inesperado. Inténtalo más tarde.', 'danger');
        }
      }
    }
  },
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: var(--spacing-xl);
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: var(--spacing-2xl);
  background: var(--color-bg);
  border-radius: var(--radius-xl);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.auth-title {
  color: var(--color-primary);
  text-align: center;
  margin-bottom: var(--spacing-xl);
  font-size: var(--font-size-2xl);
}

.auth-form {
  margin-bottom: var(--spacing-lg);
}

.auth-link {
  text-align: center;
  margin-top: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

.auth-divider {
  text-align: center;
  margin: var(--spacing-lg) 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}
</style>
