// Store de autenticacion con Pinia
// Guarda el estado del usuario logueado y el token JWT

import { createPinia, defineStore } from 'pinia';

const pinia = createPinia();

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadJson);
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

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

// El estado inicial se coge dew LocalStorage que es persistente. 
// Los datos de pInia se pierden si se refresca la pagina
function buildInitialAuthState() {
  const token = localStorage.getItem('authToken');
  const tokenExpired = isTokenExpired(token);
  const tokenPayload = getPayloadFromToken(token);
  const rol = localStorage.getItem('userRole') || tokenPayload.rol || null;
  const persistedUser = JSON.parse(localStorage.getItem('authUser') || '{}');

  if (tokenExpired && token) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('authUser');
    return {
      isAuthenticated: false,
      user: {
        id_usuario: null,
        nombre: null,
        correo: null,
        movil: null,
        familia: null,
        rol: null,
        proveedor_gestionado: null,
      },
    };
  }

  return {
    isAuthenticated: Boolean(token) && !tokenExpired,
    user: {
      id_usuario: persistedUser.id_usuario || tokenPayload.id_usuario || tokenPayload.id || null,
      nombre: persistedUser.nombre || null,
      correo: persistedUser.correo || null,
      movil: persistedUser.movil || null,
      familia: persistedUser.familia || null,
      rol: rol || null,
      proveedor_gestionado: persistedUser.proveedor_gestionado || null,
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
        familia: payload.familia,
        proveedor_gestionado: payload.proveedor_gestionado,
      };
      const rol = user.rol || tokenPayload.rol || null;
      const normalizedUser = {
        id_usuario: user.id_usuario || tokenPayload.id_usuario || tokenPayload.id || null,
        nombre: user.nombre || null,
        correo: user.correo || null,
        movil: user.movil || null,
        familia: user.familia || null,
        rol: rol || null,
        proveedor_gestionado: user.proveedor_gestionado || null,
      };

      if (token) {
        localStorage.setItem('authToken', token);
      }

      if (rol) {
        localStorage.setItem('userRole', rol);
      }

      localStorage.setItem('authUser', JSON.stringify(normalizedUser));

      this.isAuthenticated = true;
      this.user = normalizedUser;
    },
    // Cierra la sesion y limpia los datos
    logout() {
      this.isAuthenticated = false;
      this.user = { id_usuario: null, nombre: null, correo: null, movil: null, rol: null, familia: null, proveedor_gestionado: null };
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