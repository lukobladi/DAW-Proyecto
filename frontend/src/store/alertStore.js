import { reactive } from 'vue';

export const alertStore = reactive({
  message: '', // Mensaje de la alerta
  type: '', // Tipo de alerta: 'success' o 'danger'
  timeoutId: null, // ID del timeout para limpiar la alerta automáticamente

  // Mostrar una alerta
  showAlert(message, type = 'success', duration = 2000) {
    this.message = message;
    this.type = type;

    // Limpiar cualquier timeout previo
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Configurar el timeout para borrar la alerta automáticamente
    this.timeoutId = setTimeout(() => {
      this.clearAlert();
    }, duration);
  },

  // Ocultar la alerta
  clearAlert() {
    this.message = '';
    this.type = '';
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  },
});