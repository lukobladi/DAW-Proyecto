<!-- Componente raiz de la aplicacion -->
<!-- Muestra la barra de navegacion, las alertas globales y el pie de pagina -->

<template>
  <div class="app">
    <!-- Alerta Global con Transicion -->
    <transition name="fade">
      <div v-if="alertStore.message" :class="['alert', alertClass]" role="alert">
        {{ alertStore.message }}
        <button type="button" class="btn-close" aria-label="Close" @click="alertStore.clearAlert"></button>
      </div>
    </transition>
    <NavBar />
    <router-view />
    <FooterBar />
  </div>
</template>

<script>
// Componente principal que engloba toda la aplicacion
import { computed } from 'vue';
import { alertStore } from './store/alertStore';
import NavBar from './components/NavBar.vue';
import FooterBar from './components/FooterBar.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    FooterBar,
  },
  setup() {
    // Calculo la clase de la alerta segun el tipo (success o danger)
    const alertClass = computed(() => {
      return alertStore.type === 'danger' ? 'alert-danger' : 'alert-success';
    });

    return {
      alertStore,
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

.router-view {
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