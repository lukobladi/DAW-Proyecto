<template>
  <div class="login-page">
    <NavBar />
    <div class="login-form">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="correo">Correo Electrónico</label>
          <input type="email" id="correo" v-model="correo" required>
        </div>
        <div class="form-group">
          <label for="contraseña">Contraseña</label>
          <input type="password" id="contraseña" v-model="contraseña" required>
        </div>
        <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
      </form>
      <p>¿Olvidaste tu contraseña? <router-link to="/recuperar-contraseña">Recupérala aquí</router-link></p>
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
      correo: '',
      contraseña: ''
    };
  },
  methods: {
    login() {
      // Lógica para iniciar sesión
      console.log('Iniciando sesión...');
    }
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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