<template>
  <div class="dashboard-page">
    <div class="page-content">
      <h2>Hola, {{ usuarioNombre }}!</h2>

      <section class="resumen-financiero">
        <h3>Resumen financiero</h3>
        <p>Estado de tus cuentas pendientes y gasto del mes actual.</p>

        <div v-if="cargandoFinanzas" class="estado">Cargando resumen financiero...</div>

        <template v-else>
          <div class="resumen-cards">
            <article class="resumen-card gasto">
              <h4>Gasto este mes</h4>
              <p class="monto">{{ formatMoney(resumenFinanciero.total_gastado_mes) }}</p>
            </article>

            <article class="resumen-card gasto-vencido">
              <h4>Gasto mes vencido</h4>
              <p class="monto">{{ formatMoney(resumenFinancieroMesVencido.total_gastado_mes) }}</p>
            </article>

            <article class="resumen-card deuda">
              <h4>Debes pagar</h4>
              <p class="monto">{{ formatMoney(resumenFinanciero.total_pendiente_por_pagar) }}</p>
            </article>

            <article class="resumen-card cobrar">
              <h4>Te deben</h4>
              <p class="monto">{{ formatMoney(resumenFinanciero.total_pendiente_por_cobrar) }}</p>
            </article>
          </div>

          <div
            v-if="
              resumenFinanciero.total_pendiente_por_pagar <= 0 &&
              resumenFinanciero.total_pendiente_por_cobrar <= 0
            "
            class="estado"
          >
            No tienes cuentas pendientes.
          </div>

          <div v-else class="deudas-lista">
            <article v-for="deuda in resumenFinanciero.deudas_pendientes" :key="deuda.id_pago" class="deuda-card">
              <p v-if="esDeudor(deuda)">
                Debes <strong>{{ formatMoney(deuda.monto) }}</strong> a
                <strong>{{ deuda.nombre_creditor }}</strong>
              </p>
              <p v-else>
                <strong>{{ deuda.nombre_deudor }}</strong> te debe
                <strong>{{ formatMoney(deuda.monto) }}</strong>
              </p>
              <p class="texto-secundario" v-if="deuda.periodo">
                Periodo: {{ formatPeriodoDeuda(deuda.periodo) }}
              </p>
              <p class="texto-secundario" v-if="deuda.deudor_reporta_pagado && !esDeudor(deuda)">
                El deudor indica que ya ha pagado.
              </p>

              <button
                v-if="esDeudor(deuda)"
                class="btn btn-outline-primary btn-sm"
                :disabled="Boolean(deuda.deudor_reporta_pagado) || actualizandoPagoId === deuda.id_pago"
                @click="marcarComoPagado(deuda)"
              >
                {{ deuda.deudor_reporta_pagado ? 'Pendiente de confirmacion' : 'Marcar como pagado' }}
              </button>

              <button
                v-else
                class="btn btn-success btn-sm"
                :disabled="actualizandoPagoId === deuda.id_pago"
                @click="marcarComoRecibido(deuda)"
              >
                Marcar como recibido
              </button>
            </article>
          </div>
        </template>
      </section>

      <section class="cesta-mensual">
        <h3>Productos comprados este mes</h3>
        <p>Listado de productos que has comprado durante el mes actual.</p>

        <div v-if="cargando" class="estado">Cargando dashboard...</div>
        <div v-else-if="errorCarga" class="estado error">{{ errorCarga }}</div>

        <div v-else-if="!productosMes.length" class="estado">
          No has comprado productos este mes.
        </div>

        <div v-else class="lista-productos">
          <div
            v-for="producto in productosMes"
            :key="`${producto.id_detalle}-${producto.id_pedido}`"
            class="producto-card"
          >
            <img
              :src="producto.imagen"
              alt="Imagen del producto"
              class="producto-imagen"
              @error="onImageError"
            />
            <h3>{{ producto.nombre }}</h3>
            <p>{{ producto.proveedor }}</p>
            <div class="cantidad-control">
              <span>Unidades pedidas:</span>
              <button
                class="btn-unidad"
                :disabled="actualizandoDetalleId === producto.id_detalle || !producto.pedido_abierto"
                @click="decrementarUnidades(producto)"
              >
                -
              </button>
              <strong>{{ producto.cantidad }}</strong>
              <button
                class="btn-unidad"
                :disabled="actualizandoDetalleId === producto.id_detalle || !producto.pedido_abierto"
                @click="incrementarUnidades(producto)"
              >
                +
              </button>
            </div>
            <p v-if="!producto.pedido_abierto" class="aviso-edicion">
              Solo puedes modificar unidades mientras el pedido este abierto.
            </p>
            <p>Precio unidad: {{ producto.precio_unitario }} EUR</p>
            <p>Total: {{ producto.total }} EUR</p>
            <p>
              <span :class="['estado-pill', estadoClass(producto.estado_pedido)]">
                {{ estadoLabel(producto.estado_pedido) }}
              </span>
            </p>
          </div>
        </div>
      </section>

      <section class="productos-pendientes">
        <h3>Productos pendientes de entrega</h3>
        <p>Productos sin entregar o recoger.</p>

        <div v-if="!productosPendientesEntrega.length" class="estado">
          No tienes productos pendientes de entrega.
        </div>

        <div v-else class="lista-productos">
          <div
            v-for="producto in productosPendientesEntrega"
            :key="`${producto.id_detalle}-${producto.id_pedido}`"
            class="producto-card"
          >
            <img
              :src="producto.imagen"
              alt="Imagen del producto"
              class="producto-imagen"
              @error="onImageError"
            />
            <h3>{{ producto.nombre }}</h3>
            <p>{{ producto.proveedor }}</p>
            <p>Cantidad: {{ producto.cantidad }}</p>
            <p>Precio unidad: {{ producto.precio_unitario }} EUR</p>
            <p>Total: {{ producto.total }} EUR</p>
            <p>
              <span :class="['estado-pill', estadoClass(producto.estado_pedido)]">
                {{ estadoLabel(producto.estado_pedido) }}
              </span>
            </p>
          </div>
        </div>
      </section>

      <section class="pedidos-abiertos">
        <h3>Pedidos abiertos</h3>
        <div v-if="!pedidosAbiertos.length" class="estado">No hay pedidos abiertos ahora mismo.</div>
        <div v-else class="lista-pedidos">
          <div v-for="pedido in pedidosAbiertos" :key="pedido.id_pedido" class="pedido-card">
            <h4>{{ pedido.proveedor }}</h4>
            <p>Apertura: {{ formatFecha(pedido.fecha_apertura) }}</p>
            <p>Cierre: {{ formatFecha(pedido.fecha_cierre) }}</p>
            <p>Entrega aprox: {{ formatFecha(pedido.fecha_entrega) }}</p>
            <p>
              <span :class="['estado-pill', 'estado-pendiente']">Abierto</span>
            </p>
            <router-link to="/compras" class="btn btn-primary btn-sm">Adquirir</router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import { useAuthStore } from '@/store';
import { alertStore } from '@/store/alertStore';

export default {
  // ============================================
  // data()
  // Variables de estado del componente
  // ============================================
  data() {
    return {
      // Bandera que indica si se están cargando los datos principales
      cargando: false,
      // Bandera que indica si se está cargando el resumen financiero
      cargandoFinanzas: false,
      // Mensaje de error en caso de que la carga falle
      errorCarga: '',
      // Lista de productos comprados en el mes actual
      productosMes: [],
      // Lista de productos pendientes de entrega
      productosPendientesEntrega: [],
      // Lista de pedidos abiertos disponibles
      pedidosAbiertos: [],
      // ID del detalle que se está actualizando (para deshabilitar botones)
      actualizandoDetalleId: null,
      // ID del pago que se está actualizando (para deshabilitar botones)
      actualizandoPagoId: null,
      // Periodo actual en formato YYYY-MM
      periodoActual: new Date().toISOString().slice(0, 7),
      // Resumen financiero del mes actual
      resumenFinanciero: {
        periodo_consultado: '',
        saldo_actual: 0,
        total_gastado_mes: 0,
        total_pendiente_por_pagar: 0,
        total_pendiente_por_cobrar: 0,
        deudas_pendientes: [],
      },
      // Resumen financiero del mes vencido
      resumenFinancieroMesVencido: {
        total_gastado_mes: 0,
      },
    };
  },
  // ============================================
  // computed
  // Propiedades calculadas del componente
  // ============================================
  computed: {
    // ============================================
    // periodoVencido
    // Calcula el periodo del mes anterior en formato YYYY-MM
    // Parámetros: Ninguno
    // Retorna: String - Periodo del mes anterior
    // ============================================
    periodoVencido() {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      return date.toISOString().slice(0, 7);
    },
    // ============================================
    // usuarioNombre
    // Obtiene el nombre del usuario autenticado
    // Parámetros: Ninguno
    // Retorna: String - Nombre del usuario o 'usuario' por defecto
    // ============================================
    usuarioNombre() {
      const authStore = useAuthStore();
      return authStore.user?.nombre || 'usuario';
    },
    // ============================================
    // isAdmin
    // Determina si el usuario tiene rol de administrador
    // Parámetros: Ninguno
    // Retorna: Boolean - true si es admin
    // ============================================
    isAdmin() {
      const authStore = useAuthStore();
      return authStore.user?.rol === 'admin';
    },
    // ============================================
    // isGestor
    // Determina si el usuario tiene rol de gestor
    // Parámetros: Ninguno
    // Retorna: Boolean - true si es gestor
    // ============================================
    isGestor() {
      const authStore = useAuthStore();
      return authStore.user?.rol === 'gestor';
    },
    // ============================================
    // isAdminOrGestor
    // Determina si el usuario es admin o gestor
    // Parámetros: Ninguno
    // Retorna: Boolean - true si es admin o gestor
    // ============================================
    isAdminOrGestor() {
      const authStore = useAuthStore();
      return authStore.user?.rol === 'admin' || authStore.user?.rol === 'gestor';
    },
  },
  // ============================================
  // created()
  // Hook que se ejecuta cuando el componente se crea
  // ============================================
  async created() {
    // Carga todos los datos del dashboard
    await this.cargarDashboard();
  },
  // ============================================
  // methods
  // Métodos del componente
  // ============================================
  methods: {
    // ============================================
    // getBackendOrigin
    // Obtiene el origen del backend para construir URLs completas
    // Parámetros: Ninguno
    // Retorna: String - Origen del backend
    // ============================================
    getBackendOrigin() {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';

      if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
        return new URL(apiUrl).origin;
      }

      return window.location.origin;
    },
    // ============================================
    // normalizarImagen
    // Normaliza la URL de una imagen para que sea accesible
    // Parámetros: imagen (String) - URL de la imagen
    // Retorna: String - URL normalizada
    // ============================================
    normalizarImagen(imagen) {
      if (!imagen) {
        return '/favicon.ico';
      }

      if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
        return imagen;
      }

      if (imagen.startsWith('/')) {
        return `${this.getBackendOrigin()}${imagen}`;
      }

      return `${this.getBackendOrigin()}/${imagen}`;
    },
    // ============================================
    // formatFecha
    // Formatea una fecha ISO a formato español con hora
    // Parámetros: fechaIso (String) - Fecha en formato ISO
    // Retorna: String - Fecha formateada o 'Sin fecha'
    // ============================================
    formatFecha(fechaIso) {
      if (!fechaIso) {
        return 'Sin fecha';
      }

      return new Date(fechaIso).toLocaleString('es-ES');
    },
    // ============================================
    // esPedidoAbierto
    // Determina si un pedido está actualmente abierto
    // Parámetros: pedido (Object) - Objeto pedido con estado y fecha_cierre
    // Retorna: Boolean - true si el pedido está abierto
    // ============================================
    esPedidoAbierto(pedido) {
      if (pedido.estado !== 'pendiente') {
        return false;
      }

      const cierre = pedido.fecha_cierre ? new Date(pedido.fecha_cierre) : null;
      if (!cierre) {
        return false;
      }

      const ahora = new Date();
      const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
      const fechaCierre = new Date(cierre.getFullYear(), cierre.getMonth(), cierre.getDate());

      return fechaCierre > hoy;
    },
    // ============================================
    // estadoLabel
    // Devuelve la etiqueta traducida para un estado de pedido
    // Parámetros: estado (String) - Estado del pedido
    // Retorna: String - Etiqueta en español
    // ============================================
    estadoLabel(estado) {
      const labels = {
        pendiente: 'Pendiente',
        'en proceso': 'En proceso',
        entregado: 'Entregado',
        repartido: 'Repartido',
        cancelado: 'Cancelado',
      };
      return labels[estado] || estado;
    },
    // ============================================
    // estadoClass
    // Devuelve la clase CSS para el badge de estado
    // Parámetros: estado (String) - Estado del pedido
    // Retorna: String - Nombre de la clase CSS
    // ============================================
    estadoClass(estado) {
      const classes = {
        pendiente: 'estado-pendiente',
        'en proceso': 'estado-proceso',
        entregado: 'estado-entregado',
        repartido: 'estado-repartido',
        cancelado: 'estado-cancelado',
      };
      return classes[estado] || 'estado-pendiente';
    },
    // ============================================
    // formatMoney
    // Formatea un valor numérico como moneda EUR
    // Parámetros: value (Number/String) - Valor a formatear
    // Retorna: String - Valor formateado con 2 decimales y EUR
    // ============================================
    formatMoney(value) {
      const amount = Number(value || 0);
      return `${amount.toFixed(2)} EUR`;
    },
    // ============================================
    // formatPeriodoDeuda
    // Formatea un periodo YYYY-MM a formato MM/YYYY
    // Parámetros: periodo (String) - Periodo en formato YYYY-MM
    // Retorna: String - Periodo formateado o 'Sin periodo'
    // ============================================
    formatPeriodoDeuda(periodo) {
      if (!periodo) {
        return 'Sin periodo';
      }

      const raw = String(periodo);
      const periodoMes = raw.length >= 7 ? raw.slice(0, 7) : raw;
      const [year, month] = periodoMes.split('-');

      if (!year || !month) {
        return periodoMes;
      }

      return `${month}/${year}`;
    },
    // ============================================
    // getUsuarioId
    // Obtiene el ID del usuario autenticado
    // Parámetros: Ninguno
    // Retorna: Number - ID del usuario
    // ============================================
    getUsuarioId() {
      const authStore = useAuthStore();
      return Number(authStore.user?.id_usuario);
    },
    // ============================================
    // esDeudor
    // Determina si el usuario actual es el deudor de una deuda
    // Parámetros: deuda (Object) - Objeto deuda con id_usuario_deudor
    // Retorna: Boolean - true si el usuario actual es el deudor
    // ============================================
    esDeudor(deuda) {
      return Number(deuda.id_usuario_deudor) === this.getUsuarioId();
    },
    // ============================================
    // manejarSesionCaducada
    // Maneja la expiración de sesión redirigiendo al login
    // Parámetros: Ninguno
    // Retorna: No retorna valor
    // Efectos secundarios: Limpia localStorage y redirige a Login
    // ============================================
    manejarSesionCaducada() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('authUser');
      alertStore.showAlert('Tu sesion ha caducado. Inicia sesion de nuevo.', 'danger');
      this.$router.push({ name: 'Login' });
    },
    // ============================================
    // cargarResumenFinanciero
    // Carga el resumen financiero del mes actual y mes vencido
    // Parámetros: Ninguno
    // Retorna: No retorna valor, actualiza resumenFinanciero y resumenFinancieroMesVencido
    // Efectos secundarios: Llama a api.getResumenPagosMensual
    // ============================================
    async cargarResumenFinanciero() {
      this.cargandoFinanzas = true;

      const periodoActual = new Date().toISOString().slice(0, 7);
      const periodoVencido = new Date(new Date().setMonth(new Date().getMonth() - 1))
        .toISOString()
        .slice(0, 7);

      try {
        const resumenResponse = await api.getResumenPagosMensual(periodoActual);
        const resumenVencidoResponse = await api.getResumenPagosMensual(periodoVencido);

        this.resumenFinanciero = {
          ...this.resumenFinanciero,
          ...(resumenResponse.data || {}),
          deudas_pendientes: resumenResponse.data?.deudas_pendientes || [],
        };

        this.resumenFinancieroMesVencido = {
          total_gastado_mes: resumenVencidoResponse.data?.total_gastado_mes || 0,
        };
      } catch (error) {
        if (error.response?.status === 401) {
          this.manejarSesionCaducada();
          return;
        }

        alertStore.showAlert('No se pudo cargar el resumen financiero.', 'danger');
      } finally {
        this.cargandoFinanzas = false;
      }
    },
    // ============================================
    // marcarComoPagado
    // Marca una deuda como pagada por el deudor
    // Parámetros: deuda (Object) - Objeto deuda con id_pago
    // Retorna: No retorna valor
    // Efectos secundarios: Llama a api.marcarPagoEnviado, actualiza UI
    // ============================================
    async marcarComoPagado(deuda) {
      this.actualizandoPagoId = deuda.id_pago;

      try {
        await api.marcarPagoEnviado(deuda.id_pago);
        alertStore.showAlert('Has marcado la deuda como pagada. Pendiente de confirmacion.', 'success');
        await this.cargarResumenFinanciero();
      } catch (error) {
        if (error.response?.status === 401) {
          this.manejarSesionCaducada();
          return;
        }

        alertStore.showAlert('No se pudo marcar la deuda como pagada.', 'danger');
      } finally {
        this.actualizandoPagoId = null;
      }
    },
    // ============================================
    // marcarComoRecibido
    // Confirma que el acreedor ha recibido el pago
    // Parámetros: deuda (Object) - Objeto deuda con id_pago
    // Retorna: No retorna valor
    // Efectos secundarios: Llama a api.marcarPagoRecibido, actualiza UI
    // ============================================
    async marcarComoRecibido(deuda) {
      this.actualizandoPagoId = deuda.id_pago;

      try {
        await api.marcarPagoRecibido(deuda.id_pago);
        alertStore.showAlert('Pago confirmado como recibido.', 'success');
        await this.cargarResumenFinanciero();
      } catch (error) {
        if (error.response?.status === 401) {
          this.manejarSesionCaducada();
          return;
        }

        alertStore.showAlert('No se pudo confirmar el pago como recibido.', 'danger');
      } finally {
        this.actualizandoPagoId = null;
      }
    },
    // ============================================
    // cargarDashboard
    // Carga todos los datos del dashboard: pedidos, productos, proveedores
    // Parámetros: Ninguno
    // Retorna: No retorna valor, actualiza múltiples variables de estado
    // Efectos secundarios: Llama a múltiples APIs, maneja sesión caducada
    // ============================================
    async cargarDashboard() {
      console.log('isGestor:', this.isGestor);
  console.log('user rol:', useAuthStore().user?.rol);
      this.cargando = true;
      this.errorCarga = '';

      try {
        const authStore = useAuthStore();
        const userId = Number(authStore.user?.id_usuario);

        // Refresca datos del usuario si no están completos
        if (!authStore.user?.nombre && userId) {
          const usuario = await api.getUsuario(userId);
          authStore.login({
            token: localStorage.getItem('authToken'),
            user: {
              ...authStore.user,
              ...usuario.data,
            },
          });
        }

        // Carga datos en paralelo
        const [pedidosResponse, productosResponse, proveedoresResponse] = await Promise.all([
          api.getPedidos(),
          api.getProductos(),
          api.getProveedores(),
        ]);

        await this.cargarResumenFinanciero();

        const pedidos = pedidosResponse.data || [];
        const productos = productosResponse.data || [];
        const proveedores = proveedoresResponse.data || [];

        // Crea mapas para búsqueda rápida
        const proveedorPorId = new Map(
          proveedores.map((proveedor) => [proveedor.id_proveedor, proveedor.nombre])
        );

        const productoPorId = new Map(
          productos.map((producto) => [producto.id_producto, producto])
        );

        // Filtra pedidos abiertos y añade nombre del proveedor
        this.pedidosAbiertos = pedidos
          .filter((pedido) => this.esPedidoAbierto(pedido))
          .map((pedido) => ({
            ...pedido,
            proveedor: proveedorPorId.get(pedido.id_proveedor) || 'Proveedor sin nombre',
          }));

        const mesActual = new Date().toISOString().slice(0, 7);

        // Carga detalles de cada pedido
        const detallesPorPedido = await Promise.all(
          pedidos.map((pedido) => api.getDetallesPedidoPorPedido(pedido.id_pedido))
        );

        // Normaliza detalles para el mes actual
        const detallesNormalizados = [];
        detallesPorPedido.forEach((response, index) => {
          const pedido = pedidos[index];
          const detalles = response.data || [];

          const fechaCierre = pedido.fecha_cierre ? new Date(pedido.fecha_cierre) : null;
          const cierreMes = fechaCierre ? fechaCierre.toISOString().slice(0, 7) : null;
          const esCierreEsteMes = cierreMes === mesActual;

          detalles.forEach((detalle) => {
            if (!userId || Number(detalle.id_usuario_comprador) !== userId || detalle.cantidad <= 0) {
              return;
            }

            const fechaMod = detalle.fecha_modificacion || '';
            const esModificacionEsteMes = fechaMod.startsWith(mesActual);

            if (!esModificacionEsteMes && !esCierreEsteMes) {
              return;
            }

            const producto = productoPorId.get(detalle.id_producto) || {};

            detallesNormalizados.push({
              id_detalle: detalle.id_detalle,
              id_pedido: detalle.id_pedido,
              id_producto: detalle.id_producto,
              id_usuario_comprador: detalle.id_usuario_comprador,
              nombre: producto.nombre || `Producto #${detalle.id_producto}`,
              imagen: this.normalizarImagen(producto.imagen),
              proveedor: proveedorPorId.get(pedido.id_proveedor) || 'Proveedor sin nombre',
              cantidad: Number(detalle.cantidad),
              precio_unitario: Number(detalle.precio_unitario || 0).toFixed(2),
              total: Number((detalle.precio_unitario || 0) * detalle.cantidad).toFixed(2),
              estado_pedido: pedido.estado,
              pedido_abierto: this.esPedidoAbierto(pedido),
            });
          });
        });

        this.productosMes = detallesNormalizados;

        // Calcula productos pendientes de entrega
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const productosPendientes = [];
        detallesPorPedido.forEach((response, index) => {
          const pedido = pedidos[index];
          const cierre = pedido.fecha_cierre ? new Date(pedido.fecha_cierre) : null;
          cierre?.setHours(0, 0, 0, 0);

          if (!cierre || cierre >= hoy || !['pendiente', 'en proceso'].includes(pedido.estado)) {
            return;
          }

          const detalles = response.data || [];
          detalles.forEach((detalle) => {
            if (!userId || Number(detalle.id_usuario_comprador) !== userId || detalle.cantidad <= 0) {
              return;
            }

            const producto = productoPorId.get(detalle.id_producto) || {};
            productosPendientes.push({
              id_detalle: detalle.id_detalle,
              id_pedido: detalle.id_pedido,
              id_producto: detalle.id_producto,
              id_usuario_comprador: detalle.id_usuario_comprador,
              nombre: producto.nombre || `Producto #${detalle.id_producto}`,
              imagen: this.normalizarImagen(producto.imagen),
              proveedor: proveedorPorId.get(pedido.id_proveedor) || 'Proveedor sin nombre',
              cantidad: Number(detalle.cantidad),
              precio_unitario: Number(detalle.precio_unitario || 0).toFixed(2),
              total: Number((detalle.precio_unitario || 0) * detalle.cantidad).toFixed(2),
              estado_pedido: pedido.estado,
            });
          });
        });

        this.productosPendientesEntrega = productosPendientes;
      } catch (error) {
        if (error.response?.status === 401) {
          this.manejarSesionCaducada();
          return;
        }

        this.errorCarga = 'No se pudo cargar la informacion del dashboard.';
      } finally {
        this.cargando = false;
      }
    },
    // ============================================
    // actualizarUnidades
    // Actualiza la cantidad de un producto en el pedido
    // Parámetros: producto (Object), nuevaCantidad (Number)
    // Retorna: No retorna valor
    // Efectos secundarios: Llama a api.actualizarDetallePedido o api.eliminarDetallePedido
    // ============================================
    async actualizarUnidades(producto, nuevaCantidad) {
      if (!producto.pedido_abierto) {
        alertStore.showAlert('Este pedido ya no esta abierto. No puedes modificar unidades.', 'danger');
        return;
      }

      if (nuevaCantidad < 0) {
        return;
      }

      this.actualizandoDetalleId = producto.id_detalle;

      try {
        if (nuevaCantidad === 0) {
          await api.eliminarDetallePedido(producto.id_detalle);
          this.productosPendientesEntrega = this.productosPendientesEntrega.filter(
            (item) => item.id_detalle !== producto.id_detalle
          );
          alertStore.showAlert(`Has eliminado ${producto.nombre} de tus pendientes.`, 'success');
          return;
        }

        await api.actualizarDetallePedido(producto.id_detalle, {
          cantidad: nuevaCantidad,
        });

        producto.cantidad = nuevaCantidad;
        producto.total = Number(Number(producto.precio_unitario) * nuevaCantidad).toFixed(2);
      } catch (error) {
        if (error.response?.status === 401) {
          this.manejarSesionCaducada();
          return;
        }

        alertStore.showAlert('No se pudieron actualizar las unidades.', 'danger');
      } finally {
        this.actualizandoDetalleId = null;
      }
    },
    // ============================================
    // incrementarUnidades
    // Incrementa en 1 la cantidad de un producto
    // Parámetros: producto (Object) - Producto a incrementar
    // Retorna: No retorna valor
    // Efectos secundarios: Llama a actualizarUnidades
    // ============================================
    async incrementarUnidades(producto) {
      await this.actualizarUnidades(producto, producto.cantidad + 1);
    },
    // ============================================
    // decrementarUnidades
    // Decrementa en 1 la cantidad de un producto
    // Parámetros: producto (Object) - Producto a decrementar
    // Retorna: No retorna valor
    // Efectos secundarios: Llama a actualizarUnidades
    // ============================================
    async decrementarUnidades(producto) {
      await this.actualizarUnidades(producto, producto.cantidad - 1);
    },
    // ============================================
    // onImageError
    // Maneja errores de carga de imágenes mostrando un icono por defecto
    // Parámetros: event (Event) - Evento de error de imagen
    // Retorna: No retorna valor
    // ============================================
    onImageError(event) {
      event.target.src = '/favicon.ico';
    },
  },
};
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.cesta-mensual,
.resumen-financiero,
.pedidos-abiertos {
  margin-bottom: var(--spacing-xl);
}

.resumen-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.resumen-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
}

.resumen-card h4 {
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-xs);
}

.resumen-card .monto {
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin: 0;
}

.resumen-card.deuda { border-left: 4px solid var(--color-danger); }
.resumen-card.cobrar { border-left: 4px solid var(--color-success); }
.resumen-card.gasto { border-left: 4px solid var(--color-secondary); }
.resumen-card.gasto-vencido { border-left: 4px solid var(--color-warning); }

.deudas-lista {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.deuda-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  background: var(--color-bg);
}

.texto-secundario {
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
}

.lista-productos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.producto-card {
  border: 1px solid var(--color-border);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  text-align: center;
}

.lista-pedidos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.pedido-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  background: var(--color-bg);
}

.producto-imagen {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

.cantidad-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.btn-unidad {
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  line-height: 1;
  cursor: pointer;
}

.aviso-edicion {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-sm);
}
</style>
