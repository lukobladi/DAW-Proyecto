<template>
  <!-- Pagina principal de la aplicacion que muestra informacion del grupo de consumo -->
  <div class="home-page">
    <!-- Seccion hero con imagen de fondo y mensaje de bienvenida -->
    <div class="hero-section">
      <div class="hero-content">
        <h1>Bienvenido al Grupo de Consumo</h1>
        <p>Compra productos locales y ecológicos de manera colaborativa.</p>
        <div class="buttons">
          <button v-if="!isAuthenticated" @click="goToLogin" class="btn btn-secondary">Iniciar Sesión</button>
          <button v-if="!isAuthenticated" @click="goToRegistrar" class="btn btn-primary">Registrarse</button>
        </div>
      </div>
    </div>
    <div class="features-section">
      <div class="page-content">
        <h2>¿Por qué unirte a nosotros?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <i class="fas fa-store"></i>
            <h3>Productores locales</h3>
            <p>Apoya a productores locales de tu zona.</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-leaf"></i>
            <h3>Productos ecológicos</h3>
            <p>Accede a productos frescos y ecológicos.</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-users"></i>
            <h3>Comunidad</h3>
            <p>Forma parte de una comunidad colaborativa.</p>
          </div>
        </div>
      </div>
    </div>
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
      this.$router.push({ name: 'Login' });
    },

    goToRegistrar() {
      this.$router.push({ name: 'Registrar' });
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

.hero-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: var(--spacing-2xl);
  background-color: #4CAF50;
  background-image: url('../assets/cestaesparza.jpg');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  color: white;
  min-height: 50vh;
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.85) 0%, rgba(102, 187, 106, 0.75) 100%);
}

.hero-content {
  max-width: 600px;
  position: relative;
  z-index: 1;
}

.hero-section h1 {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-md);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-section p {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-lg);
  opacity: 0.95;
}

.buttons {
  margin-top: var(--spacing-md);
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  justify-content: center;
}

.features-section {
  padding: var(--spacing-xl) 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.feature-card {
  text-align: center;
  padding: var(--spacing-xl);
  background: var(--color-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.feature-card i {
  font-size: 3rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.feature-card h3 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
}

.feature-card p {
  color: var(--color-text-light);
  margin: 0;
}
</style>
