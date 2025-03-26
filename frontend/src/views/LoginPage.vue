<template>
  <div class="login-page">
    <NavBar />
    <div class="login-container">
      <div class="login-form">
        <h2>Iniciar Sesión</h2>
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="correoOMovil">Correo Electrónico o Móvil</label>
            <input type="text" id="correoOMovil" v-model="correoOMovil" placeholder="Ingresa tu correo o móvil" required>
          </div>
          <div class="form-group">
            <label for="contraseña">Contraseña</label>
            <input type="password" id="contraseña" v-model="contraseña" placeholder="Ingresa tu contraseña" required>
          </div>
          <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
        </form>
        <p class="forgot-password">
          ¿Olvidaste tu contraseña? <router-link to="/recuperar-contraseña">Recupérala aquí</router-link>
        </p>
        <div class="text-center mt-4">
          <p>¿No tienes una cuenta?</p>
          <router-link to="/registrar" class="btn btn-secondary w-100">Registrarse</router-link>
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
      correoOMovil: '', // Puede ser correo o móvil
      contraseña: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await api.login({
          correoOMovil: this.correoOMovil,
          contrasenia: this.contraseña, // Cambiado de contraseña a contrasenia
        });

        const token = response.data.token;
        localStorage.setItem('authToken', token);

        this.$store.dispatch('login', {
          correoOMovil: this.correoOMovil,
          token: token,
        });

        this.$router.push({ name: 'Dashboard' });
        alertStore.showAlert('Inicio de sesión exitoso.', 'success');
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        const errorMessage = error.response?.data?.error || 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
        alertStore.showAlert(errorMessage, 'danger');
      }
    },
  },
};
</script>

<style scoped>
/* Estilo general de la página */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem; /* Espaciado alrededor de la página */
  background: #f9f9f9; /* Color de fondo claro */
  background-size: cover;
  color: #333333;
}

/* Contenedor del formulario */
.login-container {
  width: 100%;
  max-width: 400px; /* Limita el ancho máximo */
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.9); /* Fondo blanco semitransparente */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: auto; 
}

/* Formulario */
.login-form {
  width: 100%;
  text-align: center;
}

.login-form h2 {
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

/* Enlace de contraseña olvidada */
.forgot-password {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.forgot-password a {
  color: #007BFF; /* Azul para enlaces */
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
}
</style>