# TODO Checklist del Proyecto

## General y Estructura
- [x] Limpiar el directorio raíz de archivos innecesarios (multimedia, zips).
- [x] Crear o verificar un archivo `.gitignore` completo en la raíz del proyecto.
- [x] Añadir un archivo `.env.example` en el backend para documentar las variables de entorno.
- [x] Escribir documentación general del proyecto en `README.md`, explicando cómo instalar y ejecutarlo.
- [x] (Opcional) Investigar el uso de `npm workspaces` para gestionar los dos proyectos.
- [ ] Probar Backend completo manualmente
- [ ] Probar Frontend completo manualmente
- [ ] Revisar documentacion
- [ ] Revisar despliegue
- [x] Unificar package.json de frontend y backend


## Backend
- [ ] **Configuración**
    - [x] Instalar y configurar ESLint y Prettier para mantener un estilo de código consistente.
    - [x] Implementar un sistema de logging avanzado (ej. Winston) para un mejor seguimiento de errores.
    - [x] Credenciales seguras db.js
    - [x] EmailService.js securiza credenciales
    - [x] Validaciones Multer
    - [x] Credenciales a .env
    - [x] Jest/Supertest
    - [ ] Testing
- [ ] **Desarrollo de API**
    - [X] Revisar y completar la documentación de todos los endpoints con Swagger.
    - [X] Diseñar e implementar los modelos de datos que faltan.
    - [X] Desarrollar los endpoints restantes para el CRUD de todas las entidades.
- [ ] **Pruebas**
    - [ ] Incrementar la cobertura de pruebas unitarias para la lógica de negocio.
    - [ ] Añadir más pruebas de integración para los endpoints de la API.
    - [ ] Generar listado de test
    - [ ] Inicializar @Jest @Supertest

## Frontend
- [ ] **Estructura y Estilo**
    - [ ] Crear un servicio centralizado de API (con Axios) para gestionar las peticiones al backend.
    - [ ] Modularizar el store de Vuex si la complejidad de la aplicación aumenta.
    - [ ] Asegurar que el estilo y los componentes de UI sean consistentes en toda la aplicación.
    - [ ] Dashboard - Diseño
    - [ ] Dashboard - Corregir nombre
    - [ ] Cesta - Diseño
    - [ ] Compras - Imagenes
    - [ ] Compras - Diseño
    - [ ] Soporte - Diseño
- [ ] **Funcionalidades**
    - [X] Implementar la lógica de autenticación del cliente (login, logout, registro).
    - [X] Desarrollar las vistas y componentes para todas las funcionalidades (productos, pedidos, etc.).
    - [X] Añadir un sistema de notificaciones para feedback al usuario (ej. "Pedido creado con éxito").
    - [ ] Dashboard - Funcionalidad 
    - [ ] Historial - Ver detalles
    - [ ] Soporte - Funcionalidad
    - [ ] Gestion de usuarios - No funciona
    - [ ] Email - ¿Cuando?¿Donde?
    - [ ] Cesta - Funcionalidad
    - [ ] Compras - Imagenes

- [ ] **Optimización y Pruebas**
    - [ ] Implementar carga perezosa (lazy loading) para las rutas en Vue Router.
    - [ ] Escribir pruebas unitarias para los componentes más críticos.
    - [ ] (Opcional) Configurar pruebas de extremo a extremo (E2E) con una herramienta como Cypress.
    - [ ] Implementar Tests Jest/Vitest
    - [ ] Generar listado de test
    - [ ] Inicializar @Jest @Supertest