# DOCUMENTACIÓN EKONSUMO

## Descripción del Proyecto

El objetivo de este proyecto es desarrollar una aplicación web que facilite la gestión de un grupo de consumo local y ecológico, compuesto por aproximadamente cuarenta usuarios (familias) y quince productores. Actualmente, la gestión de pedidos y productos se realiza de manera manual a través de tablas en Google Sheets, lo que puede resultar ineficiente y propenso a errores.

## Contexto Actual

### Estructura del Grupo

El grupo está formado por familias que se encargan de contactar directamente con los productores. Cada usuario asume la responsabilidad de mantenerse en Contacto con un proveedor específico, aunque hay algunos usuarios que no gestionan ningún proveedor. Será el usuario que gestiona ese proveedor el encargado de dar de alta, modificar y borrar productos. Será el encargado de dar de alta pedidos conjuntos estableciendo un periodo en el que los usuarios podrán añadir líneas al pedido.

### Ejemplo actual de uso para incorporar una familia

1. Contacta con responsable del grupo de consumo.
2. Responsable explica funcionamiento de grupo.
3. Responsable pide usuario de Google a la familia.
4. Responsable comparte la hoja de cálculo de Google con la familia.

### Ejemplo actual de uso semanal para una familia que quiere pedir verduras

1. Entra a Google Docs.
2. Entra a la sheet compartida.
3. Busca la hoja correspondiente al productor de verduras (semanal).
4. Comprueba que el cuadro corresponde a la semana actual (se pone cabecera verde).
5. Se sitúa en la columna correspondiente a su familia.
6. Va introduciendo las unidades de cada producto que desea.
7. En la parte de abajo le calcula el importe total.
8. La semana siguiente tendrá la nueva tabla vacía.

### Ejemplo actual de uso semanal para una familia que quiere pedir huevos

1. Entra a Google Docs.
2. Entra a la sheet compartida.
3. Busca la hoja correspondiente al productor de huevos (semanal y periódico).
4. Comprueba que el cuadro corresponde a la semana actual (se pone cabecera verde).
5. Se sitúa en la columna correspondiente a su familia.
6. Introduce las unidades.
7. En la parte de abajo le calcula el importe total.
8. Hasta que modifique las unidades, recibirá ese pedido semanalmente de manera automática.

### Ejemplo actual de uso semanal para la familia que gestiona las verduras

1. Entra a Google Docs.
2. Entra a la sheet compartida.
3. Busca la hoja correspondiente al productor de verduras (semanal).
4. Busca el cuadro con la suma total de unidades de cada verdura.
5. Contacta con el proveedor o automáticamente se le envía correo desde la sheet.
6. (Esto ahora es automático) Duplica el cuadro (vacío) de la semana pasada en las filas inferiores y se establece la cabecera del pedido actual en verde y la anterior en rojo.
7. Al final de mes, el productor le pasa factura.
8. Comprueba que el importe coincide con los pedidos.

### Ejemplo actual de uso semanal para la familia que gestiona el pan (periódico)

1. Entra a Google Docs.
2. Entra a la sheet compartida.
3. Busca la hoja correspondiente al productor de pan (semanal).
4. Busca el cuadro con la suma total de unidades de cada pan.
5. Contacta con el proveedor o automáticamente se le envía correo desde la sheet.
6. (Esto ahora es automático) Duplica el cuadro de la semana pasada (arrastrando las unidades también) en las filas inferiores y se establece la cabecera del pedido actual en verde y la anterior en rojo.
7. Al final de mes, el productor le pasa factura.
8. Comprueba que el importe coincide con los pedidos.

### Pedidos

Los pedidos se hacen de manera conjunta entre todos los usuarios del grupo. Los pedidos los abre el usuario encargado de ese proveedor (grupo de productos).

### Pedido abierto

Cuando un pedido está abierto significa que el usuario encargado del proveedor ha abierto un pedido y ha establecido una fecha de apertura y una fecha de cierre. El pedido solo será editable en este periodo.

### Pedidos periódicos

Hay algunos productos que se piden semanalmente de manera automática sin que tenga que intervenir el usuario hasta que quiera dejar de recibir ese pedido.

### Frecuencia de Pedidos

Los productos se solicitan a diferentes proveedores con distintas frecuencias: algunos se piden semanalmente, mientras que otros se solicitan cada dos, tres o seis meses.

### Entrega de Productos

Todos los productos se entregan en un local común, donde los usuarios pueden recoger sus pedidos. Es el usuario encargado de ese proveedor el que establecerá una fecha aproximada de entrega en el momento de abrir un pedido.

### Reparto de Productos

Algunos productos se repartirán a los usuarios que los han pedido, después de que hayan sido entregados en el local.

### Gestión Actual en Google Sheets

La gestión de pedidos y productos se organiza en Google Sheets de la siguiente manera:

- Páginas por Proveedor: Cada proveedor tiene su propia página en la hoja de cálculo.
- Registro de Productos: Cada producto se representa en una fila, lo que permite un seguimiento claro de la disponibilidad y características de cada uno.
- Pedidos: Cada pedido se compone de varias filas, donde se establece una fecha máxima de modificación, la fecha de pedido y la periodicidad de los mismos.
- Familias: Cada familia o usuario tiene su propia columna, lo que facilita el seguimiento de sus pedidos y gastos.

### Cálculos Avanzados

Se realizan cálculos complejos para gestionar la información financiera y de pedidos:

- Gasto Mensual: Se calcula el gasto mensual de cada familia. Aquellos que gestionan un proveedor y realizan el pago de los pedidos tienen un saldo positivo. Al final del mes, se determina qué familias deben dinero y a quién se lo deben.
- Cálculo de Pedidos: Se establece un cálculo para determinar el pedido que debe enviarse al proveedor o productor antes de la fecha límite.

### Propuesta de Solución

La nueva aplicación web permitirá automatizar y optimizar todos estos procesos, ofreciendo una interfaz más amigable y eficiente para los usuarios. Algunas de las características clave incluirán:

- Gestión de Productos y Proveedores: Una sección dedicada para que los usuarios gestores puedan ver y gestionar los productos y proveedores de manera más intuitiva.
- Sistema de Pedidos: Un sistema que permita abrir pedidos de forma sencilla a los usuarios gestores.
- Sistema de Compras: Un sistema que permita añadir productos a la cesta mensual de manera intuitiva.
- Cálculos Automáticos: Automatización de los cálculos de gastos y deudas, eliminando la necesidad de realizar cálculos manuales en hojas de cálculo.
- Interacción entre Usuarios: Facilitar la comunicación entre usuarios y productores, mejorando la colaboración y la eficiencia del grupo.

## Herramientas

- GitHub: Para el control de versiones y el repositorio remoto.
- Visual Studio Code: Editor de código muy versátil, con mucha comunidad, e infinidad de extensiones.
- VUE Dev Tools: Extensión de navegador para depurar aplicaciones desarrolladas con VUE.
- Draw.io: Para crear diagramas rápidos, como flujos de trabajo o esquemas de la base de datos.
- Clouding.io: VPS para alojar la app en producción.
- Duckdns.org: Para tener un nombre de dominio gratuito.
- Nginx: Servidor web para producción.

## Tecnologías de Programación

### Backend (Node.js + Express)

- Node.js 22.x: Entorno de ejecución JavaScript
- Express 5.x: Framework para crear la API REST
- PostgreSQL: Motor de base de datos robusto y escalable
- JWT: Para autenticación y autorización
- express-validator: Para validar y sanitizar datos
- multer: Para manejar la subida de archivos (imágenes de productos)
- nodemailer + OAuth2: Para envío de emails
- bcryptjs: Para almacenar contraseñas de forma segura
- winston: Para logging
- Jest: Framework de pruebas
- swagger-ui-express + swagger-jsdoc: Documentación interactiva de la API

### Frontend (Vue.js 3 + Vite)

- Vue.js 3.5+: Framework de frontend con Composition API
- Vite: Herramienta de construcción y servidor local
- Vue Router: Para gestión de navegación SPA
- Pinia: Para gestión del estado global
- Axios: Para peticiones HTTP
- Bootstrap 5: Para interfaces responsivas
- Font Awesome: Para iconografía

## Arquitectura del Sistema

### Componentes

- Frontend (Vue.js + Vite + Bootstrap): Interfaz de usuario
- Backend (Node.js + Express): API REST
- Base de Datos (PostgreSQL): Almacenamiento de información
- Almacenamiento de ficheros: Imágenes de productos (Multer)
- Servicios Externos: Notificaciones por email (Nodemailer + OAuth2)

## Modelo de Datos

### Diagrama ER

```
[Familia] --< [familia_proveedor] >-- [Proveedor]
[Proveedor] --< [Producto]
[Usuario] --< [Pedido] >-- [Proveedor]
[Pedido] --< [Detalle_Pedido] >-- [Producto]
[Pedido] --< [Pedido_Periodico]
[Usuario] --< [Pago] >-- [Usuario]
[Usuario] --< [Notificacion]
```

### Tablas Principales

#### 1. Usuario

| Columna | Tipo de Dato | Descripción |
|---------|--------------|-------------|
| id_usuario | SERIAL | Clave primaria |
| nombre | VARCHAR(100) | Nombre del usuario |
| correo | VARCHAR(100) | Correo electrónico (único) |
| pass | VARCHAR(100) | Contraseña hasheada |
| rol | VARCHAR(50) | Rol (admin, gestor, usuario) |
| movil | VARCHAR(20) | Teléfono móvil |
| familia | INTEGER | ID de la familia a la que pertenece |
| activo | BOOLEAN | Indica si está activo |
| fecha_modificacion | TIMESTAMP | Última modificación |

#### 2. Proveedor

| Columna | Tipo de Dato | Descripción |
|---------|--------------|-------------|
| id_proveedor | SERIAL | Clave primaria |
| nombre | VARCHAR(100) | Nombre del proveedor |
| contacto | VARCHAR(100) | Persona de contacto |
| telefono | VARCHAR(20) | Teléfono |
| movil | VARCHAR(20) | Móvil |
| correo | VARCHAR(100) | Email |
| metodo_pago | VARCHAR(300) | Método de pago |
| frecuencia_pedido_aproximada | VARCHAR(50) | Frecuencia de pedidos |
| envio_movil | BOOLEAN | Avisar por SMS |
| envio_mail | BOOLEAN | Avisar por email |
| activo | BOOLEAN | Indica si está activo |
| fecha_modificacion | TIMESTAMP | Última modificación |

#### 3. Producto

| Columna | Tipo de Dato | Descripción |
|---------|--------------|-------------|
| id_producto | SERIAL | Clave primaria |
| nombre | VARCHAR(100) | Nombre del producto |
| imagen | VARCHAR(100) | URL de imagen |
| descripcion | TEXT | Descripción |
| precio | DECIMAL(10,2) | Precio unitario |
| id_proveedor | INT | Clave foránea (Proveedor) |
| activo | BOOLEAN | Indica si está activo |
| fecha_modificacion | TIMESTAMP | Última modificación |

#### 4. Pedido

| Columna | Tipo de Dato | Descripción |
|---------|--------------|-------------|
| id_pedido | SERIAL | Clave primaria |
| id_usuario_encargado | INT | Usuario que abrió el pedido |
| id_proveedor | INT | Clave foránea (Proveedor) |
| fecha_apertura | TIMESTAMP | Inicio del periodo de pedido |
| fecha_cierre | TIMESTAMP | Fin del periodo |
| fecha_entrega | TIMESTAMP | Fecha aproximada de entrega |
| estado | VARCHAR(50) | Estado del pedido |
| fecha_modificacion | TIMESTAMP | Última modificación |

#### 5. Detalle_Pedido

| Columna | Tipo de Dato | Descripción |
|---------|--------------|-------------|
| id_detalle | SERIAL | Clave primaria |
| id_pedido | INT | Clave foránea (Pedido) |
| id_producto | INT | Clave foránea (Producto) |
| cantidad | INT | Cantidad solicitada |
| precio_unitario | DECIMAL(10,2) | Precio en el momento del pedido |
| id_usuario_comprador | INT | Usuario que pidió |
| fecha_modificacion | TIMESTAMP | Última modificación |

#### 6. familia_proveedor

| Columna | Tipo de Dato | Descripción |
|---------|--------------|-------------|
| id_familia | INT | Clave foránea (Usuario.familia) |
| id_proveedor | INT | Clave foránea (Proveedor) |

#### 7. Pedido_Periodico

| Columna | Tipo de Dato | Descripción |
|---------|--------------|-------------|
| id_pedido_periodico | SERIAL | Clave primaria |
| id_proveedor | INT | Proveedor |
| fecha_inicio | TIMESTAMP | Fecha de inicio |
| fecha_fin | TIMESTAMP | Fecha de fin |
| activo | BOOLEAN | Si está activo |
| periodicidad | INT | Días entre pedidos |
| dia_apertura | INT | Día de apertura |
| dia_cierre | INT | Día de cierre |
| dia_entrega | INT | Día de entrega |

#### 8. Pago

| Columna | Tipo de Dato | Descripción |
|---------|--------------|-------------|
| id_pago | SERIAL | Clave primaria |
| id_usuario_deudor | INT | Usuario que debe |
| id_usuario_creditor | INT | Usuario al que se debe |
| monto | DECIMAL(10,2) | Cantidad |
| estado | VARCHAR(50) | Estado (pendiente/completado) |
| periodo | VARCHAR(7) | Periodo (YYYY-MM) |
| origen | VARCHAR(50) | Origen (manual/liquidacion) |
| concepto | TEXT | Descripción |
| fecha_modificacion | TIMESTAMP | Última modificación |

#### 9. Notificacion

| Columna | Tipo de Dato | Descripción |
|---------|--------------|-------------|
| id_notificacion | SERIAL | Clave primaria |
| id_usuario | INT | Usuario destinatario |
| mensaje | TEXT | Contenido |
| fecha | TIMESTAMP | Fecha de envío |
| leida | BOOLEAN | Si ha sido leída |

## Backend API REST Node Express

### Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/
│   │   ├── UsuarioController.js
│   │   ├── ProductoController.js
│   │   ├── ProveedorController.js
│   │   ├── PedidoController.js
│   │   ├── DetallePedidoController.js
│   │   ├── PagoController.js
│   │   ├── PedidoPeriodicoController.js
│   │   ├── NotificacionController.js
│   │   └── FamiliaProveedorController.js
│   ├── models/
│   │   ├── Usuario.js
│   │   ├── Producto.js
│   │   ├── Proveedor.js
│   │   ├── Pedido.js
│   │   ├── DetallePedido.js
│   │   ├── Pago.js
│   │   ├── PedidoPeriodico.js
│   │   ├── Notificacion.js
│   │   └── FamiliaProveedor.js
│   ├── routes/
│   │   ├── index.js (agrega todas las rutas)
│   │   ├── UsuarioRoutes.js
│   │   ├── ProductoRoutes.js
│   │   ├── ProveedorRoutes.js
│   │   ├── PedidoRoutes.js
│   │   ├── DetallePedidoRoutes.js
│   │   ├── PagoRoutes.js
│   │   ├── PedidoPeriodicoRoutes.js
│   │   ├── NotificacionRoutes.js
│   │   └── FamiliaProveedorRoutes.js
│   ├── middlewares/
│   │   ├── auth.js (verificación JWT)
│   │   ├── admin.js
│   │   ├── gestor.js
│   │   ├── adminOrGestor.js
│   │   ├── validators.js
│   │   └── validar.js
│   ├── services/
│   │   └── emailService.js
│   ├── config/
│   │   ├── db.js
│   │   ├── logger.js
│   │   └── multer.js
│   ├── app.js
│   └── server.js
├── tests/
├── swagger.js
├── index.js (punto de entrada)
└── package.json
```

### Middlewares de Autorización

- auth.js: Verifica token JWT
- admin.js: Solo administradores
- gestor.js: Solo gestores
- adminOrGestor.js: Admin o gestor

### Rutas de la API

#### Autenticación

- POST /api/usuarios/registrar
- POST /api/usuarios/login
- POST /api/usuarios/recuperar-password
- POST /api/usuarios/reset-password

#### Usuarios

- GET /api/usuarios/obtenerTodos
- GET /api/usuarios/obtener/:id
- PUT /api/usuarios/actualizar/:id
- PATCH /api/usuarios/activar/:id
- DELETE /api/usuarios/eliminar/:id

#### Productos

- GET /api/productos/obtenerTodos
- GET /api/productos/misProductos
- POST /api/productos/crear (con imagen)
- PUT /api/productos/actualizar/:id
- DELETE /api/productos/eliminar/:id
- PATCH /api/productos/cambiarEstadoActivo/:id

#### Proveedores

- GET /api/proveedores/obtenerTodos
- POST /api/proveedores/crear
- PATCH /api/proveedores/actualizar/:id
- DELETE /api/proveedores/eliminar/:id
- PATCH /api/proveedores/cambiarEstadoActivo/:id

#### Pedidos

- GET /api/pedidos/obtenerTodos
- GET /api/pedidos/misPedidos
- POST /api/pedidos/crear
- PUT /api/pedidos/actualizar/:id
- DELETE /api/pedidos/eliminar/:id
- PATCH /api/pedidos/cambiarEstado/:id

#### Detalle Pedido

- GET /api/detalle-pedido/pedido/:idPedido
- POST /api/detalle-pedido/crear/
- PUT /api/detalle-pedido/actualizar/:id
- DELETE /api/detalle-pedido/eliminar/:id

#### Pagos

- GET /api/pagos/obtenerTodos/
- GET /api/pagos/resumen-mensual
- PATCH /api/pagos/:id/marcar-pagado
- PATCH /api/pagos/:id/marcar-recibido
- POST /api/pagos/generar-liquidacion-mensual

#### Pedido Periódico

- GET /api/pedido-periodico/obtenerTodos
- POST /api/pedido-periodico/crear
- PUT /api/pedido-periodico/actualizar/:id
- DELETE /api/pedido-periodico/eliminar/:id
- PATCH /api/pedido-periodico/cambiarEstadoActivo/:id

#### Notificaciones

- POST /api/notificaciones/enviar/
- PUT /api/notificaciones/marcar-leida/:id

## Frontend Vue.js 3

### Estructura del Proyecto

```
frontend/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       ├── variables.css
│   │       ├── components.css
│   │       └── global.css
│   ├── components/
│   │   ├── NavBar.vue
│   │   └── FooterBar.vue
│   ├── services/
│   │   └── api.js
│   ├── store/
│   │   ├── index.js (authStore)
│   │   ├── alertStore.js
│   │   └── index.test.js
│   ├── router/
│   │   └── index.js
│   ├── views/
│   │   ├── HomePage.vue
│   │   ├── LoginPage.vue
│   │   ├── RegistrarPage.vue
│   │   ├── RecuperarPasswordPage.vue
│   │   ├── DashboardPage.vue
│   │   ├── ComprasPage.vue
│   │   ├── HistorialPage.vue
│   │   ├── DetallesPedidoPage.vue
│   │   ├── ConfiguracionPage.vue
│   │   ├── SoportePage.vue
│   │   ├── GestionUsuariosPage.vue
│   │   ├── GestionProveedoresPage.vue
│   │   ├── GestionProductosPage.vue
│   │   ├── GestionPedidosPage.vue
│   │   ├── GestionPedidosPeriodicosPage.vue
│   │   ├── GestionPagosPage.vue
│   │   ├── GestionNotificacionesPage.vue
│   │   └── GestionSaldosPage.vue
│   ├── App.vue
│   └── main.js
├── public/
├── dist/ (build de producción)
├── .env.development
├── .env.production
├── vite.config.mjs
└── package.json
```

### Rutas del Frontend

- / - Página de inicio
- /login - Inicio de sesión
- /registrar - Registro de usuario
- /recuperar-password - Solicitar recuperación
- /recuperar-password/:token - Restablecer contraseña
- /dashboard - Panel principal (requiere auth)
- /compras - Página de compras (requiere auth)
- /historial - Historial de pedidos (requiere auth)
- /detalles-pedido/:id - Detalles de un pedido
- /gestion-usuarios - Gestión de usuarios (solo admin)
- /gestion-proveedores - Gestión de proveedores
- /gestion-productos - Gestión de productos
- /gestion-pedidos - Gestión de pedidos
- /gestion-pedidos-periodicos - Gestión de pedidos periódicos
- /gestion-pagos - Gestión de pagos
- /gestion-notificaciones - Gestión de notificaciones
- /gestion-saldos - Gestión de saldos
- /configuracion - Configuración de cuenta
- /soporte - Ayuda y soporte

## Variables de Entorno

### Backend (.env)

| Variable | Descripción |
|----------|-------------|
| PORT | Puerto del servidor (3000) |
| NODE_ENV | Entorno (production) |
| DB_HOST | Host de PostgreSQL |
| DB_PORT | Puerto de PostgreSQL |
| DB_NAME | Nombre de la base de datos |
| DB_USER | Usuario de PostgreSQL |
| DB_PASSWORD | Contraseña de PostgreSQL |
| JWT_SECRET | Clave secreta para JWT |
| FRONTEND_URL | URL del frontend |
| EMAIL_USER | Email para envío |
| EMAIL_PASS | Password de aplicación |
| OAUTH_CLIENT_ID | Client ID OAuth2 |
| OAUTH_CLIENT_SECRET | Client Secret OAuth2 |
| OAUTH_REFRESH_TOKEN | Refresh Token |

### Frontend (.env.development)

| Variable | Descripción |
|----------|-------------|
| VITE_API_URL | URL del API (desarrollo) |

### Frontend (.env.production)

| Variable | Descripción |
|----------|-------------|
| VITE_API_URL | URL del API (/api) |

## Despliegue

### Requisitos del Servidor

- Ubuntu/Debian
- Nginx
- Node.js 22.x
- PostgreSQL 14+
- PM2

### Backend

```bash
# Subir código
rsync -avz --exclude 'node_modules/' --exclude '.env' \
  backend/ user@server:/var/www/daw-proyecto/backend/

# Instalar dependencias
cd /var/www/daw-proyecto/backend && npm install --production

# Crear .env con las variables necesarias

# Iniciar con PM2
pm2 start index.js --name ekonsumo-api
pm2 save
```

### Frontend

```bash
# Compilar localmente
npm run build --workspace=frontend

# Subir dist/
rsync -avz dist/ user@server:/var/www/daw-proyecto/frontend/

# Asignar permisos
sudo chown -R www-data:www-data /var/www/daw-proyecto/frontend/
```

### Nginx

```nginx
server {
    server_name ekonsumo.duckdns.org;
    root /var/www/daw-proyecto/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
    }

    listen 443 ssl;
}
```

## Diseño Visual

### Paleta de Colores

- Primario: #4CAF50 (Verde - sostenibilidad)
- Secundario: #FF9800 (Naranja - botones)
- Fondo: #FFFFFF
- Texto: #333333
- Error: #DC3545

### Tipografía

- Principal: Open Sans
- Secundaria: Roboto

### Elementos UI

- Botones con bordes redondeados (5px) y sombra
- Formularios con focus en color primario
- Tarjetas con bordes redondeados (10px) y elevación

## Estado del Proyecto

### Funcionalidades Implementadas

- [x] Autenticación JWT con login por correo/móvil
- [x] Registro de usuarios
- [x] Recuperación de contraseña por email
- [x] Gestión de usuarios (admin)
- [x] Gestión de proveedores
- [x] Gestión de productos (con imágenes)
- [x] Sistema de pedidos (abierto/cerrado)
- [x] Pedidos periódicos
- [x] Gestión de pagos y liquidaciones mensuales
- [x] Sistema de familias
- [x] Notificaciones por email
- [x] Dashboard con estado de pedidos
- [x] Diseño responsivo con CSS unificado
- [x] Tests con Jest y Vitest
- [x] Linting con ESLint y Prettier
- [x] API documentada con Swagger

### Funcionalidades Pendientes

- [ ] Tests más exhaustivos
- [ ] Tests de integración
- [ ] Despliegue a producción
