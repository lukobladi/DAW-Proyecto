// src/services/api.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL,
  withCredentials: true, // Permitir cookies y credenciales
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; 
  }
  return config;
});

export default {
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
  actualizarUsuario(id, data) {
    return apiClient.put(`/usuarios/actualizar/${id}`, data);
  },
  cambiarEstadoUsuario(id, activo) {
    return apiClient.patch(`/usuarios/activar/${id}`, { activo });
  },
  eliminarUsuario(id) {
    return apiClient.delete(`/usuarios/eliminar/${id}`);
  },

  getProductos() {
    return apiClient.get('/productos/obtenerTodos');
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

  getPedidos() {
    return apiClient.get('/pedidos/obtenerTodos');
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
  enviarNotificacion(data) {
    return apiClient.post('/notificaciones/enviar/', data);
  },
};
