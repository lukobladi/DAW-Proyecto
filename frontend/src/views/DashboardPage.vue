<template>
  <div class="dashboard-page">
    <NavBar />
    <div class="dashboard-content">
      <h2>Dashboard</h2>
      <div class="cesta-mensual">
        <h3>Cesta Mensual</h3>
        <p>Aquí puedes ver los productos que has pedido este mes.</p>
        <!-- Lista de productos en la cesta -->
      </div>
      <div class="acceso-rapido">
        <router-link to="/compras" class="btn btn-primary">Adquirir Productos</router-link>
      </div>
      <div class="productos-disponibles">
        <h3>Productos Disponibles</h3>
        <!-- Lista de productos disponibles -->
      </div>
      <div class="notificaciones">
        <h3>Notificaciones</h3>
        <!-- Lista de notificaciones -->
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
.dashboard-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
}

.cesta-mensual, .productos-disponibles, .notificaciones {
  margin-bottom: 2rem;
}

.btn {
  margin-top: 1rem;
}
</style>