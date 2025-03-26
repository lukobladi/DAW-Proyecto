<template>
  <div class="recover-password-page">
    <div class="recover-container">
      <div class="recover-form">
        <h2>Recuperar Contraseña</h2>

        <form @submit.prevent="recoverPassword">
          <div class="form-group">
            <label for="correoOMovil">Correo Electrónico o Móvil</label>
            <input
              type="text"
              id="correoOMovil"
              v-model="correoOMovil"
              class="form-control"
              placeholder="Ingresa tu correo o móvil"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary mt-3">Enviar Solicitud</button>
        </form>
        <p class="back-to-login mt-3">
          ¿Ya recuerdas tu contraseña? <router-link to="/login">Inicia sesión aquí</router-link>
        </p>
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
      correoOMovil: '', // Puede ser correo o móvil
      errorMessage: '', // Mensaje de error
      successMessage: '', // Mensaje de éxito
    };
  },
  methods: {
    async recoverPassword() {
      try {
        await api.recoverPassword({ correoOMovil: this.correoOMovil });
        alertStore.showAlert('Se ha enviado un enlace de recuperación a tu correo o móvil.', 'success');
        this.correoOMovil = ''; // Limpia el campo del formulario
      } catch (error) {
        console.error('Error al recuperar contraseña:', error);
        const errorMessage = error.response?.data?.error || 'Ocurrió un error inesperado. Inténtalo más tarde.';
        alertStore.showAlert(errorMessage, 'danger');
      }
    },
  },
};
</script>

<style scoped>
/* Estilo general de la página */
.recover-password-page {
        display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem; /* Espaciado alrededor de la página */
    background: #f9f9f9; /* Color de fondo claro */
    background-size: cover;
    color: #333333;
    }
  
  /* Contenedor del formulario */
  .recover-container {
    width: 100%;
    max-width: 400px; /* Limita el ancho máximo */
    padding: 2rem;
    background-color: rgba(255, 255, 255, 0.9); /* Fondo blanco semitransparente */
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin: auto; 
    }

/* Formulario */
.recover-form {
  width: 100%;
  text-align: center;
}

.recover-form h2 {
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

/* Enlace para volver al login */
.back-to-login {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.back-to-login a {
  color: #007BFF; /* Azul para enlaces */
  text-decoration: none;
}

.back-to-login a:hover {
  text-decoration: underline;
}
</style>

