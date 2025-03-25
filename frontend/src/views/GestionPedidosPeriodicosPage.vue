<template>
  <div class="gestion-pedidos-periodicos-page">
    <NavBar />
    <div class="gestion-pedidos-periodicos-content">
      <h2>Gestión de Pedidos Periódicos</h2>
      <button @click="crearPedidoPeriodico" class="btn btn-primary">Crear Pedido Periódico</button>
      <div class="lista-pedidos-periodicos">
        <div v-for="pedidoPeriodico in pedidosPeriodicos" :key="pedidoPeriodico.id" class="pedido-periodico-card">
          <h3>Pedido Periódico #{{ pedidoPeriodico.id }}</h3>
          <p>Frecuencia: {{ pedidoPeriodico.frecuencia }}</p>
          <p>Fecha de Inicio: {{ pedidoPeriodico.fechaInicio }}</p>
          <p>Fecha de Fin: {{ pedidoPeriodico.fechaFin }}</p>
          <button @click="editarPedidoPeriodico(pedidoPeriodico.id)" class="btn btn-secondary">Editar</button>
          <button @click="eliminarPedidoPeriodico(pedidoPeriodico.id)" class="btn btn-danger">Eliminar</button>
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
      pedidosPeriodicos: [
        // Ejemplo de datos de pedidos periódicos
        { id: 1, frecuencia: 'Semanal', fechaInicio: '2023-10-01', fechaFin: '2023-12-31' },
        { id: 2, frecuencia: 'Mensual', fechaInicio: '2023-10-01', fechaFin: '2023-12-31' }
      ]
    };
  },
  methods: {
    crearPedidoPeriodico() {
      // Lógica para crear un nuevo pedido periódico
      console.log('Creando pedido periódico...');
    },
    editarPedidoPeriodico(pedidoPeriodicoId) {
      // Lógica para editar un pedido periódico
      console.log('Editando pedido periódico:', pedidoPeriodicoId);
    },
    eliminarPedidoPeriodico(pedidoPeriodicoId) {
      // Lógica para eliminar un pedido periódico
      console.log('Eliminando pedido periódico:', pedidoPeriodicoId);
    }
  }
};
</script>

<style scoped>
.gestion-pedidos-periodicos-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.gestion-pedidos-periodicos-content {
  flex: 1;
  padding: 2rem;
}

.lista-pedidos-periodicos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.pedido-periodico-card {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
}

.btn {
  margin-top: 1rem;
  margin-right: 0.5rem;
}
</style>