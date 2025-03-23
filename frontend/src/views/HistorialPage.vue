<template>
  <div class="historial-page">
    <NavBar />
    <div class="historial-content">
      <h2>Historial de Pedidos</h2>
      <div class="lista-pedidos">
        <div v-for="pedido in pedidos" :key="pedido.id" class="pedido-card">
          <h3>Pedido #{{ pedido.id }}</h3>
          <p>Fecha: {{ pedido.fecha }}</p>
          <p>Importe: {{ pedido.importe }}€</p>
          <p>Estado: {{ pedido.estado }}</p>
          <button @click="verDetalles(pedido.id)" class="btn btn-primary">Ver Detalles</button>
        </div>
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
  },
  data() {
    return {
      pedidos: [
        // Ejemplo de datos de pedidos
        { id: 1, fecha: '2023-10-01', importe: 25.5, estado: 'Entregado' },
        { id: 2, fecha: '2023-10-15', importe: 18.7, estado: 'En proceso' }
      ]
    };
  },
  methods: {
    verDetalles(pedidoId) {
      // Lógica para ver detalles del pedido
      console.log('Ver detalles del pedido:', pedidoId);
    }
  }
};
</script>

<style scoped>
.historial-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.historial-content {
  flex: 1;
  padding: 2rem;
}

.lista-pedidos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.pedido-card {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
}

.btn {
  margin-top: 1rem;
}
</style>