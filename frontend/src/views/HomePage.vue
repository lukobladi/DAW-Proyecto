<template>
  <div class="home-page">
    <NavBar />
    <div class="hero-section">
      <h1>Bienvenido al Grupo de Consumo</h1>
      <p>Un espacio para comprar productos locales y ecológicos de manera colaborativa.</p>
      <div class="buttons">
        <router-link to="/login" class="btn btn-primary">Iniciar Sesión</router-link>
        <router-link to="/register" class="btn btn-secondary">Registrarse</router-link>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/FooterBar.vue';

export default {
  components: {
    NavBar,
    Footer
  }
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
  padding: 2rem;
}

.buttons {
  margin-top: 1rem;
}

.btn {
  margin: 0 0.5rem;
}
</style>