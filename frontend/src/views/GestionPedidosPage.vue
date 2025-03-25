<template>
  <div class="gestion-pedidos-page">
    <NavBar />
    <div class="gestion-pedidos-content">
      <h2>Gestión de Pedidos</h2>
      <button @click="crearPedido" class="btn btn-primary">Crear Pedido</button>
      <div class="lista-pedidos">
        <div v-for="pedido in pedidos" :key="pedido.id" class="pedido-card">
          <h3>Pedido #{{ pedido.id }}</h3>
          <p>Fecha: {{ pedido.fecha }}</p>
          <p>Importe: {{ pedido.importe }}€</p>
          <p>Estado: {{ pedido.estado }}</p>
          <button @click="editarPedido(pedido.id)" class="btn btn-secondary">Editar</button>
          <button @click="eliminarPedido(pedido.id)" class="btn btn-danger">Eliminar</button>
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
      pedidos: [
        // Ejemplo de datos de pedidos
        { id: 1, fecha: '2023-10-01', importe: 25.5, estado: 'Entregado' },
        { id: 2, fecha: '2023-10-15', importe: 18.7, estado: 'En proceso' }
      ]
    };
  },
  methods: {
    crearPedido() {
      // Lógica para crear un nuevo pedido
      console.log('Creando pedido...');
    },
    editarPedido(pedidoId) {
      // Lógica para editar un pedido
      console.log('Editando pedido:', pedidoId);
    },
    eliminarPedido(pedidoId) {
      // Lógica para eliminar un pedido
      console.log('Eliminando pedido:', pedidoId);
    }
  }
};
</script>

<style scoped>
.gestion-pedidos-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.gestion-pedidos-content {
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
  margin-right: 0.5rem;
}
</style>