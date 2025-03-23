import { createStore } from 'vuex';

export default createStore({
  state: {
    auth: {
      isAuthenticated: false, // Estado inicial de autenticación
    },
  },
  mutations: {
    setAuth(state, isAuthenticated) {
      state.auth.isAuthenticated = isAuthenticated;
    },
  },
  actions: {
    login({ commit }) {
      commit('setAuth', true);
    },
    logout({ commit }) {
      commit('setAuth', false);
    },
  },
});