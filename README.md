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

