// Store para mostrar alertas/notificaciones en la UI
// Usa reactive() de Vue para simplicidad

import { reactive } from 'vue';

export const alertStore = reactive({
  message: '', // Mensaje de la alerta
  type: '', // Tipo de alerta: 'success' o 'danger'
  timeoutId: null, // ID del timeout para limpiar la alerta automaticamente

  // Mostrar una alerta que desaparece despues de un tiempo
  showAlert(message, type = 'success', duration = 2000) {
    this.message = message;
    this.type = type;

    // Limpio cualquier timeout previo
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Configuro el timeout para borrar la alerta automaticamente
    this.timeoutId = setTimeout(() => {
      this.clearAlert();
    }, duration);
  },

  // Ocultar la alerta manualmente
  clearAlert() {
    this.message = '';
    this.type = '';
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  },
});