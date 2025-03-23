<template>
  <div class="gestion-proveedores-page">
    <NavBar />
    <div class="gestion-proveedores-content">
      <h2>Gestión de Proveedores</h2>
      <button @click="añadirProveedor" class="btn btn-primary">Añadir Proveedor</button>
      <div class="lista-proveedores">
        <div v-for="proveedor in proveedores" :key="proveedor.id" class="proveedor-card">
          <h3>{{ proveedor.nombre }}</h3>
          <p>Contacto: {{ proveedor.contacto }}</p>
          <p>Estado: {{ proveedor.activo ? 'Activo' : 'Inactivo' }}</p>
          <button @click="editarProveedor(proveedor.id)" class="btn btn-secondary">Editar</button>
          <button @click="eliminarProveedor(proveedor.id)" class="btn btn-danger">Eliminar</button>
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
      proveedores: [
        // Ejemplo de datos de proveedores
        { id: 1, nombre: 'Proveedor A', contacto: 'contacto@proveedora.com', activo: true },
        { id: 2, nombre: 'Proveedor B', contacto: 'contacto@proveedorb.com', activo: false }
      ]
    };
  },
  methods: {
    añadirProveedor() {
      // Lógica para añadir un nuevo proveedor
      console.log('Añadiendo proveedor...');
    },
    editarProveedor(proveedorId) {
      // Lógica para editar un proveedor
      console.log('Editando proveedor:', proveedorId);
    },
    eliminarProveedor(proveedorId) {
      // Lógica para eliminar un proveedor
      console.log('Eliminando proveedor:', proveedorId);
    }
  }
};
</script>

<style scoped>
.gestion-proveedores-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.gestion-proveedores-content {
  flex: 1;
  padding: 2rem;
}

.lista-proveedores {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.proveedor-card {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
}

.btn {
  margin-top: 1rem;
  margin-right: 0.5rem;
}
</style>