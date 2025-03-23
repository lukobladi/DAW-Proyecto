// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // URL de tu backend
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default {
  // Ejemplo de métodos para interactuar con la API
  getUsuarios() {
    return apiClient.get('/usuarios');
  },
  getProductos() {
    return apiClient.get('/productos');
  },
  // Más métodos aquí
};