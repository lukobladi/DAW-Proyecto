# Documentación: Alojar Proyecto en un VPS con Debian 12

## Requisitos Previos
1. **Servidor VPS**: Contratado en [Clouding.io](https://clouding.io/).
2. **Sistema Operativo**: Debian 12 instalado en el VPS.
3. **Dominio**: Gratuito [DuckDNS](https://www.duckdns.org/).
4. **Acceso SSH**: Acceso VPS.
5. **Proyecto**: Código fuente npm.

---

## Pasos para Configurar el VPS

### 1. Acceso al Servidor
1. Acceder al servidor mediante SSH:
   ```bash
   ssh root@<IP_DEL_SERVIDOR>
   ```

2. Actualiza el sistema:
   ```bash
   apt update && apt upgrade -y
   ```

---

### 2. Configurar DuckDNS
1. Crear cuenta en [DuckDNS](https://www.duckdns.org/) y añadir subdominio.
2. Copiar token de DuckDNS.
3. Configurar script para actualizar la IP dinámica:
   - Crear archivo para script programado con CRON para que actualize la IP regularmente:
     ```bash
     nano /etc/cron.daily/duckdns
     ```
   - Añadir el contenido (reemplazar `<SUBDOMINIO>` y `<TOKEN>` con los datos de DUCKDNS):
     ```bash
     #!/bin/bash
     echo url="https://www.duckdns.org/update?domains=<SUBDOMINIO>&token=<TOKEN>&ip=" | curl -k -o ~/duckdns.log -K -
     ```
   - Hacer el script ejecutable:
     ```bash
     chmod +x /etc/cron.daily/duckdns
     ```
4. Verificar script manualmente:
   ```bash
   /etc/cron.daily/duckdns
   ```
   Si todo está correcto, veremos la IP del servidor en DuckDNS apuntando al domainname.

---

### 3. Instalar Dependencias
1. **Node.js y npm**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt install -y nodejs
   ```
2. **PostgreSQL**:
   ```bash
   apt install -y postgresql postgresql-contrib
   ```
3. **Nginx**:
   ```bash
   apt install -y nginx
   ```
4. **PM2** (para gestionar procesos de Node.js):
   ```bash
   npm install -g pm2
   ```

---

### 4. Configurar PostgreSQL
1. Inicia el servicio de PostgreSQL:
   ```bash
   systemctl start postgresql
   systemctl enable postgresql
   ```
2. Crea un usuario y una base de datos para tu proyecto:
   ```bash
   sudo -u postgres psql
   ```
   Dentro de la consola de PostgreSQL, ejecuta:
   ```sql
   CREATE USER daw_user WITH PASSWORD 'daw_password';
   CREATE DATABASE daw_db OWNER daw_user;
   ALTER USER daw_user CREATEDB;
   \q
   ```

---

### 5. Configurar Nginx
1. Crea un archivo de configuración para tu proyecto:
   ```bash
   nano /etc/nginx/sites-available/daw-proyecto
   ```
2. Añade la siguiente configuración (reemplaza `<SUBDOMINIO>.duckdns.org` con tu dominio):
   ```nginx
   server {
       listen 80;
       server_name <SUBDOMINIO>.duckdns.org;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location /static/ {
           root /var/www/daw-proyecto;
       }

       error_page 404 /404.html;
   }
   ```
3. Activa la configuración:
   ```bash
   ln -s /etc/nginx/sites-available/daw-proyecto /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

---

### 6. Configurar Firewall (UFW)
1. Instalar UFW si no está instalado:
   ```bash
   apt install ufw
   ```
2. Permite conexiones SSH y tráfico HTTP/HTTPS:
   ```bash
   ufw allow OpenSSH
   ufw allow 'Nginx Full'
   ufw enable
   ```

---

### 7. Desplegar el Proyecto
1. Sube tu proyecto al servidor (por ejemplo, usando `scp` o Git):
   ```bash
   scp -r /ruta/local/proyecto root@<IP_DEL_SERVIDOR>:/var/www/daw-proyecto
   ```
2. Instalar las dependencias del backend:
   ```bash
   cd /var/www/daw-proyecto/backend
   npm install
   ```
3. Configura las variables de entorno (`.env`):
   ```bash
   nano .env
   ```
   Ejemplo:
   ```env
   DB_HOST=localhost
   DB_USER=daw_user
   DB_PASSWORD=daw_password
   DB_NAME=daw_db
   PORT=3000
   ```
4. Inicia el backend con PM2:
   ```bash
   pm2 start index.js --name daw-proyecto
   pm2 save
   pm2 startup
   ```

---

### 8. Configurar HTTPS (Opcional)
1. Instala Certbot para Nginx:
   ```bash
   apt install certbot python3-certbot-nginx
   ```
2. Genera un certificado SSL para el dominio:
   ```bash
   certbot --nginx -d <SUBDOMINIO>.duckdns.org
   ```
3. Renueva automáticamente los certificados:
   ```bash
   crontab -e
   ```
   Añadir siguiente línea:
   ```bash
   0 0 * * * certbot renew --quiet
   ```

---

### 9. Verificar el Despliegue
1. Abrir navegador y accede al dominio:
   ```
   http://<SUBDOMINIO>.duckdns.org
   ```
2. Si HTTPS, accede con:
   ```
   https://<SUBDOMINIO>.duckdns.org
   ```

---

## Notas Finales
- **Logs de Nginx**: Depurar problemas, revisar los logs:
  ```bash
  tail -f /var/log/nginx/error.log
  ```
- **Logs del Backend**: PM2 guarda los logs del backend:
  ```bash
  pm2 logs daw-proyecto
  ```
- **Actualizar el Proyecto**: Para actualizar el código, subir los cambios al servidor, reiniciar PM2:
  ```bash
  pm2 restart daw-proyecto
  ```

