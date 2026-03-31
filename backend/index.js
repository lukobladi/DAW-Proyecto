// Fichero principal del backend
// Configura Express, middlewares, rutas y arranca el servidor

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ quiet: process.env.NODE_ENV === 'test' });
const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  console.error('JWT_SECRET no esta definido en las variables de entorno');
  process.exit(1);
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
const TestRoutes = require('./src/routes/TestRoutes');

const upload = require('./src/config/multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy para que express-rate-limit funcione correctamente detrás de nginx
app.set('trust proxy', 1);

// Middleware para parsear JSON (DEBE ir antes de las rutas)
app.use(express.json());

// Rate limiting (ANTES de las rutas)
const rateLimit = require('express-rate-limit');
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);
if (process.env.NODE_ENV !== 'test' && RATE_LIMIT_MAX > 0) {
  app.use(
    '/api/',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: RATE_LIMIT_MAX,
      validate: { xForwardedForHeader: false },
      standardHeaders: true,
      legacyHeaders: false,
    })
  );
}

// Configuración CORS
const corsOptions = process.env.NODE_ENV === 'production'
  ? {
      origin: [
        'http://ekonsumo.duckdns.org',
        'https://ekonsumo.duckdns.org',
        'http://localhost:8080',
        'http://localhost:80',
        'http://localhost:3000'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }
  : {
      origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    };

app.use(cors(corsOptions));

// Middleware para manejar preflight OPTIONS manualmente
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }
  next();
});

// Configuro Swagger
swaggerSetup(app);

// Servir archivos estáticos (imágenes subidas)
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
    cors: 'Configurado correctamente',
    allowedOrigins: ['http://ekonsumo.duckdns.org', 'http://localhost:8080'],
  });
});

// =========== MANEJO DE ERRORES ===========

app.use((err, req, res, next) => {
  console.error('========================================');
  console.error('Error en la petición:', req.method, req.originalUrl);
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('========================================');

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

// Exporto la app para poder hacer tests
module.exports = app;

// Arranco el servidor solo si no estoy en modo test
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Documentacion de la API: http://localhost:${PORT}/api-docs`);
  });
}
