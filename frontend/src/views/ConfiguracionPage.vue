<template>
  <div class="configuracion-page">
    <NavBar />
    <div class="configuracion-content">
      <h2>Configuración de Cuenta</h2>
      <form @submit.prevent="guardarCambios">
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input type="text" id="nombre" v-model="nombre" required>
        </div>
        <div class="form-group">
          <label for="correo">Correo Electrónico</label>
          <input type="email" id="correo" v-model="correo" required>
        </div>
        <div class="form-group">
          <label for="password">Nueva Contraseña</label>
          <input type="password" id="password" v-model="password">
        </div>
        <div class="form-group">
          <label for="confirmar-password">Confirmar Nueva Contraseña</label>
          <input type="password" id="confirmar-password" v-model="confirmarPassword">
        </div>
        <button type="submit" class="btn btn-primary">Guardar Cambios</button>
      </form>
    </div>
    <Footer />
  </div>
</template>

<script>

export default {

  data() {
    return {
      nombre: 'Juan Pérez',
      correo: 'juan@example.com',
      password: '',
      confirmarPassword: ''
    };
  },
  methods: {
    guardarCambios() {
      // Lógica para guardar los cambios
      console.log('Guardando cambios...');
    }
  }
};
</script>

<style scoped>
.configuracion-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.configuracion-content {
  flex: 1;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

.btn {
  margin-top: 1rem;
}
</style>