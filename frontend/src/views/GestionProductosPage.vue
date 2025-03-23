<template>
  <div class="gestion-productos-page">
    <NavBar />
    <div class="gestion-productos-content">
      <h2>Gestión de Productos</h2>
      <button @click="añadirProducto" class="btn btn-primary">Añadir Producto</button>
      <div class="lista-productos">
        <div v-for="producto in productos" :key="producto.id" class="producto-card">
          <h3>{{ producto.nombre }}</h3>
          <p>{{ producto.descripcion }}</p>
          <p>Precio: {{ producto.precio }}€</p>
          <p>Estado: {{ producto.activo ? 'Activo' : 'Inactivo' }}</p>
          <button @click="editarProducto(producto.id)" class="btn btn-secondary">Editar</button>
          <button @click="eliminarProducto(producto.id)" class="btn btn-danger">Eliminar</button>
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
        { id: 1, nombre: 'Manzanas', descripcion: 'Manzanas ecológicas', precio: 2.5, activo: true },
        { id: 2, nombre: 'Pan', descripcion: 'Pan integral', precio: 1.8, activo: false }
      ]
    };
  },
  methods: {
    añadirProducto() {
      // Lógica para añadir un nuevo producto
      console.log('Añadiendo producto...');
    },
    editarProducto(productoId) {
      // Lógica para editar un producto
      console.log('Editando producto:', productoId);
    },
    eliminarProducto(productoId) {
      // Lógica para eliminar un producto
      console.log('Eliminando producto:', productoId);
    }
  }
};
</script>

<style scoped>
.gestion-productos-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.gestion-productos-content {
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
  margin-right: 0.5rem;
}
</style>