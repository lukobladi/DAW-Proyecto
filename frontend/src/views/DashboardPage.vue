<template>
  <div class="dashboard">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <a class="navbar-brand" href="#">Ekonsumo</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link">Inicio</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
            </li>
            <li class="nav-item">
              <button class="btn btn-danger" @click="cerrarSesion">Cerrar Sesión</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Contenido Principal -->
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-12">
          <h2>Dashboard</h2>
          <div v-if="loading">Cargando usuarios...</div>
          <div v-else>
            <ul>
              <li v-for="usuario in usuarios" :key="usuario.id">
                {{ usuario.nombre }} - {{ usuario.correo }}
              </li>
            </ul>
          </div>
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Resumen de Pedidos</h5>
              <p class="card-text">Aquí puedes ver un resumen de tus pedidos.</p>
              <router-link to="/pedidos" class="btn btn-primary">Ver Pedidos</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

console.log('mensaje');

export default {
  name: 'DashboardPage',
    data() {
      return {
        usuarios: [], // Almacena los usuarios obtenidos
        loading: true, // Estado de carga
      };
    },
    async mounted() {
      try {
        const response = await api.getUsuarios(); // Llama a la API
        this.usuarios = response.data; // Asigna los datos a la variable 'usuarios'
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      } finally {
        this.loading = false; // Desactiva el estado de carga
      }
    },
    
  methods: {
    cerrarSesion() {
      // Lógica para cerrar sesión
      alert('Cerrando sesión...');
    },
  },
};
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  margin-bottom: 2rem;
}

.card {
  margin-top: 1rem;
}
</style>