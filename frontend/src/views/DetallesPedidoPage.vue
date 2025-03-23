<template>
  <div class="detalles-pedido-page">
    <NavBar />
    <div class="detalles-pedido-content">
      <h2>Detalles del Pedido #{{ pedido.id }}</h2>
      <div class="lista-productos">
        <div v-for="producto in pedido.productos" :key="producto.id" class="producto-card">
          <img :src="producto.imagen" alt="Imagen del producto" class="producto-imagen" />
          <h3>{{ producto.nombre }}</h3>
          <p>Cantidad: {{ producto.cantidad }}</p>
          <p>Precio Unitario: {{ producto.precioUnitario }}€</p>
          <p>Total: {{ producto.total }}€</p>
        </div>
      </div>
      <div class="info-adicional">
        <p>Fecha de Entrega: {{ pedido.fechaEntrega }}</p>
        <p>Estado: {{ pedido.estado }}</p>
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
      pedido: {
        id: 1,
        productos: [
          { id: 1, nombre: 'Manzanas', cantidad: 5, precioUnitario: 2.5, total: 12.5, imagen: '/uploads/manzanas.jpg' },
          { id: 2, nombre: 'Pan', cantidad: 3, precioUnitario: 1.8, total: 5.4, imagen: '/uploads/pan.jpg' }
        ],
        fechaEntrega: '2023-10-10',
        estado: 'Entregado'
      }
    };
  }
};
</script>

<style scoped>
.detalles-pedido-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.detalles-pedido-content {
  flex: 1;
  padding: 2rem;
}

.lista-productos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.producto-card {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.producto-imagen {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.info-adicional {
  margin-top: 2rem;
}
</style>