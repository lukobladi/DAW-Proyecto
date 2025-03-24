const express = require('express');
const cors = require('cors');
const path = require('path'); 

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
const saldoRoutes = require('./routes/SaldoRoutes');

const upload = require('./config/multer'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Configura Swagger
swaggerSetup(app);

//app.use(express.json());
// Solo permitir conexion desde estos origenes
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:8080',
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
app.use('/api/saldos', saldoRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Algo salió mal en el servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación de la API: http://localhost:${PORT}/api-docs`);
});
