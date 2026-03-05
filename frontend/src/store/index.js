import { createPinia, defineStore } from 'pinia';

const pinia = createPinia();

function getRoleFromToken(token) {
  if (!token) {
    return null;
  }

  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadJson);
    return payload.rol || payload.role || null;
  } catch {
    return null;
  }
}

function buildInitialAuthState() {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole') || getRoleFromToken(token);

  return {
    isAuthenticated: Boolean(token),
    user: {
      role: role || null,
    },
  };
}

export const useAuthStore = defineStore('auth', {
  state: () => buildInitialAuthState(),
  actions: {
    login(payload = {}) {
      const token = payload.token || null;
      const user = payload.user || {};
      const role = user.role || user.rol || getRoleFromToken(token);

      if (token) {
        localStorage.setItem('authToken', token);
      }

      if (role) {
        localStorage.setItem('userRole', role);
      }

      this.isAuthenticated = true;
      this.user = {
        ...user,
        role: role || null,
      };
    },
    logout() {
      this.isAuthenticated = false;
      this.user = { role: null };
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
    },
    hydrateAuthState() {
      const { isAuthenticated, user } = buildInitialAuthState();
      this.isAuthenticated = isAuthenticated;
      this.user = user;
    },
  },
});

export default pinia;
