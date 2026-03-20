<template>
  <div class="login-page">

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
          ¿Olvidaste tu contraseña? <router-link to="/recuperar-password">Recupérala aquí</router-link>
        </p>
        <div class="text-center mt-4">
          <p>¿No tienes una cuenta?</p>
          <router-link to="/registrar" class="btn btn-secondary w-100">Registrarse</router-link>
        </div>
      </div>
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
      correoOMovil: '', // Puede ser correo o móvil
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
/* Estilo general de la página */
.login-page {
  display: flex; /* Utiliza flexbox para alinear los elementos */
  justify-content: center; /* Centra horizontalmente el contenido */
  align-items: center; /* Centra verticalmente el contenido */
  padding: 2rem; /* Espaciado alrededor de la página */
  background: #f9f9f9; /* Color de fondo claro */
  background-size: cover; /* Asegura que el fondo cubra toda la página */
  color: #333333; /* Color de texto predeterminado */
}

/* Contenedor del formulario */
.login-container {
  width: 100%; /* Ocupa todo el ancho disponible */
  max-width: 400px; /* Limita el ancho máximo del contenedor */
  padding: 2rem; /* Espaciado interno del contenedor */
  background-color: rgba(255, 255, 255, 0.9); /* Fondo blanco semitransparente */
  border-radius: 10px; /* Bordes redondeados */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra para dar efecto de elevación */
  margin: auto; /* Centra el contenedor horizontalmente */
}

/* Formulario */
.login-form {
  width: 100%; /* Ocupa todo el ancho del contenedor */
  text-align: center; /* Centra el texto dentro del formulario */
}

.login-form h2 {
  font-size: 2rem; /* Tamaño de fuente grande para el título */
  margin-bottom: 1.5rem; /* Espaciado inferior */
  color: #4CAF50; /* Color verde primario */
}

/* Grupo de campos del formulario */
.form-group {
  margin-bottom: 1.5rem; /* Espaciado inferior entre los grupos */
  text-align: left; /* Alinea el texto a la izquierda */
}

/* Etiquetas de los campos */
label {
  display: block; /* Hace que las etiquetas ocupen toda la línea */
  font-size: 1rem; /* Tamaño de fuente estándar */
  margin-bottom: 0.5rem; /* Espaciado inferior */
  color: #333333; /* Color de texto oscuro */
}

/* Campos de entrada */
input {
  width: 100%; /* Ocupa todo el ancho del contenedor */
  padding: 0.75rem; /* Espaciado interno */
  font-size: 1rem; /* Tamaño de fuente estándar */
  border: 1px solid #e0e0e0; /* Borde gris claro */
  border-radius: 5px; /* Bordes redondeados */
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1); /* Sombra interna para dar profundidad */
  transition: border-color 0.3s ease; /* Transición suave al cambiar el color del borde */
}

/* Estilo del campo de entrada cuando está enfocado */
input:focus {
  border-color: #4CAF50; /* Cambia el color del borde a verde cuando está enfocado */
  outline: none; /* Elimina el contorno predeterminado del navegador */
}

/* Botón */
.btn {
  width: 100%; /* Ocupa todo el ancho del contenedor */
  padding: 0.75rem; /* Espaciado interno */
  font-size: 1rem; /* Tamaño de fuente estándar */
  border: none; /* Elimina el borde predeterminado */
  border-radius: 5px; /* Bordes redondeados */
  cursor: pointer; /* Cambia el cursor a una mano al pasar sobre el botón */
  transition: background-color 0.3s ease; /* Transición suave al cambiar el color de fondo */
}

/* Botón principal (Iniciar Sesión) */
.btn-primary {
  background-color: #FF9800; /* Color de fondo naranja */
  color: white; /* Color del texto blanco */
}

.btn-primary:hover {
  background-color: #E68900; /* Cambia a un naranja más oscuro al pasar el cursor */
}

/* Enlace de contraseña olvidada */
.forgot-password {
  margin-top: 1rem; /* Espaciado superior */
  font-size: 0.9rem; /* Tamaño de fuente ligeramente más pequeño */
}

/* Estilo del enlace dentro de la sección de contraseña olvidada */
.forgot-password a {
  color: #007BFF; /* Color azul para los enlaces */
  text-decoration: none; /* Elimina el subrayado predeterminado */
}

.forgot-password a:hover {
  text-decoration: underline; /* Agrega subrayado al pasar el cursor */
}
</style>
