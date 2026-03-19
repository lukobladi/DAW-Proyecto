// Fichero principal del frontend
// Inicializa Vue, Pinia (estado) y el router

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './store';
import { autoblur } from './directives/autoblur';

const app = createApp(App);
app.use(pinia);
app.use(router);

// Registrar la directiva globalmente
app.directive('autoblur', autoblur);

app.mount('#app');
