<template>
  <div class="gestion-notificaciones-page">
    <NavBar />
    <div class="gestion-notificaciones-content">
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
        { id: 1, mensaje: 'Nuevo pedido recibido', fecha: '2023-10-01', leida: false },
        { id: 2, mensaje: 'Pago completado', fecha: '2023-10-15', leida: true }
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

.gestion-notificaciones-content {
  flex: 1;
  padding: 2rem;
}

.lista-notificaciones {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.notificacion-card {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
}

.btn {
  margin-top: 1rem;
}
</style>