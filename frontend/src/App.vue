<template>
  <div class="app">
    <!-- Alerta Global con Transición -->
    <transition name="fade">
      <div v-if="alertStore.message" :class="['alert', alertClass]" role="alert">
        {{ alertStore.message }}
        <button type="button" class="btn-close" aria-label="Close" @click="alertStore.clearAlert"></button>
      </div>
    </transition>
    <NavBar />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import { computed } from 'vue'; // Importación correcta de `computed`
import { alertStore } from './store/alertStore'; // Importación del estado global
import NavBar from './components/NavBar.vue';
import Footer from './components/FooterBar.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    Footer,
  },
  setup() {
    // Computar la clase de la alerta según el tipo
    const alertClass = computed(() => {
      return alertStore.type === 'danger' ? 'alert-danger' : 'alert-success';
    });

    return {
      alertStore, // Usar el estado global
      alertClass,
    };
  },
};
</script>

<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

router-view {
  flex: 1;
}

/* Estilo para la transición de la alerta */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.alert {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1050;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 300px;
}

.alert .btn-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>