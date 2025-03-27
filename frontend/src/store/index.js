import { createStore } from 'vuex';

export default createStore({
  state: {
    auth: {
      isAuthenticated: false, // Cambia a false al cerrar sesión
      user: {
        role: null, // Limpia el rol del usuario
      },
    },
  },
  mutations: {
    setAuth(state, isAuthenticated) {
      state.auth.isAuthenticated = isAuthenticated;
    },
    setUser(state, user) {
      state.auth.user = user;
    },
  },
  actions: {
    login({ commit }, user) {
      commit('setAuth', true);
      commit('setUser', user);
    },
    logout({ commit }) {
      commit('setAuth', false);
      commit('setUser', { role: null });
    },
  },
});