<template>
  <div class="home-page">
    <div class="grupo-section">
      <h1>Bienvenido al Grupo de Consumo</h1>
      <p>Compra productos locales y ecológicos de manera colaborativa.</p>
      <div class="buttons">
        <button v-if="!isAuthenticated" @click="goToLogin" class="btn btn-primary">Iniciar Sesión</button>
        <button v-if="!isAuthenticated" @click="goToRegistrar" class="btn btn-secondary">Registrarse</button>
      </div>
    </div>
    <div class="mensaje-section">
      <h2>¿Por qué unirte a nosotros?</h2>
      <ul>
        <li>Apoya a productores locales.</li>
        <li>Accede a productos frescos y ecológicos.</li>
        <li>Forma parte de una comunidad colaborativa.</li>
      </ul>
    </div>
    <Footer />
  </div>
</template>

<script>
import { useAuthStore } from '@/store';

export default {
  computed: {
    isAuthenticated() {
      const authStore = useAuthStore();
      return authStore.isAuthenticated;
    },
  },
  methods: {
    goToLogin() {
      this.$router.push({ name: 'Login' }); // Redirige a la página de inicio de sesión
    },
    goToRegistrar() {
      this.$router.push({ name: 'Registrar' }); // Redirige a la página de registro
    },
  },
};
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.grupo-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  background: url('../assets/cestaesparza.png') no-repeat center center;
  background-size: cover;
  color: white;
}

.grupo-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.grupo-section p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.buttons {
  margin-top: 1rem;
}

.btn {
  margin: 0 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #FF9800;
  color: white;
}

.btn-primary:hover {
  background-color: #E68900;
}

.btn-secondary {
  background-color: #4CAF50;
  color: white;
}

.btn-secondary:hover {
  background-color: #3E8E41;
}

.mensaje-section {
  text-align: center;
  padding: 2rem;
  background-color: #f9f9f9;
}

.mensaje-section h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.mensaje-section ul {
  list-style: none;
  padding: 0;
}

.mensaje-section li {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}
</style>
