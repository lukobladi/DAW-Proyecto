<template>
  <div class="page-content container">
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

// ============================================
// FUNCION AUXILIAR: productoVacio
// Crea un objeto de producto vacío con valores por defecto
// Parámetros: Ninguno
// Retorna: Object - Objeto con estructura de producto vacía
// ============================================
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
  // ============================================
  // data()
  // Variables de estado del componente
  // ============================================
  data() {
    return {
      // Lista de productos cargados
      productos: [],
      // Lista de proveedores disponibles
      proveedores: [],
      // Bandera que indica si se están cargando datos
      cargando: false,
      // Mensaje de error en caso de que la carga falle
      errorCarga: '',
      // ID del producto que se está modificando (para deshabilitar botones)
      accionandoId: null,
      // Bandera que controla la visibilidad del modal
      mostrarModal: false,
      // Bandera que indica si estamos editando (true) o creando (false)
      modoEdicion: false,
      // Bandera que indica si se está guardando el formulario
      guardando: false,
      // Formulario de producto (para crear/editar)
      form: productoVacio(),
      // Objeto de errores de validación del formulario
      errors: {},
    };
  },
  // ============================================
  // computed
  // Propiedades calculadas del componente
  // ============================================
  computed: {
    // ============================================
    // isAdmin
    // Determina si el usuario tiene rol de administrador
    // Parámetros: Ninguno
    // Retorna: Boolean - true si es admin
    // ============================================
    isAdmin() {
      const authStore = useAuthStore();
      return authStore.user?.rol === 'admin';
    },
    // ============================================
    // isGestor
    // Determina si el usuario tiene rol de gestor
    // Parámetros: Ninguno
    // Retorna: Boolean - true si es gestor
    // ============================================
    isGestor() {
      const authStore = useAuthStore();
      return authStore.user?.rol === 'gestor';
    },
    // ============================================
    // isAdminOrGestor
    // Determina si el usuario es admin o gestor
    // Parámetros: Ninguno
    // Retorna: Boolean - true si es admin o gestor
    // ============================================
    isAdminOrGestor() {
      const authStore = useAuthStore();
      return authStore.user?.rol === 'admin' || authStore.user?.rol === 'gestor';
    },
    // ============================================
    // nombreProveedorAsignado
    // Obtiene el nombre del proveedor asignado al gestor actual
    // Parámetros: Ninguno
    // Retorna: String - Nombre del proveedor o mensaje de carga
    // ============================================
    nombreProveedorAsignado() {
      if (!this.form.id_proveedor) return 'Cargando...';
      return this.proveedores.find(p => p.id_proveedor === this.form.id_proveedor)?.nombre || '-';
    },
  },
  // ============================================
  // created()
  // Hook que se ejecuta cuando el componente se crea
  // ============================================
  async created() {
    // Carga productos y proveedores
    await this.cargarDatos();
  },
  // ============================================
  // methods
  // Métodos del componente
  // ============================================
  methods: {
    // ============================================
    // getBackendOrigin
    // Obtiene el origen del backend para construir URLs completas
    // Parámetros: Ninguno
    // Retorna: String - Origen del backend
    // ============================================
    getBackendOrigin() {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
        return new URL(apiUrl).origin;
      }
      return window.location.origin;
    },
    // ============================================
    // normalizarImagen
    // Normaliza la URL de una imagen para que sea accesible
    // Parámetros: imagen (String) - URL de la imagen
    // Retorna: String - URL normalizada
    // ============================================
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
    // ============================================
    // onImageError
    // Maneja errores de carga de imágenes
    // Parámetros: event (Event) - Evento de error
    // Retorna: No retorna valor
    // ============================================
    onImageError(event) {
      event.target.src = '/favicon.ico';
    },
    // ============================================
    // nombreProveedor
    // Busca el nombre de un proveedor por su ID
    // Parámetros: idProveedor (Number) - ID del proveedor
    // Retorna: String - Nombre del proveedor o '-'
    // ============================================
    nombreProveedor(idProveedor) {
      return this.proveedores.find((item) => item.id_proveedor === idProveedor)?.nombre || '-';
    },
    // ============================================
    // cargarDatos
    // Carga la lista de productos y proveedores
    // Parámetros: Ninguno
    // Retorna: No retorna valor, actualiza las variables productos y proveedores
    // Efectos secundarios: Llama a api.getProveedores y api.getProductos o api.getMisProductos
    // ============================================
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
    // ============================================
    // abrirModalCrear
    // Abre el modal para crear un nuevo producto
    // Parámetros: Ninguno
    // Retorna: No retorna valor
    // Efectos secundarios: Resetea el formulario, detecta proveedor del gestor
    // ============================================
    async abrirModalCrear() {
      this.modoEdicion = false;
      this.errors = {};
      const nuevoForm = productoVacio();
      
      // Si es gestor, intenta detectar su proveedor asignado
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
    // ============================================
    // abrirModalEditar
    // Abre el modal para editar un producto existente
    // Parámetros: producto (Object) - Producto a editar
    // Retorna: No retorna valor
    // Efectos secundarios: Prepara el formulario con datos del producto
    // ============================================
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
    // ============================================
    // cerrarModal
    // Cierra el modal de crear/editar producto
    // Parámetros: Ninguno
    // Retorna: No retorna valor
    // Efectos secundarios: Oculta el modal
    // ============================================
    cerrarModal() {
      this.mostrarModal = false;
    },
    // ============================================
    // seleccionarImagen
    // Maneja la selección de una imagen desde el formulario
    // Parámetros: event (Event) - Evento de cambio del input file
    // Retorna: No retorna valor
    // Efectos secundarios: Actualiza form.imagenFile
    // ============================================
    seleccionarImagen(event) {
      this.form.imagenFile = event.target.files?.[0] || null;
    },
    // ============================================
    // guardarProducto
    // Guarda el producto (crea nuevo o actualiza existente)
    // Parámetros: Ninguno (obtiene datos del formulario via v-model)
    // Retorna: No retorna valor
    // Efectos secundarios: Llama a api.crearProducto o api.actualizarProducto
    // ============================================
    async guardarProducto() {
      this.errors = {};
      this.guardando = true;
      try {
        // Crea FormData para enviar archivo de imagen
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
    // ============================================
    // cambiarEstado
    // Activa o desactiva un producto
    // Parámetros: producto (Object) - Producto cuyo estado se cambiará
    // Retorna: No retorna valor
    // Efectos secundarios: Llama a api.cambiarEstadoProducto
    // ============================================
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
    // ============================================
    // eliminarProducto
    // Elimina un producto existente tras confirmación
    // Parámetros: idProducto (Number) - ID del producto a eliminar
    // Retorna: No retorna valor
    // Efectos secundarios: Llama a api.eliminarProducto, actualiza lista
    // ============================================
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
  border: 1px solid var(--color-border);
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
  height: 160px;
  object-fit: contain;
  background-color: #f8f9fa;
  flex-shrink: 0;
  padding: 0.5rem;
}

.producto-card h5 {
  padding: var(--spacing-md) var(--spacing-md) 0.25rem;
  margin: 0;
  font-size: var(--font-size-base);
}

.producto-card p {
  padding: 0 var(--spacing-md);
  margin: 0.25rem 0;
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
}

.producto-card p:last-of-type {
  margin-bottom: var(--spacing-sm);
}

.producto-card .d-flex {
  margin-top: auto;
  padding: 0 var(--spacing-md) var(--spacing-md);
}
</style>
