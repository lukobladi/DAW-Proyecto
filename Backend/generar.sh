#!/bin/bash

# Crear directorios
mkdir -p config middlewares controllers models routes

# Crear archivos en config
touch config/db.js config/config.env

# Crear archivos en middlewares
touch middlewares/validators.js

# Crear archivos en controllers
touch controllers/PagoController.js controllers/NotificacionController.js controllers/SaldoController.js

# Crear archivos en models
touch models/Pago.js models/Notificacion.js models/Saldo.js

# Crear archivos en routes
touch routes/PagoRoutes.js routes/NotificacionRoutes.js routes/SaldoRoutes.js

# Crear archivos en la raíz
touch crearBaseDatos.sql datosPrueba.sql db.js index.js package.json swagger.js

# Añadir contenido a los archivos

# middlewares/validators.js
cat <<EOL > middlewares/validators.js
const { body, param, query } = require('express-validator');

const validators = {
  // Validación para crear un usuario
  crearUsuario: [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('correo').isEmail().withMessage('El correo no es válido'),
    body('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  // Validación para crear un pedido
  crearPedido: [
    body('id_usuario_encargado').isInt().withMessage('El ID del usuario encargado debe ser un número'),
    body('id_proveedor').isInt().withMessage('El ID del proveedor debe ser un número'),
    body('fecha_apertura').isISO8601().withMessage('La fecha de apertura debe ser válida'),
    body('fecha_cierre').isISO8601().withMessage('La fecha de cierre debe ser válida'),
    body('fecha_entrega').isISO8601().withMessage('La fecha de entrega debe ser válida'),
    body('estado').isIn(['pendiente', 'en proceso', 'entregado', 'repartido', 'cancelado']).withMessage('Estado no válido'),
  ],
  // Validación para paginación
  paginacion: [
    query('pagina').optional().isInt({ min: 1 }).withMessage('La página debe ser un número mayor a 0'),
    query('limite').optional().isInt({ min: 1 }).withMessage('El límite debe ser un número mayor a 0'),
  ],
};

module.exports = validators;
EOL

# controllers/PagoController.js
cat <<EOL > controllers/PagoController.js
const Pago = require('../models/Pago');

const PagoController = {
  // Crear un nuevo pago
  async crear(req, res) {
    const { id_usuario_deudor, id_usuario_creditor, monto, estado } = req.body;
    try {
      const nuevoPago = await Pago.create(id_usuario_deudor, id_usuario_creditor, monto, estado);
      res.status(201).json(nuevoPago);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al crear el pago');
    }
  },

  // Obtener todos los pagos
  async listar(req, res) {
    try {
      const pagos = await Pago.findAll();
      res.json(pagos);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener los pagos');
    }
  },

  // Cambiar el estado de un pago
  async cambiarEstado(req, res) {
    const { id } = req.params;
    const { estado } = req.body;
    try {
      const pagoActualizado = await Pago.cambiarEstado(id, estado);
      res.json(pagoActualizado);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al cambiar el estado del pago');
    }
  },
};

module.exports = PagoController;
EOL

# controllers/NotificacionController.js
cat <<EOL > controllers/NotificacionController.js
const Notificacion = require('../models/Notificacion');

const NotificacionController = {
  // Enviar una notificación
  async enviar(req, res) {
    const { id_usuario, mensaje } = req.body;
    try {
      const nuevaNotificacion = await Notificacion.enviar(id_usuario, mensaje);
      res.status(201).json(nuevaNotificacion);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al enviar la notificación');
    }
  },

  // Marcar una notificación como leída
  async marcarLeida(req, res) {
    const { id } = req.params;
    try {
      const notificacion = await Notificacion.marcarLeida(id);
      res.json(notificacion);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al marcar la notificación como leída');
    }
  },
};

module.exports = NotificacionController;
EOL

# controllers/SaldoController.js
cat <<EOL > controllers/SaldoController.js
const Saldo = require('../models/Saldo');

const SaldoController = {
  // Calcular el saldo de un usuario
  async calcularSaldo(req, res) {
    const { id_usuario } = req.params;
    try {
      const saldo = await Saldo.calcularSaldo(id_usuario);
      res.json({ saldo });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al calcular el saldo');
    }
  },
};

module.exports = SaldoController;
EOL

# models/Pago.js
cat <<EOL > models/Pago.js
const db = require('../db');

class Pago {
  static async create(id_usuario_deudor, id_usuario_creditor, monto, estado) {
    const query = \`
      INSERT INTO Pago (ID_Usuario_Deudor, ID_Usuario_Creditor, Monto, Estado)
      VALUES (\$1, \$2, \$3, \$4)
      RETURNING *;
    \`;
    const values = [id_usuario_deudor, id_usuario_creditor, monto, estado];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async findAll() {
    const query = \`
      SELECT * FROM Pago;
    \`;
    const { rows } = await db.query(query);
    return rows;
  }

  static async cambiarEstado(id, estado) {
    const query = \`
      UPDATE Pago
      SET Estado = \$1
      WHERE ID_Pago = \$2
      RETURNING *;
    \`;
    const { rows } = await db.query(query, [estado, id]);
    return rows[0];
  }
}

module.exports = Pago;
EOL

# models/Notificacion.js
cat <<EOL > models/Notificacion.js
const db = require('../db');

class Notificacion {
  static async enviar(id_usuario, mensaje) {
    const query = \`
      INSERT INTO Notificacion (ID_Usuario, Mensaje)
      VALUES (\$1, \$2)
      RETURNING *;
    \`;
    const { rows } = await db.query(query, [id_usuario, mensaje]);
    return rows[0];
  }

  static async marcarLeida(id) {
    const query = \`
      UPDATE Notificacion
      SET Leida = TRUE
      WHERE ID_Notificacion = \$1
      RETURNING *;
    \`;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = Notificacion;
EOL

# models/Saldo.js
cat <<EOL > models/Saldo.js
const db = require('../db');

class Saldo {
  static async calcularSaldo(id_usuario) {
    const query = \`
      SELECT SUM(Monto) AS saldo
      FROM Pago
      WHERE ID_Usuario_Deudor = \$1 AND Estado = 'pendiente';
    \`;
    const { rows } = await db.query(query, [id_usuario]);
    return rows[0].saldo || 0;
  }
}

module.exports = Saldo;
EOL

# routes/PagoRoutes.js
cat <<EOL > routes/PagoRoutes.js
const express = require('express');
const PagoController = require('../controllers/PagoController');
const validators = require('../middlewares/validators');

const router = express.Router();

router.post('/', validators.crearPedido, PagoController.crear);
router.get('/', PagoController.listar);
router.put('/:id/cambiar-estado', PagoController.cambiarEstado);

module.exports = router;
EOL

# routes/NotificacionRoutes.js
cat <<EOL > routes/NotificacionRoutes.js
const express = require('express');
const NotificacionController = require('../controllers/NotificacionController');

const router = express.Router();

router.post('/', NotificacionController.enviar);
router.put('/:id/marcar-leida', NotificacionController.marcarLeida);

module.exports = router;
EOL

# routes/SaldoRoutes.js
cat <<EOL > routes/SaldoRoutes.js
const express = require('express');
const SaldoController = require('../controllers/SaldoController');

const router = express.Router();

router.get('/:id_usuario', SaldoController.calcularSaldo);

module.exports = router;
EOL

# index.js
cat <<EOL > index.js
const express = require('express');
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
app.use('/api/pagos', pagoRoutes);
app.use('/api/notificaciones', notificacionRoutes);
app.use('/api/saldos', saldoRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

app.listen(PORT, () => {
  console.log(\`Servidor corriendo en http://localhost:\${PORT}\`);
  console.log(\`Documentación de la API: http://localhost:\${PORT}/api-docs\`);
});
EOL

# swagger.js
cat <<EOL > swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API del Grupo de Consumo',
      version: '1.0.0',
      description: 'Documentación de la API para la gestión del grupo de consumo local y ecológico',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
EOL

# package.json
cat <<EOL > package.json
{
  "name": "grupo-consumo-api",
  "version": "1.0.0",
  "description": "API para la gestión de un grupo de consumo local y ecológico",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "pg": "^8.7.1",
    "swagger-jsdoc": "^6.1.0",
    "swagger-ui-express": "^4.1.6",
    "express-validator": "^6.14.2"
  },
  "devDependencies": {
    "nodemon": "^2.0.12"
  }
}
EOL

echo "Estructura de archivos y contenido generado exitosamente."
