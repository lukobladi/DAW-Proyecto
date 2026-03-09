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
            <button class="btn btn-sm btn-success" @click="abrirModalEditar(producto)">Editar</button>
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
            <input v-model="form.nombre" class="form-control" required />
          </div>
          <div class="mb-2">
            <label class="form-label">Descripcion</label>
            <textarea v-model="form.descripcion" class="form-control" rows="3" required />
          </div>
          <div class="mb-2">
            <label class="form-label">Precio</label>
            <input v-model.number="form.precio" type="number" min="0" step="0.01" class="form-control" required />
          </div>
          <div v-if="isAdmin" class="mb-2">
            <label class="form-label">Proveedor</label>
            <select v-model.number="form.id_proveedor" class="form-select" required>
              <option disabled :value="null">Selecciona proveedor</option>
              <option
                v-for="proveedor in proveedores"
                :key="proveedor.id_proveedor"
                :value="proveedor.id_proveedor"
              >
                {{ proveedor.nombre }}
              </option>
            </select>
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
    };
  },
  computed: {
    isAdmin() {
      const authStore = useAuthStore();
      return authStore.user?.role === 'admin';
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
    abrirModalCrear() {
      this.modoEdicion = false;
      const nuevoForm = productoVacio();
      if (!this.isAdmin && this.proveedores.length > 0) {
        nuevoForm.id_proveedor = this.proveedores[0].id_proveedor;
      }
      this.form = nuevoForm;
      this.mostrarModal = true;
    },
    abrirModalEditar(producto) {
      this.modoEdicion = true;
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
      } catch {
        alertStore.showAlert('No se pudo guardar el producto.', 'danger');
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
.estado {
  padding: 1rem 0;
}

.estado.error {
  color: #dc3545;
}

.producto-card {
  border: 1px solid #dee2e6;
  border-radius: 10px;
  padding: 0.9rem;
  background: #fff;
}

.producto-imagen {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.8rem;
}

.estado-pill {
  display: inline-block;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.8rem;
}

.estado-pill.activo {
  background: #d1e7dd;
  color: #0f5132;
}

.estado-pill.inactivo {
  background: #f8d7da;
  color: #842029;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}

.modal-card {
  width: min(92vw, 560px);
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
}
</style>
