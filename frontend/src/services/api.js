// Servicio para hacer peticiones HTTP al backend
// Usa Axios con un interceptor para anadir el token JWT automaticamente

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL,
  withCredentials: true, // Permitir cookies y credenciales
});

// Interceptor para anadir el token JWT a todas las peticiones
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; 
  }
  return config;
});

// Interceptor para manejar respuestas y errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('authUser');
      
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.dispatchEvent(new CustomEvent('session-expired'));
      }
    }
    return Promise.reject(error);
  }
);

export default {
  // =========== USUARIOS ===========
  login(credentials) {
    return apiClient.post('/usuarios/login', credentials);
  },
  recoverPassword(data) {
    return apiClient.post('/usuarios/recuperar-password', data);
  },
  registrar(data) {
    return apiClient.post('/usuarios/registrar', data);
  },
  getUsuarios() {
    return apiClient.get('/usuarios/obtenerTodos');
  },
  getUsuario(idUsuario) {
    return apiClient.get(`/usuarios/obtener/${idUsuario}`);
  },
  getUsuarioSaldo(idUsuario) {
    return apiClient.get(`/usuarios/obtenerSaldo/${idUsuario}`);
  },
  actualizarUsuario(id, data) {
    return apiClient.put(`/usuarios/actualizar/${id}`, data);
  },
  cambiarEstadoUsuario(id, activo) {
    return apiClient.patch(`/usuarios/activar/${id}`, { activo });
  },
  eliminarUsuario(id) {
    return apiClient.delete(`/usuarios/eliminar/${id}`);
  },

  // =========== PRODUCTOS ===========
  getProductos() {
    return apiClient.get('/productos/obtenerTodos');
  },
  getMisProductos() {
    return apiClient.get('/productos/misProductos');
  },
  crearProducto(formData) {
    return apiClient.post('/productos/crear', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  actualizarProducto(id, formData) {
    return apiClient.put(`/productos/actualizar/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  eliminarProducto(id) {
    return apiClient.delete(`/productos/eliminar/${id}`);
  },
  cambiarEstadoProducto(id, activo) {
    return apiClient.patch(`/productos/cambiarEstadoActivo/${id}`, { activo });
  },

  // =========== PROVEEDORES ===========
  getProveedores() {
    return apiClient.get('/proveedores/obtenerTodos');
  },
  crearProveedor(data) {
    return apiClient.post('/proveedores/crear', data);
  },
  actualizarProveedor(id, data) {
    return apiClient.patch(`/proveedores/actualizar/${id}`, data);
  },
  eliminarProveedor(id) {
    return apiClient.delete(`/proveedores/eliminar/${id}`);
  },
  cambiarEstadoProveedor(id, activo) {
    return apiClient.patch(`/proveedores/cambiarEstadoActivo/${id}`, { activo });
  },

  // =========== USUARIO-PROVEEDOR ===========
  asignarUsuarioProveedor(data) {
    return apiClient.post('/usuario-proveedor/crear', data);
  },
  getUsuariosProveedor(idProveedor) {
    return apiClient.get(`/usuario-proveedor/obtenerUsuariosProveedor/${idProveedor}`);
  },
  eliminarUsuarioProveedor(idUsuario, idProveedor) {
    return apiClient.delete(`/usuario-proveedor/eliminar/${idUsuario}/${idProveedor}`);
  },

  // =========== PEDIDOS ===========
  getPedidos() {
    return apiClient.get('/pedidos/obtenerTodos');
  },
  getMisPedidos() {
    return apiClient.get('/pedidos/misPedidos');
  },
  crearPedido(data) {
    return apiClient.post('/pedidos/crear', data);
  },
  actualizarPedido(id, data) {
    return apiClient.put(`/pedidos/actualizar/${id}`, data);
  },
  eliminarPedido(id) {
    return apiClient.delete(`/pedidos/eliminar/${id}`);
  },
  cambiarEstadoPedido(id, estado) {
    return apiClient.patch(`/pedidos/cambiarEstado/${id}`, { estado });
  },

  // =========== DETALLES DE PEDIDO ===========
  getDetallesPedidoPorPedido(idPedido) {
    return apiClient.get(`/detalle-pedido/pedido/${idPedido}`);
  },
  crearDetallePedido(data) {
    return apiClient.post('/detalle-pedido/crear/', data);
  },
  actualizarDetallePedido(idDetalle, data) {
    return apiClient.put(`/detalle-pedido/actualizar/${idDetalle}`, data);
  },
  eliminarDetallePedido(idDetalle) {
    return apiClient.delete(`/detalle-pedido/eliminar/${idDetalle}`);
  },

  // =========== NOTIFICACIONES ===========
  enviarNotificacion(data) {
    return apiClient.post('/notificaciones/enviar/', data);
  },

  // =========== PAGOS ===========
  getPagos() {
    return apiClient.get('/pagos/obtenerTodos/');
  },
  getPagosPendientesDeudor(idUsuarioDeudor) {
    return apiClient.get(`/pagos/pendientes-deudor/${idUsuarioDeudor}`);
  },
  getPagosPendientesCreditor(idUsuarioCreditor) {
    return apiClient.get(`/pagos/pendientes-creditor/${idUsuarioCreditor}`);
  },
  getResumenPagosMensual(periodo) {
    return apiClient.get('/pagos/resumen-mensual', {
      params: periodo ? { periodo } : {},
    });
  },
  crearPago(data) {
    return apiClient.post('/pagos/crear/', data);
  },
  marcarPagoEnviado(idPago) {
    return apiClient.patch(`/pagos/${idPago}/marcar-pagado`);
  },
  marcarPagoRecibido(idPago) {
    return apiClient.patch(`/pagos/${idPago}/marcar-recibido`);
  },
  generarLiquidacionMensual(periodo) {
    return apiClient.post('/pagos/generar-liquidacion-mensual', periodo ? { periodo } : {});
  },

  // =========== PEDIDOS PERIODICOS ===========
  getPedidosPeriodicos() {
    return apiClient.get('/pedido-periodico/obtenerTodos');
  },
  crearPedidoPeriodico(data) {
    return apiClient.post('/pedido-periodico/crear', data);
  },
  actualizarPedidoPeriodico(id, data) {
    return apiClient.put(`/pedido-periodico/actualizar/${id}`, data);
  },
  eliminarPedidoPeriodico(id) {
    return apiClient.delete(`/pedido-periodico/eliminar/${id}`);
  },
};
