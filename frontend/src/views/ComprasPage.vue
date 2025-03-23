<template>
  <div class="compras-page">
    <NavBar />
    <div class="compras-content">
      <h2>Compras</h2>
      <div class="filtros">
        <!-- Filtros por categoría o proveedor -->
      </div>
      <div class="lista-productos">
        <div v-for="producto in productos" :key="producto.id" class="producto-card">
          <h3>{{ producto.nombre }}</h3>
          <p>{{ producto.descripcion }}</p>
          <p>Precio: {{ producto.precio }}€</p>
          <button @click="añadirACesta(producto)" class="btn btn-primary">Añadir a la cesta</button>
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
      productos: [
        // Ejemplo de datos de productos
        { id: 1, nombre: 'Manzanas', descripcion: 'Manzanas ecológicas', precio: 2.5 },
        { id: 2, nombre: 'Pan', descripcion: 'Pan integral', precio: 1.8 }
      ]
    };
  },
  methods: {
    añadirACesta(producto) {
      // Lógica para añadir el producto a la cesta
      console.log('Añadiendo a la cesta:', producto);
    }
  }
};
</script>

<style scoped>
.compras-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.compras-content {
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
}

.btn {
  margin-top: 1rem;
}
</style>