<template>
  <!-- Pagina para recuperacion de contrasena: solicita email/movil o establece nueva contrasena -->
  <div class="recover-password-page">
    <div class="auth-card">
      <!-- Si existe token, mostrar formulario para nueva contrasena -->
      <template v-if="token">
        <h2 class="auth-title">Nueva Contraseña</h2>
        <p class="auth-subtitle">Ingresa tu nueva contraseña</p>
        <form @submit.prevent="resetPassword" class="auth-form">
          <div class="mb-3">
            <label for="password" class="form-label">Nueva Contraseña</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="form-control"
              placeholder="Mínimo 6 caracteres"
              required
              minlength="6"
              :class="{ 'is-invalid': error }"
            />
          </div>
          <div class="mb-3">
            <label for="confirmarPassword" class="form-label">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmarPassword"
              v-model="confirmarPassword"
              class="form-control"
              placeholder="Repite la contraseña"
              required
              :class="{ 'is-invalid': error }"
            />
            <div v-if="error" class="error-text">{{ error }}</div>
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="guardando">
            {{ guardando ? 'Guardando...' : 'Cambiar Contraseña' }}
          </button>
        </form>
      </template>

      <template v-else-if="!token && !enviado">
        <h2 class="auth-title">Recuperar Contraseña</h2>
        <p class="auth-subtitle">Ingresa tu correo electrónico o móvil</p>
        <form @submit.prevent="recoverPassword" class="auth-form">
          <div class="mb-3">
            <label for="correoOMovil" class="form-label">Correo Electrónico o Móvil</label>
            <input
              type="text"
              id="correoOMovil"
              v-model="correoOMovil"
              class="form-control"
              placeholder="Ingresa tu correo o móvil"
              required
              :class="{ 'is-invalid': error }"
            />
            <div v-if="error" class="error-text">{{ error }}</div>
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="guardando">
            {{ guardando ? 'Enviando...' : 'Enviar Solicitud' }}
          </button>
        </form>
      </template>

      <template v-else>
        <div class="success-message">
          <i class="fas fa-check-circle success-icon"></i>
          <h2 class="auth-title">Correo Enviado</h2>
          <p class="auth-subtitle">Revisa tu bandeja de entrada y sigue las instrucciones.</p>
          <router-link to="/login" class="btn btn-primary w-100">Volver al Login</router-link>
        </div>
      </template>

      <div v-if="!token || enviado" class="auth-divider">
        <span>¿Ya recuerdas tu contraseña?</span>
      </div>
      <router-link v-if="!token || enviado" to="/login" class="btn btn-secondary w-100">Iniciar Sesión</router-link>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import { alertStore } from '@/store/alertStore';

export default {
  props: {
    // Token de recuperación de contraseña (presente si el usuario llegó desde el email)
    token: {
      type: String,
      default: null,
    },
  },
  // ============================================
  // data()
  // Variables de estado del componente
  // ============================================
  data() {
    return {
      // Correo electrónico o móvil del usuario que solicita recuperación
      correoOMovil: '',
      // Nueva contraseña elegida por el usuario
      password: '',
      // Confirmación de la nueva contraseña
      confirmarPassword: '',
      // Mensaje de error para mostrar en el formulario
      error: '',
      // Bandera que indica si se está procesando una solicitud
      guardando: false,
      // Bandera que indica si el correo de recuperación fue enviado exitosamente
      enviado: false,
    };
  },
  // ============================================
  // methods
  // Métodos del componente
  // ============================================
  methods: {
    // ============================================
    // recoverPassword
    // Envía una solicitud de recuperación de contraseña al backend
    // Parámetros: Ninguno (obtiene datos del formulario via v-model)
    // Retorna: No retorna valor, pero actualiza el estado 'enviado'
    // Efectos secundarios: Llama a api.recoverPassword, actualiza estado 'enviado'
    // ============================================
    async recoverPassword() {
      this.error = '';
      this.guardando = true;
      try {
        await api.recoverPassword({ correoOMovil: this.correoOMovil });
        this.enviado = true;
      } catch (error) {
        console.error('Error al recuperar contraseña:', error);
        if (error.response?.status === 404) {
          this.error = error.response.data.error;
        } else if (error.response?.status === 400 && error.response?.data?.errors?.length) {
          this.error = error.response.data.errors[0];
        } else {
          const errorMessage = error.response?.data?.error || 'Ocurrió un error inesperado. Inténtalo más tarde.';
          alertStore.showAlert(errorMessage, 'danger');
        }
      } finally {
        this.guardando = false;
      }
    },
    // ============================================
    // resetPassword
    // Restablece la contraseña usando el token de recuperación
    // Parámetros: Ninguno (obtiene datos del formulario via v-model y token de props)
    // Retorna: No retorna valor, pero redirige al login tras éxito
    // Efectos secundarios: Llama a api.resetPassword, redirige a Login
    // ============================================
    async resetPassword() {
      this.error = '';

      // Validar que las contraseñas coincidan
      if (this.password !== this.confirmarPassword) {
        this.error = 'Las contraseñas no coinciden';
        return;
      }

      // Validar longitud mínima de contraseña
      if (this.password.length < 6) {
        this.error = 'La contraseña debe tener al menos 6 caracteres';
        return;
      }

      this.guardando = true;
      try {
        await api.resetPassword({ token: this.token, password: this.password });
        alertStore.showAlert('Contraseña cambiada correctamente. Ya puedes iniciar sesión.', 'success');
        this.$router.push({ name: 'Login' });
      } catch (error) {
        console.error('Error al resetear contraseña:', error);
        if (error.response?.status === 401 || error.response?.status === 404) {
          this.error = error.response.data.error;
        } else {
          const errorMessage = error.response?.data?.error || 'Ocurrió un error inesperado. Inténtalo más tarde.';
          alertStore.showAlert(errorMessage, 'danger');
        }
      } finally {
        this.guardando = false;
      }
    },
  },
};
</script>

<style scoped>
.recover-password-page {
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
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-2xl);
}

.auth-subtitle {
  text-align: center;
  color: var(--color-text-light);
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-sm);
}

.auth-form {
  margin-bottom: var(--spacing-lg);
}

.auth-divider {
  text-align: center;
  margin: var(--spacing-lg) 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.success-message {
  text-align: center;
  padding: var(--spacing-lg) 0;
}

.success-icon {
  font-size: 4rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
}
</style>
