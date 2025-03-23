<template>
  <div class="gestion-productos-page">
    <NavBar />
    <div class="gestion-productos-content">
      <h2>Gestión de Productos</h2>
      <button @click="mostrarModalCrear" class="btn btn-primary">Añadir Producto</button>
      <div class="lista-productos">
        <div v-for="producto in productos" :key="producto.id" class="producto-card">
          <img :src="producto.imagen" alt="Imagen del producto" class="producto-imagen" />
          <h3>{{ producto.nombre }}</h3>
          <p>{{ producto.descripcion }}</p>
          <p>Precio: {{ producto.precio }}€</p>
          <p>Estado: {{ producto.activo ? 'Activo' : 'Inactivo' }}</p>
          <button @click="editarProducto(producto)" class="btn btn-secondary">Editar</button>
          <button @click="eliminarProducto(producto.id)" class="btn btn-danger">Eliminar</button>
        </div>
      </div>

      <!-- Modal para crear/editar producto -->
      <div v-if="mostrarModal" class="modal">
        <div class="modal-content">
          <h3>{{ modoEdicion ? 'Editar Producto' : 'Añadir Producto' }}</h3>
          <form @submit.prevent="guardarProducto">
            <input v-model="form.nombre" placeholder="Nombre" required />
            <textarea v-model="form.descripcion" placeholder="Descripción" required></textarea>
            <input v-model="form.precio" type="number" placeholder="Precio" required />
            <input type="file" @change="seleccionarImagen" />
            <button type="submit" class="btn btn-primary">Guardar</button>
            <button type="button" @click="cerrarModal" class="btn btn-secondary">Cancelar</button>
          </form>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import Footer from '@/components/FooterBar.vue';
import api from '@/services/api';

export default {
  components: {
    NavBar,
    Footer
  },
  data() {
    return {
      productos: [],
      mostrarModal: false,
      modoEdicion: false,
      form: {
        id: null,
        nombre: '',
        descripcion: '',
        precio: 0,
        imagen: null
      }
    };
  },
  async created() {
    await this.cargarProductos();
  },
  methods: {
    async cargarProductos() {
      try {
        const response = await api.getProductos();
        this.productos = response.data;
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    },
    mostrarModalCrear() {
      this.modoEdicion = false;
      this.form = { id: null, nombre: '', descripcion: '', precio: 0, imagen: null };
      this.mostrarModal = true;
    },
    editarProducto(producto) {
      this.modoEdicion = true;
      this.form = { ...producto };
      this.mostrarModal = true;
    },
    seleccionarImagen(event) {
      this.form.imagen = event.target.files[0];
    },
    async guardarProducto() {
      const formData = new FormData();
      formData.append('nombre', this.form.nombre);
      formData.append('descripcion', this.form.descripcion);
      formData.append('precio', this.form.precio);
      if (this.form.imagen) {
        formData.append('imagen', this.form.imagen);
      }

      try {
        if (this.modoEdicion) {
          await api.actualizarProducto(this.form.id, formData);
        } else {
          await api.crearProducto(formData);
        }
        await this.cargarProductos();
        this.cerrarModal();
      } catch (error) {
        console.error('Error al guardar el producto:', error);
      }
    },
    async eliminarProducto(id) {
      try {
        await api.eliminarProducto(id);
        await this.cargarProductos();
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
      }
    },
    cerrarModal() {
      this.mostrarModal = false;
    }
  }
};
</script>

<style scoped>
/* Estilos anteriores */
</style>