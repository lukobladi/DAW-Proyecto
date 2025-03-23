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


/* 
import Vue from 'vue';
import Router from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import LoginPage from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import DashboardPage from '@/views/DashboardPage.vue';
import HomeDosPage from '@/views/HomeDosPage.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage,
    },
    {
      path: '/register',
      name: 'RegisterPage',
      component: RegisterPage,
    },
    {
      path: '/dashboard',
      name: 'DashboardPage',
      component: DashboardPage,
    },
    {
      path: '/homeDos',
      name: 'HomeDosPage',
      component: HomeDosPage,
    },
  ],
}); 
*/