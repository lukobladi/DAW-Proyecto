<!-- Barra de navegacion principal -->
<!-- Muestra el menu segun el rol del usuario y si esta autenticado -->

<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-logo">Grupo de Consumo</router-link>
      <span v-if="isAuthenticated && userName" class="navbar-user">
        {{ userName }}
        <span v-if="userFamily" class="user-family">
          (Familia {{ userFamily }})
          <span v-if="userProvider"> - {{ userProvider }}</span>
        </span>
      </span>
    </div>
    <div class="navbar-right">
      <!-- Badge con el numero de pedidos pendientes de entrega -->
      <router-link
        v-if="isAuthenticated && pedidosPendientesEntrega > 0"
        to="/dashboard"
        class="navbar-badge"
        title="Pedidos pendientes de entrega"
      >
        <i class="fas fa-box"></i>
        <span class="badge-count">{{ pedidosPendientesEntrega }}</span>
      </router-link>
      <!-- Boton hamburguesa para movil -->
      <button class="navbar-burger" @click="toggleMenu" aria-label="Abrir menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
    <!-- Menu de navegacion -->
    <div class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
      <router-link to="/dashboard" class="navbar-item" @click="closeMenu">Dashboard</router-link>
      <router-link to="/compras" class="navbar-item" @click="closeMenu">Compras</router-link>
      <router-link to="/historial" class="navbar-item" @click="closeMenu">Historial</router-link>
      <router-link to="/gestion-pagos" class="navbar-item" @click="closeMenu">Pagos</router-link>
      <router-link v-if="isAdmin" to="/gestion-usuarios" class="navbar-item" @click="closeMenu">Gestion de Usuarios</router-link>
      <router-link to="/gestion-productos" class="navbar-item" @click="closeMenu">Gestion de Productos</router-link>
      <router-link to="/gestion-pedidos" class="navbar-item" @click="closeMenu">Gestion de Pedidos</router-link>
      <router-link v-if="isAdmin" to="/gestion-proveedores" class="navbar-item" @click="closeMenu">Gestion de Proveedores</router-link>
      <router-link v-if="isAdmin" to="/gestion-pedidos-periodicos" class="navbar-item" @click="closeMenu">Pedidos Periodicos</router-link>
      <router-link to="/configuracion" class="navbar-item" @click="closeMenu">Configuracion</router-link>
      <router-link to="/soporte" class="navbar-item" @click="closeMenu">Soporte</router-link>
      <router-link v-if="!isAuthenticated" to="/login" class="navbar-item navbar-login" @click="closeMenu">
        <i class="fas fa-sign-in-alt"></i> Iniciar Sesion
      </router-link>
      <a v-if="isAuthenticated" @click="logout" class="navbar-item navbar-logout">
        <i class="fas fa-sign-out-alt"></i> Cerrar Sesion
      </a>
    </div>
  </nav>
</template>

<script>
// Barra de navegacion que muestra el menu segun el rol del usuario
import { useAuthStore } from '@/store';
import api from '@/services/api';

export default {
  name: 'NavBar',
  data() {
    return {
      isMenuOpen: false,
      pedidosPendientesEntrega: 0,
    };
  },
  computed: {
    isAuthenticated() {
      const authStore = useAuthStore();
      return authStore.isAuthenticated;
    },
    isAdmin() {
      const authStore = useAuthStore();
      return authStore.user?.rol === 'admin';
    },
    isGestor() {
      const authStore = useAuthStore();
      return authStore.user?.rol === 'gestor';
    },
    isAdminOrGestor() {
      const authStore = useAuthStore();
      return authStore.user?.rol === 'admin' || authStore.user?.rol === 'gestor';
    },
    userName() {
      const authStore = useAuthStore();
      return authStore.user?.nombre || '';
    },
    userFamily() {
      const authStore = useAuthStore();
      return authStore.user?.familia || null;
    },
    userProvider() {
      const authStore = useAuthStore();
      return authStore.user?.proveedor_gestionado || null;
    },
  },
  created() {
    if (this.isAuthenticated) {
      this.cargarPedidosPendientes();
    }
  },
  watch: {
    isAuthenticated(val) {
      if (val) {
        this.cargarPedidosPendientes();
      } else {
        this.pedidosPendientesEntrega = 0;
      }
    },
  },
  methods: {
    // Abre/cierra el menu en movil
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    // Cierra el menu (al hacer click en un enlace)
    closeMenu() {
      this.isMenuOpen = false;
    },
    // Carga el numero de pedidos pendientes de entrega para mostrar en el badge
    async cargarPedidosPendientes() {
      if (!this.isAuthenticated) {
        return;
      }
      try {
        const authStore = useAuthStore();
        const userId = Number(authStore.user?.id_usuario);
        if (!userId) {
          return;
        }

        const pedidosPromise = this.isAdmin ? api.getPedidos() : api.getMisPedidos();
        const [pedidosResponse] = await Promise.all([pedidosPromise]);
        const pedidos = pedidosResponse.data || [];

        // Filtro los pedidos que no estan repartidos ni cancelados
        const pedidosPendientes = pedidos.filter(
          pedido => !['repartido', 'cancelado'].includes(pedido.estado)
        );

        // Cuento los productos del usuario en esos pedidos
        let totalProductos = 0;
        for (const pedido of pedidosPendientes) {
          const detallesResponse = await api.getDetallesPedidoPorPedido(pedido.id_pedido);
          const detallesUsuario = (detallesResponse.data || []).filter(
            detalle =>
              Number(detalle.id_usuario_comprador) === userId && Number(detalle.cantidad || 0) > 0
          );
          totalProductos += detallesUsuario.length;
        }

        this.pedidosPendientesEntrega = totalProductos;
      } catch (error) {
        console.error('Error cargando pedidos pendientes:', error);
        this.pedidosPendientesEntrega = 0;
      }
    },
    // Cierra la sesion del usuario
    async logout() {
      try {
        const authStore = useAuthStore();
        authStore.logout();
        this.pedidosPendientesEntrega = 0;
        this.isMenuOpen = false;
        this.$router.push({ name: 'Login' }).catch((err) => {
          console.error('Error al redirigir a la pagina de inicio de sesion:', err);
        });
      } catch (error) {
        console.error('Error al cerrar sesion:', error);
      }
    },
  },
};
</script>

<style scoped>
.navbar {
  background-color: #FFFFFF;
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  position: relative;
  z-index: 1000;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-logo {
  color: #333333;
  font-weight: bold;
  text-decoration: none;
  font-size: 1.5rem;
}

.navbar-user {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.navbar-badge {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.6rem;
  background-color: #fff3cd;
  border-radius: 20px;
  color: #664d03;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.navbar-badge:hover {
  background-color: #ffe69c;
}

.badge-count {
  background-color: #dc3545;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.15rem 0.4rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.navbar-menu {
  display: flex;
  flex-wrap: wrap;
  transition: max-height 0.3s ease;
}

.navbar-menu.is-active {
  max-height: 1000px;
}

.navbar-item {
  color: #333333;
  margin: 0 0.5rem;
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: background-color 0.3s ease;
  cursor: pointer;
  white-space: nowrap;
}

.navbar-item:hover {
  background-color: #e9ecef;
  border-radius: 5px;
}

.navbar-login {
  font-weight: bold;
  color: #FF9800;
}

.navbar-login i {
  margin-right: 0.5rem;
}

.navbar-login:hover {
  background-color: #FFE0B2;
  border-radius: 5px;
}

.navbar-logout {
  font-weight: bold;
  color: #DC3545;
}

.navbar-logout i {
  margin-right: 0.5rem;
}

.navbar-logout:hover {
  background-color: #F8D7DA;
  border-radius: 5px;
}

.navbar-burger {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 25px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.navbar-burger span {
  display: block;
  width: 100%;
  height: 3px;
  background-color: #333333;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
  }

  .navbar-brand {
    flex: 1;
    min-width: 0;
  }

  .navbar-user {
    display: none;
  }

.user-family {
  color: #0d6efd;
  font-weight: 600;
}

.navbar-right {
    flex-shrink: 0;
  }

  .navbar-menu {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 0;
    overflow: hidden;
    padding: 0;
    margin-top: 0;
  }

  .navbar-menu.is-active {
    max-height: 1000px;
    padding-top: 0.5rem;
    margin-top: 0.5rem;
    border-top: 1px solid #e9ecef;
  }

  .navbar-item {
    width: 100%;
    margin: 0;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #f8f9fa;
  }

  .navbar-item:last-child {
    border-bottom: none;
  }

  .navbar-burger {
    display: flex;
  }
}
</style>
