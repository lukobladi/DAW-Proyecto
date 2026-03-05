<template>
  <div class="container py-4">
    <h2 class="mb-3">Soporte y Ayuda</h2>

    <section class="mb-4">
      <h4>Preguntas frecuentes</h4>
      <div class="accordion" role="list">
        <div v-for="item in faq" :key="item.id" class="faq-item">
          <button class="faq-question" @click="toggleFaq(item.id)">
            <span>{{ item.pregunta }}</span>
            <span>{{ abiertaId === item.id ? '-' : '+' }}</span>
          </button>
          <p v-if="abiertaId === item.id" class="faq-answer">{{ item.respuesta }}</p>
        </div>
      </div>
    </section>

    <section>
      <h4>Enviar consulta</h4>
      <form class="card p-3" @submit.prevent="enviarConsulta">
        <div class="row g-3">
          <div class="col-12 col-md-6">
            <label class="form-label" for="nombre">Nombre</label>
            <input id="nombre" v-model="form.nombre" class="form-control" required />
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label" for="correo">Correo</label>
            <input id="correo" v-model="form.correo" type="email" class="form-control" required />
          </div>
          <div class="col-12">
            <label class="form-label" for="mensaje">Mensaje</label>
            <textarea id="mensaje" v-model="form.mensaje" class="form-control" rows="5" required />
          </div>
        </div>

        <div class="d-flex gap-2 mt-3 flex-wrap">
          <button class="btn btn-primary" type="submit" :disabled="enviando">
            {{ enviando ? 'Enviando...' : 'Enviar consulta' }}
          </button>
          <a class="btn btn-outline-secondary" :href="mailtoLink">Abrir cliente de correo</a>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
import api from '@/services/api';
import { useAuthStore } from '@/store';
import { alertStore } from '@/store/alertStore';

export default {
  data() {
    return {
      abiertaId: 1,
      enviando: false,
      faq: [
        {
          id: 1,
          pregunta: 'Como anado productos a mi pedido?',
          respuesta:
            'Entra en Compras, busca productos con pedido abierto y pulsa "Anadir a la cesta".',
        },
        {
          id: 2,
          pregunta: 'Por que no puedo editar unidades en el dashboard?',
          respuesta:
            'Solo se permite editar unidades cuando el pedido correspondiente esta abierto.',
        },
        {
          id: 3,
          pregunta: 'Donde veo el estado de mis pedidos?',
          respuesta:
            'En Dashboard e Historial puedes ver estados como pendiente, en proceso, entregado o repartido.',
        },
      ],
      form: {
        nombre: '',
        correo: '',
        mensaje: '',
      },
    };
  },
  computed: {
    mailtoLink() {
      const asunto = encodeURIComponent('Consulta soporte Ekonsumo');
      const cuerpo = encodeURIComponent(
        `Nombre: ${this.form.nombre}\nCorreo: ${this.form.correo}\n\nMensaje:\n${this.form.mensaje}`
      );
      return `mailto:soporte@ekonsumo.local?subject=${asunto}&body=${cuerpo}`;
    },
  },
  created() {
    const authStore = useAuthStore();
    this.form.nombre = authStore.user?.nombre || '';
    this.form.correo = authStore.user?.correo || '';
  },
  methods: {
    toggleFaq(id) {
      this.abiertaId = this.abiertaId === id ? null : id;
    },
    async enviarConsulta() {
      this.enviando = true;
      try {
        const authStore = useAuthStore();
        const idUsuario = Number(authStore.user?.id_usuario);

        if (!idUsuario) {
          alertStore.showAlert('No se pudo identificar el usuario de sesion.', 'danger');
          return;
        }

        const mensaje = `[SOPORTE] ${this.form.mensaje}\nContacto: ${this.form.nombre} (${this.form.correo})`;

        await api.enviarNotificacion({
          id_usuario: idUsuario,
          mensaje,
        });

        alertStore.showAlert('Consulta enviada correctamente.', 'success');
        this.form.mensaje = '';
      } catch {
        alertStore.showAlert('No se pudo enviar la consulta desde la app.', 'danger');
      } finally {
        this.enviando = false;
      }
    },
  },
};
</script>

<style scoped>
.faq-item {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  margin-bottom: 0.7rem;
  background: #fff;
}

.faq-question {
  width: 100%;
  border: 0;
  background: transparent;
  padding: 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.faq-answer {
  padding: 0 0.8rem 0.8rem;
  margin: 0;
  color: #495057;
}
</style>
