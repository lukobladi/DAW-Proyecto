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
      <div class="spinner"></div>
      <span>Cargando...</span>
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.25rem;
  color: var(--color-text-light);
  gap: 1rem;
}

.loading-state .spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.router-view {
  flex: 1;
}

.alert {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1060;
  padding: 1rem 2.5rem 1rem 1rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  max-width: 380px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.alert-success {
  background-color: #d1e7dd;
  color: #0f5132;
  border-left: 4px solid var(--color-success);
}

.alert-danger {
  background-color: #f8d7da;
  color: #842029;
  border-left: 4px solid var(--color-danger);
}

.alert .btn-close {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity var(--transition-fast);
}

.alert .btn-close:hover {
  opacity: 1;
}

@media (max-width: 480px) {
  .alert {
    left: 12px;
    right: 12px;
    top: 12px;
    max-width: none;
  }
}
</style>