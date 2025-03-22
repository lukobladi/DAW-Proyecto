
const express = require('express');
const swaggerSetup = require('./swagger');

const usuarioRoutes = require('./routes/UsuarioRoutes');
const productoRoutes = require('./routes/ProductoRoutes');
const proveedorRoutes = require('./routes/ProveedorRoutes');
const pedidoRoutes = require('./routes/PedidoRoutes');
const detallePedidoRoutes = require('./routes/DetallePedidoRoutes');
const usuarioProveedorRoutes = require('./routes/UsuarioProveedorRoutes');
const pedidoPeriodicoRoutes = require('./routes/PedidoPeriodicoRoutes');

// Solo para testear API
const testRoutes = require('./routes/TestRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configura Swagger
swaggerSetup(app);  

app.use(express.json());


// Usar las rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/detalle-pedido', detallePedidoRoutes);
app.use('/api/usuario-proveedor', usuarioProveedorRoutes);
app.use('/api/pedido-periodico', pedidoPeriodicoRoutes);

app.use('/api', testRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack); // Log del error en la consola
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación de la API: http://localhost:${PORT}/api-docs`);
});
