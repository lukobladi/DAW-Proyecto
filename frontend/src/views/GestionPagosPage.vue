<template>
  <div class="gestion-pagos-page">
    <NavBar />
    <div class="gestion-pagos-content">
      <h2>Gestión de Pagos</h2>
      <div class="lista-pagos">
        <div v-for="pago in pagos" :key="pago.id" class="pago-card">
          <h3>Pago #{{ pago.id }}</h3>
          <p>Deudor: {{ pago.deudor }}</p>
          <p>Acreedor: {{ pago.acreedor }}</p>
          <p>Monto: {{ pago.monto }}€</p>
          <p>Estado: {{ pago.estado }}</p>
          <button @click="cambiarEstadoPago(pago.id)" class="btn btn-primary">Cambiar Estado</button>
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
      pagos: [
        // Ejemplo de datos de pagos
        { id: 1, deudor: 'Juan Pérez', acreedor: 'Ana Gómez', monto: 25.5, estado: 'Pendiente' },
        { id: 2, deudor: 'Carlos López', acreedor: 'María Ruiz', monto: 18.7, estado: 'Completado' }
      ]
    };
  },
  methods: {
    cambiarEstadoPago(pagoId) {
      // Lógica para cambiar el estado de un pago
      console.log('Cambiando estado del pago:', pagoId);
    }
  }
};
</script>

<style scoped>
.gestion-pagos-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.gestion-pagos-content {
  flex: 1;
  padding: 2rem;
}

.lista-pagos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.pago-card {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
}

.btn {
  margin-top: 1rem;
}
</style>