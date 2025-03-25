import { createStore } from 'vuex';

export default createStore({
  state: {
    auth: {
      isAuthenticated: false, // Cambia a true cuando el usuario inicia sesión
      user: {
        role: null, // 'admin' o 'user'
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
      commit('setUser', user); // user debe incluir información como el rol
    },
    logout({ commit }) {
      commit('setAuth', false);
      commit('setUser', { role: null }); // Limpia la información del usuario
    },
  },
});