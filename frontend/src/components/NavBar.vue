<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-logo">Grupo de Consumo</router-link>
    </div>
    <button class="navbar-burger" @click="toggleMenu" aria-label="Abrir menú">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
      <router-link to="/dashboard" class="navbar-item">Dashboard</router-link>
      <router-link to="/compras" class="navbar-item">Compras</router-link>
      <router-link to="/historial" class="navbar-item">Historial</router-link>
      <router-link to="/gestion-usuarios" class="navbar-item">Gestión de Usuarios</router-link>
      <router-link to="/configuracion" class="navbar-item">Configuración</router-link>
      <router-link to="/soporte" class="navbar-item">Soporte</router-link>
      <router-link v-if="isAdmin" to="/gestion-proveedores" class="navbar-item">Gestión de Proveedores</router-link>
      <router-link v-if="isAdmin" to="/gestion-productos" class="navbar-item">Gestión de Productos</router-link>
      <router-link v-if="isAdmin" to="/gestion-pedidos" class="navbar-item">Gestión de Pedidos</router-link>
      <router-link v-if="!isAuthenticated" to="/login" class="navbar-item navbar-login">
        <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
      </router-link>
      <router-link v-if="isAuthenticated" @click.native="logout" class="navbar-item navbar-logout">
        <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      isMenuOpen: false, // Controla el estado del menú en dispositivos móviles
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.auth.isAuthenticated; // Verifica si el usuario está autenticado
    },
    isAdmin() {
      return this.$store.state.auth.user.role === 'admin'; // Verifica si el usuario es administrador
    },
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen; // Alterna el estado del menú
    },
    async logout() {
      try {
        await this.$store.dispatch('logout'); // Espera a que Vuex complete la acción
        this.$router.push({ name: 'Home' }); // Redirige al usuario a la página de inicio
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Estilo general del navbar */
.navbar {
  background-color: #FFFFFF;
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  position: relative;
  z-index: 1000;
}

/* Logo */
.navbar-logo {
  color: #333333;
  font-weight: bold;
  text-decoration: none;
  font-size: 1.5rem;
}

/* Menú */
.navbar-menu {
  display: flex;
  flex-wrap: wrap;
  transition: max-height 0.3s ease;
}

.navbar-menu.is-active {
  max-height: 500px; /* Para dispositivos móviles */
}

.navbar-item {
  color: #333333;
  margin: 0 0.5rem;
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: background-color 0.3s ease;
}

.navbar-item:hover {
  background-color: #e9ecef;
  border-radius: 5px;
}

/* Estilo para el elemento de inicio de sesión */
.navbar-login {
  font-weight: bold;
  color: #FF9800;
}

.navbar-login i {
  margin-right: 0.5rem;
}

.navbar-login:hover {
  background-color: #FFE0B2;
  border-radius: 5px;
}

/* Estilo para el elemento de cerrar sesión */
.navbar-logout {
  font-weight: bold;
  color: #DC3545;
}

.navbar-logout i {
  margin-right: 0.5rem;
}

.navbar-logout:hover {
  background-color: #F8D7DA;
  border-radius: 5px;
}

/* Responsividad */
.navbar-burger {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 25px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.navbar-burger span {
  display: block;
  width: 100%;
  height: 3px;
  background-color: #333333;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .navbar-menu {
    flex-direction: column;
    max-height: 0;
    overflow: hidden;
  }

  .navbar-burger {
    display: flex;
  }
}
</style>