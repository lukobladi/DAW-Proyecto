const express = require('express');
const cors = require('cors');
const path = require('path'); 
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  console.error('JWT_SECRET no está definido en las variables de entorno');
  process.exit(1); // Detén la aplicación si falta la clave secreta
}

const swaggerSetup = require('./swagger');
const validators = require('./middlewares/validators');

const usuarioRoutes = require('./routes/UsuarioRoutes');
const productoRoutes = require('./routes/ProductoRoutes');
const proveedorRoutes = require('./routes/ProveedorRoutes');
const pedidoRoutes = require('./routes/PedidoRoutes');
const detallePedidoRoutes = require('./routes/DetallePedidoRoutes');
const usuarioProveedorRoutes = require('./routes/UsuarioProveedorRoutes');
const pedidoPeriodicoRoutes = require('./routes/PedidoPeriodicoRoutes');
const pagoRoutes = require('./routes/PagoRoutes');
const notificacionRoutes = require('./routes/NotificacionRoutes');
const TestRoutes = require('./routes/TestRoutes'); // Importar las rutas de prueba

const upload = require('./config/multer'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Configura Swagger
swaggerSetup(app);

app.use(express.json());
// Solo permitir conexion desde estos origenes
app.options('*', cors()); // Manejar solicitudes preflight para todas las rutas
app.use(cors({
  origin: [
    'http://localhost:80',
    'http://localhost:3000',
    'http://localhost:8080',
    'http://ekonsumo.duckdns.org',
    'https://ekonsumo.duckdns.org',
    'http://ekonsumo.duckdns.org:8080',
    'http://ekonsumo.duckdns.org:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // Permitir credenciales (cookies, autorización, etc.)
}));


// Usar las rutas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/detalle-pedido', detallePedidoRoutes);
app.use('/api/usuario-proveedor', usuarioProveedorRoutes);
app.use('/api/pedido-periodico', pedidoPeriodicoRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/notificaciones', notificacionRoutes);

app.use('/api/test', TestRoutes); // Usar las rutas de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'API del proyecto de DAW' });
});

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Algo salió mal en el servidor' });
});

// Exportar la app para pruebas
module.exports = app;

// Iniciar el servidor solo si no se está ejecutando en modo de prueba
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Documentación de la API: http://localhost:${PORT}/api-docs`);
  });
}