
const express = require('express');
const swaggerSetup = require('./swagger');

const pool = require('./db');

const usuarioRoutes = require('./routes/usuarioRoutes');
const productoRoutes = require('./routes/productoRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const detallePedidoRoutes = require('./routes/detallePedidoRoutes');

// Solo para testear API
const testRoutes = require('./routes/testRoutes');

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
app.use('/api', testRoutes);


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación de la API: http://localhost:${PORT}/api-docs`);
});