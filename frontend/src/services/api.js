// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://ekonsumo.duckdns.org:3000/api', // Cambia esto si es necesario
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
  actualizarUsuario(id, data) {
    return apiClient.put(`/usuarios/actualizar/${id}`, data);
  },
  eliminarUsuario(id) {
    return apiClient.delete(`/usuarios/eliminar/${id}`);
  },








  
  // Ejemplo de métodos para interactuar con la API
  getProductos() {
    return apiClient.get('/productos');
  },
  crearProducto(formData) {
    return apiClient.post('/productos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  actualizarProducto(id, formData) {
    return apiClient.put(`/productos/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  eliminarProducto(id) {
    return apiClient.delete(`/productos/${id}`);
  },
  getCestaMensual() {
    return apiClient.get('/cesta-mensual');
  },
  getDetallesPedido(pedidoId) {
    return apiClient.get(`/pedidos/${pedidoId}`);
  },

};