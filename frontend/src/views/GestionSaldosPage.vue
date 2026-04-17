<template>
  <div class="gestion-saldos-page">
    <NavBar />
    <div class="page-content">
      <h2>Gestión de Saldos</h2>
      <div class="lista-saldos">
        <div v-for="usuario in usuarios" :key="usuario.id" class="saldo-card">
          <h3>{{ usuario.nombre }}</h3>
          <p>Saldo: {{ usuario.saldo }}€</p>
          <button @click="verDetalles(usuario.id)" class="btn btn-primary">Ver Detalles</button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>

export default {
  data() {
    return {
      usuarios: [
        // Ejemplo de datos de usuarios con saldos
        { id: 1, nombre: 'Juan Pérez', saldo: 25.5 },
        { id: 2, nombre: 'Ana Gómez', saldo: -18.7 }
      ]
    };
  },
  methods: {
    verDetalles(usuarioId) {
      console.log('Ver detalles del saldo:', usuarioId);
    }
  }
};
</script>

<style scoped>
.gestion-saldos-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.lista-saldos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.saldo-card {
  border: 1px solid var(--color-border);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}
</style>
