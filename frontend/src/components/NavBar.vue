<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="navbar-brand">
        <img src="@/assets/cestakonsumo.png" alt="Ekonsumo" class="navbar-logo-img">
        <span class="navbar-logo-text">Ekonsumo</span>
      </router-link>

      <div class="navbar-user-info" v-if="isAuthenticated && userName">
        <router-link to="/configuracion" class="user-link">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="user-details">
            <span class="user-name">{{ userName }}</span>
            <span v-if="userFamily" class="user-meta">
              Familia {{ userFamily }}
              <span v-if="userProvider" class="user-provider">· {{ userProvider }}</span>
            </span>
          </div>
        </router-link>
      </div>

      <div v-if="isAuthenticated" class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
        <router-link to="/dashboard" class="navbar-item" @click="closeMenu">
          <i class="fas fa-th-large"></i>
          <span class="item-text">Dashboard</span>
        </router-link>
        <router-link to="/compras" class="navbar-item" @click="closeMenu">
          <i class="fas fa-shopping-cart"></i>
          <span class="item-text">Compras</span>
        </router-link>
        <router-link to="/historial" class="navbar-item" @click="closeMenu">
          <i class="fas fa-history"></i>
          <span class="item-text">Historial</span>
        </router-link>
        <router-link to="/gestion-pagos" class="navbar-item" @click="closeMenu">
          <i class="fas fa-wallet"></i>
          <span class="item-text">Pagos</span>
        </router-link>

        <div v-if="isAdminOrGestor" class="navbar-dropdown">
          <button class="navbar-item navbar-dropdown-toggle" @click="toggleProveedoresMenu">
            <i class="fas fa-cog"></i>
            <span class="item-text">Gestión</span>
            <i class="fas fa-chevron-down dropdown-arrow"></i>
          </button>
          <div class="navbar-dropdown-menu" :class="{ 'is-open': isProveedoresMenuOpen }">
            <router-link v-if="isAdmin" to="/gestion-usuarios" class="navbar-dropdown-item" @click="closeMenu">
          <i class="fas fa-users"></i>
          <span class="item-text">Usuarios</span>
        </router-link>
            <router-link to="/gestion-proveedores" class="navbar-dropdown-item" @click="closeMenu">
              <i class="fas fa-truck"></i>
              <span>Proveedores</span>
            </router-link>
            <router-link to="/gestion-productos" class="navbar-dropdown-item" @click="closeMenu">
              <i class="fas fa-box-open"></i>
              <span>Productos</span>
            </router-link>
            <router-link to="/gestion-pedidos" class="navbar-dropdown-item" @click="closeMenu">
              <i class="fas fa-clipboard-list"></i>
              <span>Pedidos</span>
            </router-link>
            <router-link v-if="isAdmin" to="/gestion-pedidos-periodicos" class="navbar-dropdown-item" @click="closeMenu">
              <i class="fas fa-calendar-alt"></i>
              <span>Periódicos</span>
            </router-link>
          </div>
        </div>



        <router-link to="/soporte" class="navbar-item" @click="closeMenu">
          <i class="fas fa-question-circle"></i>
          <span class="item-text">Ayuda</span>
        </router-link>
      </div>
      <div v-else class="navbar-menu-guest">
        <router-link to="/soporte" class="navbar-item navbar-item-guest" @click="closeMenu">
          <i class="fas fa-question-circle"></i>
          <span class="item-text">Ayuda</span>
        </router-link>
      </div>

      <div class="navbar-right">
        <router-link
          v-if="isAuthenticated && pedidosPendientesEntrega > 0"
          to="/dashboard"
          class="navbar-badge"
          title="Productos pendientes de entrega"
        >
          <i class="fas fa-shopping-basket"></i>
          <span class="badge-count">{{ pedidosPendientesEntrega }}</span>
        </router-link>

        <a v-if="isAuthenticated" @click="logout" class="navbar-auth navbar-logout">
          <i class="fas fa-sign-out-alt"></i>
        </a>

        <button class="navbar-burger" @click="toggleMenu" :class="{ 'is-active': isMenuOpen }" aria-label="Abrir menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '@/store';
import api from '@/services/api';

export default {
  name: 'NavBar',
  data() {
    return {
      isMenuOpen: false,
      isProveedoresMenuOpen: false,
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
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    toggleProveedoresMenu() {
      this.isProveedoresMenuOpen = !this.isProveedoresMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
      this.isProveedoresMenuOpen = false;
    },
    async cargarPedidosPendientes() {
      if (!this.isAuthenticated) return;
      try {
        const authStore = useAuthStore();
        const userId = Number(authStore.user?.id_usuario);
        if (!userId) return;

        const pedidosResponse = await api.getPedidos();
        const pedidos = pedidosResponse.data || [];

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const pedidosPendientes = pedidos.filter((pedido) => {
          if (!['pendiente', 'en proceso'].includes(pedido.estado)) {
            return false;
          }
          const cierre = pedido.fecha_cierre ? new Date(pedido.fecha_cierre) : null;
          if (!cierre) {
            return false;
          }
          cierre.setHours(0, 0, 0, 0);
          return cierre < hoy;
        });

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
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 1000;
}

.navbar-container {
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem 0.6rem 0;
  max-width: 1400px;
  margin: 0 auto;
  gap: 1rem;
}

.navbar-brand {
  text-decoration: none;
  flex-shrink: 0;
  margin-right: 0.5rem;
}

.navbar-logo-img {
  height: 36px;
  width: auto;
}

.navbar-logo-text {
  color: #4CAF50;
  font-weight: 700;
  font-size: 1.3rem;
}

.navbar-user-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0.8rem;
  background-color: #f8f9fa;
  border-radius: 50px;
  flex-shrink: 0;
  margin-right: 0.5rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background-color: #4CAF50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.85rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  padding: 0.4rem 0.8rem;
  background-color: #f8f9fa;
  border-radius: 50px;
  flex-shrink: 0;
  transition: background-color 0.2s ease;
}

.user-link:hover {
  background-color: #e9ecef;
}

.user-name {
  font-weight: 600;
  color: #333333;
  font-size: 0.9rem;
}

.user-meta {
  font-size: 0.75rem;
  color: #6c757d;
}

.user-provider {
  color: #4CAF50;
  font-weight: 500;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
}

.navbar-menu-guest {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.navbar-item-guest {
  background-color: var(--color-secondary-bg);
  color: var(--color-secondary);
  font-weight: 500;
}

.navbar-item-guest:hover {
  background-color: var(--color-secondary-light);
  color: var(--color-secondary-dark);
}

.navbar-item-guest i {
  color: var(--color-secondary);
}

.navbar-item-guest:hover i {
  color: var(--color-secondary-dark);
}

.navbar-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #555555;
  text-decoration: none;
  padding: 0.4rem 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  white-space: nowrap;
  flex-shrink: 0;
}

.navbar-item i {
  font-size: 0.85rem;
  color: #888888;
  width: 16px;
  text-align: center;
  transition: color 0.2s ease;
}

.navbar-item:hover {
  background-color: #f0f7f0;
  color: #4CAF50;
}

.navbar-item:hover i {
  color: #4CAF50;
}

.navbar-item.router-link-active {
  background-color: #e8f5e9;
  color: #4CAF50;
  font-weight: 600;
}

.navbar-item.router-link-active i {
  color: #4CAF50;
}

.navbar-dropdown {
  position: relative;
}

.navbar-dropdown-toggle {
  cursor: pointer;
  background: transparent;
  border: 1px solid transparent;
  font-family: inherit;
}

.navbar-dropdown-toggle:hover {
  background-color: #f0f7f0;
  border-color: #e0e0e0;
}

.dropdown-arrow {
  font-size: 0.7rem;
  margin-left: 0.25rem;
  transition: transform 0.2s ease;
}

.navbar-dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  padding: 0.5rem 0;
  z-index: 1001;
}

.navbar-dropdown-menu.is-open {
  display: block;
}

.navbar-dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1rem;
  color: #555555;
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.navbar-dropdown-item:hover {
  background-color: #f0f7f0;
  color: #4CAF50;
}

.navbar-dropdown-item i {
  width: 16px;
  text-align: center;
  color: #888888;
}

.navbar-dropdown-item:hover i {
  color: #4CAF50;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  flex-shrink: 0;
}

.navbar-badge {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.7rem;
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  border-radius: 50px;
  color: white;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(76, 175, 80, 0.3);
}

.navbar-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(76, 175, 80, 0.4);
  background: linear-gradient(135deg, #43A047, #4CAF50);
}

.navbar-badge i {
  font-size: 0.8rem;
}

.badge-count {
  background-color: rgba(255, 255, 255, 0.25);
  padding: 0.05rem 0.4rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
}

.navbar-auth {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.2s ease;
}

.navbar-login {
  color: #FF9800;
  background-color: #fff3e0;
}

.navbar-login:hover {
  background-color: #FFE0B2;
  color: #E68900;
}

.navbar-logout {
  color: #DC3545;
  background-color: #fce4e4;
}

.navbar-logout:hover {
  background-color: #f8d7da;
  color: #c82333;
}

.navbar-burger {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.navbar-burger span {
  display: block;
  width: 100%;
  height: 2.5px;
  background-color: #555555;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.navbar-burger.is-active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.navbar-burger.is-active span:nth-child(2) {
  opacity: 0;
}

.navbar-burger.is-active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media (max-width: 1200px) {
  .item-text {
    display: none;
  }
  
  .navbar-item i {
    width: auto;
  }
}

@media (max-width: 1100px) {
  .navbar-user-info {
    display: none;
  }
}

@media (max-width: 768px) {
  .user-link {
    display: none;
  }
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0.6rem 0;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .navbar-logo {
    font-size: 1.1rem;
  }

  .navbar-burger {
    display: flex;
    margin-right: 0.5rem;
  }

  .navbar-menu {
    display: none;
    flex-direction: column;
    width: 100%;
    padding: 0.5rem 0;
    border-top: 1px solid #e9ecef;
    margin-top: 0.5rem;
    gap: 0;
  }

  .navbar-menu.is-active {
    display: flex;
  }

  .navbar-item {
    width: 100%;
    padding: 0.75rem 0.5rem;
    border-bottom: 1px solid #f0f0f0;
    font-size: 0.95rem;
  }

  .navbar-item i {
    width: 20px;
    text-align: center;
  }

  .item-text {
    display: inline;
  }

  .navbar-right {
    gap: 0.5rem;
  }

  .navbar-dropdown {
    width: 100%;
  }

  .navbar-dropdown-menu {
    position: static;
    box-shadow: none;
    padding-left: 1.5rem;
    border-radius: 0;
  }

  .navbar-dropdown-item {
    padding: 0.6rem 0.5rem;
  }

  .dropdown-arrow {
    display: none;
  }
}
</style>
