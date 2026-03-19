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
    
    <!-- Muestra la barra de navegacion solo si el estado de autenticacion ha sido restaurado -->
    <NavBar v-if="authStore.stateRestored" />
    
    <!-- Muestra un estado de carga mientras se restaura el estado de autenticacion -->
    <div v-if="authStore.loading" class="loading-state">
      Cargando...
    </div>
    
    <!-- Muestra el contenido principal una vez que el estado ha sido restaurado -->
    <router-view v-if="authStore.stateRestored" />
    
    <FooterBar v-if="authStore.stateRestored" />
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useAuthStore } from './store';
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
    const authStore = useAuthStore();

    // Cuando el componente se monta, restaura el estado de autenticacion
    onMounted(() => {
      if (!authStore.stateRestored) {
        authStore.hydrateAuthState();
      }
    });

    const alertClass = computed(() => {
      return alertStore.type === 'danger' ? 'alert-danger' : 'alert-success';
    });

    return {
      alertStore,
      alertClass,
      authStore,
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

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
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