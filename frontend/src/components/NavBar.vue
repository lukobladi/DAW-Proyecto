<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-logo">Grupo de Consumo</router-link>
    </div>
    <div class="navbar-menu">
      <router-link to="/dashboard" class="navbar-item">Dashboard</router-link>
      <router-link to="/compras" class="navbar-item">Compras</router-link>
      <router-link to="/historial" class="navbar-item">Historial</router-link>
      <router-link to="/gestion-usuarios" class="navbar-item">Gestión de Usuarios</router-link>
      <router-link to="/configuracion" class="navbar-item">Configuración</router-link>
      <router-link to="/soporte" class="navbar-item">Soporte</router-link>
    </div>
    <div class="navbar-actions">
      <button v-if="!isAuthenticated" @click="goToLogin" class="btn btn-primary">Iniciar Sesión</button>
      <button v-if="isAuthenticated" @click="logout" class="btn btn-danger">Cerrar Sesión</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  computed: {
    isAuthenticated() {
      // Lógica para verificar si el usuario está autenticado
      return this.$store.state.auth.isAuthenticated; // Ejemplo usando Vuex
    }
  },
  methods: {
    goToLogin() {
      this.$router.push({ name: 'Login' });
    },
    logout() {
      // Lógica para cerrar sesión
      this.$store.dispatch('auth/logout'); // Ejemplo usando Vuex
      this.$router.push({ name: 'Home' });
    }
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-logo {
  text-decoration: none;
  color: #333;
}

.navbar-menu {
  display: flex;
  gap: 1rem;
}

.navbar-item {
  text-decoration: none;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.navbar-item:hover {
  background-color: #e9ecef;
}

.navbar-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}
</style>