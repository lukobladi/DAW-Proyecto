<template>
  <div class="dashboard-page">
    <NavBar />
    <div class="dashboard-content container">
      <h2>¡Hola, {{ usuarioNombre }}!</h2>
      <div class="cesta-mensual">
        <h3>Cesta Mensual</h3>
        <p>Aquí puedes ver los productos que has pedido este mes.</p>
        <div class="lista-productos">
          <div v-for="producto in cestaMensual" :key="producto.id" class="producto-card">
            <img :src="producto.imagen" alt="Imagen del producto" class="producto-imagen" />
            <h3>{{ producto.nombre }}</h3>
            <p>Cantidad: {{ producto.cantidad }}</p>
            <p>Precio: {{ producto.precio }}€</p>
          </div>
        </div>
      </div>
      <div class="acceso-rapido">
        <router-link to="/compras" class="btn btn-primary">Adquirir Productos</router-link>
      </div>
      <div class="productos-disponibles">
        <h3>Productos Disponibles</h3>
        <div class="lista-productos">
          <div v-for="producto in productosDisponibles" :key="producto.id" class="producto-card">
            <img :src="producto.imagen" alt="Imagen del producto" class="producto-imagen" />
            <h3>{{ producto.nombre }}</h3>
            <p>{{ producto.descripcion }}</p>
            <p>Precio: {{ producto.precio }}€</p>
          </div>
        </div>
      </div>
      <div class="notificaciones">
        <h3>Notificaciones</h3>
        <!-- Lista de notificaciones -->
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>

import api from '@/services/api';

export default {

  data() {
    return {
      cestaMensual: [],
      productosDisponibles: []
    };
  },
   async created() {
    //await this.cargarCestaMensual();
    await this.cargarProductosDisponibles();
  },
  methods: {
    async cargarCestaMensual() {
      try {
        const response = await api.getCestaMensual();
        this.cestaMensual = response.data;
      } catch (error) {
        console.error('Error al cargar la cesta mensual:', error);
      }
    },
    async cargarProductosDisponibles() {
      try {
        const response = await api.getProductos();
        // Hay que concatenar la URL del backend, ya que la URL de la imagen la obtenemos como ruta relativa
        this.productosDisponibles = response.data.map(producto => ({
        ...producto,
        imagen: `http://localhost:3000${producto.imagen}`
      }));
      } catch (error) {
        console.error('Error al cargar productos disponibles:', error);
      }
    }
  }
};
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
}

.cesta-mensual, .productos-disponibles, .notificaciones {
  margin-bottom: 2rem;
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

.btn {
  margin-top: 1rem;
}
</style>