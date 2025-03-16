import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomePage.vue';
import Dashboard from '../views/DashboardPage.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/dashboard', component: Dashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;