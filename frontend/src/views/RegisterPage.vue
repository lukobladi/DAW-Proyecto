<template>
  <div class="register-page">
    <NavBar />
    <div class="register-form">
      <h2>Registro</h2>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" v-model="nombre" required>
        </div>
        <div class="form-group">
          <label for="correo">Correo Electrónico</label>
          <input type="email" id="correo" v-model="correo" required>
        </div>
        <div class="form-group">
          <label for="contraseña">Contraseña</label>
          <input type="password" id="contraseña" v-model="contraseña" required>
        </div>
        <div class="form-group">
          <label for="confirmar-contraseña">Confirmar Contraseña</label>
          <input type="password" id="confirmar-contraseña" v-model="confirmarContraseña" required>
        </div>
        <button type="submit" class="btn btn-primary">Registrarse</button>
      </form>
      <p>¿Ya tienes una cuenta? <router-link to="/login">Inicia Sesión</router-link></p>
    </div>
    <Footer />
  </div>
</template>

<script>
import { alertStore } from '@/store/alertStore';

export default {

  data() {
    return {
      nombre: '',
      correo: '',
      contraseña: '',
      confirmarContraseña: ''
    };
  },
  methods: {
    async register() {
      if (this.contraseña !== this.confirmarContraseña) {
        alertStore.showAlert('Las contraseñas no coinciden.', 'danger');
        return;
      }

      try {
        // Simulación de registro exitoso
        console.log('Registrando usuario...');
        alertStore.showAlert('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
        this.$router.push({ name: 'Login' });
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        const errorMessage = error.response?.data?.error || 'Error al registrar usuario. Inténtalo más tarde.';
        alertStore.showAlert(errorMessage, 'danger');
      }
    },
  }
};
</script>

<style scoped>
.register-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.register-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

.btn {
  margin-top: 1rem;
}
</style>