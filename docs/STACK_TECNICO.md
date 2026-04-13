# Arquitectura Técnica del Sistema Ekonsumo

## Documentación Técnica Exhaustiva del Stack Tecnológico

---

**Versión:** 1.0  
**Fecha:** Abril 2026  
**Proyecto:** Ekonsumo - Sistema de Gestión de Grupos de Consumo  
**Tipo de documento:** Documentación Técnica / Arquitectura  

---

> **Público objetivo:** Desarrolladores con conocimientos básicos de programación que no están familiarizados con las herramientas específicas de este stack. El documento está diseñado para ser educativo, progresivo y exhaustivo.

---

# Tabla de Contenidos

1. [Introducción al Stack](#1-introducción-al-stack)
2. [Backend: Análisis de Dependencias de Producción](#2-backend-análisis-de-dependencias-de-producción)
3. [Frontend: Análisis de Dependencias de Producción](#3-frontend-análisis-de-dependencias-de-producción)
4. [Entorno de Desarrollo: Tooling](#4-entorno-de-desarrollo-tooling)
5. [Ecosistema de Pruebas y Calidad](#5-ecosistema-de-pruebas-y-calidad)
6. [Conclusión: Cómo Interactúan las Piezas](#6-conclusión-cómo-interactúan-las-piezas)

---

# 1. Introducción al Stack

## 1.1 Visión General del Monorepo

Ekonsumo es un **monorepo** (repositorio único que contiene múltiples proyectos relacionados) estructurado usando **Workspaces de npm**. Esta arquitectura permite gestionar dos proyectos independientes pero relacionados —el backend y el frontend— desde una única raíz de repositorio, compartiendo dependencias y facilitando el desarrollo coordinado.

```
daw-proyecto/
├── package.json              # Raíz del monorepo (workspaces)
├── backend/                  # workspace "ekonsumo-backend"
│   ├── package.json
│   ├── index.js              # Punto de entrada Express
│   ├── swagger.js            # Configuración Swagger
│   └── src/
│       ├── config/           # Configuraciones (DB, logger, multer)
│       ├── controllers/      # Lógica de manejo de solicitudes HTTP
│       ├── models/           # Acceso a datos y lógica de negocio
│       ├── routes/           # Definición de endpoints API
│       ├── middlewares/      # Funciones intermedias de procesamiento
│       ├── services/         # Servicios externos (email)
│       └── jobs/             # Scripts CLI para tareas periódicas
├── frontend/                 # workspace "ekonsumo-frontend"
│   ├── package.json
│   ├── vite.config.mjs       # Configuración de Vite
│   └── src/
│       ├── assets/           # Recursos estáticos (CSS, imágenes)
│       ├── components/       # Componentes Vue reutilizables
│       ├── directives/       # Directivas Vue personalizadas
│       ├── router/           # Configuración de rutas
│       ├── services/         # Cliente API (axios)
│       ├── store/            # Estado global (Pinia)
│       └── views/            # Páginas/Vistas de la aplicación
└── docs/                     # Documentación del proyecto
```

### ¿Por qué un Monorepo?

**Ventajas prácticas observadas en este proyecto:**

1. **Gestión de dependencias unificada**: Un único `package-lock.json` evita conflictos de versiones entre backend y frontend
2. **Scripts centralizados**: El `package.json` raíz permite ejecutar comandos como `npm run start:backend` o `npm run test:frontend` desde la raíz
3. **Consistencia de código**: Un único repositorio facilita compartir convenciones y revisar cambios transversales
4. **Despliegue simplificado**: El servidor puede clonar un único repositorio y ejecutar ambas aplicaciones

---

## 1.2 Arquitectura Cliente-Servidor

Ekonsumo sigue la **arquitectura cliente-servidor clásica de aplicaciones web**, con la particularidad de que el cliente es una **Aplicación de Página Única (SPA)** construida con Vue 3.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              NAVEGADOR WEB                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         FRONTEND (Vue 3 + SPA)                       │   │
│  │   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐     │   │
│  │   │  Views   │◄──►│  Store   │◄──►│  Router  │───►│  Axios   │     │   │
│  │   │ (Pages)  │    │ (Pinia)  │    │          │    │ (HTTP)   │     │   │
│  │   └──────────┘    └──────────┘    └──────────┘    └────┬─────┘     │   │
│  └──────────────────────────────────────────────────────────┼───────────┘   │
└──────────────────────────────────────────────────────────────┼───────────────┘
                                                               │ HTTP/REST
                                                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SERVIDOR (Backend)                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        EXPRESS.JS (API REST)                         │   │
│  │   ┌─────────────────────────────────────────────────────────────┐   │   │
│  │   │                      MIDDLEWARES                             │   │   │
│  │   │  cors → rate-limit → express.json → auth → validators        │   │   │
│  │   └─────────────────────────────────────────────────────────────┘   │   │
│  │   ┌───────────┐    ┌───────────┐    ┌───────────┐                  │   │
│  │   │  Routes   │───►│ Controllers│◄───│  Models   │                  │   │
│  │   └───────────┘    └───────────┘    └───────────┘                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    POSTGRESQL (Base de Datos)                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1.3 Responsabilidades de Cada Capa

### Backend (Express.js + Node.js)

El backend de Ekonsumo actúa como una **API RESTful** y asume las siguientes responsabilidades:

| Responsabilidad | Descripción |
|----------------|-------------|
| **Recepción de solicitudes HTTP** | Escuchar y procesar peticiones de los clientes |
| **Autenticación** | Verificar la identidad del usuario mediante JWT |
| **Autorización** | Verificar permisos basados en roles (admin/gestor/usuario) |
| **Validación** | Asegurar que los datos recibidos cumplen con los requisitos |
| **Lógica de negocio** | Procesar pedidos, calcular liquidaciones, gestionar usuarios |
| **Acceso a datos** | Consultar y modificar la base de datos PostgreSQL |
| **Logging** | Registrar eventos y errores para monitoreo |
| **Comunicación externa** | Enviar emails a usuarios |
| **Tareas automatizadas** | Generar pedidos periódicos y liquidaciones mensuales |

### Frontend (Vue 3 + Vite)

El frontend asume las responsabilidades de la **capa de presentación**:

| Responsabilidad | Descripción |
|----------------|-------------|
| **Renderizado de interfaces** | Mostrar páginas y componentes visuales |
| **Gestión de estado local** | Mantener datos temporales de la UI |
| **Gestión de estado global** | Mantener estado compartido (usuario autenticado, alertas) |
| **Navegación** | Cambiar vistas sin recargar la página |
| **Comunicación con API** | Realizar solicitudes HTTP al backend |
| **Manejo de errores de red** | Detectar tokens expirados y redirigir a login |

---

## 1.4 Flujo de Datos Típico

Para entender cómo fluye la información en Ekonsumo, describimos el proceso completo de un caso de uso común: **Listar todos los productos disponibles**.

```
Usuario navega a "Gestión de Productos"
         │
         ▼
┌────────────────────────┐
│ Vue Router detecta     │
│ cambio de ruta         │
│ /gestion-productos     │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Component mounted,     │
│ hook created()        │
│ llama cargarProductos()│
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Axios GET /api/productos│
│ Header: Bearer <JWT>   │
└───────────┬────────────┘
            │ HTTP Request
            ▼
┌────────────────────────┐
│ Express recibe        │
│ Pipeline: CORS →      │
│ RateLimit → Auth →    │
│ Route Handler         │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Controller llama a    │
│ Producto.obtenerTodos()│
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Model ejecuta SQL:     │
│ SELECT * FROM producto│
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ PostgreSQL devuelve    │
│ array de productos     │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Response JSON 200     │
│ [ {...}, {...} ]      │
└───────────┬────────────┘
            │ HTTP Response
            ▼
┌────────────────────────┐
│ Axios interceptor     │
│ recibe respuesta      │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ this.productos =      │
│ response.data         │
│ Vue detecta cambio    │
│ y re-renderiza DOM   │
└────────────────────────┘
            │
            ▼
    Tabla actualizada
```

---

# 2. Backend: Análisis de Dependencias de Producción

El backend de Ekonsumo está construido sobre **Node.js** (entorno de ejecución JavaScript del lado del servidor) y utiliza **Express.js** como framework web.

## Dependencias 

| Paquete | Versión | Propósito Principal |
|---------|---------|---------------------|
| express | ^5.2.1 | Framework web y sistema de routing |
| pg | ^8.20.0 | Cliente PostgreSQL con pool de conexiones |
| jsonwebtoken | ^9.0.3 | Autenticación mediante tokens JWT |
| bcryptjs | ^3.0.3 | Hash de contraseñas |
| winston | ^3.19.0 | Logging estructurado |
| nodemailer | ^8.0.3 | Envío de correos electrónicos |
| multer | ^2.1.1 | Manejo de subida de archivos |
| express-validator | ^7.3.1 | Validación de solicitudes HTTP |
| express-rate-limit | ^8.3.1 | Limitación de tasa de solicitudes |
| cors | ^2.8.6 | Configuración de CORS |
| swagger-jsdoc | ^6.2.8 | Generación de especificación OpenAPI |
| swagger-ui-express | ^5.0.1 | Interfaz visual de documentación API |
| dotenv | ^17.3.1 | Carga de variables de entorno |

---

## 2.1 Express.js - El Framework Web Minimalista

### ¿Qué es Express.js?

**Express.js** es un **framework web minimalista y rápido** para Node.js. Proporciona una capa delgada de funcionalidades fundamentales sobre las capacidades base de Node.js, específicamente orientadas a la construcción de aplicaciones web y APIs.

Express no es un framework "todo-en-uno" como Django (Python) o Laravel (PHP). En su lugar, sigue el principio de **"microframework"**: proporciona únicamente lo esencial (routing, middlewares, manejo de errores) y deja al desarrollador la libertad de elegir qué otras librerías necesita.

### Justificación: ¿Por qué Express y no vanilla Node.js?

**Sin Express (Node.js puro):**
```javascript
// Routing manual mediante if/else
const server = http.createServer((req, res) => {
  if (parsedUrl.pathname === '/api/productos' && req.method === 'GET') {
    // Manejar GET...
  } else if (parsedUrl.pathname === '/api/productos' && req.method === 'POST') {
    // Manejar POST...
  }
  // Imagine 50+ endpoints...
});
```

**Con Express:**
```javascript
// Routing declarativo
app.get('/api/productos', productoController.listar);
app.post('/api/productos', productoController.crear);
```

### Concepto Clave: El Pipeline de Middlewares

Un **middleware** es una función que recibe `req`, `res` y `next`. Puede ejecutar código, modificar objetos, y continuar o detener el pipeline.

```
Solicitud HTTP
      │
      ▼
┌─────────────────────┐
│   MIDDLEWARE 1      │ → CORS (configura headers)
│   next()            │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   MIDDLEWARE 2      │ → Rate Limiting (verifica límites)
│   next() / 429      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   MIDDLEWARE 3      │ → Auth (verifica JWT)
│   next() / 401      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   ROUTE HANDLER     │ → Lógica específica
└─────────────────────┘
```

### Ejemplo Real: Configuración del Pipeline

```javascript
// backend/index.js

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Rate Limiting (primero, protege el servidor)
if (process.env.NODE_ENV !== 'test' && RATE_LIMIT_MAX > 0) {
  app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: RATE_LIMIT_MAX,
  }));
}

// CORS (permite peticiones desde el frontend)
const corsOptions = process.env.NODE_ENV === 'production'
  ? { origin: ['http://ekonsumo.duckdns.org', 'http://localhost:8080'], credentials: true }
  : { origin: ['http://localhost:8080'], credentials: true };
app.use(cors(corsOptions));

// Parsear JSON
app.use(express.json());

// Rutas de la API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/productos', productoRoutes);

// Manejo de errores (al final)
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
```

---

## 2.2 PostgreSQL con pg - Acceso Nativo a Base de Datos

### ¿Qué es PostgreSQL?

**PostgreSQL** es un **sistema de gestión de bases de datos relacional (RDBMS)** de código abierto, considerado uno de los más avanzados del mundo. Soporta SQL completo, transacciones ACID, claves foráneas, y tipos de datos complejos (JSON, arrays, rangos).

### ¿Qué es el paquete `pg`?

El paquete `pg` (node-postgres) es el **cliente PostgreSQL más popular para Node.js**. Ekonsumo usa el **Pool mode**, que mantiene un grupo de conexiones abiertas que se reutilizan, evitando el costo de crear nuevas conexiones para cada solicitud.

### Concepto Clave: El Pool de Conexiones

Sin pool: cada request crea una nueva conexión (lento). Con pool: las conexiones se reutilizan.

```javascript
// backend/src/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20,                      // Máximo 20 conexiones simultáneas
  idleTimeoutMillis: 30000,     // Cerrar inactivas después de 30s
  connectionTimeoutMillis: 2000, // Error si no hay conexión en 2s
});

module.exports = pool;
```

### Ejemplo de Query en un Model

```javascript
// backend/src/models/Producto.js
const pool = require('../config/db');

const Producto = {
  async obtenerTodos() {
    const query = `
      SELECT p.*, pr.nombre as proveedor_nombre
      FROM producto p
      JOIN proveedor pr ON p.id_proveedor = pr.id_proveedor
      WHERE p.activo = true
      ORDER BY p.nombre ASC;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  async crear({ nombre, precio, id_proveedor }) {
    const query = `
      INSERT INTO producto (nombre, precio, id_proveedor, fecha_creacion)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [nombre, precio, id_proveedor]);
    return rows[0];
  },
};

module.exports = Producto;
```

### Ejemplo Avanzado: CTE para Liquidación Mensual

```javascript
// Liquidación mensual con CTEs (Common Table Expressions)
static async generarLiquidacionMensual(periodo) {
  const query = `
    WITH resumen AS (
      SELECT
        d.id_usuario_comprador AS id_usuario_deudor,
        p.id_usuario_encargado AS id_usuario_creditor,
        ROUND(SUM(d.cantidad * d.precio_unitario)::numeric, 2) AS monto
      FROM detalle_pedido d
      JOIN pedido p ON p.id_pedido = d.id_pedido
      WHERE d.cantidad > 0
        AND p.estado <> 'cancelado'
        AND date_trunc('month', COALESCE(p.fecha_cierre, p.fecha_apertura))
            = date_trunc('month', $1::date)
      GROUP BY d.id_usuario_comprador, p.id_usuario_encargado
    )
    INSERT INTO pago (id_usuario_deudor, id_usuario_creditor, monto, periodo, origen)
    SELECT r.id_usuario_deudor, r.id_usuario_creditor, r.monto, $2, 'liquidacion_mensual'
    FROM resumen r
    ON CONFLICT (id_usuario_deudor, id_usuario_creditor, periodo, origen)
    DO UPDATE SET monto = EXCLUDED.monto
    RETURNING *;
  `;
  const { rows } = await db.query(query, [periodoDate, periodoDate]);
  return { total_registros: rows.length, registros: rows };
}
```

---

## 2.3 JWT y bcryptjs - Autenticación y Autorización

### ¿Qué es JWT (JSON Web Token)?

JWT es un estándar abierto (RFC 7519) para crear **tokens de acceso** que permiten transmitir información segura entre dos partes. Un JWT tiene tres partes:

```
header.payload.signature
xxxxx.yyyyy.zzzzz
```

| Parte | Contenido | Propósito |
|-------|-----------|-----------|
| **Header** | `{"alg": "HS256", "typ": "JWT"}` | Metadatos del algoritmo |
| **Payload** | `{"id_usuario": 1, "rol": "admin"}` | Datos (claims) |
| **Signature** | `HMACSHA256(header + "." + payload, secret)` | Verifica que no fue manipulado |

### Flujo de Autenticación

```
FASE 1: LOGIN
Cliente → POST /api/usuarios/login { correo, password }
Servidor verifica credenciales, genera JWT
Servidor devuelve { token: "eyJhbGciOiJIUzI1NiIs..." }

FASE 2: USO
Cliente → GET /api/recurso
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

FASE 3: VERIFICACIÓN
Middleware auth.js:
1. Extrae token del header
2. jwt.verify(token, SECRET)
3. Adjunta decoded a req.user
4. next()
```

### Ejemplo Real: Login y Generación de Token

```javascript
// backend/src/controllers/UsuarioController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async login(req, res) {
  const { correoOMovil, password } = req.body;

  try {
    const user = await Usuario.findByEmailOrMobile(correoOMovil);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Verificar contraseña con bcrypt
    const validPassword = await bcrypt.compare(password, user.pass);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Generar JWT
    const token = jwt.sign(
      { id_usuario: user.id_usuario, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, user: { id_usuario: user.id_usuario, nombre: user.nombre, rol: user.rol } });

  } catch (err) {
    logger.error('Error en login:', err);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
}
```

### ¿Qué es bcryptjs?

bcryptjs implementa el algoritmo de hash **bcrypt**, considerado el estándar para contraseñas:

1. **Resistente a rainbow tables**: Usa "sal" aleatoria
2. **Cost factor configurable**: Permite hacer el hash más lento ( противостоит fuerza bruta)
3. **Actualizable**: Si se descubre vulnerabilidad, se puede re-hashear

```javascript
// Hashing de contraseña
const hashedPassword = await bcrypt.hash(password, 10); // 10 = cost factor

// Verificación
const validPassword = await bcrypt.compare(password, hash);
```

### Middlewares de Autorización

```javascript
// backend/src/middlewares/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no encontrado' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id_usuario, rol }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
```

```javascript
// backend/src/middlewares/admin.js
module.exports = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).send('Acceso denegado: No tienes permisos de administrador');
  }
  next();
};
```

---

## 2.4 express-validator - Validación Robusta de Solicitudes

### ¿Qué es express-validator?

**express-validator** proporciona **middlewares** para validar y sanitizar datos de solicitudes HTTP (body, params, query). Permite encadenar múltiples validaciones de forma declarativa.

### Ejemplo Real: Validadores de Usuario

```javascript
// backend/src/middlewares/validators.js
const { body } = require('express-validator');

const validators = {
  login: [
    body('correoOMovil').notEmpty().trim().escape(),
    body('password').notEmpty(),
  ],

  crearUsuario: [
    body('nombre').notEmpty().isLength({ min: 2, max: 100 }).trim().escape(),
    body('correo').notEmpty().isEmail().normalizeEmail(),
    body('password')
      .isLength({ min: 6, max: 100 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    body('rol').optional().isIn(['admin', 'usuario', 'gestor']),
  ],

  crearProducto: [
    body('nombre').notEmpty().isLength({ min: 2, max: 100 }).trim().escape(),
    body('precio').notEmpty().isFloat({ min: 0.01, max: 999999.99 }),
    body('id_proveedor').notEmpty().isInt({ min: 1 }),
  ],
};

module.exports = validators;
```

### Middleware de Validación

```javascript
// backend/src/middlewares/validar.js
const { validationResult } = require('express-validator');

const validar = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      message: 'Error de validación',
      errors: errores.array().map(err => err.msg),
    });
  }
  next();
};

module.exports = validar;
```

### Uso en Rutas

```javascript
// backend/src/routes/UsuarioRoutes.js
router.post(
  '/registrar',
  validators.crearUsuario,
  validar,
  UsuarioController.registrar
);

router.patch(
  '/activar/:id',
  authMiddleware,
  adminMiddleware,
  validators.cambiarEstadoUsuario,
  validar,
  UsuarioController.cambiarEstadoActivo
);
```

---

## 2.5 cors y express-rate-limit - Seguridad en Capas

### ¿Qué es CORS?

**CORS (Cross-Origin Resource Sharing)** es un mecanismo de seguridad de los navegadores que **restringe solicitudes HTTP** a un dominio diferente al que sirvió la página. CORS permite al servidor especificar qué orígenes (dominios) están autorizados.

```javascript
// backend/index.js
const corsOptions = process.env.NODE_ENV === 'production'
  ? { origin: ['http://ekonsumo.duckdns.org', 'http://localhost:8080'], credentials: true }
  : { origin: ['http://localhost:8080'], credentials: true };

app.use(cors(corsOptions));
```

### ¿Qué es express-rate-limit?

**express-rate-limit** limita el número de solicitudes que un cliente (IP) puede hacer en un período de tiempo, protegiendo contra ataques DoS y fuerza bruta.

```javascript
// backend/index.js
if (process.env.NODE_ENV !== 'test' && RATE_LIMIT_MAX > 0) {
  app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: RATE_LIMIT_MAX,       // Máximo 100 requests por ventana
  }));
}
```

Con `RATE_LIMIT_MAX=100`: máximo 100 requests en ventanas de 15 minutos. Request #101 recibe **429 Too Many Requests**.

---

## 2.6 Winston - Logging Estructurado

### ¿Qué es Winston?

**Winston** es la librería de logging más popular para Node.js. Proporciona logging centralizado con múltiples niveles y destinos (transports).

### ¿Por qué no console.log?

```
CONSOLE.LOG: No tiene niveles, no tiene timestamps, no se puede desactivar en producción.

WINSTON:
- Niveles: error, warn, info, debug
- Timestamps automáticos
- Múltiples transports (archivo + consola)
- Formato JSON para agregación
```

### Ejemplo Real: Configuración

```javascript
// backend/src/config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'ekonsumo-backend' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

module.exports = logger;
```

### Uso en Controllers

```javascript
// backend/src/controllers/UsuarioController.js
const logger = require('../config/logger');

async registrar(req, res) {
  try {
    const nuevoUsuario = await Usuario.create(...);
    logger.info('Usuario registrado', { userId: nuevoUsuario.id_usuario });
    res.status(201).json(nuevoUsuario);
  } catch (err) {
    logger.error('Error al registrar usuario:', { error: err.message, stack: err.stack });
    res.status(500).send('Error al registrar');
  }
}
```

---

## 2.7 Nodemailer - Comunicación por Email

### ¿Qué es Nodemailer?

**Nodemailer** es una librería para Node.js que facilita el envío de correos electrónicos a través de SMTP.

### Ejemplo Real: Servicio de Email

```javascript
// backend/src/services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const emailService = {
  async enviarNotificacionPedido(destinatario, datosPedido) {
    const mailOptions = {
      from: `"Ekonsumo" <${process.env.SMTP_FROM}>`,
      to: destinatario,
      subject: `Pedido #${datosPedido.id} - ${datosPedido.estado}`,
      html: `<h2>¡Hola ${datosPedido.nombre_usuario}!</h2>
             <p>Tu pedido <strong>#${datosPedido.id}</strong> ha sido actualizado.</p>`,
    };
    return transporter.sendMail(mailOptions);
  },
};

module.exports = emailService;
```

---

## 2.8 Multer - Gestión de Archivos Subidos

### ¿Qué es Multer?

**Multer** es un middleware para Express que maneja `multipart/form-data` (el tipo de formulario para subir archivos).

### Ejemplo Real: Configuración

```javascript
// backend/src/config/multer.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Tipo de archivo no permitido'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
});

module.exports = upload;
```

### Uso en Rutas

```javascript
// backend/src/routes/ProductoRoutes.js
router.post(
  '/crear',
  authMiddleware,
  upload.single('imagen'), // 'imagen' = name del input file
  ProductoController.crear
);
```

---

## 2.9 Swagger - Documentación Automatizada de APIs

### ¿Qué es Swagger/OpenAPI?

**Swagger** (OpenAPI) es un estándar para documentar APIs RESTful en JSON/YAML. **Swagger UI** genera una interfaz visual interactiva.

### Ejemplo Real: Configuración

```javascript
// backend/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Ekonsumo API', version: '1.0.0', description: 'API REST para Ekonsumo' },
    servers: [{ url: 'http://localhost:3000', description: 'Desarrollo' }],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } }
    },
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
```

### Anotaciones JSDoc

```javascript
// backend/src/routes/UsuarioRoutes.js
/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Autenticar un usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correoOMovil: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/login', validators.login, validar, UsuarioController.login);
```

Swagger UI disponible en `http://localhost:3000/api-docs`.

---

## 2.10 dotenv - Gestión de Configuración

### ¿Qué es dotenv?

**dotenv** carga variables de entorno desde un archivo `.env` al `process.env` de Node.js.

### Ejemplo de .env

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=ekonsumo_user
DB_PASSWORD=mi_password_secreto
DB_NAME=ekonsumo_db

# JWT
JWT_SECRET=cadena_muy_larga_y_aleatoria

# Rate Limiting
RATE_LIMIT_MAX=100

# Entorno
NODE_ENV=development
PORT=3000
```

### Carga en Ekonsumo

```javascript
// backend/index.js
require('dotenv').config({ quiet: process.env.NODE_ENV === 'test' });

// Ahora se puede usar:
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
```

**IMPORTANTE**: El archivo `.env` NUNCA debe commitearse a git. Solo se commitea `.env.example` (plantilla sin valores reales).

---

## Resumen de la Sección 2: Backend

| Dependencia | Concepto Clave |
|-------------|----------------|
| Express | Pipeline de middlewares |
| pg | Pool de conexiones |
| jsonwebtoken | Tokens firmados (payload + firma) |
| bcryptjs | Salt y cost factor |
| express-validator | Chains de validación |
| cors | Whitelist de orígenes |
| express-rate-limit | Ventanas de tiempo |
| winston | Transportes y niveles |
| nodemailer | Transporte SMTP |
| multer | multipart/form-data |
| swagger-jsdoc | Anotaciones JSDoc → OpenAPI |
| dotenv | Variables de entorno |

---

# 3. Frontend: Análisis de Dependencias de Producción

El frontend de Ekonsumo está construido con **Vue 3**, usando un conjunto de dependencias para crear una experiencia moderna y mantenible.

## Dependencias Identificadas

| Paquete | Versión | Propósito Principal |
|---------|---------|---------------------|
| vue | ^3.5.30 | Framework de UI |
| pinia | ^3.0.4 | Gestión de estado |
| vue-router | ^5.0.3 | Navegación SPA |
| axios | ^1.13.6 | Cliente HTTP |
| bootstrap | ^5.3.8 | Framework CSS |
| @popperjs/core | ^2.11.8 | Posicionamiento de tooltips |
| bootstrap-icons | ^1.13.1 | Iconos SVG |

---

## 3.1 Vue 3 - El Framework Progresivo

### ¿Qué es Vue 3?

**Vue.js** es un framework JavaScript progresivo para construir interfaces de usuario. "Progresivo" significa que puedes usarlo desde una simple mejora de página hasta una SPA completa.

Vue 3 trajo:
- **Composition API**: Nueva forma de escribir componentes más flexible
- **Performance mejorado**: Virtual DOM más rápido
- **TypeScript nativo**: Mejor soporte desde el core
- **Teleport, Fragments, Suspense**: Nuevas características

### Justificación: ¿Por qué Vue 3?

| Aspecto | Vue 3 | React | Angular |
|---------|-------|-------|---------|
| Curva de aprendizaje | Suave | Media | Pronunciada |
| Documentación | Excelente | Buena | Buena |
| Flexibilidad | Media | Alta | Baja (full-stack) |
| Ecosistema Vue | Bueno | Excelente | Bueno |

### Concepto Clave: Sistema de Componentes y Reactividad

Vue usa un **modelo de componentes** donde cada pieza de la UI es un componente reutilizable con estado y lógica encapsuladas.

```
APP (Raíz)
├── NavBar
├── RouterView
│   ├── GestionProductosPage
│   │   └── TablaProductos
│   └── GestionPedidosPage
│       └── ModalCrearPedido
└── FooterBar
```

### Ejemplo Real: Componente Vue con Options API

```vue
<!-- frontend/src/views/GestionProductosPage.vue -->

<template>
  <div class="gestion-productos-page">
    <div class="page-header">
      <h2>Gestión de Productos</h2>
      <button v-if="isAdmin" class="btn btn-primary" @click="mostrarModalCrear">
        Nuevo Producto
      </button>
    </div>

    <div v-if="cargando" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Proveedor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producto in productos" :key="producto.id_producto">
            <td>{{ producto.nombre }}</td>
            <td>{{ producto.precio }}€</td>
            <td>{{ producto.stock }} {{ producto.unidad }}</td>
            <td>{{ producto.proveedor_nombre }}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary" @click="editarProducto(producto)">
                Editar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import { useAuthStore } from '@/store';
import { alertStore } from '@/store/alertStore';

export default {
  name: 'GestionProductosPage',

  data() {
    return {
      productos: [],
      cargando: true,
      productoEditando: null,
    };
  },

  computed: {
    isAdmin() {
      return useAuthStore().user?.rol === 'admin';
    },
  },

  created() {
    this.cargarProductos();
  },

  methods: {
    async cargarProductos() {
      this.cargando = true;
      try {
        const response = await api.getProductos();
        this.productos = response.data;
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        this.cargando = false;
      }
    },

    editarProducto(producto) {
      this.productoEditando = { ...producto };
    },
  },
};
</script>

<style scoped>
.gestion-productos-page { padding: 1.5rem; }
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
</style>
```

### Reactividad en Profundidad

La **reactividad** es la capacidad de Vue de mantener el DOM sincronizado con los datos automáticamente:

```javascript
// Vue 3 usa Proxies para reactividad
const datos = reactive({
  nombre: 'Ana',
  precio: 10,
});

datos.nombre = 'Juan'; // Vue detecta y actualiza el DOM automáticamente
```

Cuando asignas a una propiedad reactiva, Vue detecta el cambio y busca TODOS los lugares del template que dependen de esa propiedad, actualizando SOLO esos nodos del DOM.

---

## 3.2 Pinia - Gestión de Estado Reactivo

### ¿Qué es Pinia?

**Pinia** es la librería oficial de gestión de estado para Vue 3. Un "state management" es un **almacén centralizado** para datos compartidos entre componentes.

### ¿Qué problema resuelve?

```
SIN PINIA:
NavBar → Layout → Page → Component1
                    → Component2
                    → Component3
El usuario autenticado tiene que pasar por 4+ niveles de props.

CON PINIA:
Cualquier componente puede acceder DIRECTAMENTE al store.
```

### Ejemplo Real: Store de Autenticación

```javascript
// frontend/src/store/index.js
import { defineStore } from 'pinia';
import { createPinia } from 'pinia';

const pinia = createPinia();

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: {
      id_usuario: null,
      nombre: null,
      correo: null,
      rol: null,
    },
    stateRestored: false,
    loading: true,
  }),

  getters: {
    isAdmin: (state) => state.user?.rol === 'admin',
    canManage: (state) => state.user?.rol === 'admin' || state.user?.rol === 'gestor',
    displayName: (state) => state.user?.nombre || state.user?.correo || 'Usuario',
  },

  actions: {
    login(payload = {}) {
      const { token, user } = payload;
      if (!token || !user) return false;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', user.rol);
      localStorage.setItem('authUser', JSON.stringify(user));

      this.isAuthenticated = true;
      this.user = { ...user };
      return true;
    },

    logout() {
      this.isAuthenticated = false;
      this.user = { id_usuario: null, nombre: null, correo: null, rol: null };
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('authUser');
    },

    hydrateAuthState() {
      const token = localStorage.getItem('authToken');
      const userJson = localStorage.getItem('authUser');

      if (!token || !userJson) {
        this.loading = false;
        return;
      }

      try {
        const user = JSON.parse(userJson);
        if (isTokenExpired(token)) {
          this.logout();
          return;
        }
        this.isAuthenticated = true;
        this.user = user;
      } catch (e) {
        this.logout();
      } finally {
        this.loading = false;
        this.stateRestored = true;
      }
    },
  },
});

export default pinia;
```

### Ejemplo Real: Alert Store (reactive() directamente)

```javascript
// frontend/src/store/alertStore.js
import { reactive } from 'vue';

export const alertStore = reactive({
  message: '',
  type: '',
  timeoutId: null,

  showAlert(message, type = 'success', duration = 2000) {
    this.message = message;
    this.type = type;

    if (this.timeoutId) clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => {
      this.clearAlert();
    }, duration);
  },

  clearAlert() {
    this.message = '';
    this.type = '';
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  },
});
```

---

## 3.3 Vue Router - Navegación en Aplicaciones SPA

### ¿Qué es Vue Router?

**Vue Router** es el enrutador oficial de Vue.js. Permite crear **SPAs** donde la navegación no causa recarga del navegador, sino que Vue Router intercambia el contenido dinámicamente.

### SPA vs Multipage

```
PÁGINA TRADICIONAL:
Usuario click → Navegador envía request → Servidor genera HTML → Recarga completa

CON VUE ROUTER:
Usuario click → Vue Router detecta cambio de ruta → Busca componente → Intercambia SOLO el contenido de <RouterView>
```

### Ejemplo Real: Configuración de Rutas

```javascript
// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store';

import HomePage from '@/views/HomePage.vue';
import LoginPage from '@/views/LoginPage.vue';
import DashboardPage from '@/views/DashboardPage.vue';
import GestionUsuariosPage from '@/views/GestionUsuariosPage.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: LoginPage, meta: { requiresGuest: true } },
  { path: '/dashboard', name: 'Dashboard', component: DashboardPage, meta: { requiresAuth: true } },
  { path: '/gestion-usuarios', name: 'GestionUsuarios', component: GestionUsuariosPage, meta: { requiresAuth: true, requiresAdmin: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de navegación global
router.beforeEach((to, from) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem('authToken');

  if (isTokenExpired(token) && token) {
    authStore.logout();
  }

  const isAuthenticated = authStore.isAuthenticated;
  const isAdmin = authStore.user?.rol === 'admin';

  // Redirigir a login si requiere auth y no está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } };
  }

  // Redirigir a dashboard si es admin requerido y no es admin
  if (to.meta.requiresAdmin && !isAdmin) {
    return { name: 'Dashboard' };
  }

  return true;
});

export default router;
```

### Concepto: Guards de Navegación

```javascript
router.beforeEach((to, from) => {
  // Se ejecuta ANTES de cada navegación
  // Return:
  //   true  → Permite la navegación
  //   '/login' → Redirige a esa ruta
  //   false → Cancela la navegación
});
```

---

## 3.4 Axios - Cliente HTTP Declarativo

### ¿Qué es Axios?

**Axios** es una librería JavaScript para hacer solicitudes HTTP. Es un cliente HTTP basado en promesas con API declarativa.

### ¿Por qué Axios y no fetch nativo?

| Aspecto | Axios | fetch |
|---------|-------|-------|
| API | Declarativa, intuitiva | Verbosa, bajo nivel |
| Transformación JSON | Automática | Manual |
| Interceptors | Soportados | No |
| Manejo errores | Consistente | Inconsistente |

### Ejemplo Real: Cliente API con Interceptores

```javascript
// frontend/src/services/api.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

// Interceptor: añade token JWT a todas las peticiones
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: maneja errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      if (window.location.pathname !== '/login') {
        window.dispatchEvent(new CustomEvent('session-expired'));
      }
    }
    return Promise.reject(error);
  }
);

export default {
  login(credentials) { return apiClient.post('/usuarios/login', credentials); },
  getUsuarios() { return apiClient.get('/usuarios/obtenerTodos'); },
  getProductos() { return apiClient.get('/productos/obtenerTodos'); },
  crearProducto(formData) {
    return apiClient.post('/productos/crear', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getPedidos() { return apiClient.get('/pedidos/obtenerTodos'); },
};
```

### Punto de Entrada del Frontend

```javascript
// frontend/src/main.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@/assets/styles/global.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './store';
import { autoblur } from './directives/autoblur';

const app = createApp(App);

app.use(pinia);
app.use(router);
app.directive('autoblur', autoblur);

app.mount('#app');
```

---

## 3.5 Bootstrap 5, Popper.js y Bootstrap Icons

### Bootstrap 5

**Bootstrap** es un framework CSS que proporciona:
- Sistema de grid responsive
- Componentes pre-construidos (botones, cards, modals, tables)
- Utilidades de spacing y typography
- JavaScript para interacciones (dropdowns, modals, tooltips)

Ekonsumo usa Bootstrap para mantener un diseño consistente sin escribir CSS desde cero.

### @popperjs/core

**Popper.js** es la librería que Bootstrap usa para posicionar elementos flotantes (dropdowns, popovers, tooltips). Hace que estos elementos se posicionen correctamente respecto a su ancla.

### bootstrap-icons

**Bootstrap Icons** es una biblioteca de iconos SVG coherente con Bootstrap. Ekonsumo los usa para iconografía consistente:

```html
<i class="bi bi-person-circle"></i>
<i class="bi bi-box-seam"></i>
<i class="bi bi-cart-plus"></i>
```

---

## 3.6 Resumen de la Arquitectura Frontend

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vue 3 + Vite)                      │
│                                                                 │
│  main.js                                                         │
│    ├── createApp(App)                                          │
│    ├── app.use(pinia)  → State management                       │
│    ├── app.use(router) → Navegación                            │
│    └── app.directive('autoblur') → Directivas                  │
│                                                                 │
│  App.vue                                                         │
│    ├── NavBar.vue (siempre visible)                            │
│    ├── <RouterView /> (contenido dinámico según ruta)          │
│    └── FooterBar.vue (siempre visible)                         │
│                                                                 │
│  Components                                                      │
│    ├── useAuthStore() → Usuario autenticado                    │
│    ├── alertStore.showAlert() → Notificaciones                  │
│    └── api.getProductos() → Comunicación con backend           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

# 4. Entorno de Desarrollo: Tooling

El tooling son las herramientas que facilitan el desarrollo, no las que forman parte de la aplicación final (son devDependencies).

## 4.1 Vite - El Build Tool Moderno

### ¿Qué es Vite?

**Vite** (del francés "rápido") es un build tool y dev server para proyectos web modernos. Creado por Evan You (el mismo creator de Vue), fue diseñado desde cero para aprovechar las características modernas de los navegadores.

### ¿Por qué Vite y no Webpack?

| Aspecto | Vite | Webpack |
|---------|------|---------|
| Arquitectura | ESM nativo en dev | Bundle todo en dev |
| Velocidad cold start | ~100ms | ~10-30s en proyectos grandes |
| Hot Module Replacement | Instantáneo | Rápido pero con bundle overhead |
| Configuración | Mínima | Compleja |
| Plugin ecosystem | Creciendo | Muy maduro |

### Concepto Clave: HMR y ESM Nativo

```
webpack (antiguo):
1. Analiza todo el proyecto
2. Crea un bundle único
3. Sirve el bundle
4. Si cambias 1 archivo → recrea TODO el bundle

vite (moderno):
1. Sirve archivos ESM individuales directamente
2. El navegador pide solo lo que necesita
3. Si cambias 1 archivo → solo recargga ESE archivo (HMR)
```

### Ejemplo Real: Configuración de Vite

```javascript
// frontend/vite.config.mjs
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],

  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.js'],
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    port: 8080,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: 'dist',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          bootstrap: ['bootstrap'],
        },
      },
    },
  },
});
```

### Scripts de npm para Vite

```json
{
  "scripts": {
    "dev": "vite",                    // Iniciar dev server
    "build": "vite build",            // Build para producción
    "build:dev": "vite build --mode development",
    "build:prod": "vite build --mode production",
    "preview": "vite preview",        // Preview del build
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint . --ext .vue,.js --fix"
  }
}
```

---

## 4.2 ESLint - Calidad y Consistencia del Código

### ¿Qué es ESLint?

**ESLint** es una herramienta de linting para JavaScript que analiza el código estáticamente y encuentra patrones problemáticos. Detecta:
- Errores de sintaxis
- Variables no usadas
- Conventions de código
- Bugs potenciales

### ¿Por qué ESLint?

```javascript
// SIN ESLint: Este código tiene varios problemas
const x = 1
function foo(){
  for(var i=0;i<10;i++){
    console.log(i)
  }
}

// CON ESLint: Te avisa automáticamente
// - 'x' is assigned a value but never used
// - Missing semicolons
// - Unexpected var, use let or const
```

### Plugins en Ekonsumo Backend

```javascript
// backend/eslint.config.js
module.exports = {
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'prettier',  // Desactiva reglas que conflictúan con Prettier
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn',
    'no-console': 'off', // Permitir console en backend
  },
};
```

### Plugins en Ekonsumo Frontend

```json
{
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "eslint": "^10.0.3",
    "eslint-plugin-vue": "^10.8.0",
    "globals": "^17.4.0"
  }
}
```

### Uso

```bash
npm run lint          # Verificar (frontend)
npm run lint:backend  # Verificar (backend)
```

---

## 4.3 Prettier - Formateo Automatizado

### ¿Qué es Prettier?

**Prettier** es un formateador de código opinado que asegura consistencia estilística en todo el proyecto.

### Diferencia entre ESLint y Prettier

| Aspecto | ESLint | Prettier |
|---------|--------|----------|
| Propósito | Detectar errores y bugs | Formatear código |
| ¿Qué analiza? | Código | Estilo (espacios, comas, etc.) |
| ¿Cambia código? | No (solo avisa) | Sí (lo reformatea) |
| ¿Compatible con el otro? | Sí (plugin eslint-config-prettier) |

### Ejemplo de Conflictos Resueltos

```javascript
// ESLint quiere: semicolon, single quote
// Prettier quiere: no semicolon, double quote

// eslint-config-prettier desactiva las reglas de estilo de ESLint
// Prettier tiene la última palabra sobre estilos
// ESLint se enfoca en lógica/bugs
```

---

## 4.4 Sass - Potenciando el CSS

### ¿Qué es Sass?

**Sass** (Syntactically Awesome Style Sheets) es un preprocesador CSS que extiende CSS con:
- **Variables**: Reutilizar valores
- **Nesting**: Anidar selectores
- **Mixins**: Bloques reutilizables de CSS
- **Partials e imports**: Modularidad

### Ejemplo de Sass

```scss
// Variables
$primary-color: #2c7a7b;
$secondary-color: #38b2ac;
$font-stack: 'Avenir', Helvetica, Arial, sans-serif;

// Mixin
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// Nesting
.navbar {
  background-color: $primary-color;

  .nav-link {
    color: white;

    &:hover {
      color: $secondary-color;
    }
  }
}

// Uso
.header {
  @include flex-center;
  font-family: $font-stack;
}
```

### Compilación a CSS

Vite (a través de plugins) compila automáticamente los archivos `.scss` a CSS válido que los navegadores entienden.

---

# 5. Ecosistema de Pruebas y Calidad

## 5.1 Backend: Jest + supertest

### ¿Qué es Jest?

**Jest** es un test runner de Facebook (ahora Meta) popularizado por React pero usado en todo el ecosistema JavaScript. Proporciona:
- Test runner con parallel execution
- Mocking integrado
- Coverage reporting
- Watch mode para desarrollo

### ¿Qué es supertest?

**supertest** es una librería que permite hacer solicitudes HTTP a Express sin necesidad de un servidor real. Ideal para tests de integración de APIs.

### Ejemplo Real: Test de Ruta

```javascript
// backend/tests/routes/usuarioRoutes.test.js
const request = require('supertest');
const app = require('../../index');

describe('POST /api/usuarios/login', () => {
  it('should return 401 for invalid credentials', async () => {
    const response = await request(app)
      .post('/api/usuarios/login')
      .send({ correoOMovil: 'invalid@test.com', password: 'wrong' })
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toHaveProperty('message');
  });

  it('should return 400 for missing fields', async () => {
    const response = await request(app)
      .post('/api/usuarios/login')
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('message', 'Error de validación');
  });
});
```

### Ejemplo Real: Test de Model

```javascript
// backend/tests/models/usuarioModel.test.js
const pool = require('../../src/config/db');

describe('Usuario Model', () => {
  beforeAll(async () => {
    // Setup: crear usuario de test
  });

  afterAll(async () => {
    // Cleanup: eliminar usuario de test
    await pool.end();
  });

  describe('findByEmailOrMobile', () => {
    it('should find user by email', async () => {
      const user = await Usuario.findByEmailOrMobile('test@test.com');
      expect(user).toBeDefined();
      expect(user.correo).toBe('test@test.com');
    });

    it('should return undefined for non-existent email', async () => {
      const user = await Usuario.findByEmailOrMobile('nonexistent@test.com');
      expect(user).toBeUndefined();
    });
  });
});
```

### Configuración de Jest

```javascript
// backend/jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/jobs/**', '!src/index.js'],
  coverageDirectory: 'coverage',
  verbose: true,
  runInBand: true, // Ejecutar secuencialmente (para tests de BD)
  setupFilesAfterEnv: ['./tests/setup.js'],
};
```

### Scripts de npm para Testing

```json
{
  "scripts": {
    "test": "NODE_ENV=test jest --runInBand",
    "test:watch": "NODE_ENV=test jest --watchAll",
    "test:coverage": "NODE_ENV=test jest --coverage --runInBand"
  }
}
```

---

## 5.2 Frontend: Vitest + jsdom + @vue/test-utils

### ¿Qué es Vitest?

**Vitest** es un test runner creado por el equipo de Vite, diseñado para integrarse perfectamente con proyectos Vite. Es:
- Compatible con Jest API (misma sintaxis)
- Más rápido que Jest (usa HMR engine de Vite)
- Soporta ESM nativo

### ¿Qué es jsdom?

**jsdom** es una implementación de navegador en JavaScript puro. Crea un DOM virtual para que los tests puedan ejecutar código que espera un navegador (como `document.querySelector()`).

### ¿Qué es @vue/test-utils?

**@vue/test-utils** es la librería oficial de testing para Vue 3. Proporciona funciones para:
- Montar componentes Vue en tests
- Simular interacciones de usuario
- Acceder y verificar el output del componente

### Ejemplo Real: Test de Pinia Store

```javascript
// frontend/src/store/index.test.js
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from './index';

describe('useAuthStore', () => {
  beforeEach(() => {
    // Crear un pinia fresco antes de cada test
    setActivePinia(createPinia());
    localStorage.clear();
  });

  describe('login', () => {
    it('should set authenticated state', () => {
      const authStore = useAuthStore();

      authStore.login({
        token: 'valid.jwt.token',
        user: { id_usuario: 1, nombre: 'Test', correo: 'test@test.com', rol: 'admin' },
      });

      expect(authStore.isAuthenticated).toBe(true);
      expect(authStore.user.nombre).toBe('Test');
      expect(localStorage.getItem('authToken')).toBe('valid.jwt.token');
    });
  });

  describe('logout', () => {
    it('should clear auth state', () => {
      const authStore = useAuthStore();

      authStore.login({ token: 'test', user: { id_usuario: 1, nombre: 'Test', rol: 'user' } });
      authStore.logout();

      expect(authStore.isAuthenticated).toBe(false);
      expect(authStore.user.id_usuario).toBeNull();
    });
  });
});
```

### Ejemplo Real: Test de Alert Store

```javascript
// frontend/src/store/alertStore.test.js
import { alertStore } from './alertStore';

describe('alertStore', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    alertStore.clearAlert();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('showAlert', () => {
    it('should set message and type', () => {
      alertStore.showAlert('Test message', 'success');

      expect(alertStore.message).toBe('Test message');
      expect(alertStore.type).toBe('success');
    });

    it('should auto-clear after duration', () => {
      alertStore.showAlert('Test', 'success', 2000);

      expect(alertStore.message).toBe('Test');

      jest.advanceTimersByTime(2000);

      expect(alertStore.message).toBe('');
      expect(alertStore.type).toBe('');
    });
  });
});
```

### Configuración de Vitest

```javascript
// frontend/vite.config.mjs
export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom', // Simula el DOM del navegador
    include: ['src/**/*.test.js'],
  },
});
```

### Scripts de npm para Testing Frontend

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

---

## 5.3 Estrategia de Testing Recomendada

### Pirámide de Testing

```
           ┌─────────────┐
           │     E2E     │  ← Pocas, críticas
           │   (Cypress) │
           ├─────────────┤
           │  Integración│  ← Algunas, fluxos completos
           │  (Vitest)   │
           ├─────────────┤
           │   Unitarios │  ← Muchas, componentes aislados
           │   (Vitest)  │
           └─────────────┘
```

### Recomendaciones para Ekonsumo

1. **Unit tests** para:
   - Stores de Pinia (authStore, alertStore)
   - Funciones utilitarias
   - Validadores

2. **Integration tests** para:
   - Rutas API completas (supertest)
   - Controllers
   - Models con base de datos real (usando transactions)

3. **E2E tests** (opcional para futuro):
   - Flujos críticos: login → crear pedido → logout
   - Uso de Cypress o Playwright

---

# 6. Conclusión: Cómo Interactúan las Piezas

## 6.1 Diagrama de Arquitectura Integrada

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              NAVEGADOR WEB                                  │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                        FRONTEND (Vue 3 + Vite)                          │ │
│  │                                                                         │ │
│  │   ┌──────────────────────────────────────────────────────────────────┐  │ │
│  │   │                         Vue Components                            │  │ │
│  │   │                                                                  │  │ │
│  │   │   Views (Pages)          Components     Directives               │  │ │
│  │   │   ├─ HomePage            ├─ NavBar      ├─ v-autoblur            │  │ │
│  │   │   ├─ LoginPage           └─ FooterBar                           │  │ │
│  │   │   ├─ DashboardPage                                              │  │ │
│  │   │   └─ ...                                                        │  │ │
│  │   │                                                                  │  │ │
│  │   └──────────────────────────────────────────────────────────────────┘  │ │
│  │                                  │                                        │ │
│  │   ┌──────────────────────────────┴──────────────────────────────┐        │ │
│  │   │                    PINIA (State Management)                 │        │ │
│  │   │  ┌─────────────────┐       ┌─────────────────┐             │        │ │
│  │   │  │   authStore     │       │   alertStore    │             │        │ │
│  │   │  │  ├─ isAuth      │       │  ├─ message     │             │        │ │
│  │   │  │  ├─ user        │       │  ├─ type        │             │        │ │
│  │   │  │  └─ actions:    │       │  └─ showAlert() │             │        │ │
│  │   │  │     login()     │       │                 │             │        │ │
│  │   │  │     logout()   │       │                 │             │        │ │
│  │   │  └─────────────────┘       └─────────────────┘             │        │ │
│  │   └───────────────────────────────────────────────────────────┘        │ │
│  │                                  │                                        │ │
│  │   ┌──────────────────────────────┴──────────────────────────────┐        │ │
│  │   │                     VUE ROUTER                             │        │ │
│  │   │  ┌──────────────────────────────────────────────────────┐  │        │ │
│  │   │  │                   Navigation Guards                   │  │        │ │
│  │   │  │  beforeEach → requiresAuth? → redirect to /login    │  │        │ │
│  │   │  │            → requiresAdmin? → redirect to /dashboard│  │        │ │
│  │   │  └──────────────────────────────────────────────────────┘  │        │ │
│  │   └───────────────────────────────────────────────────────────┘        │ │
│  │                                  │                                        │ │
│  │   ┌──────────────────────────────┴──────────────────────────────┐        │ │
│  │   │                       AXIOS (HTTP Client)                  │        │ │
│  │   │  ┌──────────────────────────────────────────────────────┐  │        │ │
│  │   │  │              Request Interceptor                      │  │        │ │
│  │   │  │  config.headers['Authorization'] = `Bearer ${token}` │  │        │ │
│  │   │  └──────────────────────────────────────────────────────┘  │        │ │
│  │   │  ┌──────────────────────────────────────────────────────┐  │        │ │
│  │   │  │              Response Interceptor                    │  │        │ │
│  │   │  │  if (status === 401) → dispatch 'session-expired'   │  │        │ │
│  │   │  └──────────────────────────────────────────────────────┘  │        │ │
│  │   └───────────────────────────────────────────────────────────┘        │ │
│  │                                                                          │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/REST + JSON + JWT
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              SERVIDOR (Backend)                               │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                         EXPRESS.JS (API REST)                              │ │
│  │                                                                          │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                       MIDDLEWARE PIPELINE                            │ │ │
│  │  │                                                                     │ │ │
│  │  │   1. express-rate-limit  →  ¿Too many requests? → 429              │ │ │
│  │  │   2. cors               →  ¿Origin permitido? → CORS headers         │ │ │
│  │  │   3. express.json()    →  Parsear body a JSON                      │ │ │
│  │  │   4. /uploads static   →  Servir imágenes                          │ │ │
│  │  │                                                                     │ │ │
│  │  └────────────────────────────────────────────────────────────────────┘ │ │
│  │                                    │                                      │ │
│  │  ┌─────────────────────────────────┴─────────────────────────────────┐   │ │
│  │  │                         ROUTES                                    │   │ │
│  │  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐        │   │ │
│  │  │  │/usuarios  │  │/pedidos   │  │/productos │  │/pagos     │        │   │ │
│  │  │  │  Routes   │  │  Routes   │  │  Routes   │  │  Routes   │        │   │ │
│  │  │  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘        │   │ │
│  │  │        │              │              │              │               │   │ │
│  │  └────────┼──────────────┼──────────────┼──────────────┼───────────────┘   │ │
│  │           │              │              │              │                   │ │
│  │  ┌────────┴──────────────┴──────────────┴──────────────┴───────────┐      │ │
│  │  │                     CONTROLLERS                                 │      │ │
│  │  │  ┌─────────────────────────────────────────────────────────┐    │      │ │
│  │  │  │                    MIDDLEWARES                          │    │      │ │
│  │  │  │                                                         │    │      │ │
│  │  │  │   authMiddleware → ¿JWT válido? → req.user = decoded   │    │      │ │
│  │  │  │   adminMiddleware → ¿Es admin? → 403 si no           │    │      │ │
│  │  │  │   validar       → ¿Body válido? → 400 si no          │    │      │ │
│  │  │  │                                                         │    │      │ │
│  │  │  └─────────────────────────────────────────────────────────┘    │      │ │
│  │  │                                                              │      │ │
│  │  │   UsuarioController  PedidoController  ProductoController     │      │ │
│  │  │   ├─ login()        ├─ listar()         ├─ listar()          │      │ │
│  │  │   ├─ registrar()    ├─ crear()          ├─ crear()          │      │ │
│  │  │   └─ ...            └─ ...              └─ ...              │      │ │
│  │  │                                                              │      │ │
│  │  └──────────────────────────────────────────────────────────────┘      │ │
│  │                                    │                                      │ │
│  │  ┌─────────────────────────────────┴─────────────────────────────────┐  │ │
│  │  │                         MODELS (pg Pool)                           │  │ │
│  │  │                                                                      │  │ │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐                │  │ │
│  │  │  │Usuario  │  │Pedido   │  │Producto │  │  Pago   │                │  │ │
│  │  │  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘                │  │ │
│  │  │       │            │            │            │                      │  │ │
│  │  │       └────────────┴────────────┴────────────┘                      │  │ │
│  │  │                         │                                           │  │ │
│  │  │              ┌──────────┴──────────┐                               │  │ │
│  │  │              │     POOL DE BD      │                               │  │ │
│  │  │              │  max: 20 conexiones │                               │  │ │
│  │  │              └──────────┬──────────┘                               │  │ │
│  │  │                         │                                          │  │ │
│  │  └─────────────────────────┼──────────────────────────────────────────┘  │ │
│  │                            │                                             │ │
│  │  ┌─────────────────────────┴──────────────────────────────────────────┐  │ │
│  │  │                     WINSTON (Logging)                               │  │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │  │ │
│  │  │  │ error.log  │  │combined.log │  │  Console    │                  │  │ │
│  │  │  │  (errores) │  │  (todo)     │  │  (dev only) │                  │  │ │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘                  │  │ │
│  │  └────────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                          │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                      JOBS (Tareas Periódicas)                      │ │ │
│  │  │  ┌─────────────────────────┐  ┌─────────────────────────┐         │ │ │
│  │  │  │ generarLiquidacion     │  │ generarPedidos         │         │ │ │
│  │  │  │ Mensual (mensual)       │  │ Periodicos (diario)    │         │ │ │
│  │  │  │ npm run liquidacion     │  │ npm run pedidos        │         │ │ │
│  │  │  └─────────────────────────┘  └─────────────────────────┘         │ │ │
│  │  │                                                                     │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                          │ │
│  │  ┌────────────────────────────────────────────────────────────────────┐ │ │
│  │  │                      SWAGGER (Documentación)                        │ │ │
│  │  │  http://localhost:3000/api-docs                                     │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                          │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                          │
│                                    ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────────────┐ │
│  │                     POSTGRESQL (Base de Datos)                          │ │
│  │                                                                          │ │
│  │  Tablas:                                                                │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │ │
│  │  │ usuario  │  │ pedido   │  │ producto │  │ proveedor │               │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘               │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │ │
│  │  │  pago    │  │notificac.│  │det_pedido│  │ped_period│               │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘               │ │
│  │                                                                          │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## 6.2 Flujo Completo de una Solicitud

### Escenario: Usuario autenticado lista productos

```
1. NAVEGACIÓN
   Usuario hace clic en "Gestión de Productos"
   
2. VUE ROUTER
   Router detecta path '/gestion-productos'
   Verifica meta.requiresAuth → authStore.isAuthenticated?
   Verifica meta.requiresGestorOrAdmin → authStore.user.rol?
   → Pasa validaciones → Monta GestionProductosPage.vue

3. COMPONENT MOUNTED
   created() hook ejecuta this.cargarProductos()

4. AXIOS REQUEST
   api.getProductos()
   → Interceptor añade Bearer token
   → GET http://localhost:3000/api/productos/obtenerTodos

5. EXPRESS PIPELINE
   Rate Limit: ¿IP tiene requests disponibles?
   CORS: ¿Origin permitido?
   express.json(): Parsear headers
   Route '/api/productos' → PedidoRoutes

6. MIDDLEWARE CHAIN
   authMiddleware: ¿JWT válido? → req.user = { id_usuario, rol }
   adminOrGestor: ¿rol admin o gestor?
   → Pasa → Controller.listar()

7. MODEL/POSTGRESQL
   pool.query('SELECT * FROM producto...')
   → PostgreSQL devuelve rows
   → Model devuelve array de productos

8. RESPONSE
   Controller → res.status(200).json(productos)
   Express → HTTP 200 OK

9. AXIOS RESPONSE
   Interceptor recibe respuesta
   → response.data = array de productos

10. VUE REACTIVITY
    this.productos = response.data
    Vue detecta cambio en 'productos'
    Vue re-renderiza tabla automáticamente

11. UI ACTUALIZADA
    Tabla con productos visible para el usuario
```

---

## 6.3 Seguridad en Capas Múltiples

```
┌─────────────────────────────────────────────────────────────────┐
│                    SEGURIDAD EN CAPAS                           │
│                                                                 │
│  CAPA 1: RED                                                   │
│  ├── HTTPS (TLS/SSL) - Cifrado en tránsito                     │
│  └── Firewalls - Filtrado de tráfico                          │
│                                                                 │
│  CAPA 2: APLICACIÓN (Express)                                  │
│  ├── CORS - Whitelist de orígenes permitidos                   │
│  ├── Rate Limiting - Máximo requests/ventana                   │
│  ├── Helmet - Headers de seguridad HTTP                        │
│  └── express.json() - Validación de Content-Type              │
│                                                                 │
│  CAPA 3: AUTENTICACIÓN                                         │
│  ├── JWT - Tokens firmados criptográficamente                 │
│  ├── bcrypt - Contraseñas hasheadas con salt                  │
│  └── Expiración - Tokens expiran (1h)                         │
│                                                                 │
│  CAPA 4: AUTORIZACIÓN                                          │
│  ├── Middleware admin - Solo admins                           │
│  ├── Middleware gestor - Gestores con proveedores              │
│  └── Nivel de fila - Productos pertenecen a proveedores       │
│                                                                 │
│  CAPA 5: VALIDACIÓN                                            │
│  ├── express-validator - Sanitización de inputs              │
│  ├── SQL parametrizados - Previene SQL injection              │
│  └── Multer - Validación de archivos subidos                  │
│                                                                 │
│  CAPA 6: DATOS                                                 │
│  ├── PostgreSQL - Integridad referencial (FK)                │
│  ├── Transacciones - Consistencia ACID                       │
│  └── Backups - Recuperación ante desastres                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6.4 Mantenibilidad y Escalabilidad

### Factores que Mejoran el Mantenimiento

1. **Arquitectura clara**: Separación precisa de responsabilidades
2. **Convenciones de código**: ESLint + Prettier = código consistente
3. **Documentación**: Swagger UI + comentarios JSDoc
4. **Testing**: Coverage para detectar regressions
5. **Logging**: Winston para debugging en producción
6. **Variables de entorno**: dotenv para configuración sin código

### Factores que Mejoran la Escalabilidad

1. **Stateless**: JWT permite añadir instancias sin estado compartido
2. **Pool de conexiones**: PostgreSQL maneja múltiples conexiones eficientemente
3. **Monorepo**: Fácil añadir microservicios si es necesario
4. **Frontend分开**: Vue SPA reduce carga en el servidor
5. **API REST**: Cualquier cliente (web, móvil, IoT) puede consumir

### Hoja de Ruta Tecnológica

| Área | Actual | Futuro Potencial |
|------|--------|------------------|
| Frontend | Vue 3 Options API | Vue 3 Composition API + TypeScript |
| State | Pinia | Pinia + persistence |
| HTTP | Axios | Fetch API nativo (menos dependencias) |
| CSS | Bootstrap 5 + Sass | Tailwind CSS o CSS Modules |
| Testing | Vitest/Jest | Playwright (E2E) |
| API | REST | GraphQL o tRPC |
| DB | PostgreSQL | PostgreSQL + Redis cache |

---

## Resumen Final

El stack tecnológico de Ekonsumo representa una **elección equilibrada** entre modernidad, productividad y mantenibilidad:

### Backend (Node.js + Express + PostgreSQL)

- **Express** proporciona un framework minimalista pero extensible
- **pg** ofrece acceso directo a PostgreSQL con pool de conexiones para eficiencia
- **JWT + bcrypt** proporcionan autenticación y contraseña seguros
- **express-validator + rate-limit + cors** añaden capas de seguridad
- **Winston + Swagger** facilitan operación y documentación
- **Jest + supertest** permiten testing automatizado

### Frontend (Vue 3 + Pinia + Vite)

- **Vue 3** ofrece un framework progresivo con reactividad automática
- **Pinia** gestiona estado global de forma sencilla
- **Vue Router** permite SPA con guards de navegación
- **Axios** facilita comunicación HTTP con interceptores
- **Bootstrap 5** acelera desarrollo de UI
- **Vite** proporciona experiencia de desarrollo moderna y rápida
- **Vitest + jsdom** permiten testing de componentes

### Juntas

Esta arquitectura permite:
- **Desarrollo rápido** gracias a herramientas maduras y bien integradas
- **Código mantenible** mediante convenciones y documentación
- **Aplicación escalable** con JWT stateless y pooling de conexiones
- **Seguridad robusta** mediante múltiples capas de protección
- **Testing automatizado** para detectar regressions tempranas

El conocimiento profundo de cada una de estas herramientas permite al desarrollador no solo usar la tecnología, sino tomar decisiones informadas sobre cuándo, cómo y por qué usar cada una en contextos específicos.

---

**Documento generado:** Abril 2026  
**Proyecto:** Ekonsumo - Sistema de Gestión de Grupos de Consumo  
**Versión del Stack:** Backend ^5.2.1 / Frontend ^3.5.30
