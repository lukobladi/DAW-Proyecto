<template>
  <div class="page-content container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="mb-0">Gestion de Proveedores</h2>
      <button class="btn btn-primary" @click="abrirModalCrear">Anadir proveedor</button>
    </div>

    <div v-if="cargando" class="estado">Cargando proveedores...</div>
    <div v-else-if="errorCarga" class="estado error">{{ errorCarga }}</div>

    <template v-else>
      <div class="table-responsive d-none d-md-block">
        <table class="table table-striped align-middle">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Contacto</th>
              <th>Correo</th>
              <th>Frecuencia</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="proveedor in proveedores" :key="proveedor.id_proveedor">
              <td>{{ proveedor.nombre }}</td>
              <td>{{ proveedor.contacto || '-' }}</td>
              <td>{{ proveedor.correo || '-' }}</td>
              <td>{{ proveedor.frecuencia_pedido_aproximada || '-' }}</td>
              <td>
                <span :class="['estado-pill', proveedor.activo ? 'activo' : 'inactivo']">
                  {{ proveedor.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="acciones">
                <button class="btn btn-sm btn-success" @click="abrirModalEditar(proveedor)">
                  Editar
                </button>
                <button
                  class="btn btn-sm btn-warning"
                  @click="cambiarEstado(proveedor)"
                  :disabled="accionandoId === proveedor.id_proveedor"
                >
                  {{ proveedor.activo ? 'Desactivar' : 'Activar' }}
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  @click="eliminarProveedor(proveedor.id_proveedor)"
                  :disabled="accionandoId === proveedor.id_proveedor"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="d-md-none">
        <div v-for="proveedor in proveedores" :key="proveedor.id_proveedor" class="proveedor-card-mobile">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="mb-0">{{ proveedor.nombre }}</h5>
            <span :class="['estado-pill', 'sm', proveedor.activo ? 'activo' : 'inactivo']">
              {{ proveedor.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
          <p class="mb-1"><strong>Contacto:</strong> {{ proveedor.contacto || '-' }}</p>
          <p class="mb-1"><strong>Correo:</strong> {{ proveedor.correo || '-' }}</p>
          <p class="mb-1"><strong>Frecuencia:</strong> {{ proveedor.frecuencia_pedido_aproximada || '-' }}</p>
          <div class="d-flex gap-2 flex-wrap mt-2">
            <button class="btn btn-sm btn-success" @click="abrirModalEditar(proveedor)">Editar</button>
            <button
              class="btn btn-sm btn-warning"
              @click="cambiarEstado(proveedor)"
              :disabled="accionandoId === proveedor.id_proveedor"
            >
              {{ proveedor.activo ? 'Desactivar' : 'Activar' }}
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="eliminarProveedor(proveedor.id_proveedor)"
              :disabled="accionandoId === proveedor.id_proveedor"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </template>

    <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-card">
        <h4>{{ modoEdicion ? 'Editar proveedor' : 'Nuevo proveedor' }}</h4>
        <form @submit.prevent="guardarProveedor">
          <div class="mb-2">
            <label class="form-label">Nombre</label>
            <input v-model="form.nombre" class="form-control" required :class="{ 'is-invalid': errors.nombre }" />
            <span v-if="errors.nombre" class="error-text">{{ errors.nombre }}</span>
          </div>
          <div class="mb-2">
            <label class="form-label">Contacto</label>
            <input v-model="form.contacto" class="form-control" :class="{ 'is-invalid': errors.contacto }" />
            <span v-if="errors.contacto" class="error-text">{{ errors.contacto }}</span>
          </div>
          <div class="mb-2">
            <label class="form-label">Telefono</label>
            <input v-model="form.telefono" class="form-control" :class="{ 'is-invalid': errors.telefono }" />
            <span v-if="errors.telefono" class="error-text">{{ errors.telefono }}</span>
          </div>
          <div class="mb-2">
            <label class="form-label">Movil</label>
            <input v-model="form.movil" class="form-control" :class="{ 'is-invalid': errors.movil }" />
            <span v-if="errors.movil" class="error-text">{{ errors.movil }}</span>
          </div>
          <div class="mb-2">
            <label class="form-label">Correo</label>
            <input v-model="form.correo" type="email" class="form-control" :class="{ 'is-invalid': errors.correo }" />
            <span v-if="errors.correo" class="error-text">{{ errors.correo }}</span>
          </div>
          <div class="mb-2">
            <label class="form-label">Metodo de pago</label>
            <input v-model="form.metodo_pago" class="form-control" :class="{ 'is-invalid': errors.metodo_pago }" />
            <span v-if="errors.metodo_pago" class="error-text">{{ errors.metodo_pago }}</span>
          </div>
          <div class="mb-2">
            <label class="form-label">Frecuencia</label>
            <select v-model="form.frecuencia_pedido_aproximada" class="form-select" required>
              <option value="semanal">semanal</option>
              <option value="mensual">mensual</option>
              <option value="bimestral">bimestral</option>
              <option value="trimestral">trimestral</option>
              <option value="semestral">semestral</option>
              <option value="anual">anual</option>
            </select>
          </div>
          <div class="form-check mb-1">
            <input id="envioMovil" v-model="form.envio_movil" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="envioMovil">Aviso movil</label>
          </div>
          <div class="form-check mb-3">
            <input id="envioMail" v-model="form.envio_mail" class="form-check-input" type="checkbox" />
            <label class="form-check-label" for="envioMail">Aviso email</label>
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

// ============================================
// FUNCION AUXILIAR: proveedorVacio
// Crea un objeto de proveedor vacío con valores por defecto
// Parámetros: Ninguno
// Retorna: Object - Objeto con estructura de proveedor vacía
// ============================================
function proveedorVacio() {
  return {
    id_proveedor: null,
    nombre: '',
    contacto: '',
    telefono: '',
    movil: '',
    correo: '',
    metodo_pago: '',
    frecuencia_pedido_aproximada: 'semanal',
    envio_movil: false,
    envio_mail: true,
    familia: null,
  };
}

export default {
  // ============================================
  // data()
  // Variables de estado del componente
  // ============================================
  data() {
    return {
      // Lista de proveedores cargados
      proveedores: [],
      // Lista de usuarios del sistema (para generar familias)
      usuarios: [],
      // Lista de familias únicas extraídas de usuarios
      familias: [],
      // Bandera que indica si se están cargando datos
      cargando: false,
      // Mensaje de error en caso de que la carga falle
      errorCarga: '',
      // ID del proveedor que se está modificando (para deshabilitar botones)
      accionandoId: null,
      // Bandera que controla la visibilidad del modal
      mostrarModal: false,
      // Bandera que indica si estamos editando (true) o creando (false)
      modoEdicion: false,
      // Bandera que indica si se está guardando el formulario
      guardando: false,
      // Formulario de proveedor (para crear/editar)
      form: proveedorVacio(),
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
    // familiasDisponibles
    // Filtra las familias que pueden ser asignadas a un proveedor
    // (una familia solo puede gestionar un proveedor)
    // Parámetros: Ninguno
    // Retorna: Array - Lista de familias disponibles
    // ============================================
    familiasDisponibles() {
      return this.familias.filter(f => {
        const proveedorAsignado = this.proveedores.find(p => p.familia === f);
        if (!proveedorAsignado) return true;
        if (this.modoEdicion && proveedorAsignado.id_proveedor === this.form.id_proveedor) return true;
        return false;
      });
    },
  },
  // ============================================
  // created()
  // Hook que se ejecuta cuando el componente se crea
  // ============================================
  async created() {
    // Carga proveedores y usuarios, luego genera la lista de familias
    await this.cargarProveedores();
    await this.cargarUsuarios();
    this.generarFamilias();
  },
  // ============================================
  // methods
  // Métodos del componente
  // ============================================
  methods: {
    // ============================================
    // generarFamilias
    // Extrae las familias únicas de la lista de usuarios
    // Parámetros: Ninguno
    // Retorna: No retorna valor, actualiza la variable familias
    // ============================================
    generarFamilias() {
      const familiasSet = new Set();
      this.usuarios.forEach(u => {
        if (u.familia) {
          familiasSet.add(u.familia);
        }
      });
      this.familias = Array.from(familiasSet).sort((a, b) => a - b);
    },
    // ============================================
    // cargarProveedores
    // Carga la lista de proveedores del sistema
    // Parámetros: Ninguno
    // Retorna: No retorna valor, actualiza la variable proveedores
    // Efectos secundarios: Llama a api.getProveedores
    // ============================================
    async cargarProveedores() {
      this.cargando = true;
      this.errorCarga = '';
      try {
        const response = await api.getProveedores();
        this.proveedores = response.data || [];
      } catch {
        this.errorCarga = 'No se pudo cargar la lista de proveedores.';
      } finally {
        this.cargando = false;
      }
    },
    // ============================================
    // cargarUsuarios
    // Carga la lista de usuarios (para generar familias)
    // Parámetros: Ninguno
    // Retorna: No retorna valor, actualiza la variable usuarios
    // Efectos secundarios: Llama a api.getUsuarios
    // ============================================
    async cargarUsuarios() {
      try {
        const response = await api.getUsuarios();
        this.usuarios = response.data || [];
        this.generarFamilias();
      } catch {
        this.errorCarga = 'No se pudo cargar la lista de usuarios.';
      }
    },
    // ============================================
    // abrirModalCrear
    // Abre el modal para crear un nuevo proveedor
    // Parámetros: Ninguno
    // Retorna: No retorna valor
    // Efectos secundarios: Resetea el formulario y muestra el modal
    // ============================================
    abrirModalCrear() {
      this.modoEdicion = false;
      this.errors = {};
      this.form = proveedorVacio();
      this.mostrarModal = true;
    },
    // ============================================
    // abrirModalEditar
    // Abre el modal para editar un proveedor existente
    // Parámetros: proveedor (Object) - Proveedor a editar
    // Retorna: No retorna valor
    // Efectos secundarios: Prepara el formulario con datos del proveedor
    // ============================================
    abrirModalEditar(proveedor) {
      this.modoEdicion = true;
      this.errors = {};
      this.form = { 
        ...proveedor,
        familia: proveedor.familia || null 
      };
      this.mostrarModal = true;
    },
    // ============================================
    // cerrarModal
    // Cierra el modal de crear/editar proveedor
    // Parámetros: Ninguno
    // Retorna: No retorna valor
    // Efectos secundarios: Oculta el modal
    // ============================================
    cerrarModal() {
      this.mostrarModal = false;
    },
    // ============================================
    // guardarProveedor
    // Guarda el proveedor (crea nuevo o actualiza existente)
    // Parámetros: Ninguno (obtiene datos del formulario via v-model)
    // Retorna: No retorna valor
    // Efectos secundarios: Llama a api.crearProveedor o api.actualizarProveedor
    // ============================================
    async guardarProveedor() {
      this.errors = {};
      this.guardando = true;
      try {
        const payload = {
          nombre: this.form.nombre,
          contacto: this.form.contacto,
          telefono: this.form.telefono,
          movil: this.form.movil,
          correo: this.form.correo,
          metodo_pago: this.form.metodo_pago,
          frecuencia_pedido_aproximada: this.form.frecuencia_pedido_aproximada,
          envio_movil: Boolean(this.form.envio_movil),
          envio_mail: Boolean(this.form.envio_mail),
          familia: this.form.familia,
        };

        if (this.modoEdicion) {
          await api.actualizarProveedor(this.form.id_proveedor, payload);
          alertStore.showAlert('Proveedor actualizado correctamente.', 'success');
        } else {
          await api.crearProveedor(payload);
          alertStore.showAlert('Proveedor creado correctamente.', 'success');
        }

        await this.cargarProveedores();
        this.cerrarModal();
      } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.errors) {
          error.response.data.errors.forEach(msg => {
            const msgLower = msg.toLowerCase();
            if (msgLower.includes('nombre')) this.errors.nombre = msg;
            else if (msgLower.includes('contacto')) this.errors.contacto = msg;
            else if (msgLower.includes('teléfono') || msgLower.includes('telefono')) this.errors.telefono = msg;
            else if (msgLower.includes('móvil') || msgLower.includes('movil')) this.errors.movil = msg;
            else if (msgLower.includes('correo') || msgLower.includes('email')) this.errors.correo = msg;
            else if (msgLower.includes('pago')) this.errors.metodo_pago = msg;
            else alertStore.showAlert(msg, 'danger');
          });
        } else {
          alertStore.showAlert('No se pudo guardar el proveedor.', 'danger');
        }
      } finally {
        this.guardando = false;
      }
    },
    // ============================================
    // cambiarEstado
    // Activa o desactiva un proveedor
    // Parámetros: proveedor (Object) - Proveedor cuyo estado se cambiará
    // Retorna: No retorna valor
    // Efectos secundarios: Llama a api.cambiarEstadoProveedor
    // ============================================
    async cambiarEstado(proveedor) {
      this.accionandoId = proveedor.id_proveedor;
      try {
        await api.cambiarEstadoProveedor(proveedor.id_proveedor, !proveedor.activo);
        await this.cargarProveedores();
      } catch {
        alertStore.showAlert('No se pudo cambiar el estado del proveedor.', 'danger');
      } finally {
        this.accionandoId = null;
      }
    },
    // ============================================
    // eliminarProveedor
    // Elimina un proveedor existente tras confirmación
    // Parámetros: idProveedor (Number) - ID del proveedor a eliminar
    // Retorna: No retorna valor
    // Efectos secundarios: Llama a api.eliminarProveedor, actualiza lista
    // ============================================
    async eliminarProveedor(idProveedor) {
      if (!window.confirm('Se eliminara el proveedor. Quieres continuar?')) {
        return;
      }

      this.accionandoId = idProveedor;
      try {
        await api.eliminarProveedor(idProveedor);
        alertStore.showAlert('Proveedor eliminado correctamente.', 'success');
        await this.cargarProveedores();
      } catch {
        alertStore.showAlert('No se pudo eliminar el proveedor.', 'danger');
      } finally {
        this.accionandoId = null;
      }
    },
  },
};
</script>

<style scoped>
/* Los estilos de este componente usan clases globales */
</style>
