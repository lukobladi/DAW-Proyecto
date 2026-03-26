<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="navbar-brand">
        <span class="navbar-logo">
          <i class="fas fa-leaf"></i>
          Ekonsumo
        </span>
      </router-link>

      <div class="navbar-user-info" v-if="isAuthenticated && userName">
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
        <router-link v-if="isAdminOrGestor" to="/gestion-productos" class="navbar-item" @click="closeMenu">
          <i class="fas fa-box-open"></i>
          <span class="item-text">Productos</span>
        </router-link>
        <router-link v-if="isAdminOrGestor" to="/gestion-pedidos" class="navbar-item" @click="closeMenu">
          <i class="fas fa-clipboard-list"></i>
          <span class="item-text">Pedidos</span>
        </router-link>
        <router-link v-if="isAdmin" to="/gestion-usuarios" class="navbar-item" @click="closeMenu">
          <i class="fas fa-users"></i>
          <span class="item-text">Usuarios</span>
        </router-link>
        <router-link v-if="isAdmin" to="/gestion-proveedores" class="navbar-item" @click="closeMenu">
          <i class="fas fa-truck"></i>
          <span class="item-text">Proveedores</span>
        </router-link>
        <router-link v-if="isAdmin" to="/gestion-pedidos-periodicos" class="navbar-item" @click="closeMenu">
          <i class="fas fa-calendar-alt"></i>
          <span class="item-text">Periódicos</span>
        </router-link>
        <router-link to="/configuracion" class="navbar-item" @click="closeMenu">
          <i class="fas fa-cog"></i>
          <span class="item-text">Config</span>
        </router-link>
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
    closeMenu() {
      this.isMenuOpen = false;
    },
    async cargarPedidosPendientes() {
      if (!this.isAuthenticated) return;
      try {
        const authStore = useAuthStore();
        const userId = Number(authStore.user?.id_usuario);
        if (!userId) return;

        const pedidosPromise = this.isAdmin ? api.getPedidos() : api.getMisPedidos();
        const [pedidosResponse] = await Promise.all([pedidosPromise]);
        const pedidos = pedidosResponse.data || [];

        const pedidosPendientes = pedidos.filter(
          pedido => !['repartido', 'cancelado'].includes(pedido.estado)
        );

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
  padding: 0.6rem 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  gap: 1.5rem;
}

.navbar-brand {
  text-decoration: none;
  flex-shrink: 0;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4CAF50;
  font-weight: 700;
  font-size: 1.3rem;
}

.navbar-logo i {
  font-size: 1.1rem;
}

.navbar-user-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0.8rem;
  background-color: #f8f9fa;
  border-radius: 50px;
  flex-shrink: 0;
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
  gap: 0.4rem;
  color: #555555;
  text-decoration: none;
  padding: 0.5rem 0.7rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  white-space: nowrap;
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

.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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

@media (max-width: 992px) {
  .navbar-user-info {
    display: none;
  }
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0.6rem 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .navbar-logo {
    font-size: 1.1rem;
  }

  .navbar-burger {
    display: flex;
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
}
</style>
