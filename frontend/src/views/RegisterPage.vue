<template>
  <div class="register">
    <h2>Registro</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="name">Nombre</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Registrarse</button>
    </form>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  name: 'RegisterPage',
  data() {
    return {
      name: '',
      email: '',
      password: '',
    };
  },
  methods: {
    async register() {
      try {
        await api.register({
          name: this.name,
          email: this.email,
          password: this.password,
        });
        this.$router.push('/login');
      } catch (error) {
        console.error('Error al registrarse:', error);
      }
    },
  },
};
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #369f6e;
}
</style>