// Store de autenticacion con Pinia
// Guarda el estado del usuario logueado y el token JWT

import { createPinia, defineStore } from 'pinia';

const pinia = createPinia();

// Extrae el payload del token JWT sin verificar la firma
function getPayloadFromToken(token) {
  if (!token) {
    return {};
  }

  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payloadJson);
  } catch {
    return {};
  }
}

// Construye el estado inicial de autenticacion desde localStorage
function buildInitialAuthState() {
  const token = localStorage.getItem('authToken');
  const tokenPayload = getPayloadFromToken(token);
  const role = localStorage.getItem('userRole') || tokenPayload.rol || tokenPayload.role || null;
  const persistedUser = JSON.parse(localStorage.getItem('authUser') || '{}');

  return {
    isAuthenticated: Boolean(token),
    user: {
      id_usuario: persistedUser.id_usuario || tokenPayload.id_usuario || tokenPayload.id || null,
      nombre: persistedUser.nombre || null,
      correo: persistedUser.correo || null,
      movil: persistedUser.movil || null,
      familia: persistedUser.familia || null,
      role: role || null,
    },
  };
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    ...buildInitialAuthState(),
    stateRestored: false,
    loading: true,
  }),
  actions: {
    // Guarda los datos del usuario logueado
    login(payload = {}) {
      const token = payload.token || null;
      const tokenPayload = getPayloadFromToken(token);
      const user = payload.user || {
        id_usuario: payload.id_usuario,
        nombre: payload.nombre,
        correo: payload.correo,
        movil: payload.movil,
        rol: payload.rol,
      };
      const role = user.role || user.rol || tokenPayload.rol || tokenPayload.role || null;
      const normalizedUser = {
        id_usuario: user.id_usuario || tokenPayload.id_usuario || tokenPayload.id || null,
        nombre: user.nombre || null,
        correo: user.correo || null,
        movil: user.movil || null,
        familia: user.familia || null,
        role: role || null,
      };

      if (token) {
        localStorage.setItem('authToken', token);
      }

      if (role) {
        localStorage.setItem('userRole', role);
      }

      localStorage.setItem('authUser', JSON.stringify(normalizedUser));

      this.isAuthenticated = true;
      this.user = normalizedUser;
    },
    // Cierra la sesion y limpia los datos
    logout() {
      this.isAuthenticated = false;
      this.user = { id_usuario: null, nombre: null, correo: null, movil: null, role: null, familia: null };
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('authUser');
    },
    // Recupera el estado de autenticacion desde localStorage
    hydrateAuthState() {
      this.loading = true;
      const { isAuthenticated, user } = buildInitialAuthState();
      this.isAuthenticated = isAuthenticated;
      this.user = user;
      this.stateRestored = true;
      this.loading = false;
    },
    setLoading(loading) {
      this.loading = loading;
    },
  },
});

export default pinia;
