# Ekonsumo - Grupo de Consumo Local

> **NOTA**: Inspiración de diseño: [TromJaro](https://www.tromjaro.com/)

---

## Tabla de Contenidos

- [Ekonsumo - Grupo de Consumo Local](#ekonsumo---grupo-de-consumo-local)
  - [Descripción del Proyecto](#descripción-del-proyecto)
  - [Contexto](#contexto)
    - [Estructura del Grupo](#estructura-del-grupo)
    - [Sistema de Familias](#sistema-de-familias)
    - [Pedidos](#pedidos)
    - [Pedido Abierto](#pedido-abierto)
    - [Pedidos Periódicos](#pedidos-periódicos)
  - [Tecnologías](#tecnologías)
    - [Backend](#backend)
    - [Frontend](#frontend)
    - [Herramientas](#herramientas)
  - [Estructura del Proyecto](#estructura-del-proyecto)
    - [Monorepo](#monorepo)
    - [Backend (Node.js + Express)](#backend-nodejs--express)
    - [Frontend (Vue.js)](#frontend-vuejs)
  - [Instalación y Puesta en Marcha](#instalación-y-puesta-en-marcha)
    - [Requisitos Previos](#requisitos-previos)
    - [Instalación](#instalación)
    - [Configuración](#configuración)
    - [Ejecución](#ejecución)
  - [Base de Datos](#base-de-datos)
    - [Esquema](#esquema)
    - [Tablas Principales](#tablas-principales)
      - [Usuario](#usuario)
      - [Proveedor](#proveedor)
      - [Producto](#producto)
      - [Pedido](#pedido)
      - [Detalle\_Pedido](#detalle_pedido)
      - [Pedido\_Periodico](#pedido_periodico)
      - [Pago](#pago)
      - [Notificacion](#notificacion)
  - [API REST](#api-rest)
    - [Rutas de Usuarios](#rutas-de-usuarios)
    - [Rutas de Productos](#rutas-de-productos)
    - [Rutas de Proveedores](#rutas-de-proveedores)
    - [Rutas de Pedidos](#rutas-de-pedidos)
    - [Rutas de Pagos](#rutas-de-pagos)
  - [Autenticación](#autenticación)
    - [JWT](#jwt)
    - [Rutas Protegidas](#rutas-protegidas)
  - [Roles de Usuario](#roles-de-usuario)
  - [Sistema de Familias](#sistema-de-familias-1)
  - [Funcionalidades](#funcionalidades)
    - [Usuario Regular](#usuario-regular)
    - [Usuario Gestor (familia con proveedor)](#usuario-gestor-familia-con-proveedor)
    - [Administrador](#administrador)
  - [Estado del Proyecto](#estado-del-proyecto)

---

## Descripción del Proyecto

**Ekonsumo** es una aplicación web desarrollada para gestionar un grupo de consumo local y ecológico, compuesto por aproximadamente cuarenta familias y quince productores.

El objetivo principal es automatizar y optimizar todos los procesos de gestión de pedidos y productos que actualmente se realizan de manera manual a través de Google Sheets, ofreciendo una interfaz más amigable y eficiente.

---

## Contexto

### Estructura del Grupo

El grupo está formado por familias que se encargan de contactar directamente con los productores. Cada familia puede asumir la responsabilidad de gestionar uno o más proveedores (grupos de productos).

### Sistema de Familias

Cada usuario pertenece a una **familia** (identificada por un número). Las familias son las unidades básicas de gestión:

- **Familias consumidoras**: Familias que realizan pedidos de productos
- **Familias gestoras**: Familias que además gestionan uno o más proveedores

Un proveedor puede ser asignado a una familia gestora, lo que significa que todos los miembros de esa familia pueden gestionar los productos y pedidos de dicho proveedor.

**Ejemplo de uso semanal para una familia que quiere pedir verduras:**
1. Inicia sesión en la aplicación
2. Navega a la sección de compras
3. Selecciona el proveedor de verduras (si hay un pedido abierto)
4. Añade los productos deseados a su cesta
5. Confirma el pedido

**Ejemplo de uso para la familia que gestiona las verduras:**
1. Inicia sesión en la aplicación
2. Navega a la sección de gestión de pedidos
3. Abre un nuevo pedido estableciendo fechas de apertura y cierre
4. Supervisa los pedidos de las familias
5. Cierra el pedido cuando finaliza el período de pedidos
6. Contacta con el proveedor para confirmar el pedido

### Pedidos

Los pedidos se hacen de manera conjunta entre todos los usuarios del grupo. Un pedido lo abre el usuario gestor del proveedor (familia gestora).

### Pedido Abierto

Cuando un pedido está **abierto**, significa que el usuario gestor ha establecido una fecha de apertura y una fecha de cierre. Los usuarios pueden añadir, modificar o eliminar productos solo durante este período.

### Pedidos Periódicos

Hay algunos productos que se piden semanalmente de manera automática sin que tenga que intervenir el usuario hasta que quiera dejar de recibir ese pedido.

---

## Tecnologías

### Backend

- **Node.js** - Entorno de ejecución JavaScript
- **Express 5** - Framework web
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación por tokens
- **Nodemailer** - Envío de correos electrónicos
- **Multer** - Gestión de archivos (imágenes de productos)
- **Winston** - Logging
- **Swagger/OpenAPI** - Documentación de la API
- **Jest** + **Supertest** - Testing

### Frontend

- **Vue.js 3** - Framework progresivo
- **Vite** - Build tool
- **Pinia** - Gestión de estado
- **Vue Router 4** - Enrutamiento
- **Bootstrap 5** - Framework CSS
- **Axios** - Cliente HTTP

### Herramientas

- **Git** - Control de versiones
- **Visual Studio Code** - Editor de código
- **Penpot** - Prototipado de interfaces
- **Draw.io** - Diagramas
- **PostgreSQL** - Base de datos
- **pgAdmin** - Administración de PostgreSQL

---

## Estructura del Proyecto

### Monorepo

El proyecto utiliza **npm workspaces** para gestionar el backend y frontend en un único repositorio:

```
DAW-Proyecto/
├── backend/           # API REST (Node.js + Express)
├── frontend/          # Aplicación web (Vue.js)
├── datos/            # Scripts de base de datos
├── docs/             # Documentación adicional
├── scripts/          # Scripts de utilidad
└── package.json      # Workspace raíz
```

### Backend (Node.js + Express)

```
backend/
├── index.js                      # Punto de entrada
├── swagger.js                    # Configuración Swagger
├── src/
│   ├── config/
│   │   ├── db.js                # Conexión PostgreSQL
│   │   ├── logger.js            # Winston logger
│   │   └── multer.js            # Configuración uploads
│   ├── controllers/             # Lógica de negocio
│   │   ├── UsuarioController.js
│   │   ├── ProveedorController.js
│   │   ├── ProductoController.js
│   │   ├── PedidoController.js
│   │   ├── DetallePedidoController.js
│   │   ├── PagoController.js
│   │   ├── NotificacionController.js
│   │   ├── PedidoPeriodicoController.js
│   │   └── UsuarioProveedorController.js
│   ├── models/                  # Modelos de datos (SQL)
│   │   ├── Usuario.js
│   │   ├── Proveedor.js
│   │   ├── Producto.js
│   │   ├── Pedido.js
│   │   ├── DetallePedido.js
│   │   ├── Pago.js
│   │   ├── Notificacion.js
│   │   ├── PedidoPeriodico.js
│   │   └── UsuarioProveedor.js
│   ├── routes/                  # Rutas API
│   │   ├── UsuarioRoutes.js
│   │   ├── ProveedorRoutes.js
│   │   ├── ProductoRoutes.js
│   │   ├── PedidoRoutes.js
│   │   └── ...
│   ├── middlewares/             # Middlewares
│   │   ├── auth.js             # Verificación JWT
│   │   ├── admin.js            # Verificación rol admin
│   │   └── validators.js       # Validación express-validator
│   ├── services/
│   │   └── emailService.js     # Envío de correos
│   └── jobs/
│       └── generarLiquidacionMensual.js
├── tests/                       # Pruebas Jest
└── package.json
```

### Frontend (Vue.js)

```
frontend/
├── index.html
├── vite.config.mjs
├── src/
│   ├── main.js                 # Bootstrap Vue
│   ├── App.vue                 # Componente raíz
│   ├── router/
│   │   └── index.js            # Definición de rutas
│   ├── store/
│   │   ├── index.js            # Pinia setup + auth store
│   │   └── alertStore.js       # Store de alertas
│   ├── services/
│   │   └── api.js              # Cliente Axios
│   ├── components/
│   │   ├── NavBar.vue          # Barra de navegación
│   │   └── FooterBar.vue       # Pie de página
│   ├── views/                  # Páginas
│   │   ├── HomePage.vue
│   │   ├── LoginPage.vue
│   │   ├── RegistrarPage.vue
│   │   ├── DashboardPage.vue
│   │   ├── ComprasPage.vue
│   │   ├── HistorialPage.vue
│   │   ├── GestionUsuariosPage.vue
│   │   ├── GestionProveedoresPage.vue
│   │   ├── GestionProductosPage.vue
│   │   ├── GestionPedidosPage.vue
│   │   ├── GestionPedidosPeriodicosPage.vue
│   │   ├── GestionPagosPage.vue
│   │   ├── GestionSaldosPage.vue
│   │   ├── GestionNotificacionesPage.vue
│   │   ├── DetallesPedidoPage.vue
│   │   ├── ConfiguracionPage.vue
│   │   ├── RecuperarPasswordPage.vue
│   │   └── SoportePage.vue
│   └── assets/
│       └── styles/
│           └── global.css
└── package.json
```

---

## Instalación y Puesta en Marcha

### Requisitos Previos

- **Node.js** (versión 14 o superior)
- **npm** (incluido con Node.js)
- **PostgreSQL** (versión 12 o superior)

### Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/DAW-Proyecto.git
   cd DAW-Proyecto
   ```

2. **Instala las dependencias del proyecto (backend + frontend):**
   ```bash
   npm install
   ```

### Configuración

1. **Base de Datos:**
   - Crea una base de datos PostgreSQL llamada `ekonsumo`
   - Ejecuta el script de creación de tablas: `sql/crearBaseDatos.sql`
   - Opcional: Ejecuta scripts de datos de prueba en `datos/`

2. **Variables de Entorno:**

   Crea el archivo `backend/.env`:
   ```env
   # Servidor
   PORT=3000
   NODE_ENV=development

   # JWT
   JWT_SECRET=tu_clave_secreta

   # Base de Datos
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=ekonsumo

   # Email
   EMAIL_USER=tu_email@gmail.com
   EMAIL_PASS=tu_contraseña_app
   OAUTH_CLIENTID=tu_client_id
   OAUTH_CLIENT_SECRET=tu_client_secret
   OAUTH_REFRESH_TOKEN=tu_refresh_token

   # Frontend URL (para recuperación de contraseña)
   FRONTEND_URL=http://localhost:8080
   ```

### Ejecución

1. **Inicia el servidor Backend:**
   ```bash
   npm run start:backend
   ```
   El servidor estará en `http://localhost:3000`
   - API docs (Swagger): `http://localhost:3000/api-docs`

2. **Inicia el servidor Frontend:**
   ```bash
   npm run start:frontend
   ```
   La aplicación estará en `http://localhost:8080`

---

## Base de Datos

### Esquema

```
[Usuario] --< [Pedido] >-- [Proveedor]
[Usuario] --< [Pago] >-- [Usuario]
[Usuario] --< [Detalle_Pedido] >-- [Pedido]
[Proveedor] --< [Producto]
[Proveedor] --< [Pedido_Periodico]
[Usuario] --< [Notificacion]

-- Sistema de familias (simplificado)
[Usuario] (familia) --< [Proveedor] (familia)
```

### Tablas Principales

#### Usuario

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_usuario` | SERIAL | Clave primaria |
| `nombre` | VARCHAR(100) | Nombre del usuario |
| `correo` | VARCHAR(100) | Correo electrónico (único) |
| `pass` | VARCHAR(255) | Contraseña hasheada |
| `movil` | VARCHAR(20) | Teléfono móvil |
| `rol` | VARCHAR(50) | Rol: `admin`, `usuario` |
| `activo` | BOOLEAN | Usuario activo/inactivo |
| `familia` | INTEGER | Número de familia (nullable) |
| `saldo` | DECIMAL(10,2) | Saldo actual |
| `fecha_modificacion` | TIMESTAMP | Última modificación |

#### Proveedor

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_proveedor` | SERIAL | Clave primaria |
| `nombre` | VARCHAR(100) | Nombre del proveedor/grupo |
| `contacto` | VARCHAR(100) | Persona de contacto |
| `telefono` | VARCHAR(20) | Teléfono |
| `movil` | VARCHAR(20) | Teléfono móvil |
| `correo` | VARCHAR(100) | Correo electrónico |
| `metodo_pago` | VARCHAR(300) | Método de pago |
| `imagen` | VARCHAR(255) | URL de imagen |
| `familia` | INTEGER | Familia gestora (nullable) |
| `activo` | BOOLEAN | Proveedor activo/inactivo |

#### Producto

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_producto` | SERIAL | Clave primaria |
| `nombre` | VARCHAR(100) | Nombre del producto |
| `imagen` | VARCHAR(255) | URL de imagen |
| `descripcion` | TEXT | Descripción |
| `precio` | DECIMAL(10,2) | Precio |
| `frecuencia_pedido` | VARCHAR(50) | Frecuencia (semanal, mensual...) |
| `id_proveedor` | INTEGER | Clave foránea (Proveedor) |

#### Pedido

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_pedido` | SERIAL | Clave primaria |
| `familia` | INTEGER | Familia responsable |
| `id_proveedor` | INTEGER | Clave foránea (Proveedor) |
| `fecha_modificacion` | TIMESTAMP | Última modificación |
| `fecha_apertura` | TIMESTAMP | Fecha de apertura |
| `fecha_cierre` | TIMESTAMP | Fecha de cierre |
| `fecha_entrega` | TIMESTAMP | Fecha de entrega |
| `estado` | VARCHAR(50) | Estado: `pendiente`, `en proceso`, `entregado`, `repartido`, `cancelado` |

#### Detalle_Pedido

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_detalle` | SERIAL | Clave primaria |
| `id_pedido` | INTEGER | Clave foránea (Pedido) |
| `id_producto` | INTEGER | Clave foránea (Producto) |
| `cantidad` | INTEGER | Cantidad |
| `precio_total` | DECIMAL(10,2) | Precio total |
| `id_usuario_comprador` | INTEGER | Clave foránea (Usuario) |
| `fecha_modificacion` | TIMESTAMP | Última modificación |

#### Pedido_Periodico

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_pedido_periodico` | SERIAL | Clave primaria |
| `id_proveedor` | INTEGER | Clave foránea (Proveedor) |
| `fecha_inicio` | TIMESTAMP | Fecha de inicio |
| `fecha_fin` | TIMESTAMP | Fecha de fin |
| `activo` | BOOLEAN | Activo/inactivo |
| `periodicidad` | INTEGER | Días entre pedidos |
| `dia_apertura` | INTEGER | Día de apertura (0-6) |
| `dia_cierre` | INTEGER | Día de cierre (0-6) |
| `dia_entrega` | INTEGER | Día de entrega (0-6) |

#### Pago

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_pago` | SERIAL | Clave primaria |
| `id_usuario_deudor` | INTEGER | Usuario que debe |
| `id_usuario_creditor` | INTEGER | Usuario que recibe |
| `monto` | DECIMAL(10,2) | Monto |
| `fecha_pago` | TIMESTAMP | Fecha del pago |
| `estado` | VARCHAR(50) | Estado: `pendiente`, `completado` |
| `periodo` | VARCHAR(7) | Período (YYYY-MM) |

#### Notificacion

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id_notificacion` | SERIAL | Clave primaria |
| `id_usuario` | INTEGER | Usuario destinatario |
| `mensaje` | TEXT | Contenido |
| `fecha` | TIMESTAMP | Fecha |
| `leida` | BOOLEAN | Leída/no leída |

---

## API REST

### Rutas de Usuarios

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/usuarios/registrar` | Registrar nuevo usuario |
| POST | `/api/usuarios/login` | Iniciar sesión |
| POST | `/api/usuarios/recuperar-password` | Recuperar contraseña |
| GET | `/api/usuarios/obtenerTodos` | Listar usuarios (admin) |
| GET | `/api/usuarios/obtener/:id` | Obtener usuario por ID |
| PUT | `/api/usuarios/actualizar/:id` | Actualizar usuario |
| PATCH | `/api/usuarios/activar/:id` | Activar/desactivar usuario |
| DELETE | `/api/usuarios/eliminar/:id` | Eliminar usuario (admin) |

### Rutas de Productos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/productos/obtenerTodos` | Listar productos |
| GET | `/api/productos/misProductos` | Productos del proveedor asignado |
| POST | `/api/productos/crear` | Crear producto |
| PUT | `/api/productos/actualizar/:id` | Actualizar producto |
| DELETE | `/api/productos/eliminar/:id` | Eliminar producto |

### Rutas de Proveedores

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/proveedores/obtenerTodos` | Listar proveedores |
| POST | `/api/proveedores/crear` | Crear proveedor |
| PATCH | `/api/proveedores/actualizar/:id` | Actualizar proveedor |
| DELETE | `/api/proveedores/eliminar/:id` | Eliminar proveedor |

### Rutas de Pedidos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/pedidos/obtenerTodos` | Listar pedidos |
| GET | `/api/pedidos/misPedidos` | Pedidos del proveedor asignado |
| GET | `/api/pedidos/obtener/:id` | Obtener pedido por ID |
| POST | `/api/pedidos/crear` | Crear pedido |
| PUT | `/api/pedidos/actualizar/:id` | Actualizar pedido |
| DELETE | `/api/pedidos/eliminar/:id` | Eliminar pedido |
| PATCH | `/api/pedidos/cambiarEstado/:id` | Cambiar estado |

### Rutas de Pagos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/pagos/obtenerTodos` | Listar pagos |
| GET | `/api/pagos/resumen-mensual` | Resumen mensual |
| POST | `/api/pagos/crear` | Crear pago |
| POST | `/api/pagos/generar-liquidacion-mensual` | Generar liquidación |
| PATCH | `/api/pagos/:id/marcar-pagado` | Marcar como pagado |
| PATCH | `/api/pagos/:id/marcar-recibido` | Marcar como recibido |

---

## Autenticación

### JWT

La aplicación utiliza **JSON Web Tokens (JWT)** para la autenticación:

1. **Login**: El usuario envía credenciales, el servidor valida y devuelve un token
2. **Token**: Se incluye en el header `Authorization: Bearer <token>`
3. **Expiración**: El token expira en 1 hora

### Rutas Protegidas

Las siguientes rutas requieren autenticación:
- `/api/usuarios/obtenerTodos` (solo admin)
- `/api/usuarios/obtener/:id`
- `/api/usuarios/actualizar/:id`
- `/api/productos/*` (excepto obtenerTodos)
- `/api/proveedores/*` (excepto obtenerTodos)
- `/api/pedidos/*`
- `/api/pagos/*`

---

## Roles de Usuario

| Rol | Descripción |
|-----|-------------|
| `admin` | Acceso completo a todas las funcionalidades |
| `usuario` | Acceso básico: compras, historial, configuración personal |

---

## Sistema de Familias

El sistema de familias simplifica la gestión de proveedores:

1. **Asignación de familia**: Cada usuario pertenece a una familia (número)
2. **Proveedor asignado**: Un proveedor puede ser asignado a una familia gestora
3. **Acceso múltiple**: Todos los miembros de una familia pueden gestionar el mismo proveedor

**Flujo:**
1. Un usuario se registra indicando su número de familia (opcional)
2. Un administrador asigna la familia a un proveedor
3. Cualquier usuario de esa familia puede:
   - Gestionar productos del proveedor
   - Abrir/cerrar pedidos
   - Ver pedidos del proveedor

---

## Funcionalidades

### Usuario Regular

- Iniciar sesión / Registrarse
- Recuperar contraseña
- Ver productos disponibles
- Añadir productos a pedidos abiertos
- Ver historial de pedidos
- Ver y configurar notificaciones
- Actualizar perfil

### Usuario Gestor (familia con proveedor)

- Todas las funcionalidades de usuario regular
- Gestionar productos (crear, editar, eliminar)
- Abrir y cerrar pedidos
- Ver detalles de todos los pedidos al proveedor

### Administrador

- Todas las funcionalidades
- Gestionar usuarios (crear, editar, eliminar, activar/desactivar)
- Gestionar proveedores
- Gestionar pedidos
- Ver saldos de todos los usuarios
- Gestionar pagos y liquidaciones
- Ver notificaciones

---

## Estado del Proyecto

El proyecto se encuentra en **desarrollo activo**.

### Funcionalidades implementadas:

- [x] Autenticación JWT
- [x] Registro de usuarios
- [x] Recuperación de contraseña
- [x] Gestión de usuarios (admin)
- [x] Gestión de proveedores
- [x] Gestión de productos (con imágenes] Sistema de pedidos)
- [x (abierto/cerrado)
- [x] Pedidos periódicos
- [x] Gestión de pagos
- [x] Sistema de liquidaciones mensuales
- [x] Notificaciones
- [x] Sistema de familias
- [x] Notificación a administradores por nuevo registro

### Funcionalidades pendientes:

- [ ] Tests completos
- [ ] Despliegue a producción
- [ ] Documentación de usuario
