### **Entorno de Producción**

#### **1. Clouding.io**
- **Descripción:** VPS contratado para alojar el proyecto.
- **Especificaciones del Servidor:**
  - Sistema Operativo: Debian 12
  - Capacidad: 10 GB
  - CPU: 0.5 vCores
  - Uso: Alojamiento del backend y frontend del proyecto.

#### **2. Scripts para Instalar el Entorno y Arrancar el Proyecto**
- **Instalación del Entorno:**
  - He creado un script (`instalar-backend-frontend-vps.sh`) que automatiza la instalación de dependencias necesarias como Node.js, PostgreSQL, PM2 y Nginx.
  - Configura el backend y frontend en sus respectivos directorios (`/var/www/daw-proyecto/backend` y `/var/www/daw-proyecto/frontend`).
  - Configura Nginx para servir el frontend y hacer proxy inverso al backend.

- **Arranque del Proyecto:**
  - El script (`reiniciar_frontend_backend_vps.sh`) permite reiniciar el backend y frontend en caso de actualizaciones o reinicios del servidor.
  - Utiliza PM2 para gestionar el backend y Nginx para servir el frontend.

#### **3. DuckDNS.org**
- **Descripción:** Servidor DNS dinámico gratuito utilizado para asignar un nombre de dominio al proyecto.
- **Configuración:**
  - Dominio: `ekonsumo.duckdns.org`
  - Acceso al proyecto:
    - **Backend:** [http://ekonsumo.duckdns.org:3000/api-docs/#/](http://ekonsumo.duckdns.org:3000/api-docs/#/)
    - **Frontend:** [http://ekonsumo.duckdns.org:8080/](http://ekonsumo.duckdns.org:8080/)

#### **4. Subida o Actualización de Código**
- **Descripción:** He creado scripts para actualizar únicamente el código fuente del proyecto en el servidor.
- **Funcionamiento:**
  - Utiliza `SCP` para copiar los archivos de código fuente desde el entorno local al servidor.
  - Los scripts (`actualizar_codigo_fuente_vps.sh`) aseguran que solo se transfieran los archivos necesarios, como controladores, modelos, rutas y configuraciones.
  - Configura automáticamente los permisos en el servidor después de la transferencia.

#### **5. Seguridad**
- **HTTPS:** Configurado para garantizar comunicaciones seguras entre el cliente y el servidor.
- **Firewall:** Configurado con `ufw` para permitir únicamente los puertos necesarios (80, 443, 22 y 3000).
- **Autenticación:** Uso de JWT para proteger las rutas del backend.
- **CORS:** Configurado para permitir únicamente solicitudes desde el dominio del frontend.

#### **6. Copias de Seguridad**
- **Base de Datos:**
  - Uso de `pg_dump` para realizar copias de seguridad periódicas de la base de datos PostgreSQL.
  - Las copias se almacenan en un directorio seguro del servidor y se transfieren a un almacenamiento externo (por ejemplo, AWS S3).
- **Código Fuente:**
  - Uso de scripts para realizar copias de seguridad del código fuente y configuraciones críticas.

#### **7. Monitoreo**
- **Herramientas Utilizadas:**
  - `PM2`: Para monitorear el estado del backend.
  - `fail2ban`: Para bloquear intentos de acceso no autorizados.
  - Logs de Nginx: Configurados para registrar accesos y detectar actividades sospechosas.

---

Si necesitas más detalles o ajustes en alguna sección, ¡házmelo saber! 😊