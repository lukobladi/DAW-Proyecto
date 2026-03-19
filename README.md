# !!NOTA PARA EL FUTURO: mirar diseño de la web TromJaro: https://www.tromjaro.com/  !!


# DAW-Proyecto

## Instalación y Puesta en Marcha

### Requisitos Previos

Tener instalado el siguiente software antes de empezar:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (normalmente se instala con Node.js)
- [PostgreSQL](https://www.postgresql.org/)

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/DAW-Proyecto.git
    cd DAW-Proyecto
    ```

2.  **Instala las dependencias del Backend:**
    ```bash
    cd Backend
    npm install
    ```

3.  **Instala las dependencias del Frontend:**
    ```bash
    cd ../frontend
    npm install
    ```

### Configuración

1.  **Base de Datos:**
    - Crea una base de datos en PostgreSQL para el proyecto.
    - Puedes usar un cliente como `psql` o una herramienta gráfica como pgAdmin.

2.  **Variables de Entorno:**
    - Ve al directorio `Backend`.
    - Crea una copia del archivo `.env.example` y renómbrala a `.env`.
    - Abre el archivo `.env` y configura las variables de la base de datos (`DB_USER`, `DB_PASSWORD`, `DB_NAME`) y el `JWT_SECRET`.

### Ejecución

1.  **Inicia el servidor del Backend:**
    ```bash
    cd Backend
    npm start
    ```
    El servidor se ejecutará en `http://localhost:3000` (o el puerto que hayas definido en `.env`).

2.  **Inicia el servidor del Frontend:**
    ```bash
    cd frontend
    npm run serve
    ```
    La aplicación frontend estará disponible en `http://localhost:8080`.

---


## Tabla de Contenidos
- [DAW-Proyecto](#daw-proyecto)
  - [Tabla de Contenidos](#tabla-de-contenidos)
- [Descripción del Proyecto](#descripción-del-proyecto)
  - [Contexto Actual](#contexto-actual)
    - [Estructura del Grupo](#estructura-del-grupo)
      - [Ejemplo actual de uso para incorporar una familia:](#ejemplo-actual-de-uso-para-incorporar-una-familia)
      - [Ejemplo actual de uso semanal para una familia que quiere pedir verduras:](#ejemplo-actual-de-uso-semanal-para-una-familia-que-quiere-pedir-verduras)
      - [Ejemplo actual de uso semanal para una familia que quiere pedir huevos:](#ejemplo-actual-de-uso-semanal-para-una-familia-que-quiere-pedir-huevos)
      - [Ejemplo actual de uso semanal para la familia que gestiona las verduras:](#ejemplo-actual-de-uso-semanal-para-la-familia-que-gestiona-las-verduras)
      - [Ejemplo actual de uso semanal para la familia que gestiona el pan (periódico):](#ejemplo-actual-de-uso-semanal-para-la-familia-que-gestiona-el-pan-periódico)
    - [Pedidos](#pedidos)
    - [Pedido abierto](#pedido-abierto)
    - [Pedidos periódicos](#pedidos-periódicos)
    - [Frecuencia de Pedidos](#frecuencia-de-pedidos)
    - [Entrega de Productos](#entrega-de-productos)
    - [Reparto de Productos](#reparto-de-productos)
  - [Gestión Actual en Google Sheets](#gestión-actual-en-google-sheets)
    - [Cálculos Avanzados](#cálculos-avanzados)
  - [Propuesta de Solución](#propuesta-de-solución)
    - [Herramientas](#herramientas)
    - [Tecnologías de Programación](#tecnologías-de-programación)
      - [Backend API Rest](#backend-api-rest)
      - [Frontend Web](#frontend-web)
    - [Arquitectura del Sistema](#arquitectura-del-sistema)
      - [Componentes:](#componentes)
      - [Diagrama:](#diagrama)
    - [**Flujo de Usuario**](#flujo-de-usuario)
      - [Pasos:](#pasos)
      - [Diagrama:](#diagrama-1)
- [Roadmap del Proyecto](#roadmap-del-proyecto)
  - [1. Definición de Requisitos](#1-definición-de-requisitos)
  - [2. Planificación del Proyecto](#2-planificación-del-proyecto)
  - [3. Diseño de la Aplicación](#3-diseño-de-la-aplicación)
  - [4. Configuración del Entorno de Desarrollo](#4-configuración-del-entorno-de-desarrollo)
  - [5. Desarrollo del Back-End](#5-desarrollo-del-back-end)
  - [6. Desarrollo del Front-End](#6-desarrollo-del-front-end)
  - [7. Pruebas](#7-pruebas)
  - [8. Documentación](#8-documentación)
  - [9. Despliegue](#9-despliegue)
  - [10. Recopilación de Feedback y Mejora Continua](#10-recopilación-de-feedback-y-mejora-continua)
  - [11. Mantenimiento](#11-mantenimiento)
    - [**Autenticación y Autorización con JWT**](#autenticación-y-autorización-con-jwt)
      - [¿Qué es JWT?](#qué-es-jwt)
      - [Flujo de Autenticación con JWT:](#flujo-de-autenticación-con-jwt)
      - [Estructura del Token JWT:](#estructura-del-token-jwt)
      - [Implementación en el Proyecto:](#implementación-en-el-proyecto)
      - [Ventajas de JWT:](#ventajas-de-jwt)
    - [**Rutas Protegidas**](#rutas-protegidas)
    - [**Errores Comunes con JWT**](#errores-comunes-con-jwt)
- [Prototipos de la Aplicación Web](#prototipos-de-la-aplicación-web)
  - [1. Pantalla de Inicio](#1-pantalla-de-inicio)
  - [2. Pantalla de Registro](#2-pantalla-de-registro)
  - [3. Pantalla de Inicio de Sesión](#3-pantalla-de-inicio-de-sesión)
  - [4. Pantalla de Recuperar Contraseña](#4-pantalla-de-recuperar-contraseña)
  - [5. Pantalla de Dashboard (Tablero)](#5-pantalla-de-dashboard-tablero)
  - [6. Pantalla de Compras](#6-pantalla-de-compras)
  - [7. Pantalla de Historial de Pedidos](#7-pantalla-de-historial-de-pedidos)
  - [8. Pantalla de Detalles de Pedidos](#8-pantalla-de-detalles-de-pedidos)
  - [9. Pantalla de Gestión de Usuarios (para administradores)](#9-pantalla-de-gestión-de-usuarios-para-administradores)
  - [10. Pantalla de Configuración de Cuenta](#10-pantalla-de-configuración-de-cuenta)
  - [11. Pantalla de Soporte y Ayuda](#11-pantalla-de-soporte-y-ayuda)
  - [12. Pantalla de Gestión de Proveedores](#12-pantalla-de-gestión-de-proveedores)
  - [13. Pantalla de Gestión de Productos](#13-pantalla-de-gestión-de-productos)
  - [14. Pantalla de Gestión de Pedidos](#14-pantalla-de-gestión-de-pedidos)
  - [15. Barra de navegación](#15-barra-de-navegación)
  - [16. Pie de página](#16-pie-de-página)
- [Flujo de Usuario para la Aplicación Web](#flujo-de-usuario-para-la-aplicación-web)
  - [1. Gestión de Productos](#1-gestión-de-productos)
  - [2. Gestión de Compras](#2-gestión-de-compras)
  - [2. Gestión de Pedidos](#2-gestión-de-pedidos)
  - [3. Cálculos Financieros (para administradores)](#3-cálculos-financieros-para-administradores)
  - [4. Gestión de Usuarios (para administradores)](#4-gestión-de-usuarios-para-administradores)
  - [5. Notificaciones y Recordatorios](#5-notificaciones-y-recordatorios)
  - [6. Historial de Pedidos](#6-historial-de-pedidos)
  - [7. Configuración de Cuenta](#7-configuración-de-cuenta)
  - [8. Panel de Administración (para administradores)](#8-panel-de-administración-para-administradores)
  - [9. Informes y Estadísticas](#9-informes-y-estadísticas)
    - [4. **Diagrama de Flujo de Pedidos**](#4-diagrama-de-flujo-de-pedidos)
      - [Pasos:](#pasos-1)
      - [Diagrama:](#diagrama-2)
    - [5. **Diagrama de Navegación**](#5-diagrama-de-navegación)
      - [Páginas Principales:](#páginas-principales)
      - [Diagrama:](#diagrama-3)
    - [6. **Diagrama de Secuencia de Autenticación**](#6-diagrama-de-secuencia-de-autenticación)
      - [Pasos:](#pasos-2)
      - [Diagrama:](#diagrama-4)
    - [7. **Diagrama de Componentes del Frontend**](#7-diagrama-de-componentes-del-frontend)
      - [Componentes:](#componentes-1)
      - [Diagrama:](#diagrama-5)
- [Datos](#datos)
    - [**Diagrama de Base de Datos (ER)**](#diagrama-de-base-de-datos-er)
      - [Tablas Principales:](#tablas-principales)
      - [Diagrama:](#diagrama-6)
  - [Tablas Principales](#tablas-principales-1)
    - [1. Usuario](#1-usuario)
    - [2. Proveedor](#2-proveedor)
    - [3. Producto](#3-producto)
    - [4. Pedido](#4-pedido)
    - [5. Detalle\_Pedido](#5-detalle_pedido)
    - [6. Usuario\_Proveedor (Relación muchos a muchos)](#6-usuario_proveedor-relación-muchos-a-muchos)
    - [7. Pedido\_Periodico](#7-pedido_periodico)
    - [8. Pago (Nueva)](#8-pago-nueva)
    - [9. Notificacion (Nueva)](#9-notificacion-nueva)
- [Backend API Rest Node Express](#backend-api-rest-node-express)
    - [Descripción del Backend](#descripción-del-backend)
    - [Estructura del Proyecto](#estructura-del-proyecto)
  - [Descripción de los Archivos](#descripción-de-los-archivos)
    - [1. **Controladores (`src/controllers/`)**](#1-controladores-srccontrollers)
    - [2. **Modelos (`src/models/`)**](#2-modelos-srcmodels)
    - [3. **Rutas (`src/routes/`)**](#3-rutas-srcroutes)
    - [4. **Configuración (`src/config/`)**](#4-configuración-srcconfig)
    - [5. **Middleware (`src/middleware/`)**](#5-middleware-srcmiddleware)
    - [6. **Utilidades (`src/utils/`)**](#6-utilidades-srcutils)
    - [7. **Punto de Entrada (`src/server.js`)**](#7-punto-de-entrada-srcserverjs)
    - [8. **Configuración Principal (`src/app.js`)**](#8-configuración-principal-srcappjs)
  - [Requisitos del Backend](#requisitos-del-backend)
    - [1. **Autenticación y Autorización**](#1-autenticación-y-autorización)
    - [2. **Gestión de Productos**](#2-gestión-de-productos)
    - [3. **Gestión de Pedidos**](#3-gestión-de-pedidos)
    - [4. **Historial de Pedidos**](#4-historial-de-pedidos)
    - [5. **Configuración de Cuenta**](#5-configuración-de-cuenta)
    - [6. **Notificaciones**](#6-notificaciones)
    - [7. **Documentación de la API**](#7-documentación-de-la-api)
  - [Ejemplo de Rutas de la API](#ejemplo-de-rutas-de-la-api)
    - [1. **Autenticación**](#1-autenticación)
    - [2. **Usuarios**](#2-usuarios)
    - [3. **Productos**](#3-productos)
    - [4. **Proveedores**](#4-proveedores)
    - [5. **Pedidos**](#5-pedidos)
    - [6. **Notificaciones**](#6-notificaciones-1)
  - [Diseño Visual](#diseño-visual)
    - [1. Guía de Estilo](#1-guía-de-estilo)
      - [Paleta de Colores](#paleta-de-colores)
      - [Tipografía](#tipografía)
      - [Iconografía](#iconografía)
    - [2. Elementos de Interfaz](#2-elementos-de-interfaz)
      - [Botones](#botones)
      - [Formularios](#formularios)
      - [Tarjetas de Producto](#tarjetas-de-producto)
  - [Wireframes](#wireframes)
    - [Pantalla de Inicio](#pantalla-de-inicio)
    - [Pantalla de Registro](#pantalla-de-registro)
    - [Pantalla de Inicio de Sesión](#pantalla-de-inicio-de-sesión)
    - [Pantalla de Dashboard](#pantalla-de-dashboard)
    - [Pantalla de Productos](#pantalla-de-productos)
    - [Pantalla de Realización de Pedidos](#pantalla-de-realización-de-pedidos)
    - [Pantalla de Historial de Pedidos](#pantalla-de-historial-de-pedidos)
    - [Pantalla de Gestión de Usuarios (Administradores)](#pantalla-de-gestión-de-usuarios-administradores)
    - [Pantalla de Configuración de Cuenta](#pantalla-de-configuración-de-cuenta)
    - [Pantalla de Soporte y Ayuda](#pantalla-de-soporte-y-ayuda)
    - [Pantalla de Gestión de Proveedores](#pantalla-de-gestión-de-proveedores)
    - [Pantalla de Gestión de Productos](#pantalla-de-gestión-de-productos)
    - [Pantalla de Gestión de Pedidos](#pantalla-de-gestión-de-pedidos)
    - [Pantalla de Notificaciones](#pantalla-de-notificaciones)
  - [Componentes](#componentes-2)
    - [Componente `NavBar`](#componente-navbar)
    - [Componente `Footer`](#componente-footer)
    - [Componente `ProductCard`](#componente-productcard)
    - [Componente `PedidoCard`](#componente-pedidocard)
    - [Componente `Notification`](#componente-notification)
    - [Componente `UserForm`](#componente-userform)
    - [Componente `ProviderForm`](#componente-providerform)
    - [Componente `OrderForm`](#componente-orderform)
  - [Diseño Visual](#diseño-visual-1)
    - [Pantalla de Gestión de Proveedores](#pantalla-de-gestión-de-proveedores-1)
    - [Pantalla de Gestión de Productos](#pantalla-de-gestión-de-productos-1)
    - [Pantalla de Gestión de Pedidos](#pantalla-de-gestión-de-pedidos-1)
    - [Pantalla de Notificaciones](#pantalla-de-notificaciones-1)

---

# Descripción del Proyecto

El objetivo de este proyecto es desarrollar una aplicación web que facilite la gestión de un grupo de consumo local y ecológico, compuesto por aproximadamente cuarenta usuarios (familias) y quince productores. Actualmente, la gestión de pedidos y productos se realiza de manera manual a través de tablas en Google Sheets, lo que puede resultar ineficiente y propenso a errores.

## Contexto Actual

### Estructura del Grupo

El grupo está formado por familias que se encargan de contactar directamente con los productores. Cada usuario asume la responsabilidad de mantenerse en contacto con un proveedor específico, aunque hay algunos usuarios que no gestionan ningún proveedor. Será el usuario que gestiona ese proveedor el encargado de dar de alta, modificar y borrar productos. Será el encargado de dar de alta pedidos conjuntos estableciendo un periodo en el que los usuarios podrán añadir lineas al pedido.

#### Ejemplo actual de uso para incorporar una familia:
1. Contacta con responsable del grupo de consumo.
2. Responsable explica funcionamiento de grupo.
3. Responsable pide usuario de Google a la familia.
4. Responsable comparte la hoja de cálculo de Google con la familia.

#### Ejemplo actual de uso semanal para una familia que quiere pedir verduras:
1. Entra a Google Docs.
2. Entra a la sheet compartida.
3. Busca la hoja correspondiente al productor de verduras (semanal).
4. Comprueba que el cuadro corresponde a la semana actual (se pone cabecera verde).
5. Se sitúa en la columna correspondiente a su familia.
6. Va introduciendo las unidades de cada producto que desea.
7. En la parte de abajo le calcula el importe total.
8. La semana siguiente tendrá la nueva tabla vacía.

#### Ejemplo actual de uso semanal para una familia que quiere pedir huevos:
1. Entra a Google Docs.
2. Entra a la sheet compartida.
3. Busca la hoja correspondiente al productor de huevos (semanal y periódico).
4. Comprueba que el cuadro corresponde a la semana actual (se pone cabecera verde).
5. Se sitúa en la columna correspondiente a su familia.
6. Introduce las unidades.
7. En la parte de abajo le calcula el importe total.
8. Hasta que modifique las unidades, recibirá ese pedido semanalmente de manera automática.

#### Ejemplo actual de uso semanal para la familia que gestiona las verduras:
1. Entra a Google Docs.
2. Entra a la sheet compartida.
3. Busca la hoja correspondiente al productor de verduras (semanal).
4. Busca el cuadro con la suma total de unidades de cada verdura.
5. Contacta con el proveedor o automáticamente se le envía correo desde la sheet.
6. (Esto ahora es automático) Duplica el cuadro (vacío) de la semana pasada en las filas inferiores y se establece la cabecera del pedido actual en verde y la anterior en rojo.
7. Al final de mes, el productor le pasa factura.
8. Comprueba que el importe coincide con los pedidos.

#### Ejemplo actual de uso semanal para la familia que gestiona el pan (periódico):
1. Entra a Google Docs.
2. Entra a la sheet compartida.
3. Busca la hoja correspondiente al productor de pan (semanal).
4. Busca el cuadro con la suma total de unidades de cada pan.
5. Contacta con el proveedor o automáticamente se le envía correo desde la sheet.
6. (Esto ahora es automático) Duplica el cuadro de la semana pasada (arrastrando las unidades también) en las filas inferiores y se establece la cabecera del pedido actual en verde y la anterior en rojo.
7. Al final de mes, el productor le pasa factura.
8. Comprueba que el importe coincide con los pedidos.

### Pedidos 
Los pedidos se hacen de manera conjunta entre todos los usuarios del grupo. Los pedidos los abre el usuario encargado de ese proveedor(grupo de productos). 

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

## Gestión Actual en Google Sheets

La gestión de pedidos y productos se organiza en Google Sheets de la siguiente manera:

- **Páginas por Proveedor**: Cada proveedor tiene su propia página en la hoja de cálculo.
- **Registro de Productos**: Cada producto se representa en una fila, lo que permite un seguimiento claro de la disponibilidad y características de cada uno.
- **Pedidos**: Cada pedido se compone de varias filas, donde se establece una fecha máxima de modificación, la fecha de pedido y la periodicidad de los mismos.
- **Usuarios y Familias**: Cada familia o usuario tiene su propia columna, lo que facilita el seguimiento de sus pedidos y gastos.

### Cálculos Avanzados
Se realizan cálculos complejos para gestionar la información financiera y de pedidos:

- **Gasto Mensual**: Se calcula el gasto mensual de cada familia. Aquellos que gestionan un proveedor y realizan el pago de los pedidos tienen un saldo positivo. Al final del mes, se determina qué familias deben dinero y a quién se lo deben.
- **Cálculo de Pedidos**: Se establece un cálculo para determinar el pedido que debe enviarse al proveedor o productor antes de la fecha límite.

## Propuesta de Solución

La nueva aplicación web permitirá automatizar y optimizar todos estos procesos, ofreciendo una interfaz más amigable y eficiente para los usuarios. Algunas de las características clave incluirán:

- **Gestión de Productos y Proveedores**: Una sección dedicada para que los usuarios gestores puedan ver y gestionar los productos y proveedores de manera más intuitiva.
- **Sistema de Pedidos**: Un sistema que permita abrir pedidos de forma sencilla a los usuarios gestores.
- **Sistema de Compras**: Un sistema que permita añadir productos a la cesta mensual de manera intuitiva.
- **Cálculos Automáticos**: Automatización de los cálculos de gastos y deudas, eliminando la necesidad de realizar cálculos manuales en hojas de cálculo.
- **Interacción entre Usuarios**: Facilitar la comunicación entre usuarios y productores, mejorando la colaboración y la eficiencia del grupo.

---

### Herramientas

- **GitHub**: Para el control de versiones y el repositorio remoto.
- **Visual Studio Code**: Editor de código muy versátil, con mucha comunidad, e infinidad de extensiones:
  - **Git Graph**: Para visualizar ramas y commits de Git de manera gráfica.
  - **Debugger for Firefox**: Para depurar el código directamente en Firefox.
  - **Vue**: La extensión oficial de Vue, con autocompletado y herramientas de depuración.
- **Penpot**: Lo uso para prototipar interfaces. Es gratis y muy intuitivo.
- **Draw.io**: Para crear diagramas rápidos, como flujos de trabajo o esquemas de la base de datos.
- **Gimp**: Editor de imágenes para retocar o optimizar imágenes para la app.
- **Clouding.io**: VPS que he configurado con Debian para alojar la app en producción. Es rápido, seguro y fácil de configurar.
- **VUE dev tools**: Estensión de navegador para depurar aplicaciones desarrolladas con VUE.

---

### Tecnologías de Programación

- **Node.js**: Entorno de ejecución JavaScript que permite usar el mismo lenguaje en frontend y backend.
- **npm**: Gestor de paquetes de Node.js. Permite instalar paquetes y librerías y gestiona dependencias.

#### Backend API Rest

- **PostgreSQL**: El motor de base de datos elegido. Es robusto y escalable, ideal para manejar datos complejos.
- **Swagger**: Herramienta para documentar la API de manera interactiva. Así cualquiera puede entender cómo usarla.
- **Express**: Framework en Node para crear la API. Es flexible y fácil de usar.
  - **Cors**: Para permitir que el frontend se comunique con el backend sin problemas de CORS.
  - **express-validator**: Para validar y sanitizar los datos que llegan al backend.
  - **swagger-jsdoc**: Genera la documentación de Swagger automáticamente desde los comentarios del código.
  - **swagger-ui-express**: Sirve la interfaz de Swagger para probar la API desde el navegador.
  - **dotenv**: Para gestionar variables de entorno, como credenciales de la base de datos.
  - **multer**: Para manejar la subida de archivos, como las imágenes de los productos.
  - **nodemailer**: Permite enviar emails mediante diferentes servicios de correo.
  - **bcryptjs**: Permite almacenar las contraseñas de forma segura mediante hashing.
  - **jsonwebtoken (JWT)**: Permite generar y verificar tokens JWT (JSON Web Tokens) para implementar autenticación y autorización seguras.
  - **Jest**: Framework de pruebas para JavaScript.
  - **Supertest**: Herramienta para realizar pruebas de endpoints HTTP.

---

#### Frontend Web

- **Vue.js**: Framework de Node para el frontend. Es sencillo y con un desarrollo agil y quiero probar una tecnología que desconozco.
  - **vue-router**: Para gestionar la navegación entre vistas en una aplicación de una sola página (SPA).
  - **Bootstrap**: Para crear interfaces modernas y responsivas sin complicaciones.
  - **axios**: Para hacer peticiones HTTP a la API desde el frontend.
  - **vuex**: Para gestionar el estado global de la aplicación de manera centralizada.

---

### Arquitectura del Sistema
Este diagrama muestra los componentes principales del sistema y cómo interactúan entre sí.

#### Componentes:
- **Frontend (Node.js + Vue.js + Bootstrap)**: Interfaz de usuario para los usuarios del grupo de consumo.
- **Backend (Node.js + Express)**: API REST que gestiona las solicitudes del frontend.
- **Base de Datos (PostgreSQL)**: Almacena la información de usuarios, productos, proveedores, pedidos, etc.
- **Servicios Externos**: Notificaciones por correo electrónico o SMS. Librearias Node.js

#### Diagrama:
```
[Usuario] -> [Frontend (Vue.js)] -> [Backend (Node.js + Express)] -> [Base de Datos (PostgreSQL)]
[Backend] -> [Servicio de Notificaciones (Email/SMS)]
```

---

### **Flujo de Usuario**
Este diagrama representa el flujo de un usuario típico en la aplicación.

#### Pasos:
1. **Inicio de Sesión/Registro**: El usuario inicia sesión o se registra.
2. **Dashboard**: El usuario accede a su panel principal.
3. **Gestión de Productos**: El usuario gestor añade, edita o elimina productos.
4. **Gestión de Pedidos**: El usuario gestor abre o cierra pedidos.
5. **Historial de Pedidos**: El usuario consulta su historial de pedidos.
6. **Configuración de Cuenta**: El usuario actualiza su información personal.

#### Diagrama:
```
[Inicio de Sesión/Registro] -> [Dashboard]  -> [Gestión de Productos] 
                                            -> [Gestión de Pedidos] 
                                            -> [Historial de Pedidos] 
                                            -> [Configuración de Cuenta]
```

---

# Roadmap del Proyecto

## 1. Definición de Requisitos
- [X] Crear una lista de funcionalidades clave.

## 2. Planificación del Proyecto
- [X] Establecer un cronograma con hitos y plazos.

## 3. Diseño de la Aplicación
- [ ] Crear wireframes o prototipos de la interfaz de usuario.
- [X] Definir el flujo de usuario para cada funcionalidad.

## 4. Configuración del Entorno de Desarrollo
- [X] Instalar Node.js, Express, PostgreSQL, Vue.js y Bootstrap.
- [X] Configurar un repositorio en GitHub para gestionar el código.

## 5. Desarrollo del Back-End
- [X] Definir los modelos de datos en PostgreSQL (productos, pedidos, usuarios).
- [X] Implementar las rutas de la API en Express.
- [ ] Configurar la autenticación con JWT.
- [X] Establecer la conexión a la base de datos utilizando la biblioteca `pg`.

## 6. Desarrollo del Front-End
- [ ] Construir la interfaz de usuario utilizando Vue.js y Bootstrap.
- [X] Conectar el front-end con la API a través de Axios.
- [X] Considerar el uso de Vuex para la gestión del estado.

## 7. Pruebas
- [ ] Implementar pruebas unitarias para componentes y funciones.
- [ ] Realizar pruebas de integración entre el front-end y el back-end.

## 8. Documentación
- [X] Documentar la API utilizando herramientas como Swagger.
- [ ] Crear una guía de usuario para ayudar a los miembros del grupo.

## 9. Despliegue
- [X] Elegir un servicio de hosting para desplegar la aplicación.
- [ ] Configurar el entorno de producción para la base de datos y la aplicación.

## 10. Recopilación de Feedback y Mejora Continua
- [ ] Lanzar una versión beta para un grupo selecto de usuarios.
- [ ] Recopilar feedback y realizar mejoras en la aplicación.

## 11. Mantenimiento
- [ ] Establecer un plan para el soporte técnico y la resolución de problemas.
- [ ] Planificar actualizaciones regulares para mejorar la aplicación.

---


### **Autenticación y Autorización con JWT**

#### ¿Qué es JWT?
**JSON Web Tokens (JWT)** es un estándar para representar datos de forma segura entre dos partes. En este proyecto, se utiliza para autenticar usuarios y proteger rutas sensibles en la API.

#### Flujo de Autenticación con JWT:
1. **Inicio de Sesión**:
   - El usuario envía sus credenciales (correo/móvil y contraseña) al backend.
   - El backend valida las credenciales y genera un token JWT si son correctas.
   - El token se devuelve al frontend y se almacena en el `localStorage` o `sessionStorage`.

2. **Acceso a Rutas Protegidas**:
   - El frontend incluye el token en el encabezado `Authorization` de cada solicitud HTTP.
   - El backend verifica el token antes de permitir el acceso a las rutas protegidas.

3. **Cierre de Sesión**:
   - El frontend elimina el token del almacenamiento local.
   - El usuario ya no puede acceder a rutas protegidas.

#### Estructura del Token JWT:
Un token JWT consta de tres partes:
1. **Header**: Contiene el tipo de token y el algoritmo de firma.
2. **Payload**: Contiene los datos del usuario (como `id`, `correo`, `rol`) y la fecha de expiración.
3. **Signature**: Garantiza que el token no ha sido alterado.

Ejemplo de un token JWT:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29ycmVvIjoiam9obkBleGFtcGxlLmNvbSIsInJvbCI6InVzZXIiLCJpYXQiOjE2MjYyNzYwMDAsImV4cCI6MTYyNjI3OTYwMH0.4f5c8b1d8e9e8f8f8f8f8f8f8f8f8f8f8f8f8f8
```


#### Implementación en el Proyecto:
1. **Generación del Token**:
   - Se utiliza la biblioteca `jsonwebtoken` para generar el token en el backend.
   - Ejemplo:
     ```javascript
     const jwt = require('jsonwebtoken');
     const SECRET_KEY = 'clave_secreta';

     const token = jwt.sign(
       { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
       SECRET_KEY,
       { expiresIn: '1h' } // El token expira en 1 hora
     );
     ```

2. **Verificación del Token**:
   - Se utiliza un middleware para verificar el token en las rutas protegidas.
   - Ejemplo:
     ```javascript
     const authMiddleware = (req, res, next) => {
       const token = req.headers['authorization'];
       if (!token) {
         return res.status(401).send('Acceso denegado. No se proporcionó un token.');
       }

       try {
         const decoded = jwt.verify(token, SECRET_KEY);
         req.user = decoded; // Agrega los datos del usuario al objeto `req`
         next();
       } catch (err) {
         res.status(401).send('Token inválido o expirado.');
       }
     };
     ```

3. **Uso en el Frontend**:
   - El token se almacena en el `localStorage` después de iniciar sesión:
     ```javascript
     localStorage.setItem('authToken', token);
     ```
   - Se incluye en las solicitudes HTTP usando Axios:
     ```javascript
     apiClient.interceptors.request.use((config) => {
       const token = localStorage.getItem('authToken');
       if (token) {
         config.headers['Authorization'] = token;
       }
       return config;
     });
     ```

#### Ventajas de JWT:
- **Seguridad**: Los datos están firmados y no pueden ser alterados.
- **Escalabilidad**: No requiere almacenar sesiones en el servidor.
- **Flexibilidad**: Puede incluir información adicional en el payload.

---

### **Rutas Protegidas**
Las siguientes rutas están protegidas y requieren un token JWT válido para acceder:
- **GET `/api/usuarios/perfil`**: Obtiene el perfil del usuario autenticado.
- **POST `/api/pedidos`**: Crea un nuevo pedido.
- **PUT `/api/productos/:id`**: Actualiza un producto existente.
- **DELETE `/api/usuarios/:id`**: Elimina un usuario (solo para administradores).

---

### **Errores Comunes con JWT**
1. **Token no proporcionado**:
   - Mensaje: `Acceso denegado. No se proporcionó un token.`
   - Solución: Asegúrate de incluir el token en el encabezado `Authorization`.

2. **Token inválido o expirado**:
   - Mensaje: `Token inválido o expirado.`
   - Solución: Solicita un nuevo token iniciando sesión nuevamente.

3. **Falta de permisos**:
   - Mensaje: `Acceso denegado. No tienes permisos para realizar esta acción.`
   - Solución: Verifica que el usuario tenga el rol adecuado para acceder a la ruta.

---


# Prototipos de la Aplicación Web

## 1. Pantalla de Inicio
- **Elementos Clave**:
  - Logo del grupo de consumo.
  - Breve descripción del grupo y su misión.
  - Botón de "Iniciar Sesión" o "Registrarse".

**Interacciones**:
- Al hacer clic en "Iniciar Sesión", se abre la Pantalla de Inicio de Sesión.
- Al hacer clic en "Registrarse", se abre la Pantalla de Registro.

## 2. Pantalla de Registro
- **Elementos Clave**:
  - Formulario de registro con campos para:
    - Nombre completo.
    - Correo electrónico.
    - Movil
    - Contraseña.
    - Confirmar contraseña.
  - Botón de "Registrarse".
  - Enlace a "Iniciar Sesión" si ya tiene una cuenta.

**Interacciones**:
- Al hacer clic en "Registrarse", se valida la información:
  - Si es correcta, se muestra un mensaje de éxito y se redirige a la Pantalla de Inicio de Sesión.
  - Si hay errores, se muestran mensajes de validación (por ejemplo, "El correo ya está registrado").

## 3. Pantalla de Inicio de Sesión
- **Elementos Clave**:
  - Formulario de inicio de sesión con campos para:
    - Móvil.
    - Contraseña.
  - Botón de "Iniciar Sesión".
  - Enlace a "¿Olvidaste tu contraseña?".

**Interacciones**:
- Al hacer clic en "Iniciar Sesión", se valida la información:
  - Si es correcta, se redirige al Dashboard.
  - Si hay errores, se muestra un mensaje de error (por ejemplo, "Credenciales incorrectas").
- Al hacer clic en "¿Olvidaste tu contraseña?", se abre la Pantalla de Recuperación de Contraseña.

## 4. Pantalla de Recuperar Contraseña
- **Elementos Clave**:
  - Formulario de recuperar contraseña con campos para:
    - Móvil.
  - Botón: [Enviar Instrucciones].

**Interacciones**:
- Al hacer clic en "Enviar Instrucciones", se envía un correo o SMS con un enlace para restablecer la contraseña.

## 5. Pantalla de Dashboard (Tablero)
- **Elementos Clave**:
  - Cesta mensual. Lista de productos pedidos y su estado.
  - Acceso rápido a "Adquirir productos".
  - Sección de "Productos Disponibles".
  - Notificaciones sobre pedidos abiertos (no periódicos).

**Interacciones**:
- Al hacer clic en "Adquirir productos", se abre la Pantalla de compras.
- Al hacer clic en "Ver Historial de Pedidos", se abre la Pantalla de Historial de Pedidos.

## 6. Pantalla de Compras
- **Elementos Clave**:
  - Agrupados por proveedor/grupo productos
  - Tiene que diferenciarse bien los proveedor/grupo productos que esten abiertos(pedidos abiertos)
  - Lista de productos con:
    - Nombre del producto.
    - Descripción.
    - Precio.
    - Botón de "Añadir a la cesta/pedido conjunto". Solo si el pedido está abierto.
  - Filtros para buscar productos por categoría o proveedor.

**Interacciones**:
- Al hacer clic en "Añadir producto", se actualiza el carrito/cesta y se muestra un mensaje de confirmación.
- Al hacer clic en "Ver Cesta", se abre la Pantalla de la cesta o dashboard.

## 7. Pantalla de Historial de Pedidos
- **Elementos Clave**:
  - Usuario.
  - Si es admin, desplegable para seleccionar el usuario (en caso de querer utilizar la misma pantalla para que el administrador pueda gestionar pedidos. Igual no es la mejor opción)
  - Lista de pedidos anteriores con:
    - Fecha de entrega.
    - Importe.
    - Estado del pedido (entregado, repartido, pendiente, cancelado, en proceso).
    - Botón [Ver Detalles].
  - Opción para ver detalles de cada pedido.

## 8. Pantalla de Detalles de Pedidos
- **Elementos Clave**:
  - Usuario.  
  - Lista de productos del pedido:
    - Usuario que lo ha comprado.
    - proveedor/grupo productos
    - Unidades.
    - Importe.

## 9. Pantalla de Gestión de Usuarios (para administradores)
- **Elementos Clave**:
  - Lista de usuarios con:
    - Nombre.
    - Correo electrónico.
    - Teléfono.
    - Estado (activo/inactivo).
    - Rol
    - Proveedor/es asignados
    - Botones para "Editar" o "Eliminar" usuarios.
  - Opción para añadir nuevos usuarios.

**Interacciones**:
- Al hacer clic en "Editar", se abre modal de Edición de Usuario.
- Al hacer clic en "Eliminar", se muestra un mensaje de confirmación y se elimina el usuario.

## 10. Pantalla de Configuración de Cuenta
- **Elementos Clave**:
  - USuario
  - Formulario para actualizar información del usuario:
    - Nombre.
    - Correo electrónico.
    - Móvil
    - Rol
    - Proveedor/es
    - Contraseña (opcional). 
  - Botón de "Guardar Cambios".

**Interacciones**:
- Al hacer clic en "Actualizar Información", se valida la información y se muestra un mensaje de éxito.

## 11. Pantalla de Soporte y Ayuda
- **Elementos Clave**:
  - Sección de preguntas frecuentes (FAQ).
  - Formulario de contacto para enviar consultas.
  - Información de contacto del grupo.

**Interacciones**:
- Al hacer clic en "Enviar Consulta", se muestra un mensaje de confirmación.

## 12. Pantalla de Gestión de Proveedores
- **Elementos Clave**:
  - Admin permiso total.
  - Usuarios que gestionan un proveedor, permiso de modificar.
  - Lista de proveedores con:
    - Nombre proveedor/grupo productos
    - Contacto
    - Método de pago
    - Correo electrónico.
    - Teléfono.
    - Estado (activo/inactivo).
    - Botones para "Editar" o "Eliminar" proveedores.
    - Listado de productos.
  - Opción para añadir nuevos proveedores.

**Interacciones**:
- Al hacer clic en añadir proveedor se abre un modal con un formulario para introducir los datos del proveedor.

## 13. Pantalla de Gestión de Productos
- **Elementos Clave**:
  - Admin y usuario gestor del proveedor permiso total.
  - Lista de productos con:
    - Nombre.
    - Descripción.
    - Precio.
    - Proveedor/grupo productos.
    - Imagen
    - Estado (activo/inactivo).
    - Botones para "Editar" o "Eliminar" productos.
  - Opción para añadir nuevos productos.

## 14. Pantalla de Gestión de Pedidos
- **Elementos Clave**:
  - Admin y usuario gestor del proveedor permiso total.
  - El usuario gestor del proveedor será el encargado de abrir pedidos.
  - Lista de pedidos con:
    - Id.
    - Proveedor/grupo productos
    - Fecha de entrega (si hay).
    - Fecha de apertura.
    - Fecha de cierre.
    - Importe total.
    - Ver detalles de pedido.
  - Opción para crear un nuevo pedido. Abre modal con:
    - Fecha de apertura. Desde cuando los usuarios podrán pedir productos.
    - Fecha de cierre. Hasta cuando podrán los usuarios pedir, modificar o borrar productos.
    - Fecha aproximada de reparto.
    - Periodicidad. Para programar el pedido para que se abra con los mismos parámetros cada X días.

## 15. Barra de navegación
- **Elementos Clave**:
  - Usuario
  - Cerrar sesión
  - Dashboard
  - Historial pedidos
  - COmpras
  - Gestión de usuarios (solo admin)
  - Configuracion de cuenta
  - Ayuda
  - Gestión de proveedores (solo admin)
  - Gestión de productos (solo admin)
  - Gestión de pedidos (solo admin)

## 16. Pie de página
- **Elementos Clave**:
  - RRSS
  - Datos de la web
  -
  -
  -
  
---

# Flujo de Usuario para la Aplicación Web

## 1. Gestión de Productos
- **Flujo de Usuario**:

  3. **Añadir un Producto (al proveedor/grupo de productos)** (para administradores y el usuario responsable de ese productor/grupodeproductos):
     - El administrador selecciona "Añadir Producto".
     - Completa un formulario con la información del producto (nombre, descripción, precio, proveedor/grupodeproductos).
     - Hace clic en "Guardar" para añadir el producto a la base de datos.
  4. **Editar o Eliminar un Producto** (para administradores y el usuario responsable de ese grupodeproductos/proveedor):
     - El administrador selecciona un producto de la lista.
     - Elige "Editar" para modificar la información o "Eliminar" para quitar el producto.
     - Confirma la acción.


---

## 2. Gestión de Compras
- **Flujo de Usuario**:
  1. **Acceso a la sección de Productos**:
     - El usuario inicia sesión en la aplicación.
     - Navega al menú y selecciona "Productos".
  2. **Visualización de Productos**:
     - Se muestra una lista de productos disponibles con detalles (nombre, descripción, precio, proveedor/grupodeproductos).
     - El usuario selecciona un grupo de productos (proveedor).
     - Si el pedido a ese proveedor está abierto, estarán activados los botones para añadir productos.
     - El usuario selecciona productos y cantidades.
     - El usuario hace clic en **"Añadir al Pedido"**.
     - El usuario puede aplicar filtros para buscar productos específicos.
  5. **Pantalla de dashboard - Cesta de Compras Mensual**:
     - La cesta se resetea mensualmente. Excepto productos no entregados. 
     - El usuario ve un listado de los productos pedidos ese mes.
     - Al lado de cada producto se muestra el estado.
  6. **Notificación al Proveedor y usuario gestor**:
     - Cuando llega la fecha límite (fecha cierre de pedido), se notifica al proveedor y al usuario encargado de ese proveedor.
     - Los productos se marcan como **"En proceso"**.
  7. **Seguimiento del Pedido**:
     - El usuario puede ver el estado del pedido en el **Dashboard** y en el **Historial de Pedidos**.
     - Estados: En proceso, En reparto, Entregado, Repartido.
  8. **Entrega del Pedido**:
     - El proveedor entrega los productos.
     - El usuario confirma la entrega.
     - El sistema actualiza el estado del pedido a **"Entregado"** .

       8. **Reparto del Pedido**:
     - El usuario gestor del proveedor entrega los productos.
     - El usuario confirma  reparto.
     - El sistema actualiza el estado del pedido a  **"Repartido"**.

---

## 2. Gestión de Pedidos
- **Flujo de Usuario**:
  1. **Acceso a la sección de Pedidos**:
     - El usuario gestor del proveedor o el admin inicia sesión y selecciona "Pedidos" en el menú.
  2. **Crear un Nuevo Pedido (conjunto)** (para administradores y el usuario responsable de ese productor/proveedor):
     - El usuario hace clic en "Abrir Pedido".
     - Se muestra un modal para crear el pedido.
     - El usuario selecciona la fecha de apertura, fecha de cierre, fecha aproximada de entrega y la posibilidad de hacerlo periódico.
  3. **Gestión de Pedidos Existentes (Historial de pedidos)** (para administradores y el usuario responsable de ese productor/proveedor):
     - El usuario puede ver una lista de pedidos anteriores.
     - Selecciona un pedido para ver detalles, duplicar o cancelar si está pendiente.
     - En los detalles se muestra el listado de productos, cantidades, usuario que ha comprado, importe, etc.

---

## 3. Cálculos Financieros (para administradores)
- **Flujo de Usuario**:
  1. **Acceso a la sección de Finanzas**:
     - El usuario inicia sesión y selecciona "Finanzas" en el menú.
  2. **Visualización de Gastos Mensuales**:
     - Se muestra un resumen de los gastos mensuales de las familias.
     - El usuario puede ver detalles de cada pedido y el saldo actual de cada usuario.
  3. **Gestión de Deudas**:
     - El usuario puede ver a quién debe dinero y el importe.
     - Opción para marcar deudas como pagadas.

---

## 4. Gestión de Usuarios (para administradores)
- **Flujo de Usuario**:
  1. **Acceso a la sección de Gestión de Usuarios**:
     - El administrador inicia sesión y selecciona "Usuarios" en el menú.
  2. **Visualización de Usuarios**:
     - Se muestra una lista de usuarios con detalles (nombre, correo electrónico, estado, movil, activo, rol, proveedor/es).
     - Opción para buscar usuarios específicos.
  3. **Añadir un Nuevo Usuario**:
     - El administrador hace clic en "Añadir Usuario".
     - Completa un formulario con la información del nuevo usuario.
     - Hace clic en "Guardar" para añadir el usuario.
  4. **Editar o Eliminar un Usuario**:
     - El administrador selecciona un usuario de la lista.
     - Elige "Editar" para modificar la información o "Eliminar" para quitar el usuario.
     - Confirma la acción.

---

## 5. Notificaciones y Recordatorios
- **Flujo de Usuario**:
  1. **Configuración de Notificaciones**:
     - El usuario accede a "Configuración de Cuenta".
     - Selecciona "Notificaciones".
     - Activa o desactiva las notificaciones para fechas de pedidos y vencimientos.
  2. **Recepción de Notificaciones**:
     - El usuario recibe notificaciones por correo electrónico o en la aplicación sobre fechas límite de pedidos y actualizaciones.

---

## 6. Historial de Pedidos
- **Flujo de Usuario**:
  1. **Acceso a la sección de Historial de Pedidos**:
     - El usuario inicia sesión y selecciona "Historial de Pedidos" en el menú.
  2. **Visualización de Pedidos Anteriores**:
     - Se muestra una lista de pedidos anteriores con detalles como:
       - Fecha del pedido.
       - Productos solicitados.
       - Estado del pedido (completado, pendiente, cancelado).
  3. **Ver Detalles de un Pedido**:
     - El usuario selecciona un pedido de la lista.
     - Se muestra una vista detallada del pedido, incluyendo:
       - Productos solicitados.
       - Cantidades.
       - Total del pedido.
       - Estado del pedido.
  4. **Opción para Repetir un Pedido**:
     - El usuario puede seleccionar "Repetir Pedido" para crear un nuevo pedido con los mismos productos.
     - Se redirige al flujo de creación de pedidos con los productos preseleccionados.

---

## 7. Configuración de Cuenta
- **Flujo de Usuario**:
  1. **Acceso a la sección de Configuración de Cuenta**:
     - El usuario inicia sesión y selecciona "Configuración de Cuenta" en el menú.
  2. **Visualización de Información de la Cuenta**:
     - Se muestra la información actual del usuario, incluyendo:
       - Nombre.
       - Correo electrónico.
       - Opciones de seguridad.
       - Movil
       - Activo
       - Rol
       - Proveedor/es
  3. **Actualizar Información**:
     - El usuario puede editar su nombre o correo electrónico.
     - Opción para cambiar la contraseña.
     - Hace clic en "Guardar Cambios" para aplicar las modificaciones.
  4. **Cerrar Sesión**:
     - El usuario puede seleccionar "Cerrar Sesión" para salir de la aplicación.

---

## 8. Panel de Administración (para administradores)
- **Flujo de Usuario**:
  1. **Acceso al Panel de Administración**:
     - El administrador inicia sesión y selecciona "Panel de Administración" en el menú.
  2. **Visualización de Resumen General**:
     - Se muestra un resumen de la actividad del grupo, incluyendo:
       - Total de usuarios.
       - Total de pedidos realizados.
       - Productos más solicitados.
  3. **Gestión de Productos y Usuarios**:
     - El administrador puede acceder a las secciones de "Gestión de Productos" y "Gestión de Usuarios" desde el panel.
     - Opción para ver estadísticas y reportes sobre el consumo y pedidos.
  4. **Configuración de Parámetros del Grupo**:
     - El administrador puede ajustar configuraciones generales del grupo, como:
       - Frecuencias de pedidos.
       - Notificaciones automáticas.
     - Hace clic en "Guardar Cambios" para aplicar las modificaciones.

---

## 9. Informes y Estadísticas
- **Flujo de Usuario**:
  1. **Acceso a la sección de Informes**:
     - El usuario o administrador inicia sesión y selecciona "Informes" en el menú.
  2. **Visualización de Informes Generales**:
     - Se muestra una lista de informes disponibles, como:
       - Consumo mensual.
       - Gastos por familia.
       - Productos más comprados.
  3. **Generación de Informes Personalizados**:
     - El usuario puede seleccionar criterios para generar informes personalizados.
     - Hace clic en "Generar Informe" para visualizar los datos.
  4. **Descarga de Informes**:
     - Opción para descargar los informes en formato PDF o CSV.
     - Se muestra un mensaje de confirmación de que el informe ha sido descargado.

---

### 4. **Diagrama de Flujo de Pedidos**
Este diagrama muestra el flujo de un pedido desde su creación hasta su entrega.

#### Pasos:
1. **Apertura de Pedido**: El usuario gestor abre un pedido.
2. **Compras/Añadir Productos**: Los usuarios añaden productos al pedido.
3. **Cierre de Pedido**: El usuario gestor cierra el pedido.
4. **Notificación al Proveedor**: El sistema notifica al proveedor.
5. **Entrega de Productos**: El proveedor entrega los productos.
6. **Reparto de Productos**: Los productos se reparten entre los usuarios.

#### Diagrama:
```
[Apertura de Pedido] -> [Añadir Productos] -> [Cierre de Pedido] -> [Notificación al Proveedor] -> [Entrega de Productos] -> [Reparto de Productos]
```

---

### 5. **Diagrama de Navegación**
Este diagrama muestra la estructura de las páginas de la aplicación y cómo se navega entre ellas.

#### Páginas Principales:
- **Inicio**: Página de bienvenida.
- **Inicio de Sesión**: Página para iniciar sesión.
- **Registro**: Página para registrarse.
- **Dashboard**: Página principal del usuario.
- **Productos**: Página de gestión de productos.
- **Proveedores**: Página de gestión de proveedores.
- **Pedidos**: Página de gestión de pedidos.
- **Historial**: Página de historial de pedidos.
- **Configuración**: Página de configuración de cuenta.
- **Soporte**: Página de soporte y ayuda.
- **Compras**: Página donde el usuario puede comprar productos (añadirlos al pedido abierto) o ver los productos de proveedores que no tienen pedido abierto.


#### Diagrama:
```
[Inicio] -> [Inicio de Sesión] -> [Dashboard] -> [Productos]
[Inicio] -> [Registro] -> [Dashboard] -> [Proveedores]
[Dashboard] -> [Pedidos] -> [Historial]
[Dashboard] -> [Configuración]
[Dashboard] -> [Soporte]
```

---

### 6. **Diagrama de Secuencia de Autenticación**
Este diagrama muestra el flujo de autenticación de un usuario.

#### Pasos:
1. **Solicitud de Inicio de Sesión**: El usuario introduce sus credenciales.
2. **Validación de Credenciales**: El backend valida las credenciales.
3. **Generación de Token**: El backend genera un token JWT.
4. **Respuesta al Frontend**: El backend devuelve el token al frontend.
5. **Almacenamiento del Token**: El frontend almacena el token en el localStorage.
6. **Acceso a Rutas Protegidas**: El frontend usa el token para acceder a rutas protegidas.

#### Diagrama:
```
[Usuario] -> [Frontend] -> [Backend] -> [Base de Datos]
[Backend] -> [Frontend] -> [Usuario]
```

---

### 7. **Diagrama de Componentes del Frontend**
Este diagrama muestra los componentes principales del frontend y cómo interactúan entre sí.

#### Componentes:
- **NavBar**: Barra de navegación superior.
- **Footer**: Pie de página.
- **ProductCard**: Tarjeta de producto.
- **PedidoCard**: Tarjeta de pedido.
- **Notification**: Componente de notificaciones.
- **Vistas**: Páginas principales de la aplicación.

#### Diagrama:
```
[App.vue] -> [NavBar] -> [Footer]
[App.vue] -> [Vistas] -> [ProductCard]
[App.vue] -> [Vistas] -> [PedidoCard]
[App.vue] -> [Vistas] -> [Notification]
```

---

# Datos

### **Diagrama de Base de Datos (ER)**
Este diagrama muestra las tablas de la base de datos y sus relaciones.

#### Tablas Principales:
- **Usuario**: Almacena la información de los usuarios.
- **Proveedor**: Almacena la información de los proveedores.
- **Producto**: Almacena la información de los productos.
- **Pedido**: Almacena la información de los pedidos.
- **Detalle_Pedido**: Relaciona los pedidos con los productos.
- **usuario_proveedor**: Relación muchos a muchos entre usuarios y proveedores.
- **Pedido_Periodico**: Almacena la información de los pedidos periódicos.
- **Pago**: Almacena la información de los pagos.
- **Notificacion**: Almacena las notificaciones enviadas a los usuarios.

#### Diagrama:
```
[Usuario] --< [usuario_proveedor] >-- [Proveedor]
[Proveedor] --< [Producto]
[Usuario] --< [Pedido] >-- [Proveedor]
[Pedido] --< [Detalle_Pedido] >-- [Producto]
[Pedido] --< [Pedido_Periodico]
[Usuario] --< [Pago] >-- [Usuario]
[Usuario] --< [Notificacion]
```

---

## Tablas Principales

### 1. Usuario
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `id_usuario`     | `SERIAL`          | Clave primaria.                      |
| `Nombre`         | `VARCHAR(100)`    | Nombre del usuario.                  |
| `Correo`         | `VARCHAR(100)`    | Correo electrónico (único).          |
| `Contraseña`     | `VARCHAR(100)`    | Contraseña del usuario.              |
| `Movil`          | `VARCHAR(20)`     | Teléfono móvil del usuario.          |
| `Rol`            | `VARCHAR(50)`     | Rol del usuario (admin, gestor, usuario). |
| `Activo`         | `BOOLEAN`         | Indica si el usuario está activo.    |
| `Saldo`          | `DECIMAL(10, 2)`  | Saldo actual del usuario.            |

---

### 2. Proveedor
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `id_proveedor`   | `SERIAL`          | Clave primaria.                      |
| `Nombre`         | `VARCHAR(100)`    | Nombre del proveedor/grupo productos |
| `Contacto`       | `VARCHAR(100)`    | Nombre de la persona de contacto.    |
| `Telefono`       | `VARCHAR(20)`     | Teléfono del proveedor.              |
| `Movil`          | `VARCHAR(20)`     | Teléfono móvil del proveedor.        |
| `Correo`         | `VARCHAR(100)`    | Correo electrónico del proveedor.    |
| `Metodo_Pago`    | `VARCHAR(300)`    | Como se paga al proveedor            |
| `Envio_Movil`    | `BOOLEAN`         | Avisar mediante SMS o WhatsApp.      |
| `Envio_Mail`     | `BOOLEAN`         | Avisar mediante correo electrónico.  |

---

### 3. Producto
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Producto`    | `SERIAL`          | Clave primaria.                      |
| `Nombre`         | `VARCHAR(100)`    | Nombre del producto.                 |
| `Imagen`         | `VARCHAR(100)`    | URL relativa de imagen del producto. |
| `Descripcion`    | `TEXT`            | Descripción del producto.            |
| `Precio`         | `DECIMAL(10, 2)`  | Precio del producto.                 |
| `Frecuencia_Pedido` | `VARCHAR(50)`  | Frecuencia de pedido (semanal, mensual, etc.). |
| `id_proveedor`   | `INT`             | Clave foránea (relación con `Proveedor`). |

---

### 4. Pedido
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Pedido`      | `SERIAL`          | Clave primaria.                      |
| `id_usuario_Encargado` | `INT`     | Clave foránea (relación con `Usuario`). |
| `id_proveedor`   | `INT`             | Clave foránea (relación con `Proveedor`). |
| `Fecha_Modificacion` | `TIMESTAMP`       | Fecha y hora de modificacion del pedido. |
| `Fecha_Apertura` | `TIMESTAMP`       | Fecha y hora de apertura del pedido. |
| `Fecha_Cierre`   | `TIMESTAMP`       | Fecha límite para modificar el pedido. |
| `Fecha_Entrega`  | `TIMESTAMP`       | Fecha y hora de entrega.             |
| `Estado`         | `VARCHAR(50)`     | Estado del pedido (pendiente, en proceso, entregado, repartido, cancelado). |

---

### 5. Detalle_Pedido
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Detalle`     | `SERIAL`          | Clave primaria.                      |
| `ID_Pedido`      | `INT`             | Clave foránea (relación con `Pedido`). |
| `ID_Producto`    | `INT`             | Clave foránea (relación con `Producto`). |
| `Cantidad`       | `INT`             | Cantidad del producto.               |
| `Precio_Total`   | `DECIMAL(10, 2)`  | Precio total del producto.           |
| `id_usuario_Comprador` | `INT`     | Clave foránea (relación con `Usuario`). |
| `Fecha_Modificacion` | `TIMESTAMP`       | Fecha y hora de modificacion del detalle. |

---

### 6. usuario_proveedor (Relación muchos a muchos)
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `id_usuario`     | `INT`             | Clave foránea (relación con `Usuario`). |
| `id_proveedor`   | `INT`             | Clave foránea (relación con `Proveedor`). |

---

### 7. Pedido_Periodico
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Pedido_Periodico` | `SERIAL`    | Clave primaria.                      |
| `id_proveedor`   | `INT`             | Clave foránea (relación con `Proveedor`). |
| `Fecha_Inicio`   | `TIMESTAMP`       | Fecha de inicio del pedido periódico. |
| `Fecha_Fin`      | `TIMESTAMP`       | Fecha de fin del pedido periódico.   |
| `Activo`         | `BOOLEAN`         | Indica si el pedido está activo.     |
| `Periodicidad`   | `INT`             | Días entre pedidos.                  |
| `Dia_Apertura`   | `INT`             | Día de la semana en que se abre el pedido. |
| `Dia_Cierre`     | `INT`             | Día de la semana en que se cierra el pedido. |
| `Dia_Entrega`    | `INT`             | Día aproximado de entrega.           |

---

### 8. Pago (Nueva)
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Pago`        | `SERIAL`          | Clave primaria.                      |
| `id_usuario_Deudor` | `INT`         | Clave foránea (relación con `Usuario`). |
| `id_usuario_Creditor` | `INT`      | Clave foránea (relación con `Usuario`). |
| `Monto`          | `DECIMAL(10, 2)`  | Monto del pago.                      |
| `Fecha_Pago`     | `TIMESTAMP`       | Fecha y hora del pago.               |
| `Estado`         | `VARCHAR(50)`     | Estado del pago (pendiente, completado). |

---

### 9. Notificacion (Nueva)
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Notificacion` | `SERIAL`         | Clave primaria.                      |
| `id_usuario`     | `INT`             | Clave foránea (relación con `Usuario`). |
| `Mensaje`        | `TEXT`            | Contenido de la notificación.        |
| `Fecha`          | `TIMESTAMP`       | Fecha y hora de la notificación.     |
| `Leida`          | `BOOLEAN`         | Indica si la notificación ha sido leída. |

---

# Backend API Rest Node Express

### Descripción del Backend

El backend de la aplicación está desarrollado con **Node.js** y **Express**. Se conecta a una base de datos **PostgreSQL** y expone una API REST para gestionar usuarios, productos, proveedores y pedidos. La aplicación está diseñada para ser escalable y segura.

### Estructura del Proyecto

El backend está estructurado de la siguiente manera:

```
backend/
├── src/
│   ├── controllers/        # Controladores para manejar las solicitudes
│   │   ├── authController.js # Controlador de autenticación
│   │   ├── userController.js # Controlador de usuarios
│   │   ├── productController.js # Controlador de productos
│   │   ├── providerController.js # Controlador de proveedores
│   │   ├── orderController.js # Controlador de pedidos
│   │   └── notificationController.js # Controlador de notificaciones
│   ├── models/             # Modelos de datos
│   │   ├── userModel.js    # Modelo de usuario
│   │   ├── productModel.js # Modelo de producto
│   │   ├── providerModel.js # Modelo de proveedor
│   │   ├── orderModel.js   # Modelo de pedido
│   │   └── notificationModel.js # Modelo de notificación
│   ├── routes/             # Rutas de la API
│   │   ├── authRoutes.js   # Rutas de autenticación
│   │   ├── userRoutes.js   # Rutas de usuarios
│   │   ├── productRoutes.js # Rutas de productos
│   │   ├── providerRoutes.js # Rutas de proveedores
│   │   ├── orderRoutes.js  # Rutas de pedidos
│   │   └── notificationRoutes.js # Rutas de notificaciones
│   ├── config/             # Configuración de la aplicación
│   │   ├── dbConfig.js     # Configuración de la base de datos
│   │   ├── serverConfig.js # Configuración del servidor
│   │   └── swaggerConfig.js # Configuración de Swagger
│   ├── middleware/         # Middleware para la aplicación
│   │   ├── authMiddleware.js # Middleware de autenticación
│   │   ├── errorMiddleware.js # Middleware de manejo de errores
│   │   └── validationMiddleware.js # Middleware de validación
│   ├── utils/              # Utilidades y funciones auxiliares
│   │   ├── jwtUtils.js     # Utilidades para manejar JWT
│   │   ├── emailUtils.js   # Utilidades para enviar correos electrónicos
│   │   └── smsUtils.js     # Utilidades para enviar SMS
│   ├── app.js              # Configuración principal de la aplicación
│   └── server.js           # Punto de entrada del servidor
├── package.json            # Dependencias y scripts del proyecto
├── .env                    # Variables de entorno
└── swagger.yaml            # Documentación de la API con Swagger
```

---

## Descripción de los Archivos

### 1. **Controladores (`src/controllers/`)**
- **`authController.js`**: Maneja la autenticación de usuarios (registro, inicio de sesión, recuperación de contraseña).
- **`userController.js`**: Maneja las operaciones relacionadas con los usuarios (crear, editar, eliminar).
- **`productController.js`**: Maneja las operaciones relacionadas con los productos (crear, editar, eliminar).
- **`providerController.js`**: Maneja las operaciones relacionadas con los proveedores (crear, editar, eliminar).
- **`orderController.js`**: Maneja las operaciones relacionadas con los pedidos (crear, editar, eliminar).
- **`notificationController.js`**: Maneja las operaciones relacionadas con las notificaciones (crear, editar, eliminar).

### 2. **Modelos (`src/models/`)**
- **`userModel.js`**: Define el esquema y las operaciones para la tabla de usuarios.
- **`productModel.js`**: Define el esquema y las operaciones para la tabla de productos.
- **`providerModel.js`**: Define el esquema y las operaciones para la tabla de proveedores.
- **`orderModel.js`**: Define el esquema y las operaciones para la tabla de pedidos.
- **`notificationModel.js`**: Define el esquema y las operaciones para la tabla de notificaciones.

### 3. **Rutas (`src/routes/`)**
- **`authRoutes.js`**: Define las rutas de autenticación (registro, inicio de sesión, recuperación de contraseña).
- **`userRoutes.js`**: Define las rutas para las operaciones de usuarios.
- **`productRoutes.js`**: Define las rutas para las operaciones de productos.
- **`providerRoutes.js`**: Define las rutas para las operaciones de proveedores.
- **`orderRoutes.js`**: Define las rutas para las operaciones de pedidos.
- **`notificationRoutes.js`**: Define las rutas para las operaciones de notificaciones.

### 4. **Configuración (`src/config/`)**
- **`dbConfig.js`**: Configura la conexión a la base de datos PostgreSQL.
- **`serverConfig.js`**: Configura el servidor Express.
- **`swaggerConfig.js`**: Configura Swagger para la documentación de la API.

### 5. **Middleware (`src/middleware/`)**
- **`authMiddleware.js`**: Middleware para verificar la autenticación de usuarios.
- **`errorMiddleware.js`**: Middleware para manejar errores en la aplicación.
- **`validationMiddleware.js`**: Middleware para validar los datos de las solicitudes.

### 6. **Utilidades (`src/utils/`)**
- **`jwtUtils.js`**: Funciones auxiliares para manejar JWT (generar, verificar).
- **`emailUtils.js`**: Funciones auxiliares para enviar correos electrónicos.
- **`smsUtils.js`**: Funciones auxiliares para enviar SMS.

### 7. **Punto de Entrada (`src/server.js`)**
Configura y arranca el servidor Express.

### 8. **Configuración Principal (`src/app.js`)**
Configura la aplicación Express, incluyendo las rutas, middleware y conexión a la base de datos.

---

## Requisitos del Backend

### 1. **Autenticación y Autorización**
- Los usuarios deben poder registrarse, iniciar sesión y recuperar su contraseña.
- Las rutas protegidas solo deben ser accesibles para usuarios autenticados.

### 2. **Gestión de Productos**
- Los usuarios gestores deben poder añadir, editar y eliminar productos.
- Los usuarios deben poder ver los productos disponibles y añadirlos a su cesta.

### 3. **Gestión de Pedidos**
- Los usuarios gestores deben poder abrir y cerrar pedidos.
- Los usuarios deben poder ver los pedidos abiertos y añadir productos a ellos.

### 4. **Historial de Pedidos**
- Los usuarios deben poder ver un historial de sus pedidos realizados.

### 5. **Configuración de Cuenta**
- Los usuarios deben poder actualizar su información personal y cambiar su contraseña.

### 6. **Notificaciones**
- Los usuarios deben recibir notificaciones sobre fechas límite de pedidos y actualizaciones.

### 7. **Documentación de la API**
- La API debe estar documentada utilizando Swagger para facilitar su uso y comprensión.

---

## Ejemplo de Rutas de la API

### 1. **Autenticación**
- **POST `/api/auth/register`**: Registro de nuevos usuarios.
- **POST `/api/auth/login`**: Inicio de sesión de usuarios.
- **POST `/api/auth/recover`**: Recuperación de contraseña.

### 2. **Usuarios**
- **GET `/api/users`**: Obtener la lista de usuarios.
- **GET `/api/users/:id`**: Obtener la información de un usuario específico.
- **PUT `/api/users/:id`**: Actualizar la información de un usuario.
- **DELETE `/api/users/:id`**: Eliminar un usuario.

### 3. **Productos**
- **GET `/api/products`**: Obtener la lista de productos.
- **GET `/api/products/:id`**: Obtener la información de un producto específico.
- **POST `/api/products`**: Añadir un nuevo producto.
- **PUT `/api/products/:id`**: Actualizar la información de un producto.
- **DELETE `/api/products/:id`**: Eliminar un producto.

### 4. **Proveedores**
- **GET `/api/providers`**: Obtener la lista de proveedores.
- **GET `/api/providers/:id`**: Obtener la información de un proveedor específico.
- **POST `/api/providers`**: Añadir un nuevo proveedor.
- **PUT `/api/providers/:id`**: Actualizar la información de un proveedor.
- **DELETE `/api/providers/:id`**: Eliminar un proveedor.

### 5. **Pedidos**
- **GET `/api/orders`**: Obtener la lista de pedidos.
- **GET `/api/orders/:id`**: Obtener la información de un pedido específico.
- **POST `/api/orders`**: Crear un nuevo pedido.
- **PUT `/api/orders/:id`**: Actualizar la información de un pedido.
- **DELETE `/api/orders/:id`**: Eliminar un pedido.

### 6. **Notificaciones**
- **GET `/api/notifications`**: Obtener la lista de notificaciones.
- **GET `/api/notifications/:id`**: Obtener la información de una notificación específica.
- **POST `/api/notifications`**: Crear una nueva notificación.
- **PUT `/api/notifications/:id`**: Actualizar la información de una notificación.
- **DELETE `/api/notifications/:id`**: Eliminar una notificación.

---

---

## Diseño Visual

### 1. Guía de Estilo

#### Paleta de Colores
- **Color Primario**: `#4CAF50` (Verde) - Representa la sostenibilidad y la ecología.
- **Color Secundario**: `#FF9800` (Naranja) - Para botones y elementos destacados.
- **Color de Fondo**: `#FFFFFF` (Blanco) - Para una apariencia limpia y moderna.
- **Color de Texto**: `#333333` (Gris oscuro) - Para asegurar buena legibilidad.
- **Color de Enlaces**: `#007BFF` (Azul) - Para enlaces y acciones interactivas.
- **Color de Error**: `#DC3545` (Rojo) - Para mensajes de error y advertencias.

#### Tipografía
- **Fuente Principal**: 
  - **Nombre**: `Open Sans`
  - **Estilo**: Regular
  - **Tamaño**: `16px` para texto normal, `24px` para encabezados.
  
- **Fuente Secundaria**: 
  - **Nombre**: `Roboto`
  - **Estilo**: Italic
  - **Tamaño**: `14px` para subtítulos y notas.

#### Iconografía
- Utiliza iconos de **Font Awesome** o **Material Icons** para mantener la coherencia visual.
- Asegúrate de que los iconos sean simples y fáciles de entender.

---

### 2. Elementos de Interfaz

#### Botones
- **Estilo**: 
  - Bordes redondeados (`5px` de radio).
  - Sombra sutil para dar profundidad (`box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)`).
- **Colores**: 
  - Fondo: Color secundario (`#FF9800`).
  - Texto: Blanco (`#FFFFFF`).
- **Efecto Hover**: 
  - Cambiar a un tono más oscuro del color secundario (`#E68900`).

#### Formularios
- **Estilo de Campos**: 
  - Bordes redondeados (`5px` de radio).
  - Sombra ligera para destacar (`box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)`).
- **Colores**: 
  - Fondo: Blanco (`#FFFFFF`).
  - Texto: Gris oscuro (`#333333`).
- **Efecto Focus**: 
  - Resaltar el borde con el color primario (`#4CAF50`).

#### Tarjetas de Producto
- **Estilo**: 
  - Bordes redondeados (`10px` de radio).
  - Sombra para dar un efecto de elevación (`box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1)`).
- **Colores**: 
  - Fondo: Blanco (`#FFFFFF`).
  - Texto: Gris oscuro (`#333333`).
- **Elementos**: 
  - Imagen del producto en la parte superior.
  - Nombre del producto y precio debajo de la imagen.

---

## Wireframes

### Pantalla de Inicio
+-------------------------------------+
| Logo                                |
+-------------------------------------+
| Menú: [Inicio] [Productos] [Pedidos] [Soporte] |
+-------------------------------------+
| Descripción del grupo               |
+-------------------------------------+
| [Iniciar Sesión] [Registrarse]      |
+-------------------------------------+

### Pantalla de Registro
+-------------------------------------+
| Registro                            |
+-------------------------------------+
| Nombre: [________________________]  |
| Correo: [________________________]  |
| Contraseña: [_____________________]  |
| [Registrarse]                       |
+-------------------------------------+

### Pantalla de Inicio de Sesión
+-------------------------------------+
| Iniciar Sesión                      |
+-------------------------------------+
| Correo: [________________________]  |
| Contraseña: [_____________________]  |
| [Iniciar Sesión]                   |
+-------------------------------------+

### Pantalla de Dashboard
+-------------------------------------+
| Dashboard                           |
+-------------------------------------+
| Resumen de Pedidos:                |
| - Pedido 1                          |
| - Pedido 2                          |
| [Realizar Pedido]                  |
+-------------------------------------+
| Notificaciones:                     |
| - Notificación 1                    |
| - Notificación 2                    |
+-------------------------------------+

### Pantalla de Productos
+-------------------------------------+
| Productos                           |
+-------------------------------------+
| Producto 1: [Detalles] [Añadir]    |
| Producto 2: [Detalles] [Añadir]    |
| Producto 3: [Detalles] [Añadir]    |
+-------------------------------------+

### Pantalla de Realización de Pedidos
+-------------------------------------+
| Realizar Pedido                    |
+-------------------------------------+
| Producto 1: [Cantidad: ___]        |
| Producto 2: [Cantidad: ___]        |
| [Resumen del Pedido]               |
| [Confirmar Pedido]                 |
+-------------------------------------+

### Pantalla de Historial de Pedidos
+-------------------------------------+
| Historial de Pedidos               |
+-------------------------------------+
| Pedido 1: [Detalles] [Estado]      |
| Pedido 2: [Detalles] [Estado]      |
+-------------------------------------+

### Pantalla de Gestión de Usuarios (Administradores)
+-------------------------------------+
| Gestión de Usuarios                 |
+-------------------------------------+
| Usuario 1: [Editar] [Eliminar]     |
| Usuario 2: [Editar] [Eliminar]     |
+-------------------------------------+

### Pantalla de Configuración de Cuenta
+-------------------------------------+
| Configuración de Cuenta             |
+-------------------------------------+
| Nombre: [________________________]  |
| Correo: [________________________]  |
| [Actualizar Información]            |
| [Cerrar Sesión]                    |
+-------------------------------------+

### Pantalla de Soporte y Ayuda
+-------------------------------------+
| Soporte y Ayuda                    |
+-------------------------------------+
| Preguntas Frecuentes:              |
| - Pregunta 1                       |
| - Pregunta 2                       |
| [Enviar Consulta]                  |
+-------------------------------------+

### Pantalla de Gestión de Proveedores
+-------------------------------------+
| Gestión de Proveedores              |
+-------------------------------------+
| Proveedor 1: [Editar] [Eliminar]   |
| Proveedor 2: [Editar] [Eliminar]   |
| [Añadir Proveedor]                 |
+-------------------------------------+
| Detalles del Proveedor:            |
| - Nombre                           |
| - Contacto                         |
| - Teléfono                         |
| - Correo                           |
| - Método de Pago                   |
+-------------------------------------+

### Pantalla de Gestión de Productos
+-------------------------------------+
| Gestión de Productos                |
+-------------------------------------+
| Producto 1: [Editar] [Eliminar]    |
| Producto 2: [Editar] [Eliminar]    |
| [Añadir Producto]                  |
+-------------------------------------+
| Detalles del Producto:             |
| - Nombre                           |
| - Descripción                      |
| - Precio                           |
| - Proveedor                        |
| - Imagen                           |
+-------------------------------------+

### Pantalla de Gestión de Pedidos
+-------------------------------------+
| Gestión de Pedidos                  |
+-------------------------------------+
| Pedido 1: [Detalles] [Cancelar]    |
| Pedido 2: [Detalles] [Cancelar]    |
| [Abrir Pedido]                     |
+-------------------------------------+
| Detalles del Pedido:               |
| - Fecha de Apertura                |
| - Fecha de Cierre                  |
| - Fecha de Entrega                 |
| - Productos                        |
| - Estado                           |
+-------------------------------------+

### Pantalla de Notificaciones
+-------------------------------------+
| Notificaciones                      |
+-------------------------------------+
| Notificación 1: [Marcar como Leída]|
| Notificación 2: [Marcar como Leída]|
+-------------------------------------+
| Detalles de la Notificación:       |
| - Mensaje                          |
| - Fecha                            |
| - Estado (Leída/No Leída)          |
+-------------------------------------+


## Componentes

### Componente `NavBar`
- **Descripción**: Barra de navegación principal de la aplicación.
- **Elementos Clave**:
  - Enlaces a las secciones principales: Dashboard, Compras, Historial, Configuración, etc.
  - Botones de "Iniciar Sesión" y "Cerrar Sesión".
  - Visibilidad condicional de enlaces según el rol del usuario (admin o usuario regular).

### Componente `Footer`
- **Descripción**: Pie de página de la aplicación.
- **Elementos Clave**:
  - Enlaces a redes sociales.
  - Información de contacto del grupo.
  - Aviso legal y política de privacidad.

### Componente `ProductCard`
- **Descripción**: Tarjeta para mostrar información de un producto.
- **Elementos Clave**:
  - Imagen del producto.
  - Nombre y descripción.
  - Precio.
  - Botón "Añadir al Pedido".

### Componente `PedidoCard`
- **Descripción**: Tarjeta para mostrar información de un pedido.
- **Elementos Clave**:
  - Fecha de apertura y cierre.
  - Estado del pedido.
  - Botón "Ver Detalles".

### Componente `Notification`
- **Descripción**: Componente para mostrar notificaciones al usuario.
- **Elementos Clave**:
  - Mensaje de la notificación.
  - Fecha de la notificación.
  - Botón "Marcar como Leída".

### Componente `UserForm`
- **Descripción**: Formulario para añadir o editar usuarios.
- **Elementos Clave**:
  - Campos para nombre, correo, móvil, rol, y proveedores asignados.
  - Botón "Guardar Cambios".

### Componente `ProviderForm`
- **Descripción**: Formulario para añadir o editar proveedores.
- **Elementos Clave**:
  - Campos para nombre, contacto, teléfono, correo, y método de pago.
  - Botón "Guardar Cambios".

### Componente `OrderForm`
- **Descripción**: Formulario para abrir o editar pedidos.
- **Elementos Clave**:
  - Campos para fecha de apertura, fecha de cierre, fecha de entrega, y periodicidad.
  - Botón "Guardar Cambios".

---

## Diseño Visual

### Pantalla de Gestión de Proveedores
- **Estilo**:
  - Fondo blanco con bordes redondeados para las tarjetas de proveedores.
  - Botones con colores secundarios (`#FF9800`) para acciones como "Editar" y "Eliminar".
  - Sombra ligera para destacar las tarjetas.

### Pantalla de Gestión de Productos
- **Estilo**:
  - Tarjetas de productos con bordes redondeados y sombra ligera.
  - Botones con colores secundarios (`#FF9800`) para acciones como "Editar" y "Eliminar".
  - Imágenes de productos centradas en la parte superior de las tarjetas.

### Pantalla de Gestión de Pedidos
- **Estilo**:
  - Lista de pedidos con diseño de tabla.
  - Botones con colores secundarios (`#FF9800`) para acciones como "Detalles" y "Cancelar".
  - Modal para abrir nuevos pedidos con campos bien espaciados y bordes redondeados.

### Pantalla de Notificaciones
- **Estilo**:
  - Lista de notificaciones con diseño de tarjetas.
  - Botones con colores primarios (`#4CAF50`) para marcar como leídas.
  - Mensajes destacados con fondo gris claro para notificaciones no leídas.

---

## Estado del Proyecto

El proyecto se encuentra en **desarrollo activo**.

### Funcionalidades implementadas:

- [x] Autenticación JWT
- [x] Registro de usuarios
- [x] Recuperación de contraseña
- [x] Gestión de usuarios (admin)
- [x] Gestión de proveedores
- [x] Gestión de productos (con imágenes) 
- [x] Sistema de pedidos (abierto/cerrado)
- [x] Pedidos periódicos
- [x] Gestión de pagos
- [x] Sistema de liquidaciones mensuales
- [x] Notificaciones
- [x] Sistema de familias
- [x] Notificación a administradores por nuevo registro

### Funcionalidades pendientes:
- [ ] Mas tests
- [ ] Tests completos
- [ ] Despliegue a producción
- [ ] Documentación 