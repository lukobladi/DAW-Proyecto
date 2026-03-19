// Directiva para quitar el foco de un elemento despues de un evento
export const autoblur = {
  mounted(el) {
    el.addEventListener('change', () => {
      el.blur();
    });
  },
};
