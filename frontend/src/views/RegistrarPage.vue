<template>
  <div class="registrar-page">
    <div class="auth-card">
      <h2 class="auth-title">Registrar usuario</h2>
      <form @submit.prevent="registrar" class="auth-form">
        <div class="mb-3">
          <label for="nombre" class="form-label">Nombre</label>
          <input type="text" id="nombre" v-model="nombre" class="form-control" placeholder="Ingresa tu nombre" required>
        </div>
        <div class="mb-3">
          <label for="correo" class="form-label">Correo Electrónico</label>
          <input type="email" id="correo" v-model="correo" class="form-control" placeholder="Ingresa tu correo" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input type="password" id="password" v-model="password" class="form-control" placeholder="Ingresa tu contraseña" required>
        </div>
        <div class="mb-3">
          <label for="confirmar-password" class="form-label">Confirmar Contraseña</label>
          <input type="password" id="confirmar-password" v-model="confirmarPassword" class="form-control" placeholder="Confirma tu contraseña" required>
        </div>
        <div class="mb-3">
          <label for="movil" class="form-label">Móvil (opcional)</label>
          <input type="tel" id="movil" v-model="movil" class="form-control" placeholder="Ingresa tu número de móvil">
        </div>

        <button type="submit" class="btn btn-primary w-100">Registrarse</button>
      </form>
      <div class="auth-divider">
        <span>¿Ya tienes una cuenta?</span>
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
      nombre: '',
      correo: '',
      password: '',
      confirmarPassword: '',
      movil: null,
    };
  },
  methods: {
    async registrar() {
      if (this.password !== this.confirmarPassword) {
        alertStore.showAlert('Las contraseñas no coinciden.', 'danger');
        return;
      }

      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(this.password)) {
        alertStore.showAlert('La contraseña debe contener al menos una mayúscula, una minúscula y un número.', 'danger');
        return;
      }

      if (this.movil && !/^[0-9]{9,15}$/.test(this.movil)) {
        alertStore.showAlert('El móvil debe ser un número válido (9-15 dígitos).', 'danger');
        return;
      }

      try {
        await api.registrar({
          nombre: this.nombre,
          correo: this.correo,
          password: this.password,
          rol: 'usuario',
          movil: this.movil || null,
        });

        alertStore.showAlert('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
        this.$router.push({ name: 'Login' });
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        const errores = error.response?.data?.errors;
        const errorMessage = errores 
          ? errores.join('. ') 
          : (error.response?.data?.message || 'Error al registrar usuario. Inténtalo más tarde.');
        alertStore.showAlert(errorMessage, 'danger');
      }
    },
  },
};
</script>

<style scoped>
.registrar-page {
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