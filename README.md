# DAW-Proyecto

## Tabla de Contenidos
- [Descripción del Proyecto](#descripción-del-proyecto)
- [Contexto Actual](#contexto-actual)
- [Propuesta de Solución](#propuesta-de-solución)
- [Instalación](#instalación)
- [Uso](#uso)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

# Descripción del Proyecto: Desarrollo de una Aplicación Web para un Grupo de Consumo Local y Ecológico

El objetivo de este proyecto es desarrollar una aplicación web que facilite la gestión de un grupo de consumo local y ecológico, compuesto por aproximadamente cuarenta usuarios (familias) y quince productores. Actualmente, la gestión de pedidos y productos se realiza de manera manual a través de tablas en Google Sheets, lo que puede resultar ineficiente y propenso a errores.

## Contexto Actual

### Estructura del Grupo
El grupo está formado por familias que se encargan de contactar directamente con los productores. Cada usuario asume la responsabilidad de un proveedor específico, aunque hay algunos usuarios que no gestionan ningún proveedor.

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
- [ ] Reunir a los usuarios para discutir necesidades y expectativas.
- [ ] Crear una lista de funcionalidades clave.

## 2. Planificación del Proyecto
- [ ] Establecer un cronograma con hitos y plazos.
- [ ] Asignar roles y responsabilidades a los miembros del equipo.

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

- [ ] **Crear una lista de funcionalidades clave.**
  - **Objetivo**: Definir las características esenciales que debe tener la aplicación para satisfacer las necesidades de los usuarios.
  - **Acciones**:
    - Analizar las necesidades de los usuarios y extraer las funcionalidades necesarias.
    - Clasificar las funcionalidades en categorías, todas consideradas esenciales:
      - **Gestión de Productos**: 
        - Añadir, editar y eliminar productos.
        - Visualizar información de proveedores.
        - **Complejidad Técnica**: Media. Requiere implementación de formularios y validaciones, así como la gestión de la base de datos.
      - **Gestión de Pedidos**: 
        - Crear y gestionar pedidos.
        - Establecer fechas límite y enviar recordatorios.
        - **Complejidad Técnica**: Alta. Implica lógica de negocio para el manejo de fechas y cálculos, así como notificaciones.
      - **Cálculos Financieros**: 
        - Calcular gastos mensuales.
        - Gestionar deudas entre usuarios.
        - **Complejidad Técnica**: Media. Requiere cálculos precisos y la gestión de relaciones entre usuarios y pedidos.
      - **Gestión de Usuarios**: 
        - Alta y baja de usuarios.
        - Funcionalidad de login y autenticación.
        - **Complejidad Técnica**: Alta. Implica la implementación de un sistema de autenticación seguro y la gestión de sesiones.

- [ ] **Priorizar las funcionalidades.**
  - **Objetivo**: Establecer que todas las funcionalidades son esenciales para el funcionamiento de la aplicación.
  - **Acciones**:
    - Asegurar que todas las funcionalidades se implementen en la primera fase del desarrollo.

Esta fase de definición de requisitos ayudará a asegurar que la aplicación cumpla con las expectativas de los usuarios y se enfoque en resolver los problemas actuales de gestión.

