# DAW-Proyecto

## Tabla de Contenidos
- [Descripción del Proyecto](#descripción-del-proyecto)
- [Contexto Actual](#contexto-actual)
  - [Estructura del Grupo](#estructura-del-grupo)
    - [Ejemplo actual de uso para incorporar una familia](#ejemplo-actual-de-uso-para-incorporar-una-familia)
    - [Ejemplo actual de uso semanal para una familia que quiere pedir verduras](#ejemplo-actual-de-uso-semanal-para-una-familia-que-quiere-pedir-verduras)
    - [Ejemplo actual de uso semanal para una familia que quiere pedir huevos](#ejemplo-actual-de-uso-semanal-para-una-familia-que-quiere-pedir-huevos)
    - [Ejemplo actual de uso semanal para la familia que gestiona las verduras](#ejemplo-actual-de-uso-semanal-para-la-familia-que-gestiona-las-verduras)
    - [Ejemplo actual de uso semanal para la familia que gestiona el pan](#ejemplo-actual-de-uso-semanal-para-la-familia-que-gestiona-el-pan)
  - [Pedidos periódicos](#pedidos-periódicos)
  - [Frecuencia de Pedidos](#frecuencia-de-pedidos)
  - [Entrega de Productos](#entrega-de-productos)
- [Gestión Actual en Google Sheets](#gestión-actual-en-google-sheets)
  - [Páginas por Proveedor](#páginas-por-proveedor)
  - [Registro de Productos](#registro-de-productos)
  - [Pedidos](#pedidos)
  - [Usuarios y Familias](#usuarios-y-familias)
- [Cálculos Avanzados](#cálculos-avanzados)
  - [Gasto Mensual](#gasto-mensual)
  - [Cálculo de Pedidos](#cálculo-de-pedidos)
- [Propuesta de Solución](#propuesta-de-solución)
- [Roadmap del Proyecto](#roadmap-del-proyecto-aplicación-web-para-un-grupo-de-consumo-local-y-ecológico)
- [Definición de Requisitos](#1-definición-de-requisitos)
- [Cronograma del Proyecto](#2-cronograma-del-proyecto-aplicación-web-para-un-grupo-de-consumo-local-y-ecológico)
- [Prototipos de la Aplicación Web](#3-prototipos-de-la-aplicación-web)
  - [Pantalla de Inicio](#1-pantalla-de-inicio)
  - [Pantalla de Registro](#2-pantalla-de-registro)
  - [Pantalla de Inicio de Sesión](#3-pantalla-de-inicio-de-sesión)
  - [Pantalla de Dashboard (Tablero)](#4-pantalla-de-dashboard-tablero)
  - [Pantalla de Productos](#5-pantalla-de-productos)
  - [Pantalla de Realización de Pedidos](#6-pantalla-de-realización-de-pedidos)
  - [Pantalla de Historial de Pedidos](#7-pantalla-de-historial-de-pedidos)
  - [Pantalla de Gestión de Usuarios (para administradores)](#8-pantalla-de-gestión-de-usuarios-para-administradores)
  - [Pantalla de Configuración de Cuenta](#9-pantalla-de-configuración-de-cuenta)
  - [Pantalla de Soporte y Ayuda](#10-pantalla-de-soporte-y-ayuda)
- [Flujo de Usuario para la Aplicación Web de Consumo Local y Ecológico](#4-flujo-de-usuario-para-la-aplicación-web-de-consumo-local-y-ecológico)
  - [Gestión de Productos](#1-gestión-de-productos)
  - [Gestión de Pedidos](#2-gestión-de-pedidos)
  - [Cálculos Financieros](#3-cálculos-financieros)
  - [Gestión de Usuarios (para administradores)](#4-gestión-de-usuarios-para-administradores)
  - [Pantalla de Soporte y Ayuda](#5-pantalla-de-soporte-y-ayuda)
  - [Notificaciones y Recordatorios](#6-notificaciones-y-recordatorios)
  - [Historial de Pedidos](#7-historial-de-pedidos)
  - [Configuración de Cuenta](#8-configuración-de-cuenta)
  - [Panel de Administración (para administradores)](#9-panel-de-administración-para-administradores)
  - [Informes y Estadísticas](#10-informes-y-estadísticas)
  - [Soporte y Ayuda](#11-soporte-y-ayuda)

# Descripción del Proyecto: Desarrollo de una Aplicación Web para un Grupo de Consumo Local y Ecológico

El objetivo de este proyecto es desarrollar una aplicación web que facilite la gestión de un grupo de consumo local y ecológico, compuesto por aproximadamente cuarenta usuarios (familias) y quince productores. Actualmente, la gestión de pedidos y productos se realiza de manera manual a través de tablas en Google Sheets, lo que puede resultar ineficiente y propenso a errores.

## Contexto Actual

### Estructura del Grupo

El grupo está formado por familias que se encargan de contactar directamente con los productores. Cada usuario asume la responsabilidad de mantenerse en contacto con un proveedor específico, aunque hay algunos usuarios que no gestionan ningún proveedor.

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


### Pedidos periódicos
Hay algunos productos que se piden semanalmente de manera automática sin que tenga que intervenir el usuario hasta que quiera dejar de recibir ese pedido

### Frecuencia de Pedidos
Los productos se solicitan a diferentes proveedores con distintas frecuencias: algunos se piden semanalmente, mientras que otros se solicitan cada dos, tres o seis meses.

### Entrega de Productos
Todos los productos se entregan en un local común, donde los usuarios pueden recoger sus pedidos.

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

- **Gestión de Productos y Proveedores**: Una sección dedicada para que los usuarios puedan ver y gestionar los productos y proveedores de manera más intuitiva.
- **Sistema de Pedidos**: Un sistema que permita realizar pedidos de forma sencilla, con recordatorios automáticos para las fechas límite.
- **Cálculos Automáticos**: Automatización de los cálculos de gastos y deudas, eliminando la necesidad de realizar cálculos manuales en hojas de cálculo.
- **Interacción entre Usuarios**: Facilitar la comunicación entre usuarios y productores, mejorando la colaboración y la eficiencia del grupo.




# Roadmap del Proyecto: Aplicación Web para un Grupo de Consumo Local y Ecológico

Este documento describe el roadmap para el desarrollo de la aplicación web destinada a facilitar la gestión de un grupo de consumo local y ecológico.

## 1. Definición de Requisitos
- [ ] Crear una lista de funcionalidades clave.

## 2. Planificación del Proyecto
- [ ] Establecer un cronograma con hitos y plazos.

## 3. Diseño de la Aplicación
- [ ] Crear wireframes o prototipos de la interfaz de usuario.
- [ ] Definir el flujo de usuario para cada funcionalidad.

## 4. Configuración del Entorno de Desarrollo
- [ ] Instalar Node.js, Express, PostgreSQL, Vue.js y Bootstrap.
- [ ] Configurar un repositorio en GitHub para gestionar el código.

## 5. Desarrollo del Back-End
- [ ] Definir los modelos de datos en PostgreSQL (productos, pedidos, usuarios).
- [ ] Implementar las rutas de la API en Express.
- [ ] Configurar la autenticación con JWT.
- [ ] Establecer la conexión a la base de datos utilizando la biblioteca `pg`.

## 6. Desarrollo del Front-End
- [ ] Construir la interfaz de usuario utilizando Vue.js y Bootstrap.
- [ ] Conectar el front-end con la API a través de Axios.
- [ ] Considerar el uso de Vuex para la gestión del estado.

## 7. Pruebas
- [ ] Implementar pruebas unitarias para componentes y funciones.
- [ ] Realizar pruebas de integración entre el front-end y el back-end.

## 8. Documentación
- [ ] Documentar la API utilizando herramientas como Swagger.
- [ ] Crear una guía de usuario para ayudar a los miembros del grupo.

## 9. Despliegue
- [ ] Elegir un servicio de hosting para desplegar la aplicación.
- [ ] Configurar el entorno de producción para la base de datos y la aplicación.

## 10. Recopilación de Feedback y Mejora Continua
- [ ] Lanzar una versión beta para un grupo selecto de usuarios.
- [ ] Recopilar feedback y realizar mejoras en la aplicación.

## 11. Mantenimiento
- [ ] Establecer un plan para el soporte técnico y la resolución de problemas.
- [ ] Planificar actualizaciones regulares para mejorar la aplicación.

---

## 1. Definición de Requisitos

La definición de requisitos es una etapa crucial en el desarrollo de la aplicación, ya que establece las bases para el diseño y la implementación. A continuación se detallan las tareas a realizar en esta fase:

- **Lista de funcionalidades clave.**
  - **Objetivo**: Definir las características esenciales que debe tener la aplicación para satisfacer las necesidades de los usuarios.
  - **Acciones**:
    - Analizar las necesidades de los usuarios y extraer las funcionalidades necesarias.
    - Clasificar las funcionalidades en categorías, todas consideradas esenciales:
      - [ ] **Gestión de Productos**: 
        - Añadir, editar y eliminar productos.
        - Visualizar información de proveedores.
        - **Complejidad Técnica**: Media. Requiere implementación de formularios y validaciones, así como la gestión de la base de datos.
      - [ ] **Gestión de Pedidos**: 
        - Crear y gestionar pedidos.
        - Establecer fechas límite y enviar recordatorios.
        - **Complejidad Técnica**: Alta. Implica lógica de negocio para el manejo de fechas y cálculos, así como notificaciones.
      - [ ] **Cálculos Financieros**: 
        - Calcular gastos mensuales.
        - Gestionar deudas entre usuarios.
        - **Complejidad Técnica**: Media. Requiere cálculos precisos y la gestión de relaciones entre usuarios y pedidos.
      - [ ] **Gestión de Usuarios**: 
        - Alta y baja de usuarios.
        - Funcionalidad de login y autenticación.
        - **Complejidad Técnica**: Alta. Implica la implementación de un sistema de autenticación seguro y la gestión de sesiones.

- **Funcionalidades Adicionales para el Futuro**
  
  A continuación se presentan funcionalidades adicionales que podrían implementarse en futuras versiones de la aplicación:

  - [ ] **Notificaciones y Recordatorios**
    - **Descripción**: Implementar un sistema de notificaciones para recordar a los usuarios sobre fechas de pedidos, vencimientos de pagos y actualizaciones de productos.
    - **Complejidad Técnica**: Media.

  - [ ] **Historial de Pedidos**
    - **Descripción**: Permitir a los usuarios ver un historial de sus pedidos anteriores, incluyendo detalles como fechas, productos y costos.
    - **Complejidad Técnica**: Baja.

  - [ ] **Sistema de Calificación y Reseñas**
    - **Descripción**: Permitir a los usuarios calificar y dejar reseñas sobre los productos y proveedores.
    - **Complejidad Técnica**: Media.

  - [ ] **Integración de Pagos**
    - **Descripción**: Implementar un sistema de pago en línea para facilitar el pago de pedidos.
    - **Complejidad Técnica**: Alta.

  - [ ] **Panel de Administración**
    - **Descripción**: Crear un panel de administración para que los responsables del grupo puedan gestionar usuarios, productos y pedidos de manera centralizada.
    - **Complejidad Técnica**: Alta.

  - [ ] **Informes y Estadísticas**
    - **Descripción**: Generar informes sobre el consumo, gastos y tendencias de pedidos, lo que puede ayudar en la toma de decisiones.
    - **Complejidad Técnica**: Media.

  - [ ] **Soporte y Ayuda**
    - **Descripción**: Incluir una sección de preguntas frecuentes (FAQ) y un sistema de soporte para ayudar a los usuarios con problemas o dudas.
    - **Complejidad Técnica**: Baja.

  - [ ] **Interacción Social**
    - **Descripción**: Facilitar la interacción entre los miembros del grupo, como foros o grupos de discusión.
    - **Complejidad Técnica**: Alta.

  - [ ] **Accesibilidad**
    - **Descripción**: Asegurar que la aplicación sea accesible para personas con discapacidades, cumpliendo con las pautas de accesibilidad web (WCAG).
    - **Complejidad Técnica**: Media.

  - [ ] **Multilenguaje**
    - **Descripción**: Permitir que la aplicación esté disponible en varios idiomas para atender a una audiencia más amplia.
    - **Complejidad Técnica**: Media.


## 2. Cronograma del Proyecto: Aplicación Web para un Grupo de Consumo Local y Ecológico

| Hito | Descripción | Fecha de Inicio | Fecha de Finalización | Responsable |
|------|-------------|------------------|-----------------------|-------------|
| **1. Definición de Requisitos** | Crear una lista de funcionalidades clave. | 01/11/2024 | 15/11/2024 | Equipo de Proyecto |
| **2. Planificación del Proyecto** | Establecer un cronograma con hitos y plazos. | 16/11/2024 | 20/11/2024 | Equipo de Proyecto |
| **3. Diseño de la Aplicación** | Crear wireframes o prototipos de la interfaz de usuario. | 21/11/2024 | 10/12/2024 | Diseñador UI/UX |
| **4. Configuración del Entorno de Desarrollo** | Instalar Node.js, Express, PostgreSQL, Vue.js y Bootstrap. | 11/12/2024 | 15/12/2024 | Desarrollador Back-End |
| **5. Desarrollo del Back-End** | Definir modelos de datos, implementar rutas de API y autenticación. | 16/12/2024 | 31/01/2025 | Desarrollador Back-End |
| **6. Desarrollo del Front-End** | Construir la interfaz de usuario y conectar con la API. | 01/02/2025 | 15/02/2025 | Desarrollador Front-End |
| **7. Pruebas** | Implementar pruebas unitarias y de integración. | 16/02/2025 | 28/02/2025 | Equipo de QA |
| **8. Documentación** | Documentar la API y crear una guía de usuario. | 01/03/2025 | 10/03/2025 | Documentador |
| **9. Despliegue** | Elegir un servicio de hosting y configurar el entorno de producción. | 11/03/2025 | 15/03/2025 | Desarrollador Back-End |
| **10. Recopilación de Feedback y Mejora Continua** | Lanzar una versión beta y recopilar feedback. | 16/03/2025 | 31/03/2025 | Equipo de Proyecto |
| **11. Mantenimiento** | Establecer un plan para soporte técnico y actualizaciones. | 01/04/2025 | En curso | Equipo de Proyecto |

## 3. Prototipos de la Aplicación Web

### 1. Pantalla de Inicio
- **Elementos Clave**:
  - Logo del grupo de consumo.
  - Menú de navegación (Inicio, Productos, Pedidos, Usuarios, Contacto).
  - Breve descripción del grupo y su misión.
  - Botón de "Iniciar Sesión" o "Registrarse".

### 2. Pantalla de Registro
- **Elementos Clave**:
  - Formulario de registro con campos para:
    - Nombre completo.
    - Correo electrónico.
    - Contraseña.
    - Confirmar contraseña.
  - Botón de "Registrarse".
  - Enlace a "Iniciar Sesión" si ya tiene una cuenta.

### 3. Pantalla de Inicio de Sesión
- **Elementos Clave**:
  - Formulario de inicio de sesión con campos para:
    - Correo electrónico.
    - Contraseña.
  - Botón de "Iniciar Sesión".
  - Enlace a "¿Olvidaste tu contraseña?".

### 4. Pantalla de Dashboard (Tablero)
- **Elementos Clave**:
  - Resumen de pedidos actuales y próximos.
  - Acceso rápido a "Realizar Pedido".
  - Sección de "Productos Disponibles".
  - Notificaciones sobre fechas límite de pedidos.

### 5. Pantalla de Productos
- **Elementos Clave**:
  - Lista de productos con:
    - Nombre del producto.
    - Descripción.
    - Precio.
    - Botón de "Añadir al Pedido".
  - Filtros para buscar productos por categoría o proveedor.

### 6. Pantalla de Realización de Pedidos
- **Elementos Clave**:
  - Selección de productos con casillas de verificación.
  - Campo para ingresar cantidades.
  - Resumen del pedido con total calculado.
  - Botón de "Confirmar Pedido".

### 7. Pantalla de Historial de Pedidos (>funcionalidades adicionales<)
- **Elementos Clave**:
  - Lista de pedidos anteriores con:
    - Fecha del pedido.
    - Productos solicitados.
    - Estado del pedido (completado, pendiente, cancelado).
  - Opción para ver detalles de cada pedido.

### 8. Pantalla de Gestión de Usuarios (para administradores)
- **Elementos Clave**:
  - Lista de usuarios con:
    - Nombre.
    - Correo electrónico.
    - Estado (activo/inactivo).
    - Botones para "Editar" o "Eliminar" usuarios.
  - Opción para añadir nuevos usuarios.

### 9. Pantalla de Configuración de Cuenta (>funcionalidades adicionales<)
- **Elementos Clave**:
  - Formulario para actualizar información del usuario:
    - Nombre.
    - Correo electrónico.
    - Contraseña (opcional).
  - Botón de "Guardar Cambios".

### 10. Pantalla de Soporte y Ayuda (>funcionalidades adicionales<)
- **Elementos Clave**:
  - Sección de preguntas frecuentes (FAQ).
  - Formulario de contacto para enviar consultas.
  - Información de contacto del grupo.

### Herramientas para Crear Prototipos
- **Figma**: Herramienta de diseño colaborativo en línea.
- **Adobe XD**: Software de diseño y prototipado de Adobe.
- **Sketch**: Herramienta de diseño vectorial para macOS.
- **InVision**: Plataforma para crear prototipos interactivos.

## 4. Flujo de Usuario para la Aplicación Web de Consumo Local y Ecológico

### 1. Gestión de Productos

#### Flujo de Usuario:
1. **Acceso a la sección de Productos**:
   - El usuario inicia sesión en la aplicación.
   - Navega al menú y selecciona "Productos".

2. **Visualización de Productos**:
   - Se muestra una lista de productos disponibles con detalles (nombre, descripción, precio, proveedor/productor).
   - El usuario puede aplicar filtros para buscar productos específicos.

3. **Añadir un Producto** (para administradores y el usuario responsable de ese productor/proveedor):
   - El administrador selecciona "Añadir Producto".
   - Completa un formulario con la información del producto (nombre, descripción, precio, proveedor/productor).
   - Hace clic en "Guardar" para añadir el producto a la base de datos.

4. **Editar o Eliminar un Producto** (para administradores y el usuario responsable de ese productor/proveedor):
   - El administrador selecciona un producto de la lista.
   - Elige "Editar" para modificar la información o "Eliminar" para quitar el producto.
   - Confirma la acción.

---

### 2. Gestión de Pedidos

#### Flujo de Usuario:
1. **Acceso a la sección de Pedidos**:
   - El usuario inicia sesión y selecciona "Pedidos" en el menú.

2. **Crear un Nuevo Pedido**:
   - El usuario hace clic en "Realizar Pedido".
   - Se muestra una lista de productos con casillas de verificación.
   - El usuario selecciona los productos deseados y especifica las cantidades.

3. **Confirmación del Pedido**:
   - El usuario revisa el resumen del pedido, que incluye el total calculado.
   - Hace clic en "Confirmar Pedido".
   - Se muestra un mensaje de confirmación y se envía el pedido al proveedor correspondiente.

4. **Gestión de Pedidos Existentes (>funcionalidades adicionales<)**:
   - El usuario puede ver una lista de pedidos anteriores.
   - Selecciona un pedido para ver detalles, duplicar o cancelar si está pendiente.

---

### 3. Cálculos Financieros

#### Flujo de Usuario:
1. **Acceso a la sección de Finanzas**:
   - El usuario inicia sesión y selecciona "Finanzas" en el menú.

2. **Visualización de Gastos Mensuales**:
   - Se muestra un resumen de los gastos mensuales de la familia.
   - El usuario puede ver detalles de cada pedido y el saldo actual.

3. **Gestión de Deudas**:
   - El usuario puede ver a quién debe dinero y el importe.
   - Opción para marcar deudas como pagadas.

---

### 4. Gestión de Usuarios (para administradores)

#### Flujo de Usuario:
1. **Acceso a la sección de Gestión de Usuarios**:
   - El administrador inicia sesión y selecciona "Usuarios" en el menú.

2. **Visualización de Usuarios**:
   - Se muestra una lista de usuarios con detalles (nombre, correo electrónico, estado).
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

### 5. Pantalla de Soporte y Ayuda

#### Flujo de Usuario:
1. **Acceso a la sección de Soporte**:
   - El usuario inicia sesión y selecciona "Soporte" en el menú.

2. **Visualización de Preguntas Frecuentes (FAQ)**:
   - Se muestra una lista de preguntas frecuentes.
   - El usuario puede hacer clic en una pregunta para ver la respuesta.

3. **Enviar una Consulta**:
   - El usuario completa un formulario de contacto con su consulta.
   - Hace clic en "Enviar".
   - Se muestra un mensaje de confirmación de que la consulta ha sido enviada.

---

### 6. Notificaciones y Recordatorios

#### Flujo de Usuario:
1. **Configuración de Notificaciones**:
   - El usuario accede a "Configuración de Cuenta".
   - Selecciona "Notificaciones".
   - Activa o desactiva las notificaciones para fechas de pedidos y vencimientos.

2. **Recepción de Notificaciones**:
   - El usuario recibe notificaciones por correo electrónico o en la aplicación sobre fechas límite de pedidos y actualizaciones.

---

### 7. Historial de Pedidos

#### Flujo de Usuario:
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

### 8. Configuración de Cuenta

#### Flujo de Usuario:
1. **Acceso a la sección de Configuración de Cuenta**:
   - El usuario inicia sesión y selecciona "Configuración de Cuenta" en el menú.

2. **Visualización de Información de la Cuenta**:
   - Se muestra la información actual del usuario, incluyendo:
     - Nombre.
     - Correo electrónico.
     - Opciones de seguridad.

3. **Actualizar Información**:
   - El usuario puede editar su nombre o correo electrónico.
   - Opción para cambiar la contraseña.
   - Hace clic en "Guardar Cambios" para aplicar las modificaciones.

4. **Cerrar Sesión**:
   - El usuario puede seleccionar "Cerrar Sesión" para salir de la aplicación.

---

### 9. Panel de Administración (para administradores)

#### Flujo de Usuario:
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

### 10. Informes y Estadísticas

#### Flujo de Usuario:
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
