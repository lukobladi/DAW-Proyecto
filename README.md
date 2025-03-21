# DAW-Proyecto

## Tabla de Contenidos
- [DAW-Proyecto](#daw-proyecto)
  - [Tabla de Contenidos](#tabla-de-contenidos)
- [Descripción del Proyecto: Desarrollo de una Aplicación Web para un Grupo de Consumo Local y Ecológico](#descripción-del-proyecto-desarrollo-de-una-aplicación-web-para-un-grupo-de-consumo-local-y-ecológico)
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
- [Roadmap del Proyecto: Aplicación Web para un Grupo de Consumo Local y Ecológico](#roadmap-del-proyecto-aplicación-web-para-un-grupo-de-consumo-local-y-ecológico)
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
  - [1. Definición de Requisitos](#1-definición-de-requisitos-1)
  - [2. Cronograma del Proyecto: Aplicación Web para un Grupo de Consumo Local y Ecológico](#2-cronograma-del-proyecto-aplicación-web-para-un-grupo-de-consumo-local-y-ecológico)
  - [3. Prototipos de la Aplicación Web](#3-prototipos-de-la-aplicación-web)
    - [1. Pantalla de Inicio](#1-pantalla-de-inicio)
    - [2. Pantalla de Registro](#2-pantalla-de-registro)
    - [3. Pantalla de Inicio de Sesión](#3-pantalla-de-inicio-de-sesión)
    - [3. Pantalla de Recuperar contraseña](#3-pantalla-de-recuperar-contraseña)
    - [4. Pantalla de Dashboard (Tablero)](#4-pantalla-de-dashboard-tablero)
    - [5. Pantalla de Compras](#5-pantalla-de-compras)
    - [7. Pantalla de Historial de Pedidos (\>funcionalidades adicionales\<)](#7-pantalla-de-historial-de-pedidos-funcionalidades-adicionales)
    - [7. Pantalla de Detalles de Pedidos (\>funcionalidades adicionales\<)](#7-pantalla-de-detalles-de-pedidos-funcionalidades-adicionales)
    - [8. Pantalla de Gestión de Usuarios (para administradores)](#8-pantalla-de-gestión-de-usuarios-para-administradores)
    - [9. Pantalla de Configuración de Cuenta (\>funcionalidades adicionales\<)](#9-pantalla-de-configuración-de-cuenta-funcionalidades-adicionales)
    - [10. Pantalla de Soporte y Ayuda (\>funcionalidades adicionales\<)](#10-pantalla-de-soporte-y-ayuda-funcionalidades-adicionales)
    - [11. Pantalla de Gestión de proveedores](#11-pantalla-de-gestión-de-proveedores)
    - [12. Pantalla de Gestión de productos](#12-pantalla-de-gestión-de-productos)
    - [13. Pantalla de Gestión de pedidos](#13-pantalla-de-gestión-de-pedidos)
    - [Herramientas para Crear Prototipos](#herramientas-para-crear-prototipos)
  - [4. Flujo de Usuario para la Aplicación Web de Consumo Local y Ecológico](#4-flujo-de-usuario-para-la-aplicación-web-de-consumo-local-y-ecológico)
    - [1. Gestión de Productos](#1-gestión-de-productos)
      - [Flujo de Usuario:](#flujo-de-usuario)
    - [**2. Gestión de Pagos y Balances**](#2-gestión-de-pagos-y-balances)
    - [**3. Gestión de Usuarios y Proveedores**](#3-gestión-de-usuarios-y-proveedores)
    - [**4. Notificaciones**](#4-notificaciones)
    - [2. Gestión de Pedidos](#2-gestión-de-pedidos)
      - [Flujo de Usuario:](#flujo-de-usuario-1)
    - [3. Cálculos Financieros](#3-cálculos-financieros)
      - [Flujo de Usuario:](#flujo-de-usuario-2)
    - [4. Gestión de Usuarios (para administradores)](#4-gestión-de-usuarios-para-administradores)
      - [Flujo de Usuario:](#flujo-de-usuario-3)
    - [5. Pantalla de Soporte y Ayuda _(funcionalidades adicionales)_](#5-pantalla-de-soporte-y-ayuda-funcionalidades-adicionales)
      - [Flujo de Usuario:](#flujo-de-usuario-4)
    - [6. Notificaciones y Recordatorios _(funcionalidades adicionales)_](#6-notificaciones-y-recordatorios-funcionalidades-adicionales)
      - [Flujo de Usuario:](#flujo-de-usuario-5)
    - [7. Historial de Pedidos _(funcionalidades adicionales)_](#7-historial-de-pedidos-funcionalidades-adicionales)
      - [Flujo de Usuario:](#flujo-de-usuario-6)
    - [8. Configuración de Cuenta](#8-configuración-de-cuenta)
      - [Flujo de Usuario:](#flujo-de-usuario-7)
    - [9. Panel de Administración (para administradores)](#9-panel-de-administración-para-administradores)
      - [Flujo de Usuario:](#flujo-de-usuario-8)
    - [10. Informes y Estadísticas _(funcionalidades adicionales)_](#10-informes-y-estadísticas-funcionalidades-adicionales)
      - [Flujo de Usuario:](#flujo-de-usuario-9)
  - [DATOS](#datos)
    - [**Tablas Principales**](#tablas-principales)
      - [1. **Usuario**](#1-usuario)
      - [2. **Proveedor**](#2-proveedor)
      - [3. **Producto**](#3-producto)
      - [4. **Pedido**](#4-pedido)
      - [5. **Detalle\_Pedido**](#5-detalle_pedido)
      - [6. **Usuario\_Proveedor** (Relación muchos a muchos)](#6-usuario_proveedor-relación-muchos-a-muchos)
      - [7. **Pedido\_Periodico**](#7-pedido_periodico)
      - [8. **Pago** (Nueva)](#8-pago-nueva)
      - [9. **Notificacion** (Nueva)](#9-notificacion-nueva)
    - [**5. Consultas SQL**](#5-consultas-sql)
      - [Crear Tablas](#crear-tablas)

# Descripción del Proyecto: Desarrollo de una Aplicación Web para un Grupo de Consumo Local y Ecológico

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




# Roadmap del Proyecto: Aplicación Web para un Grupo de Consumo Local y Ecológico

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

- **Lista de funcionalidades clave.**
  - **Objetivo**: Definir las características esenciales que debe tener la aplicación para satisfacer las necesidades de los usuarios.
  - **Acciones**:
    - Analizar las necesidades de los usuarios y extraer las funcionalidades necesarias.
    - Clasificar las funcionalidades en categorías, todas consideradas esenciales:
      - [ ] **Gestión de Proveedores**: 
        - Añadir, editar y eliminar datps de proveedores.
        - **Complejidad Técnica**: Media. Requiere implementación de formularios y validaciones, así como la gestión de la base de datos.
      - [ ] **Gestión de Productos**: 
        - Añadir, editar y eliminar productos.
        - Visualizar información de proveedores.
        - **Complejidad Técnica**: Media. Requiere implementación de formularios y validaciones, así como la gestión de la base de datos.
      - [ ] **Gestión de Pedidos**: 
        - Los pedidos son conjuntos.
        - Cada pedido se hace a un proveedor con su lista de productos. 
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
| **1. Definición de Requisitos** | Crear una lista de funcionalidades clave. | 20/03/2025 | 20/03/2025 | Equipo de Proyecto |
| **2. Planificación del Proyecto** | Establecer un cronograma con hitos y plazos. | 20/03/2025 | 20/03/2025 | Equipo de Proyecto |
| **3. Diseño de la Aplicación** | Crear wireframes o prototipos de la interfaz de usuario. | 20/03/2025 | 20/03/2025 | Diseñador UI/UX |
| **4. Configuración del Entorno de Desarrollo** | Instalar Node.js, Express, PostgreSQL, Vue.js y Bootstrap. | 20/03/2025 | 20/03/2025 | Desarrollador Back-End |
| **5. Desarrollo del Back-End** | Definir modelos de datos, implementar rutas de API y autenticación. | 20/03/2025 | 30/03/2025 | Desarrollador Back-End |
| **6. Desarrollo del Front-End** | Construir la interfaz de usuario y conectar con la API. | 01/04/2025 | 01/05/2025 | Desarrollador Front-End |
| **7. Pruebas** | Implementar pruebas unitarias y de integración. | 01/05/2025 | 10/05/2025 | Equipo de QA |
| **8. Documentación** | Documentar la API y crear una guía de usuario. | 20/03/2025 | 20/03/2025 | Documentador |
| **9. Despliegue** | Elegir un servicio de hosting y configurar el entorno de producción. | 01/05/2025 | 15/05/2025 | Desarrollador Back-End |
| **10. Recopilación de Feedback y Mejora Continua** | Lanzar una versión beta y recopilar feedback. | 01/05/2025 | 15/05/2025 | Equipo de Proyecto |
| **11. Mantenimiento** | Establecer un plan para soporte técnico y actualizaciones. | 15/05/2025 | En curso | Equipo de Proyecto |

## 3. Prototipos de la Aplicación Web

### 1. Pantalla de Inicio
- **Elementos Clave**:
  - Logo del grupo de consumo.
  - Breve descripción del grupo y su misión.
  - Botón de "Iniciar Sesión" o "Registrarse".

Interacciones:

        Al hacer clic en "Iniciar Sesión", se abre la Pantalla de Inicio de Sesión.
        Al hacer clic en "Registrarse", se abre la Pantalla de Registro.

### 2. Pantalla de Registro
- **Elementos Clave**:
  - Formulario de registro con campos para:
    - Nombre completo.
    - Correo electrónico.
    - Contraseña.
    - Confirmar contraseña.
  - Botón de "Registrarse".
  - Enlace a "Iniciar Sesión" si ya tiene una cuenta.

    Interacciones:

        Al hacer clic en "Registrarse", se valida la información:

            Si es correcta, se muestra un mensaje de éxito y se redirige a la Pantalla de Inicio de Sesión.
            Si hay errores, se muestran mensajes de validación (por ejemplo, "El correo ya está registrado").

### 3. Pantalla de Inicio de Sesión
- **Elementos Clave**:
  - Formulario de inicio de sesión con campos para:
    - Movil.
    - Contraseña.
  - Botón de "Iniciar Sesión".
  - Enlace a "¿Olvidaste tu contraseña?".

    Interacciones:

        Al hacer clic en "Iniciar Sesión", se valida la información:

            Si es correcta, se redirige al Dashboard.

            Si hay errores, se muestra un mensaje de error (por ejemplo, "Credenciales incorrectas").

        Al hacer clic en "¿Olvidaste tu contraseña?", se abre la Pantalla de Recuperación de Contraseña.

### 3. Pantalla de Recuperar contraseña
- **Elementos Clave**:
  - Formulario de recuperar contraseña con campos para:
    - Movil.

  - Botón: [Enviar Instrucciones].

    Interacciones:

        Al hacer clic en "Enviar Instrucciones", se envía un correo o sms con un enlace para restablecer la contraseña.

### 4. Pantalla de Dashboard (Tablero)
- **Elementos Clave**:
  - Cesta mensual. Lista de productos pedidos y su estado.
  - Acceso rápido a "Adquirir productos".
  - Sección de "Productos Disponibles".
  - Notificaciones sobre pedidos abierto(no periódicos).

    Interacciones:

        Al hacer clic en "Adquirir productos", se abre la Pantalla de compras.

        Al hacer clic en "Ver Historial de Pedidos", se abre la Pantalla de Historial de Pedidos.

### 5. Pantalla de Compras
- **Elementos Clave**:
  - Agrupados por grupos de productos (proveedor)
  - Lista de productos con:
    - Nombre del producto.
    - Descripción.
    - Precio.
    - Botón de "Añadir a la cesta/pedido conjunto".
  - Filtros para buscar productos por categoría o proveedor.

    Interacciones:

        Al hacer clic en "Añadir producto", se actualiza el carrito/cesta y se muestra un mensaje de confirmación.

        Al hacer clic en "Ver Cesta", se abre la Pantalla de la cesta o dashboard.

### 7. Pantalla de Historial de Pedidos (>funcionalidades adicionales<)
- **Elementos Clave**:
  - Lista de pedidos anteriores con:
    - Fecha de entrega
    - Importe.
    - Estado del pedido (entregao, repartido, pendiente, cancelado, en proceso).
    -  botón [Ver Detalles]
  - Opción para ver detalles de cada pedido.

### 7. Pantalla de Detalles de Pedidos (>funcionalidades adicionales<)
- **Elementos Clave**:
  - Lista de productos del pedido:
    - Usuario que lo ha comprado
    - Unidades
    - Importe.

### 8. Pantalla de Gestión de Usuarios (para administradores)
- **Elementos Clave**:
  - Lista de usuarios con:
    - Nombre.
    - Correo electrónico.
    - Telefono
    - Estado (activo/inactivo).
    - Botones para "Editar" o "Eliminar" usuarios.
  - Opción para añadir nuevos usuarios.

    Interacciones:

        Al hacer clic en "Editar", se abre la Pantalla de Edición de Usuario.

        Al hacer clic en "Eliminar", se muestra un mensaje de confirmación y se elimina el usuario.

### 9. Pantalla de Configuración de Cuenta (>funcionalidades adicionales<)
- **Elementos Clave**:
  - Formulario para actualizar información del usuario:
    - Nombre.
    - Correo electrónico.
    - Contraseña (opcional).
  - Botón de "Guardar Cambios".

    Interacciones:

        Al hacer clic en "Actualizar Información", se valida la información y se muestra un mensaje de éxito.

### 10. Pantalla de Soporte y Ayuda (>funcionalidades adicionales<)
- **Elementos Clave**:
  - Sección de preguntas frecuentes (FAQ).
  - Formulario de contacto para enviar consultas.
  - Información de contacto del grupo.


    Interacciones:

        Al hacer clic en "Enviar Consulta", se muestra un mensaje de confirmación.

### 11. Pantalla de Gestión de proveedores
- **Elementos Clave**:
  - Admin permiso total
  - Usuarios que gestionan un proveedor, permiso de modificar
  - Lista de proveedores con:
    - Nombre.
    - Correo electrónico.
    - Telefono
    - Estado (activo/inactivo).
    - Botones para "Editar" o "Eliminar" proveedores.
    - Listado de productos
  - Opción para añadir nuevos proveedores.


    Interacciones:

        Al hacer clic en añadir proveedor se abre un modal con un formulario para introducir los datos del proveedor.

### 12. Pantalla de Gestión de productos
- **Elementos Clave**:
  - Admin y usuario gestor del proveedor permiso total
  - Lista de productos con:
    - Nombre.
    - Descripcion.
    - Precio
    - Estado (activo/inactivo).
    - Botones para "Editar" o "Eliminar" productos.
  - Opción para añadir nuevos productos.

### 13. Pantalla de Gestión de pedidos
- **Elementos Clave**:
  - Admin y usuario gestor del proveedor permiso total
  - El usuario geestor del proveedor será el encargado de abrir pedidos.
  - Lista de pedidos con:
    - Id
    - Fecha de entrega(si hay)
    - Fecha de apertura
    - Fecha de cierre
    - Importe total
    - Ver detalles de pedido
  - Opcion para crear un nuevo pedido. Abre modal con:
    - Fecha de apertura. Desde cuando los usuarios podrán pedir productos.
    - Fecha de cierre. Hasta cuando podrán los usuarios pedir, modificar o borrar productos.
    - Fecha aproximada de reparto.
    - Periodicidad. PAra programar el pedido para que se abra con los mismo parametros cada X dias.
### Herramientas para Crear Prototipos
- **Figma**: Herramienta de diseño colaborativo en línea.
- **Adobe XD**: Software de diseño y prototipado de Adobe.
- **Sketch**: Herramienta de diseño vectorial para macOS.
- **InVision**: Plataforma para crear prototipos interactivos.

Quiero una herramienta que sea open source compatible con linux y windows:

## 4. Flujo de Usuario para la Aplicación Web de Consumo Local y Ecológico

### 1. Gestión de Productos

#### Flujo de Usuario:
1. **Acceso a la sección de Productos**:
   - El usuario inicia sesión en la aplicación.
   - Navega al menú y selecciona "Productos".

2. **Visualización de Productos**:
   - Se muestra una lista de productos disponibles con detalles (nombre, descripción, precio, proveedor/productor).
   - El usuario selecciona un grupo de productos(proveedor).
   - Si el pedido a ese proveedor está abierto, estarán activados los botones para añadir productos.
   - El usuario selecciona productos y cantidades.
   - El usuario hace clic en **"Añadir al Pedido"**.
   - El usuario puede aplicar filtros para buscar productos específicos.

3. **Añadir un Producto (al proveedor/grupo de productos)** (para administradores y el usuario responsable de ese productor/proveedor):
   - El administrador selecciona "Añadir Producto".
   - Completa un formulario con la información del producto (nombre, descripción, precio, proveedor/productor).
   - Hace clic en "Guardar" para añadir el producto a la base de datos.

4. **Editar o Eliminar un Producto** (para administradores y el usuario responsable de ese productor/proveedor):
   - El administrador selecciona un producto de la lista.
   - Elige "Editar" para modificar la información o "Eliminar" para quitar el producto.
   - Confirma la acción.

5. **Pantalla de dashboard - Cesta de Compras Mensual**:
   - La cesta se resetea mensualmente. Excepto productos no entragados. 
   - El usuario ve un listado de los productos pedidos ese mes.
   - Al lado de cada producto se muestra el estado.


6. **Notificación al Proveedor y usuario gestor**:
   - Cuando llega la fecha límite(fecha cierre de pedido), se notifica al proveedor y al usuario encargado de ese proveedor.
   - Los productos se marcan como **"En proceso"**.


7. **Seguimiento del Pedido**:
   - El usuario puede ver el estado del pedido en el **Dashboard** y en el **Historial de Pedidos**.
   - Estados: En proceso, En reparto, Entregado, Repartido.

8. **Entrega del Pedido**:
   - El proveedor entrega los productos.
   - Puede que se haga el reparto de pedidos o no
   - El usuario confirma la entrega o reparto.
   - El sistema actualiza el estado del pedido a **"Entregado"** o **"Repartido"**.

### **2. Gestión de Pagos y Balances**
- Al final del mes, se calculan los saldos de los usuarios.
- Los usuarios que deben dinero realizan pagos a los usuarios que gestionan los proveedores.
- Se generan notificaciones para informar sobre los pagos pendientes.

### **3. Gestión de Usuarios y Proveedores**
- **Registro de Usuario**:
  - El usuario introduce sus datos y espera la confirmación del administrador.
- **Gestión de Usuarios**:
  - El administrador activa/desactiva usuarios y accede a su historial de pedidos.
- **Gestión de Proveedores**:
  - Los usuarios encargados gestionan los proveedores que tienen asignados y los pedidos a ese proveedor.


### **4. Notificaciones**
- Los usuarios reciben notificaciones sobre:
  - Nuevos pedidos.
  - Cambios en el estado de los pedidos.
  - Pagos pendientes.

   - El usuario puede ver el estado del pedido en el **Dashboard** o **Historial de Pedidos**.
   - Estados: Pendiente, En reparto, Entregado, Repartido.

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

4. **Gestión de Pedidos Existentes _(funcionalidades adicionales)_**:
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

### 5. Pantalla de Soporte y Ayuda _(funcionalidades adicionales)_

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

### 6. Notificaciones y Recordatorios _(funcionalidades adicionales)_

#### Flujo de Usuario:
1. **Configuración de Notificaciones**:
   - El usuario accede a "Configuración de Cuenta".
   - Selecciona "Notificaciones".
   - Activa o desactiva las notificaciones para fechas de pedidos y vencimientos.

2. **Recepción de Notificaciones**:
   - El usuario recibe notificaciones por correo electrónico o en la aplicación sobre fechas límite de pedidos y actualizaciones.

---

### 7. Historial de Pedidos _(funcionalidades adicionales)_

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

### 10. Informes y Estadísticas _(funcionalidades adicionales)_

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

## DATOS

### **Tablas Principales**

#### 1. **Usuario**
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Usuario`     | `SERIAL`          | Clave primaria.                      |
| `Nombre`         | `VARCHAR(100)`    | Nombre del usuario.                  |
| `Correo`         | `VARCHAR(100)`    | Correo electrónico (único).          |
| `Contraseña`     | `VARCHAR(100)`    | Contraseña del usuario.              |
| `Movil`          | `VARCHAR(20)`     | Teléfono móvil del usuario.          |
| `Rol`            | `VARCHAR(50)`     | Rol del usuario (admin, gestor, usuario). |
| `Activo`         | `BOOLEAN`         | Indica si el usuario está activo.    |
| `Saldo`          | `DECIMAL(10, 2)`  | Saldo actual del usuario.            |

---

#### 2. **Proveedor**
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Proveedor`   | `SERIAL`          | Clave primaria.                      |
| `Nombre`         | `VARCHAR(100)`    | Nombre del proveedor.                |
| `Contacto`       | `VARCHAR(100)`    | Nombre de la persona de contacto.    |
| `Telefono`       | `VARCHAR(20)`     | Teléfono del proveedor.              |
| `Movil`          | `VARCHAR(20)`     | Teléfono móvil del proveedor.        |
| `Correo`         | `VARCHAR(100)`    | Correo electrónico del proveedor.    |
| `Envio_Movil`    | `BOOLEAN`         | Avisar mediante SMS o WhatsApp.      |
| `Envio_Mail`     | `BOOLEAN`         | Avisar mediante correo electrónico.  |

---

#### 3. **Producto**
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Producto`    | `SERIAL`          | Clave primaria.                      |
| `Nombre`         | `VARCHAR(100)`    | Nombre del producto.                 |
| `Descripcion`    | `TEXT`            | Descripción del producto.            |
| `Precio`         | `DECIMAL(10, 2)`  | Precio del producto.                 |
| `Frecuencia_Pedido` | `VARCHAR(50)`  | Frecuencia de pedido (semanal, mensual, etc.). |
| `ID_Proveedor`   | `INT`             | Clave foránea (relación con `Proveedor`). |
| `ID_Usuario_Gestor`   | `INT`             | Clave foránea (relación con `Usuario`). |

---

#### 4. **Pedido**
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Pedido`      | `SERIAL`          | Clave primaria.                      |
| `ID_Usuario_Encargado` | `INT`     | Clave foránea (relación con `Usuario`). |
| `ID_Proveedor`   | `INT`             | Clave foránea (relación con `Proveedor`). |
| `Fecha_Apertura` | `TIMESTAMP`       | Fecha y hora de apertura del pedido. |
| `Fecha_Cierre`   | `TIMESTAMP`       | Fecha límite para modificar el pedido. |
| `Fecha_Entrega`  | `TIMESTAMP`       | Fecha y hora de entrega.             |
| `Estado`         | `VARCHAR(50)`     | Estado del pedido (pendiente, en proceso, entregado, repartido, cancelado). |

---

#### 5. **Detalle_Pedido**
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Detalle`     | `SERIAL`          | Clave primaria.                      |
| `ID_Pedido`      | `INT`             | Clave foránea (relación con `Pedido`). |
| `ID_Producto`    | `INT`             | Clave foránea (relación con `Producto`). |
| `Cantidad`       | `INT`             | Cantidad del producto.               |
| `Precio_Total`   | `DECIMAL(10, 2)`  | Precio total del producto.           |
| `ID_Usuario_Comprador` | `INT`     | Clave foránea (relación con `Usuario`). |

---

#### 6. **Usuario_Proveedor** (Relación muchos a muchos)
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Usuario`     | `INT`             | Clave foránea (relación con `Usuario`). |
| `ID_Proveedor`   | `INT`             | Clave foránea (relación con `Proveedor`). |

---

#### 7. **Pedido_Periodico**
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Pedido_Periodico` | `SERIAL`    | Clave primaria.                      |
| `ID_Proveedor`   | `INT`             | Clave foránea (relación con `Proveedor`). |
| `Fecha_Inicio`   | `TIMESTAMP`       | Fecha de inicio del pedido periódico. |
| `Fecha_Fin`      | `TIMESTAMP`       | Fecha de fin del pedido periódico.   |
| `Activo`         | `BOOLEAN`         | Indica si el pedido está activo.     |
| `Periodicidad`   | `INT`             | Días entre pedidos.                  |
| `Dia_Apertura`   | `INT`             | Día de la semana en que se abre el pedido. |
| `Dia_Cierre`     | `INT`             | Día de la semana en que se cierra el pedido. |
| `Dia_Entrega`    | `INT`             | Día aproximado de entrega.           |

---

#### 8. **Pago** (Nueva)
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Pago`        | `SERIAL`          | Clave primaria.                      |
| `ID_Usuario_Deudor` | `INT`         | Clave foránea (relación con `Usuario`). |
| `ID_Usuario_Creditor` | `INT`      | Clave foránea (relación con `Usuario`). |
| `Monto`          | `DECIMAL(10, 2)`  | Monto del pago.                      |
| `Fecha_Pago`     | `TIMESTAMP`       | Fecha y hora del pago.               |
| `Estado`         | `VARCHAR(50)`     | Estado del pago (pendiente, completado). |

---

#### 9. **Notificacion** (Nueva)
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Notificacion` | `SERIAL`         | Clave primaria.                      |
| `ID_Usuario`     | `INT`             | Clave foránea (relación con `Usuario`). |
| `Mensaje`        | `TEXT`            | Contenido de la notificación.        |
| `Fecha`          | `TIMESTAMP`       | Fecha y hora de la notificación.     |
| `Leida`          | `BOOLEAN`         | Indica si la notificación ha sido leída. |

---


### **5. Consultas SQL**

#### Crear Tablas
```sql
CREATE TABLE Usuario (
    ID_Usuario SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) UNIQUE NOT NULL,
    Contraseña VARCHAR(100) NOT NULL,
    Movil VARCHAR(20),
    Rol VARCHAR(50) NOT NULL CHECK (Rol IN ('admin', 'gestor', 'usuario')),
    Activo BOOLEAN DEFAULT FALSE,
    Saldo DECIMAL(10, 2) DEFAULT 0
);

CREATE TABLE Proveedor (
    ID_Proveedor SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Contacto VARCHAR(100),
    Telefono VARCHAR(20),
    Movil VARCHAR(20),
    Correo VARCHAR(100),
    Envio_Movil BOOLEAN DEFAULT FALSE,
    Envio_Mail BOOLEAN DEFAULT TRUE
);

CREATE TABLE Producto (
    ID_Producto SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Precio DECIMAL(10, 2) NOT NULL,
    Frecuencia_Pedido VARCHAR(50) CHECK (Frecuencia_Pedido IN ('semanal', 'mensual', 'bimestral', 'trimestral', 'semestral')),
    ID_Proveedor INT REFERENCES Proveedor(ID_Proveedor) ON DELETE CASCADE,
    ID_Usuario_Encargado INT REFERENCES Usuario(ID_Usuario) ON DELETE CASCADE,
);

CREATE TABLE Pedido (
    ID_Pedido SERIAL PRIMARY KEY,
    ID_Usuario_Encargado INT REFERENCES Usuario(ID_Usuario) ON DELETE CASCADE,
    ID_Proveedor INT REFERENCES Proveedor(ID_Proveedor) ON DELETE CASCADE,
    Fecha_Apertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Fecha_Cierre TIMESTAMP,
    Fecha_Entrega TIMESTAMP,
    Estado VARCHAR(50) NOT NULL CHECK (Estado IN ('pendiente', 'en proceso', 'entregado', 'repartido', 'cancelado'))
);

CREATE TABLE Detalle_Pedido (
    ID_Detalle SERIAL PRIMARY KEY,
    ID_Pedido INT REFERENCES Pedido(ID_Pedido) ON DELETE CASCADE,
    ID_Producto INT REFERENCES Producto(ID_Producto) ON DELETE CASCADE,
    Cantidad INT NOT NULL,
    Precio_Total DECIMAL(10, 2) NOT NULL,
    ID_Usuario_Comprador INT REFERENCES Usuario(ID_Usuario) ON DELETE CASCADE
);

CREATE TABLE Usuario_Proveedor (
    ID_Usuario INT REFERENCES Usuario(ID_Usuario) ON DELETE CASCADE,
    ID_Proveedor INT REFERENCES Proveedor(ID_Proveedor) ON DELETE CASCADE,
    PRIMARY KEY (ID_Usuario, ID_Proveedor)
);

CREATE TABLE Pedido_Periodico (
    ID_Pedido_Periodico SERIAL PRIMARY KEY,
    ID_Proveedor INT REFERENCES Proveedor(ID_Proveedor) ON DELETE CASCADE,
    Fecha_Inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Fecha_Fin TIMESTAMP,
    Activo BOOLEAN DEFAULT TRUE,
    Periodicidad INT,
    Dia_Apertura INT,
    Dia_Cierre INT,
    Dia_Entrega INT
);

CREATE TABLE Pago (
    ID_Pago SERIAL PRIMARY KEY,
    ID_Usuario_Deudor INT REFERENCES Usuario(ID_Usuario) ON DELETE CASCADE,
    ID_Usuario_Creditor INT REFERENCES Usuario(ID_Usuario) ON DELETE CASCADE,
    Monto DECIMAL(10, 2) NOT NULL,
    Fecha_Pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Estado VARCHAR(50) NOT NULL CHECK (Estado IN ('pendiente', 'completado'))
);

CREATE TABLE Notificacion (
    ID_Notificacion SERIAL PRIMARY KEY,
    ID_Usuario INT REFERENCES Usuario(ID_Usuario) ON DELETE CASCADE,
    Mensaje TEXT NOT NULL,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Leida BOOLEAN DEFAULT FALSE
);
```
