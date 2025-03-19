<template>
  <div class="home">
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
              <button class="btn btn-primary" @click="iniciarSesion">Iniciar Sesión</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Contenido Principal -->
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-8 offset-md-2 text-center">
          <h1 class="display-4">Bienvenido a Ekonsumo</h1>
          <p class="lead">Tu plataforma para gestionar pedidos de productos ecológicos.</p>
          <router-link to="/dashboard" class="btn btn-success btn-lg">Ir al Dashboard</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    iniciarSesion() {
      // Lógica para iniciar sesión
      alert('Iniciar sesión...');
    },
  },
};
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  margin-bottom: 2rem;
}

.display-4 {
  font-size: 2.5rem;
  font-weight: bold;
}

.lead {
  font-size: 1.25rem;
  color: #666;
}
</style>