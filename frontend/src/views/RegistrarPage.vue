<template>
  <div class="registrar-page">
    <NavBar />
    <div class="registrar-container">
      <div class="registrar-form">
        <h2>Registrarse</h2>
        <form @submit.prevent="registrar">
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" v-model="nombre" placeholder="Ingresa tu nombre" required>
          </div>
          <div class="form-group">
            <label for="correo">Correo Electrónico</label>
            <input type="email" id="correo" v-model="correo" placeholder="Ingresa tu correo" required>
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" v-model="password" placeholder="Ingresa tu contraseña" required>
          </div>
          <div class="form-group">
            <label for="confirmar-password">Confirmar Contraseña</label>
            <input type="password" id="confirmar-password" v-model="confirmarPassword" placeholder="Confirma tu contraseña" required>
          </div>
          <button type="submit" class="btn btn-primary">Registrarse</button>
        </form>
        <div class="text-center mt-4">
          <p>¿Ya tienes una cuenta?</p>
          <router-link to="/login" class="btn btn-secondary w-100">Iniciar Sesión</router-link>
        </div>
      </div>
    </div>
    <Footer />
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
    };
  },
  methods: {
    async registrar() {
      if (this.password !== this.confirmarPassword) {
        alertStore.showAlert('Las contraseñas no coinciden.', 'danger');
        return;
      }

      try {
        await api.registrar({
          nombre: this.nombre,
          correo: this.correo,
          password: this.password,
          rol: 'usuario', // Puedes cambiar el rol según sea necesario
          movil: '', // Si no se usa, puedes dejarlo vacío
        });

        alertStore.showAlert('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
        this.$router.push({ name: 'Login' });
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        const errorMessage = error.response?.data?.error || 'Error al registrar usuario. Inténtalo más tarde.';
        alertStore.showAlert(errorMessage, 'danger');
      }
    },
  },
};
</script>

<style scoped>
/* Estilo general de la página */
.registrar-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: #f9f9f9;
  background-size: cover;
  color: #333333;
}

/* Contenedor del formulario */
.registrar-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: auto;
}

/* Formulario */
.registrar-form {
  width: 100%;
  text-align: center;
}

.registrar-form h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #4CAF50; /* Verde primario */
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

label {
  display: block;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #333333;
}

input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #4CAF50; /* Verde primario */
  outline: none;
}

/* Botón */
.btn {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #FF9800; /* Naranja */
  color: white;
}

.btn-primary:hover {
  background-color: #E68900; /* Naranja más oscuro */
}
</style>