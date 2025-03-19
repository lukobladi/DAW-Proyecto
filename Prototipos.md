# Pantalla de Inicio
- **Elementos**: 
  - Logo
  - Menú de navegación: [Inicio] [Productos] [Pedidos] [Soporte]
  - Descripción del grupo
  - Botones: [Iniciar Sesión] [Registrarse]
- **Interacciones**: 
  - Al hacer clic en "Iniciar Sesión", se abre la pantalla de inicio de sesión.
  - Al hacer clic en "Registrarse", se abre la pantalla de registro.



# Pantalla de Registro
- **Elementos**: 
  - Campos: Nombre, Correo electrónico, Contraseña
  - Botón: [Registrarse]
- **Interacciones**: 
  - Al hacer clic en "Registrarse", se valida la información y se muestra un mensaje de éxito o error.



# Pantalla de Inicio de Sesión
- **Elementos**: 
  - Campos: Correo electrónico, Contraseña
  - Botón: [Iniciar Sesión]
- **Interacciones**: 
  - Al hacer clic en "Iniciar Sesión", se valida la información y se redirige al dashboard si es correcto.



# Pantalla de Dashboard
- **Elementos**: 
  - Resumen de pedidos
  - Acceso rápido a realizar pedidos
  - Notificaciones
- **Interacciones**: 
  - Al hacer clic en "Realizar Pedido", se abre la pantalla de realización de pedidos.



# Pantalla de Productos
- **Elementos**: 
  - Lista de productos con detalles
  - Opción de añadir al pedido
- **Interacciones**: 
  - Al hacer clic en "Añadir", se muestra un mensaje de confirmación y se actualiza el carrito de compras.



# Pantalla de Realización de Pedidos
- **Elementos**: 
  - Selección de productos
  - Ingreso de cantidades
  - Resumen del pedido
- **Interacciones**: 
  - Al hacer clic en "Confirmar Pedido", se valida la información y se muestra un mensaje de éxito.



# Pantalla de Historial de Pedidos
- **Elementos**: 
  - Lista de pedidos anteriores con detalles y estado
- **Interacciones**: 
  - Al hacer clic en un pedido, se muestran los detalles del mismo.



# Pantalla de Gestión de Usuarios (Administradores)
- **Elementos**: 
  - Lista de usuarios con opciones para editar o eliminar
- **Interacciones**: 
  - Al hacer clic en "Editar", se abre un formulario con la información del usuario.



# Pantalla de Configuración de Cuenta
- **Elementos**: 
  - Campos para actualizar información del usuario
  - Botón: [Actualizar Información]
- **Interacciones**: 
  - Al hacer clic en "Actualizar Información", se valida y se muestra un mensaje de éxito.



# Pantalla de Soporte y Ayuda
- **Elementos**: 
  - Sección de preguntas frecuentes
  - Formulario de contacto
- **Interacciones**: 
  - Al enviar una consulta, se muestra un mensaje de confirmación.


Pantalla de Inicio

    Elementos:

        Logo: Colocado en la esquina superior izquierda.

        Menú de Navegación: [Inicio] [Productos] [Pedidos] [Soporte].

        Descripción del Grupo: Breve texto explicativo sobre el grupo de consumo.

        Botones: [Iniciar Sesión] [Registrarse].

    Interacciones:

        Al hacer clic en "Iniciar Sesión", se abre la Pantalla de Inicio de Sesión.

        Al hacer clic en "Registrarse", se abre la Pantalla de Registro.

Pantalla de Registro

    Elementos:

        Campos: Nombre, Correo electrónico, Contraseña, Confirmar Contraseña.

        Botón: [Registrarse].

    Interacciones:

        Al hacer clic en "Registrarse", se valida la información:

            Si es correcta, se muestra un mensaje de éxito y se redirige a la Pantalla de Inicio de Sesión.

            Si hay errores, se muestran mensajes de validación (por ejemplo, "El correo ya está registrado").

Pantalla de Inicio de Sesión

    Elementos:

        Campos: Correo electrónico, Contraseña.

        Botón: [Iniciar Sesión].

        Enlace: [¿Olvidaste tu contraseña?].

    Interacciones:

        Al hacer clic en "Iniciar Sesión", se valida la información:

            Si es correcta, se redirige al Dashboard.

            Si hay errores, se muestra un mensaje de error (por ejemplo, "Credenciales incorrectas").

        Al hacer clic en "¿Olvidaste tu contraseña?", se abre la Pantalla de Recuperación de Contraseña.

Pantalla de Recuperación de Contraseña (Nueva)

    Elementos:

        Campo: Correo electrónico.

        Botón: [Enviar Instrucciones].

    Interacciones:

        Al hacer clic en "Enviar Instrucciones", se envía un correo con un enlace para restablecer la contraseña.

Pantalla de Dashboard

    Elementos:

        Resumen de Pedidos: Tarjetas con información resumida (por ejemplo, "Pedidos Pendientes", "Pedidos Completados").

        Acceso Rápido: Botones para [Realizar Pedido], [Ver Historial de Pedidos].

        Notificaciones: Lista de notificaciones recientes (por ejemplo, "Nuevo producto disponible").

    Interacciones:

        Al hacer clic en "Realizar Pedido", se abre la Pantalla de Realización de Pedidos.

        Al hacer clic en "Ver Historial de Pedidos", se abre la Pantalla de Historial de Pedidos.

Pantalla de Productos

    Elementos:

        Lista de Productos: Tarjetas con imagen, nombre, descripción, precio y botón [Añadir al Pedido].

        Filtros: Por categoría, proveedor, etc.

        Carrito de Compras: Resumen de productos añadidos.

    Interacciones:

        Al hacer clic en "Añadir al Pedido", se actualiza el carrito y se muestra un mensaje de confirmación.

        Al hacer clic en "Ver Carrito", se abre la Pantalla de Carrito de Compras.

Pantalla de Carrito de Compras (Nueva)

    Elementos:

        Lista de Productos Seleccionados: Nombre, cantidad, precio unitario y total.

        Botones: [Continuar Comprando] [Confirmar Pedido].

    Interacciones:

        Al hacer clic en "Continuar Comprando", se regresa a la Pantalla de Productos.

        Al hacer clic en "Confirmar Pedido", se abre la Pantalla de Confirmación de Pedido.

Pantalla de Confirmación de Pedido (Nueva)

    Elementos:

        Resumen del Pedido: Productos, cantidades, precios y total.

        Campo: Notas adicionales (opcional).

        Botón: [Confirmar Pedido].

    Interacciones:

        Al hacer clic en "Confirmar Pedido", se valida la información y se muestra un mensaje de éxito.

Pantalla de Historial de Pedidos

    Elementos:

        Lista de Pedidos Anteriores: Fecha, estado, total y botón [Ver Detalles].

    Interacciones:

        Al hacer clic en "Ver Detalles", se abre la Pantalla de Detalles del Pedido.

Pantalla de Detalles del Pedido (Nueva)

    Elementos:

        Información del Pedido: Fecha, estado, productos, cantidades, precios y total.

        Botón: [Volver al Historial].

    Interacciones:

        Al hacer clic en "Volver al Historial", se regresa a la Pantalla de Historial de Pedidos.

Pantalla de Gestión de Usuarios (Administradores)

    Elementos:

        Lista de Usuarios: Nombre, correo, rol y botones [Editar] [Eliminar].

    Interacciones:

        Al hacer clic en "Editar", se abre la Pantalla de Edición de Usuario.

        Al hacer clic en "Eliminar", se muestra un mensaje de confirmación y se elimina el usuario.

Pantalla de Edición de Usuario (Nueva)

    Elementos:

        Campos: Nombre, Correo electrónico, Rol (admin, gestor, usuario).

        Botón: [Guardar Cambios].

    Interacciones:

        Al hacer clic en "Guardar Cambios", se valida la información y se muestra un mensaje de éxito.

Pantalla de Configuración de Cuenta

    Elementos:

        Campos: Nombre, Correo electrónico, Contraseña actual, Nueva contraseña, Confirmar nueva contraseña.

        Botón: [Actualizar Información].

    Interacciones:

        Al hacer clic en "Actualizar Información", se valida la información y se muestra un mensaje de éxito.

Pantalla de Soporte y Ayuda

    Elementos:

        Sección de Preguntas Frecuentes: Lista de preguntas y respuestas comunes.

        Formulario de Contacto: Campos para nombre, correo, asunto y mensaje.

        Botón: [Enviar Consulta].

    Interacciones:

        Al hacer clic en "Enviar Consulta", se muestra un mensaje de confirmación.

Pantalla de Notificaciones (Nueva)

    Elementos:

        Lista de Notificaciones: Título, descripción y fecha.

    Interacciones:

        Al hacer clic en una notificación, se muestra un modal con detalles adicionales.

Pantalla de Perfil de Proveedor (Nueva)

    Elementos:

        Información del Proveedor: Nombre, contacto, teléfono, correo.

        Lista de Productos: Productos ofrecidos por el proveedor.

    Interacciones:

        Al hacer clic en un producto, se abre la Pantalla de Detalles del Producto.

Pantalla de Detalles del Producto (Nueva)

    Elementos:

        Información del Producto: Nombre, descripción, precio, proveedor.

        Botón: [Añadir al Pedido].

    Interacciones:

        Al hacer clic en "Añadir al Pedido", se actualiza el carrito y se muestra un mensaje de confirmación.

Resumen de Pantallas

    Inicio

    Registro

    Inicio de Sesión

    Recuperación de Contraseña

    Dashboard

    Productos

    Carrito de Compras

    Confirmación de Pedido

    Historial de Pedidos

    Detalles del Pedido

    Gestión de Usuarios (Admin)

    Edición de Usuario

    Configuración de Cuenta

    Soporte y Ayuda

    Notificaciones

    Perfil de Proveedor

    Detalles del Producto

