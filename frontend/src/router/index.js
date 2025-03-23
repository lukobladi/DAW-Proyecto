import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import ComprasPage from '../views/ComprasPage.vue';
import HistorialPage from '../views/HistorialPage.vue';
import DetallesPedidoPage from '../views/DetallesPedidoPage.vue';
import GestionUsuariosPage from '../views/GestionUsuariosPage.vue';
import ConfiguracionPage from '../views/ConfiguracionPage.vue';
import SoportePage from '../views/SoportePage.vue';
import GestionProveedoresPage from '../views/GestionProveedoresPage.vue';
import GestionProductosPage from '../views/GestionProductosPage.vue';
import GestionPedidosPage from '../views/GestionPedidosPage.vue';
import GestionPedidosPeriodicosPage from '../views/GestionPedidosPeriodicosPage.vue';
import GestionPagosPage from '../views/GestionPagosPage.vue';
import GestionNotificacionesPage from '../views/GestionNotificacionesPage.vue';
import GestionSaldosPage from '../views/GestionSaldosPage.vue';

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
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
  },
  {
    path: '/compras',
    name: 'Compras',
    component: ComprasPage,
  },
  {
    path: '/historial',
    name: 'Historial',
    component: HistorialPage,
  },
  {
    path: '/detalles-pedido/:id',
    name: 'DetallesPedido',
    component: DetallesPedidoPage,
    props: true,
  },
  {
    path: '/gestion-usuarios',
    name: 'GestionUsuarios',
    component: GestionUsuariosPage,
  },
  {
    path: '/configuracion',
    name: 'Configuracion',
    component: ConfiguracionPage,
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
  },
  {
    path: '/gestion-productos',
    name: 'GestionProductos',
    component: GestionProductosPage,
  },
  {
    path: '/gestion-pedidos',
    name: 'GestionPedidos',
    component: GestionPedidosPage,
  },
  {
    path: '/gestion-pedidos-periodicos',
    name: 'GestionPedidosPeriodicos',
    component: GestionPedidosPeriodicosPage,
  },
  {
    path: '/gestion-pagos',
    name: 'GestionPagos',
    component: GestionPagosPage,
  },
  {
    path: '/gestion-notificaciones',
    name: 'GestionNotificaciones',
    component: GestionNotificacionesPage,
  },
  {
    path: '/gestion-saldos',
    name: 'GestionSaldos',
    component: GestionSaldosPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;