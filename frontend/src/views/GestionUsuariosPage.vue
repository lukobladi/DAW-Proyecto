<template>
  <div class="gestion-usuarios-page">
    <NavBar />
    <div class="gestion-usuarios-content">
      <h2>Gestión de Usuarios</h2>
      <button @click="añadirUsuario" class="btn btn-primary">Añadir Usuario</button>
      <div class="lista-usuarios">
        <div v-for="usuario in usuarios" :key="usuario.id" class="usuario-card">
          <h3>{{ usuario.nombre }}</h3>
          <p>Correo: {{ usuario.correo }}</p>
          <p>Estado: {{ usuario.activo ? 'Activo' : 'Inactivo' }}</p>
          <button @click="editarUsuario(usuario.id)" class="btn btn-secondary">Editar</button>
          <button @click="eliminarUsuario(usuario.id)" class="btn btn-danger">Eliminar</button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>

export default {

  data() {
    return {
      usuarios: [
        // Ejemplo de datos de usuarios
        { id: 1, nombre: 'Juan Pérez', correo: 'juan@example.com', activo: true },
        { id: 2, nombre: 'Ana Gómez', correo: 'ana@example.com', activo: false }
      ]
    };
  },
  methods: {
    añadirUsuario() {
      // Lógica para añadir un nuevo usuario
      console.log('Añadiendo usuario...');
    },
    editarUsuario(usuarioId) {
      // Lógica para editar un usuario
      console.log('Editando usuario:', usuarioId);
    },
    eliminarUsuario(usuarioId) {
      // Lógica para eliminar un usuario
      console.log('Eliminando usuario:', usuarioId);
    }
  }
};
</script>

<style scoped>
.gestion-usuarios-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.gestion-usuarios-content {
  flex: 1;
  padding: 2rem;
}

.lista-usuarios {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.usuario-card {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
}

.btn {
  margin-top: 1rem;
  margin-right: 0.5rem;
}
</style>