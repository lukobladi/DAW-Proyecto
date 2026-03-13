// Fichero principal del backend
// Configura Express, middlewares, rutas y arranca el servidor

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ quiet: process.env.NODE_ENV === 'test' });
const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  console.error('JWT_SECRET no esta definido en las variables de entorno');
  process.exit(1); // Se para la aplicacion si falta la clave secreta
}

const swaggerSetup = require('./swagger');
const validators = require('./src/middlewares/validators');

const usuarioRoutes = require('./src/routes/UsuarioRoutes');
const productoRoutes = require('./src/routes/ProductoRoutes');
const proveedorRoutes = require('./src/routes/ProveedorRoutes');
const pedidoRoutes = require('./src/routes/PedidoRoutes');
const detallePedidoRoutes = require('./src/routes/DetallePedidoRoutes');
const usuarioProveedorRoutes = require('./src/routes/UsuarioProveedorRoutes');
const pedidoPeriodicoRoutes = require('./src/routes/PedidoPeriodicoRoutes');
const pagoRoutes = require('./src/routes/PagoRoutes');
const notificacionRoutes = require('./src/routes/NotificacionRoutes');
const TestRoutes = require('./src/routes/TestRoutes'); // Rutas de prueba

const upload = require('./src/config/multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuracion de CORS para desarrollo (localhost)
const corsOptions = {
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Middleware CORS tiene que ir PRIMERO
app.use(cors(corsOptions));

// Middleware para manejar preflight OPTIONS manualmente (compatible con Express 5)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header(
      'Access-Control-Allow-Origin',
      req.headers.origin || 'http://localhost:8080'
    );
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With'
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }
  next();
});

// Configuro Swagger para la documentacion de la API
swaggerSetup(app);

// Middleware para parsear JSON en el body de las peticiones
app.use(express.json());

// Servir archivos estaticos (imagenes subidas)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =========== RUTAS DE LA API ===========

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/detalle-pedido', detallePedidoRoutes);
app.use('/api/usuario-proveedor', usuarioProveedorRoutes);
app.use('/api/pedido-periodico', pedidoPeriodicoRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/notificaciones', notificacionRoutes);

app.get('/api', (req, res) => {
  res.json({
    message: 'API del proyecto de DAW',
    cors: 'Configurado correctamente para desarrollo',
    allowedOrigins: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  });
});

// =========== MANEJO DE ERRORES ===========

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Algo salio mal en el servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Ruta 404 para API no encontrada
app.use(/^\/api\//, (req, res) => {
  res.status(404).json({
    error: 'Ruta de API no encontrada',
    path: req.originalUrl,
    method: req.method,
  });
});

// Rate limiting para prevenir ataques de fuerza bruta
const rateLimit = require('express-rate-limit');
if (process.env.NODE_ENV !== 'test') {
  app.use(
    '/api/',
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // Maximo 100 peticiones por ventana
    })
  );
}

// Exporto la app para poder hacer tests
module.exports = app;

// Arranco el servidor solo si no estoy en modo test
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Documentacion de la API: http://localhost:${PORT}/api-docs`);
  });
}
