<template>
  <div class="recover-password-page">
    <div class="auth-card">
      <h2 class="auth-title">Recuperar Contraseña</h2>
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
        <button type="submit" class="btn btn-primary w-100">Enviar Solicitud</button>
      </form>
      <div class="auth-divider">
        <span>¿Ya recuerdas tu contraseña?</span>
      </div>
      <router-link to="/login" class="btn btn-secondary w-100">Iniciar Sesión</router-link>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import { alertStore } from '@/store/alertStore';

export default {
  data() {
    return {
      correoOMovil: '',
      error: '',
    };
  },
  methods: {
    async recoverPassword() {
      this.error = '';
      try {
        await api.recoverPassword({ correoOMovil: this.correoOMovil });
        alertStore.showAlert('Se ha enviado un enlace de recuperación a tu correo o móvil.', 'success');
        this.correoOMovil = '';
      } catch (error) {
        console.error('Error al recuperar contraseña:', error);
        if (error.response?.status === 400 && error.response?.data?.errors?.length) {
          this.error = error.response.data.errors[0];
        } else {
          const errorMessage = error.response?.data?.error || 'Ocurrió un error inesperado. Inténtalo más tarde.';
          alertStore.showAlert(errorMessage, 'danger');
        }
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
  margin-bottom: var(--spacing-xl);
  font-size: var(--font-size-2xl);
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
</style>

