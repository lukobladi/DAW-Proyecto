import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store'; // Importa el store para verificar el estado de autenticación
import HomePage from '@/views/HomePage.vue';
import LoginPage from '@/views/LoginPage.vue';
import RecuperarPasswordPage from '@/views/RecuperarPasswordPage.vue';
import RegistrarPage from '@/views/RegistrarPage.vue';
import DashboardPage from '@/views/DashboardPage.vue';
import ComprasPage from '@/views/ComprasPage.vue';
import HistorialPage from '@/views/HistorialPage.vue';
import DetallesPedidoPage from '@/views/DetallesPedidoPage.vue';
import GestionUsuariosPage from '@/views/GestionUsuariosPage.vue';
import ConfiguracionPage from '@/views/ConfiguracionPage.vue';
import SoportePage from '@/views/SoportePage.vue';
import GestionProveedoresPage from '@/views/GestionProveedoresPage.vue';
import GestionProductosPage from '@/views/GestionProductosPage.vue';
import GestionPedidosPage from '@/views/GestionPedidosPage.vue';
import GestionPedidosPeriodicosPage from '@/views/GestionPedidosPeriodicosPage.vue';
import GestionPagosPage from '@/views/GestionPagosPage.vue';
import GestionNotificacionesPage from '@/views/GestionNotificacionesPage.vue';
import GestionSaldosPage from '@/views/GestionSaldosPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/recuperar-password',
    name: 'RecuperarPassword',
    component: RecuperarPasswordPage,
  },
  {
    path: '/registrar',
    name: 'Registrar',
    component: RegistrarPage,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true }, // Ruta protegida
  },
  {
    path: '/compras',
    name: 'Compras',
    component: ComprasPage,
    meta: { requiresAuth: true }, // Ruta protegida
  },
  {
    path: '/historial',
    name: 'Historial',
    component: HistorialPage,
    meta: { requiresAuth: true }, // Ruta protegida
  },
  {
    path: '/detalles-pedido/:id',
    name: 'DetallesPedido',
    component: DetallesPedidoPage,
    props: true,
    meta: { requiresAuth: true }, // Ruta protegida
  },
  {
    path: '/gestion-usuarios',
    name: 'GestionUsuarios',
    component: GestionUsuariosPage,
    meta: { requiresAuth: true }, // Ruta protegida
  },
  {
    path: '/configuracion',
    name: 'Configuracion',
    component: ConfiguracionPage,
    meta: { requiresAuth: true }, // Ruta protegida
  },
  {
    path: '/soporte',
    name: 'Soporte',
    component: SoportePage,
  },
  {
    path: '/gestion-proveedores',
    name: 'GestionProveedores',
    component: GestionProveedoresPage,
    meta: { requiresAuth: true }, // Ruta protegida
  },
  {
    path: '/gestion-productos',
    name: 'GestionProductos',
    component: GestionProductosPage,
    meta: { requiresAuth: true }, // Ruta protegida
  },
  {
    path: '/gestion-pedidos',
    name: 'GestionPedidos',
    component: GestionPedidosPage,
    meta: { requiresAuth: true }, // Ruta protegida
  },
  {
    path: '/gestion-pedidos-periodicos',
    name: 'GestionPedidosPeriodicos',
    component: GestionPedidosPeriodicosPage,
    meta: { requiresAuth: true }, // Ruta protegida
  },
  {
    path: '/gestion-pagos',
    name: 'GestionPagos',
    component: GestionPagosPage,
    meta: { requiresAuth: true }, // Ruta protegida
  },
  {
    path: '/gestion-notificaciones',
    name: 'GestionNotificaciones',
    component: GestionNotificacionesPage,
    meta: { requiresAuth: true }, // Ruta protegida
  },
  {
    path: '/gestion-saldos',
    name: 'GestionSaldos',
    component: GestionSaldosPage,
    meta: { requiresAuth: true }, // Ruta protegida
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de navegación global
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.state.auth.isAuthenticated; // Verifica si el usuario está autenticado

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Si la ruta requiere autenticación y el usuario no está autenticado, redirige a la página de inicio de sesión
    next({ name: 'Login' });
  } else {
    // De lo contrario, permite la navegación
    next();
  }
});

export default router;