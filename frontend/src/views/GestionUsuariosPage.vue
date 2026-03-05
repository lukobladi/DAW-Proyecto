<template>
  <div class="gestion-usuarios-page">

    <div class="gestion-usuarios-container">
      <div class="gestion-usuarios-header">
        <h2>Gestión de Usuarios</h2>
        <button @click="abrirModal(false)" class="btn btn-primary">Añadir Usuario</button>
      </div>
      <div class="lista-usuarios">
        <table class="usuarios-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Móvil</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Saldo</th>
              <th>Último pedido</th>
              <th>Proveedores Asignados</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuarios" :key="usuario.id">
              <td>{{ usuario.nombre }}</td>
              <td>{{ usuario.correo }}</td>
              <td>{{ usuario.movil }}</td>
              <td>{{ usuario.rol }}</td>
              <td>{{ usuario.activo ? 'Activo' : 'Inactivo' }}</td>
              <!-- <td>{{ usuario.saldo.toFixed(2) }} €</td> -->
              <td>{{ usuario.ultimoPedido }}</td>
              <td>
                <ul>
                  <li v-for="proveedor in usuario.proveedores" :key="proveedor">{{ proveedor }}</li>
                </ul>
              </td>
              <td >
                  <button type="button" class="btn btn-primary"><i class="far fa-eye"></i></button>
                  <button @click="abrirModal(true, usuario)"  type="button" class="btn btn-success"><i class="fas fa-edit"></i></button>
              <button  @click="eliminarUsuario(usuario.id)"  type="button" class="btn btn-danger"><i class="far fa-trash-alt"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para añadir o editar usuario -->
    <div class="modal fade" id="addUserModal" tabindex="-1" aria-labelledby="addUserModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addUserModalLabel">
              {{ modoEdicion ? 'Editar Usuario' : 'Añadir Usuario' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="guardarUsuario">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre</label>
                <input v-model="nuevoUsuario.nombre" type="text" class="form-control" id="nombre" required />
              </div>
              <div class="mb-3">
                <label for="correo" class="form-label">Correo</label>
                <input v-model="nuevoUsuario.correo" type="email" class="form-control" id="correo" required />
              </div>
              <div class="mb-3">
                <label for="movil" class="form-label">Móvil</label>
                <input v-model="nuevoUsuario.movil" type="text" class="form-control" id="movil" required />
              </div>
              <div class="mb-3">
                <label for="rol" class="form-label">Rol</label>
                <select v-model="nuevoUsuario.rol" class="form-select" id="rol" required>
                  <option value="admin">Admin</option>
                  <option value="usuario">Usuario</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="activo" class="form-label">Estado</label>
                <select v-model="nuevoUsuario.activo" class="form-select" id="activo" required>
                  <option :value="true">Activo</option>
                  <option :value="false">Inactivo</option>
                </select>
              </div>

              <button type="submit" class="btn btn-primary">
                {{ modoEdicion ? 'Guardar Cambios' : 'Añadir Usuario' }}
              </button>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import api from '@/services/api';
import { alertStore } from '@/store/alertStore';

export default {
  data() {
    return {
      modoEdicion: false, // Indica si el modal está en modo edición
      usuarioSeleccionado: null, // Usuario que se está editando
      nuevoUsuario: {
        nombre: '',
        correo: '',
        movil: '',
        rol: 'usuario',
        activo: true,
        saldo: 0.0,
      },
      usuarios: [],
    };
  },
  methods: {
    async fetchUsuarios() {
      try {
        const response = await api.getUsuarios();
        this.usuarios = response.data;
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        alertStore.showAlert('Error al obtener usuarios. Inténtalo más tarde.', 'danger');
      }
    },
    async guardarUsuario() {
      try {
        if (this.modoEdicion) {
          await api.actualizarUsuario(this.nuevoUsuario.id, this.nuevoUsuario);
          alertStore.showAlert('Usuario actualizado correctamente.', 'success');
        } else {
          await api.registrar(this.nuevoUsuario);
          alertStore.showAlert('Usuario añadido correctamente.', 'success');
        }
        this.fetchUsuarios();
        const modal = window.bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
        modal.hide();
      } catch (error) {
        console.error('Error al guardar usuario:', error);
        alertStore.showAlert('Error al guardar usuario. Inténtalo más tarde.', 'danger');
      }
    },
    async eliminarUsuario(usuarioId) {
      const confirmacion = confirm('¿Estás seguro de que deseas eliminar este usuario?');
      if (!confirmacion) return;

      try {
        await api.eliminarUsuario(usuarioId);
        alertStore.showAlert('Usuario eliminado correctamente.', 'success');
        this.fetchUsuarios();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alertStore.showAlert('Error al eliminar usuario. Inténtalo más tarde.', 'danger');
      }
    },
    abrirModal(edicion, usuario = null) {
      this.modoEdicion = edicion;
      if (edicion && usuario) {
        // Cargar datos del usuario en el formulario
        this.nuevoUsuario = { ...usuario };
      } else {
        // Resetear el formulario para añadir un nuevo usuario
        this.nuevoUsuario = {
          nombre: '',
          correo: '',
          movil: '',
          rol: 'usuario',
          activo: true,
          saldo: 0.0,
        };
      }
      // Abrir el modal
      const modal = new window.bootstrap.Modal(document.getElementById('addUserModal'));
      modal.show();
    },
  },
  mounted() {
    this.fetchUsuarios();
  },
};
</script>

<style scoped>

/* Estilo general de la página */
.gestion-usuarios-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f9f9f9; /* Fondo claro */
  color: #333333; /* Color de texto */
}

/* Contenedor principal */
.gestion-usuarios-container {
  width: 100%;
  max-width: 1200px;

  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.9); /* Fondo blanco semitransparente */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra */
}

/* Encabezado */
.gestion-usuarios-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.gestion-usuarios-header h2 {
  font-size: 2rem;
  color: #4CAF50; /* Verde primario */
}

/* Tabla de usuarios */
.usuarios-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.usuarios-table th,
.usuarios-table td {
  border: 1px solid #e0e0e0;
  padding: 0.75rem;
  text-align: left;
}

.usuarios-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.usuarios-table td ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.usuarios-table td ul li {
  margin: 0;
  padding: 0;
}

/* Botones */
.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #FF9800; /* Naranja */
  color: white;
}

.btn-primary:hover {
  background-color: #E68900; /* Naranja más oscuro */
}

.btn-secondary {
  background-color: #007BFF; /* Azul */
  color: white;
}

.btn-secondary:hover {
  background-color: #0056b3; /* Azul más oscuro */
}

.btn-danger {
  background-color: #DC3545; /* Rojo */
  color: white;
}

.btn-danger:hover {
  background-color: #a71d2a; /* Rojo más oscuro */
}

 

</style>