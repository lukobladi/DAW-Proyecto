import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomePage.vue';
import Dashboard from '../views/DashboardPage.vue';
import Login from '../views/LoginPage.vue';
import Register from '../views/RegisterPage.vue';
import HomeDos from '../views/HomeDosPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/homeDos',
    name: 'HomeDos',
    component: HomeDos,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

