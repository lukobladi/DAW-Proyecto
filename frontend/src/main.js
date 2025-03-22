import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'; // Importa el CSS de Bootstrap
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'; 

import router from './router';

createApp(App).use(router).mount('#app');

//createApp(App).mount('#app')
