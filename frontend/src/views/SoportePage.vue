<template>
  <div class="soporte-page">
    <NavBar />
    <div class="soporte-content">
      <h2>Soporte y Ayuda</h2>
      <div class="faq">
        <h3>Preguntas Frecuentes</h3>
        <div v-for="pregunta in preguntas" :key="pregunta.id" class="pregunta">
          <h4>{{ pregunta.pregunta }}</h4>
          <p>{{ pregunta.respuesta }}</p>
        </div>
      </div>
      <div class="formulario-contacto">
        <h3>Contacto</h3>
        <form @submit.prevent="enviarConsulta">
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" v-model="nombre" required>
          </div>
          <div class="form-group">
            <label for="correo">Correo Electrónico</label>
            <input type="email" id="correo" v-model="correo" required>
          </div>
          <div class="form-group">
            <label for="mensaje">Mensaje</label>
            <textarea id="mensaje" v-model="mensaje" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Enviar Consulta</button>
        </form>
      </div>
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
      preguntas: [
        { id: 1, pregunta: '¿Cómo puedo registrarme?', respuesta: 'Puedes registrarte en la página de registro.' },
        { id: 2, pregunta: '¿Cómo hago un pedido?', respuesta: 'Puedes hacer un pedido en la página de compras.' }
      ],
      nombre: '',
      correo: '',
      mensaje: ''
    };
  },
  methods: {
    enviarConsulta() {
      // Lógica para enviar la consulta
      console.log('Enviando consulta...');
    }
  }
};
</script>

<style scoped>
.soporte-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.soporte-content {
  flex: 1;
  padding: 2rem;
}

.faq {
  margin-bottom: 2rem;
}

.pregunta {
  margin-bottom: 1rem;
}

.formulario-contacto {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input, textarea {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

textarea {
  height: 100px;
}

.btn {
  margin-top: 1rem;
}
</style>