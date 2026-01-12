
## 1. **Securización del Backend**

### a) **Usar HTTPS**
- **Descripción**: Asegúrar que todas las comunicaciones entre el frontend y el backend estén cifradas usando HTTPS.
- **Cómo hacerlo**:
  - Obtén un certificado SSL/TLS (puedes usar [Let's Encrypt](https://letsencrypt.org/) para obtener uno gratuito).
  - Configura tu servidor (por ejemplo, Nginx o Apache) para usar HTTPS.
  - Redirige todo el tráfico HTTP a HTTPS.

### b) **Proteger las Rutas de la API**
- **Descripción**: Asegúrar que las rutas de la API estén protegidas y solo sean accesibles para usuarios autenticados y autorizados.
- **Cómo hacerlo**:
  - Usa **JSON Web Tokens (JWT)** para autenticar a los usuarios.
  - Implementa middlewares para verificar el token en cada solicitud.
  - Limita el acceso a rutas sensibles (por ejemplo, solo los administradores pueden acceder a la gestión de usuarios).

### c) **Validar y Sanitizar las Entradas**
- **Descripción**: Evitar ataques como **SQL Injection** o **XSS** validando y sanitizando todas las entradas del usuario.
- **Cómo hacerlo**:
  - Usa librerías como `express-validator` para validar los datos de entrada.
  - Sanitiza las entradas para eliminar caracteres peligrosos.

### d) **Configurar CORS Correctamente**
- **Descripción**: Restringir las solicitudes de origen cruzado (CORS) para evitar que dominios no autorizados accedan a la API.
- **Cómo hacerlo**:
  - Configura CORS para permitir solo los dominios del frontend.
  - Usa el paquete `cors` en Express:
    ```javascript
    const cors = require('cors');
    app.use(cors({
      origin: 'https://tudominio.com', // Solo permite solicitudes desde este dominio
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    ```

### e) **Proteger Contra Ataques de Fuerza Bruta**
- **Descripción**: Limita el número de intentos de inicio de sesión para evitar ataques de fuerza bruta.
- **Cómo hacerlo**:
  - Usa el paquete `express-rate-limit` para limitar las solicitudes:
    ```javascript
    const rateLimit = require('express-rate-limit');
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // Límite de 100 solicitudes por IP
    });
    app.use(limiter);
    ```

### f) **Ocultar Información Sensible**
- **Descripción**: No expongas información sensible como claves de API, contraseñas de la base de datos, etc.
- **Cómo hacerlo**:
  - Usa variables de entorno para almacenar información sensible.
  - No subas archivos como `.env` a tu repositorio de Git. Añádelos a `.gitignore`.

### g) **Actualizar Dependencias**
- **Descripción**: Mantiene todas las dependencias actualizadas para evitar vulnerabilidades conocidas.
- **Cómo hacerlo**:
  - Usa `npm audit` para detectar vulnerabilidades.
  - Actualiza las dependencias regularmente con `npm update`.

---

## 2. **Securización del Frontend**

### a) **Usar HTTPS**
- **Descripción**: Asegúrate de que el frontend se sirva a través de HTTPS.
- **Cómo hacerlo**:
  - Configura tu servidor web (por ejemplo, Nginx o Apache) para servir el frontend con HTTPS.
  - Usa un certificado SSL/TLS válido.

### b) **Proteger Rutas con Vue Router**
- **Descripción**: Restringe el acceso a rutas protegidas en el frontend.
- **Cómo hacerlo**:
  - Usa el `beforeEach` de Vue Router para verificar si el usuario está autenticado:
    ```javascript
    router.beforeEach((to, from, next) => {
      const isAuthenticated = localStorage.getItem('token'); // Verifica si el usuario está autenticado
      if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login'); // Redirige al login si no está autenticado
      } else {
        next();
      }
    });
    ```

### c) **Sanitizar Entradas del Usuario**
- **Descripción**: Evita ataques XSS (Cross-Site Scripting) sanitizando las entradas del usuario.
- **Cómo hacerlo**:
  - Usa librerías como `DOMPurify` para sanitizar el HTML antes de renderizarlo.

### d) **Evitar Almacenar Información Sensible en el Frontend**
- **Descripción**: No almacenes información sensible como tokens JWT en `localStorage` o `sessionStorage`.
- **Cómo hacerlo**:
  - Usa cookies seguras (`HttpOnly` y `Secure`) para almacenar tokens.

### e) **Configurar Cabeceras de Seguridad**
- **Descripción**: Añade cabeceras de seguridad para proteger el frontend.
- **Cómo hacerlo**:
  - Configura cabeceras como `Content-Security-Policy`, `X-Frame-Options`, y `X-XSS-Protection` en tu servidor web.

### f) **Proteger Contra CSRF**
- **Descripción**: Evita ataques CSRF (Cross-Site Request Forgery).
- **Cómo hacerlo**:
  - Usa tokens CSRF en las solicitudes POST, PUT y DELETE.
  - Configura el backend para verificar estos tokens.

---

## 3. **Alojamiento en un Servidor**

### a) **Elegir un Proveedor de Hosting**
- **Opciones populares**:
  - **Frontend**: Netlify, Vercel, GitHub Pages, o un servidor con Nginx/Apache.
  - **Backend**: Heroku, AWS, DigitalOcean, o un servidor con Node.js.

### b) **Configurar el Servidor**
- **Frontend**:
  - Sirve el frontend usando un servidor web como Nginx o Apache.
  - Configura HTTPS y redirige el tráfico HTTP a HTTPS.
- **Backend**:
  - Usa un servidor Node.js con un proxy inverso como Nginx.
  - Configura HTTPS y restringe el acceso a la API.

### c) **Usar un Firewall**
- **Descripción**: Protege el servidor con un firewall para bloquear accesos no autorizados.
- **Cómo hacerlo**:
  - Usa `ufw` (Uncomplicated Firewall) en Linux:
    ```bash
    sudo ufw allow 80/tcp   # HTTP
    sudo ufw allow 443/tcp  # HTTPS
    sudo ufw allow 22/tcp   # SSH
    sudo ufw enable
    ```

### d) **Monitorear y Registrar Accesos**
- **Descripción**: Monitorea el servidor y registra accesos para detectar actividades sospechosas.
- **Cómo hacerlo**:
  - Usa herramientas como `fail2ban` para bloquear IPs maliciosas.
  - Configura logs en Nginx o Apache.

### e) **Hacer Copias de Seguridad**
- **Descripción**: Realiza copias de seguridad periódicas de la base de datos y el código.
- **Cómo hacerlo**:
  - Usa herramientas como `pg_dump` para PostgreSQL o `mysqldump` para MySQL.
  - Almacena las copias en un lugar seguro (por ejemplo, AWS S3).

---

## 4. **Herramientas de Seguridad Adicionales**

### a) **Escaneo de Vulnerabilidades**
- **Descripción**: Escanea tu aplicación en busca de vulnerabilidades.
- **Herramientas**:
  - **Backend**: `npm audit`, OWASP ZAP.
  - **Frontend**: Lighthouse (Chrome DevTools).

### b) **Pruebas de Penetración**
- **Descripción**: Realiza pruebas de penetración para identificar vulnerabilidades.
- **Herramientas**:
  - Burp Suite, Nessus, o contrata a un experto en seguridad.

---



---

### **1. Advertencias de `npm`**
Las advertencias `EBADENGINE` indican que algunas dependencias (`@nuxt/kit` y `@nuxt/schema`) no son compatibles con la versión de Node.js instalada en el servidor (`v20.19.0`). Estas dependencias requieren versiones específicas de Node.js (`^14.16.0 || ^16.10.0 || ^17.0.0 || ^18.0.0 || ^19.0.0`).

#### **Solución**
Puedes instalar una versión compatible de Node.js en el servidor utilizando `nvm` (Node Version Manager):

1. **Instalar `nvm` en el servidor:**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
   source ~/.bashrc
   ```

2. **Instalar una versión compatible de Node.js (por ejemplo, `18.x`):**
   ```bash
   nvm install 18
   nvm use 18
   ```

3. **Verifica la versión de Node.js:**
   ```bash
   node -v
   ```

4. **Reinstala las dependencias del frontend y backend:**
   ```bash
   cd /var/www/daw-proyecto/frontend
   npm install
   npm run build

   cd /var/www/daw-proyecto/backend
   npm install
   ```

---

### **2. Advertencias de Webpack**
Las advertencias de Webpack indican que algunos archivos (como `img/cestaesparza.4aeb8395.png`) y puntos de entrada (`app`) exceden los límites recomendados de tamaño, lo que podría afectar el rendimiento.

#### **Solución**
1. **Optimiza las imágenes:**
   Comprime las imágenes grandes utilizando herramientas como [TinyPNG](https://tinypng.com/) o `imagemin`.

   Por ejemplo, puedes usar `imagemin-cli` para optimizar imágenes en el servidor:
   ```bash
   npm install -g imagemin-cli
   imagemin /var/www/daw-proyecto/frontend/src/assets/* --out-dir=/var/www/daw-proyecto/frontend/src/assets/
   ```

2. **Habilita la carga diferida (lazy loading):**
   Divide el código en partes más pequeñas para mejorar el rendimiento. Por ejemplo, usa `import()` para cargar componentes de forma diferida en Vue:

   ```javascript
   const MiComponente = () => import('@/components/MiComponente.vue');
   ```

---

### **3. Error de Enlace Simbólico en Nginx**
El error `ln: failed to create symbolic link '/etc/nginx/sites-enabled/daw-proyecto': File exists` indica que el enlace simbólico para la configuración de Nginx ya existe.

#### **Solución**
Elimina el enlace simbólico existente antes de crearlo nuevamente:

```bash
sudo rm /etc/nginx/sites-enabled/daw-proyecto
sudo ln -s /etc/nginx/sites-available/daw-proyecto /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### **4. Vulnerabilidades Detectadas**
El comando `npm audit` detectó vulnerabilidades en las dependencias.

#### **Solución**
Ejecutar siguiente comando para intentar solucionarlas automáticamente:

```bash
npm audit fix
```

Si algunas vulnerabilidades persisten, usar el siguiente comando (aunque podría introducir cambios importantes):

```bash
npm audit fix --force
```

---

### **5. Verifica el Estado del Backend y Frontend**
- **Backend:** Verificar backend con PM2:
  ```bash
  pm2 list
  ```

- **Frontend:** Asegurar que Nginx esté sirviendo el frontend correctamente. Abre el navegador y accede a (`http://ekonsumo.duckdns.org`).

