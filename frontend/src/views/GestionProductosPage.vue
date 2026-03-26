<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-0">Gestion de Productos</h2>
      <button class="btn btn-primary" @click="abrirModalCrear">Anadir producto</button>
    </div>

    <div v-if="cargando" class="estado">Cargando productos...</div>
    <div v-else-if="errorCarga" class="estado error">{{ errorCarga }}</div>

    <div v-else class="row g-3">
      <div v-for="producto in productos" :key="producto.id_producto" class="col-12 col-md-6 col-lg-4">
        <div class="producto-card">
          <img
            :src="normalizarImagen(producto.imagen)"
            class="producto-imagen"
            alt="Imagen de producto"
            @error="onImageError"
          />
          <h5>{{ producto.nombre }}</h5>
          <p class="mb-1">{{ producto.descripcion }}</p>
          <p class="mb-1"><strong>Precio:</strong> {{ Number(producto.precio).toFixed(2) }} EUR</p>
          <p class="mb-1"><strong>Proveedor:</strong> {{ nombreProveedor(producto.id_proveedor) }}</p>
          <p class="mb-2">
            <span :class="['estado-pill', producto.activo ? 'activo' : 'inactivo']">
              {{ producto.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </p>
          <div class="d-flex gap-2 flex-wrap">
            <button v-if="isAdminOrGestor" class="btn btn-sm btn-success" @click="abrirModalEditar(producto)">Editar</button>
            <button
              class="btn btn-sm btn-warning"
              @click="cambiarEstado(producto)"
              :disabled="accionandoId === producto.id_producto"
            >
              {{ producto.activo ? 'Desactivar' : 'Activar' }}
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="eliminarProducto(producto.id_producto)"
              :disabled="accionandoId === producto.id_producto"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-card">
        <h4>{{ modoEdicion ? 'Editar producto' : 'Nuevo producto' }}</h4>
        <form @submit.prevent="guardarProducto">
          <div class="mb-2">
            <label class="form-label">Nombre</label>
            <input v-model="form.nombre" class="form-control" required :class="{ 'is-invalid': errors.nombre }" />
            <span v-if="errors.nombre" class="error-text">{{ errors.nombre }}</span>
          </div>
          <div class="mb-2">
            <label class="form-label">Descripcion</label>
            <textarea v-model="form.descripcion" class="form-control" rows="3" required :class="{ 'is-invalid': errors.descripcion }" />
            <span v-if="errors.descripcion" class="error-text">{{ errors.descripcion }}</span>
          </div>
          <div class="mb-2">
            <label class="form-label">Precio</label>
            <input v-model.number="form.precio" type="number" min="0" step="0.01" class="form-control" required :class="{ 'is-invalid': errors.precio }" />
            <span v-if="errors.precio" class="error-text">{{ errors.precio }}</span>
          </div>
          <div v-if="isAdmin" class="mb-2">
            <label class="form-label">Proveedor</label>
            <select v-model.number="form.id_proveedor" class="form-select" required :class="{ 'is-invalid': errors.id_proveedor }">
              <option disabled :value="null">Selecciona proveedor</option>
              <option
                v-for="proveedor in proveedores"
                :key="proveedor.id_proveedor"
                :value="proveedor.id_proveedor"
              >
                {{ proveedor.nombre }}
              </option>
            </select>
            <span v-if="errors.id_proveedor" class="error-text">{{ errors.id_proveedor }}</span>
          </div>
          <div v-else class="mb-2">
            <label class="form-label">Proveedor</label>
            <input 
              v-model="nombreProveedorAsignado" 
              class="form-control" 
              disabled 
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Imagen</label>
            <input type="file" class="form-control" @change="seleccionarImagen" accept="image/*" />
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-primary" type="submit" :disabled="guardando">
              {{ guardando ? 'Guardando...' : 'Guardar' }}
            </button>
            <button class="btn btn-secondary" type="button" @click="cerrarModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import { alertStore } from '@/store/alertStore';
import { useAuthStore } from '@/store';

function productoVacio() {
  return {
    id_producto: null,
    nombre: '',
    descripcion: '',
    precio: '',
    id_proveedor: null,
    imagen: null,
    activo: true,
  };
}

export default {
  data() {
    return {
      productos: [],
      proveedores: [],
      cargando: false,
      errorCarga: '',
      accionandoId: null,
      mostrarModal: false,
      modoEdicion: false,
      guardando: false,
      form: productoVacio(),
      errors: {},
    };
  },
  computed: {
    isAdmin() {
      const authStore = useAuthStore();
      return authStore.user?.rol === 'admin';
    },
    isGestor() {
      const authStore = useAuthStore();
      return authStore.user?.rol === 'gestor';
    },
    isAdminOrGestor() {
      const authStore = useAuthStore();
      return authStore.user?.rol === 'admin' || authStore.user?.rol === 'gestor';
    },
    nombreProveedorAsignado() {
      if (!this.form.id_proveedor) return 'Cargando...';
      return this.proveedores.find(p => p.id_proveedor === this.form.id_proveedor)?.nombre || '-';
    },
  },
  async created() {
    await this.cargarDatos();
  },
  methods: {
    getBackendOrigin() {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
        return new URL(apiUrl).origin;
      }
      return window.location.origin;
    },
    normalizarImagen(imagen) {
      if (!imagen) {
        return '/favicon.ico';
      }
      if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
        return imagen;
      }
      if (imagen.startsWith('/')) {
        return `${this.getBackendOrigin()}${imagen}`;
      }
      return `${this.getBackendOrigin()}/${imagen}`;
    },
    onImageError(event) {
      event.target.src = '/favicon.ico';
    },
    nombreProveedor(idProveedor) {
      return this.proveedores.find((item) => item.id_proveedor === idProveedor)?.nombre || '-';
    },
    async cargarDatos() {
      this.cargando = true;
      this.errorCarga = '';
      try {
        const proveedoresResponse = await api.getProveedores();
        this.proveedores = proveedoresResponse.data || [];

        let productosResponse;
        if (this.isAdmin) {
          productosResponse = await api.getProductos();
        } else {
          productosResponse = await api.getMisProductos();
        }
        this.productos = productosResponse.data || [];
      } catch (error) {
        if (error.response?.status === 403) {
          this.errorCarga = error.response.data.error || 'No tienes acceso a productos.';
        } else {
          this.errorCarga = 'No se pudieron cargar los productos.';
        }
      } finally {
        this.cargando = false;
      }
    },
    async abrirModalCrear() {
      this.modoEdicion = false;
      this.errors = {};
      const nuevoForm = productoVacio();
      
      if (this.isGestor) {
        try {
          const response = await api.getMisProductos();
          const misProductos = response.data || [];
          if (misProductos.length > 0) {
            nuevoForm.id_proveedor = misProductos[0].id_proveedor;
          }
        } catch (error) {
          console.error("Error fetching gestor's products:", error);
          alertStore.showAlert('No se pudo determinar el proveedor para el gestor.', 'danger');
          return;
        }
      }
      
      this.form = nuevoForm;
      this.mostrarModal = true;
    },
    abrirModalEditar(producto) {
      this.modoEdicion = true;
      this.errors = {};
      this.form = {
        id_producto: producto.id_producto,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: Number(producto.precio),
        id_proveedor: producto.id_proveedor,
        imagenFile: null,
      };
      this.mostrarModal = true;
    },
    cerrarModal() {
      this.mostrarModal = false;
    },
    seleccionarImagen(event) {
      this.form.imagenFile = event.target.files?.[0] || null;
    },
    async guardarProducto() {
      this.errors = {};
      this.guardando = true;
      try {
        const formData = new FormData();
        formData.append('nombre', this.form.nombre);
        formData.append('descripcion', this.form.descripcion);
        formData.append('precio', this.form.precio);
        formData.append('id_proveedor', this.form.id_proveedor);
        if (this.form.imagenFile) {
          formData.append('imagen', this.form.imagenFile);
        }

        if (this.modoEdicion) {
          await api.actualizarProducto(this.form.id_producto, formData);
          alertStore.showAlert('Producto actualizado correctamente.', 'success');
        } else {
          await api.crearProducto(formData);
          alertStore.showAlert('Producto creado correctamente.', 'success');
        }

        await this.cargarDatos();
        this.cerrarModal();
      } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.errors) {
          error.response.data.errors.forEach(msg => {
            const msgLower = msg.toLowerCase();
            if (msgLower.includes('nombre')) this.errors.nombre = msg;
            else if (msgLower.includes('descripcion')) this.errors.descripcion = msg;
            else if (msgLower.includes('precio')) this.errors.precio = msg;
            else if (msgLower.includes('proveedor')) this.errors.id_proveedor = msg;
            else alertStore.showAlert(msg, 'danger');
          });
        } else {
          alertStore.showAlert('No se pudo guardar el producto.', 'danger');
        }
      } finally {
        this.guardando = false;
      }
    },
    async cambiarEstado(producto) {
      this.accionandoId = producto.id_producto;
      try {
        await api.cambiarEstadoProducto(producto.id_producto, !producto.activo);
        await this.cargarDatos();
      } catch {
        alertStore.showAlert('No se pudo cambiar el estado del producto.', 'danger');
      } finally {
        this.accionandoId = null;
      }
    },
    async eliminarProducto(idProducto) {
      if (!window.confirm('Se eliminara el producto. Quieres continuar?')) {
        return;
      }

      this.accionandoId = idProducto;
      try {
        await api.eliminarProducto(idProducto);
        alertStore.showAlert('Producto eliminado correctamente.', 'success');
        await this.cargarDatos();
      } catch {
        alertStore.showAlert('No se pudo eliminar el producto.', 'danger');
      } finally {
        this.accionandoId = null;
      }
    },
  },
};
</script>

<style scoped>
.producto-card {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: var(--radius-lg);
  padding: 0;
  background: var(--color-bg);
  overflow: hidden;
  transition: all var(--transition-normal);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.producto-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.producto-imagen {
  width: 100%;
  height: 180px;
  object-fit: cover;
  background: var(--color-bg-secondary);
}

.producto-card h5 {
  padding: var(--spacing-md) var(--spacing-md) 0.25rem;
  margin: 0;
  font-size: var(--font-size-lg);
}

.producto-card p {
  padding: 0 var(--spacing-md);
  margin: 0.25rem 0;
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
}

.producto-card .btn {
  margin: var(--spacing-md);
}
</style>
