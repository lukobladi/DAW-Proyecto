// Configuracion del router de Vue
// Define todas las rutas de la aplicacion y los guards de navegacion

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store';
import HomePage from '@/views/HomePage.vue';
import LoginPage from '@/views/LoginPage.vue';
import RecuperarPasswordPage from '@/views/RecuperarPasswordPage.vue';
import RegistrarPage from '@/views/RegistrarPage.vue';
import DashboardPage from '@/views/DashboardPage.vue';
import ComprasPage from '@/views/ComprasPage.vue';
import DetallesPedidoPage from '@/views/DetallesPedidoPage.vue';
import GestionUsuariosPage from '@/views/GestionUsuariosPage.vue';
import ConfiguracionPage from '@/views/ConfiguracionPage.vue';
import SoportePage from '@/views/SoportePage.vue';
import GestionProveedoresPage from '@/views/GestionProveedoresPage.vue';
import GestionProductosPage from '@/views/GestionProductosPage.vue';
import GestionPedidosPage from '@/views/GestionPedidosPage.vue';
import GestionPedidosPeriodicosPage from '@/views/GestionPedidosPeriodicosPage.vue';
import HistorialPage from '@/views/HistorialPage.vue';
import GestionPagosPage from '@/views/GestionPagosPage.vue';
import GestionNotificacionesPage from '@/views/GestionNotificacionesPage.vue';
import GestionSaldosPage from '@/views/GestionSaldosPage.vue';

// Definicion de todas las rutas de la aplicacion
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
    path: '/recuperar-password/:token',
    name: 'RecuperarPasswordToken',
    component: RecuperarPasswordPage,
    props: true,
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
    meta: { requiresAuth: true, requiresAdmin: true }, // Solo admin
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
    meta: { requiresAuth: true }, // Accesible para admins y usuarios con proveedor asignado
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

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadJson);
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

// Escucha eventos de sesion expirada y redirige a login
window.addEventListener('session-expired', () => {
  const authStore = useAuthStore();
  authStore.logout();
  router.push({ name: 'Login' });
});

// Guard de navegacion global
// Comprueba si el usuario esta autenticado y tiene los permisos necesarios
router.beforeEach((to) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem('authToken');
  const tokenExpired = isTokenExpired(token);

  if (tokenExpired && token) {
    authStore.logout();
  }

  const isAuthenticated = authStore.isAuthenticated;
  const isAdmin = authStore.user?.rol === 'admin';

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'Login' };
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    return { name: 'Dashboard' };
  }

  if (to.name === 'Login' && isAuthenticated) {
    return { name: 'Dashboard' };
  }

  return true;
});

export default router;
