<template>
  <div class="gestion-notificaciones-page">
    <NavBar />
    <div class="page-content">
      <h2>Gestión de Notificaciones</h2>
      <div class="lista-notificaciones">
        <div v-for="notificacion in notificaciones" :key="notificacion.id" class="notificacion-card">
          <h3>Notificación #{{ notificacion.id }}</h3>
          <p>Mensaje: {{ notificacion.mensaje }}</p>
          <p>Fecha: {{ notificacion.fecha }}</p>
          <p>Estado: {{ notificacion.leida ? 'Leída' : 'No leída' }}</p>
          <button @click="marcarLeida(notificacion.id)" class="btn btn-primary">Marcar como Leída</button>
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
      notificaciones: [
        // Ejemplo de datos de notificaciones
        { id: 1, mensaje: 'Nuevo pedido recibido', fecha: '2026-03-01', leida: false },
        { id: 2, mensaje: 'Pago completado', fecha: '2026-03-30', leida: true }
      ]
    };
  },
  methods: {
    marcarLeida(notificacionId) {
      // Lógica para marcar una notificación como leída
      console.log('Marcando notificación como leída:', notificacionId);
    }
  }
};
</script>

<style scoped>
.gestion-notificaciones-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.lista-notificaciones {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.notificacion-card {
  border: 1px solid var(--color-border);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}
</style>