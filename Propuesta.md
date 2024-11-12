Este proyecto consistirá en el desarrollo de un caso práctico, que defenderás delante de un tribunal formado por un grupo de profesores.  
La solución técnica debe completar arquitecturas y configuraciones adecuadas teniendo en cuenta los contenidos adquiridos en los distintos módulos de los dos cursos.

PLANTILLA PARA LA DEFINICIÓN DEL PROYECTO

| PROYECTO PARA GRADO SUPERIOR DAM/DAW/ASIR |  |  |  |  |  |
| ----- | :---- | ----- | ----- | ----- | ----- |
|  |  |  |  |  |  |
| **TÍTULO DEL PROYECTO:** | Ekonsumo Esparza - Grupo de consumo ecológico de Esparza de Galar|  |  |  |  |
|  |  |  |  |  |  |
| **Descripción** | Este proyecto tiene como objetivo desarrollar una aplicación web que facilite la gestión de un grupo de consumo local y ecológico, mejorando la eficiencia en la gestión de pedidos y productos, actualmente realizada manualmente en Google Sheets. La aplicación permitirá a aproximadamente 40 familias y 15 productores gestionar pedidos de manera automatizada, con recordatorios y cálculos automáticos de gastos y deudas. Los usuarios interactuarán a través de una interfaz amigable y accesible, donde podrán realizar pedidos, gestionar productos y comunicarse con los productores. |  |  |  |  |
|  |  |  |  |  |  |
| **Diseño** | La infraestructura utilizará Node.js, Express y Swagger para el back-end, PostgreSQL para la base de datos y Vue.js junto con Bootstrap para el front-end. La estructura del sitio web incluirá las siguientes secciones: <br> - **Front End:** Pantallas para registro, inicio de sesión, gestión de productos, realización de pedidos, historial de pedidos. La interfaz será intuitiva, con un diseño responsive que se adapte a dispositivos móviles. <br> - **Back End:** Se implementará una API RESTful para la gestión de datos, autenticación de usuarios y administración de productos y pedidos. Se incluirá un manual para administradores sobre la gestión del sistema, actualizaciones y migraciones. <br> - **Esquema conceptual:** Se desarrollará un diagrama E-R para representar las relaciones entre las entidades del sistema. <br><br> **Diagrama E-R:** <br> ![Diagrama E-R](https://via.placeholder.com/600x400?text=Diagrama+E-R+Placeholder) <br> **Entidades y Atributos:** <br> 1. **Usuario**: ID_Usuario (PK), Nombre, Correo, Contraseña, Rol (Admin/Usuario) <br> 2. **Producto**: ID_Producto (PK), Nombre, Descripción, Precio, ID_Proveedor (FK) <br> 3. **Proveedor**: ID_Proveedor (PK), Nombre, Contacto, Teléfono, Correo <br> 4. **Pedido**: ID_Pedido (PK), Fecha, ID_Usuario (FK), Estado (Pendiente, Completado, Cancelado) <br> 5. **Detalle_Pedido**: ID_Detalle (PK), ID_Pedido (FK), ID_Producto (FK), Cantidad, Precio_Total |  |  |  |  |
| **Plan de trabajo** | Se utilizarán herramientas como Visual Studio Code, Postman para pruebas de API, y Git para el control de versiones. El análisis de necesidades se llevará a cabo mediante encuestas a los usuarios actuales del sistema. Se realizarán esbozos de la interfaz (front-end) utilizando Figma, y se desarrollará la lógica del servidor (back-end) en Node.js. El cronograma del proyecto se establecerá con plazos claros para cada fase, desde la definición de requisitos hasta el despliegue y mantenimiento. |  |  |  |  |



**Una vez elegido el tema sobre el cual se va a trabajar, recopila información o recursos. Recuerda que por motivos de derechos de autor debes referenciar las fuentes.**

TENÉIS QUE ENTREGAR RELLENADA LA TABLA DE PLANTILLA DEL PROYECTO CON TODOS LOS DETALLES. DESPUÉS LOS REVISAREMOS Y OS DAREMOS EL VISTO BUENO PARA QUE PODÁIS EMPEZAR A DESARROLLAR EL PROYECTO. 

EN CASO DE INTERPRETAR QUE EL PROYECTO NO CUMPLE LOS REQUISITOS MÍNIMOS EXIGIBLES, SE OS COMENTARÁ ASPECTOS A MEJORAR O PROFUNDIZAR EN EL PROYECTO PLANTEADO.

EN CASO DE NO ENTREGAR ESTA PLANTILLA CUMPLIMENTADA PARA EL 22 DE NOVIEMBRE, SIGNIFICA QUE NO SE OS DA EL VISTO BUENO PARA EL PROYECTO PLANTEADO Y SE OS ASIGNARÁ UN PROYECTO DETERMINADO POR EL PROFESORADO 
