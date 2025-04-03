# INSTALAR SCRIPT PARA QUE DUCKDNS REFRESQUE LA IP
# ==============================================
# Instalar crontab si no está instalado
if ! ps -ef | grep cr[o]n; then
    echo "Crontab no está instalado. Instalando crontab..."
    apt update
    apt install -y cron
fi

# Instalar curl si no está instalado
if ! command -v curl >/dev/null 2>&1; then
    echo "Curl no está instalado. Instalando curl..."
    apt update
    apt install -y curl
fi

# Crear script para refrescar IP
mkdir -p ~/duckdns
cat > ~/duckdns/duck.sh <<EOF
#!/bin/bash
curl -k -o ~/duckdns/duck.log "https://www.duckdns.org/update?domains=ekonsumo&token=5cee5aa6-77fa-4e3d-b1f1-ec3afea1c773"
EOF

chmod 700 ~/duckdns/duck.sh

# Añadir script a cron para que se ejecute periódicamente
(crontab -l 2>/dev/null; echo "*/5 * * * * ~/duckdns/duck.sh >/dev/null 2>&1") | crontab -

# Probar el script
~/duckdns/duck.sh
cat ~/duckdns/duck.log



# Crear usuario eneko si no existe
if ! id -u eneko >/dev/null 2>&1; then
    echo "Creando usuario eneko..."
    useradd -m eneko
fi

# Habilitar sudo para eneko
echo "eneko ALL=(ALL) NOPASSWD:ALL" | tee /etc/sudoers.d/eneko >/dev/null

# Configurar el nombre de host
echo "ekonsumo-esparza" > /etc/hostname
echo "127.0.0.1       ekonsumo-esparza" >> /etc/hosts

# Deshabilitar el acceso root por SSH
# sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config

# Reiniciar el servicio SSH
systemctl restart sshd.service

# Conectar como eneko
echo "Para conectar al servidor, utilizar el siguiente comando:"
echo "ssh eneko@ekonsumo.duckdns.org"




# INSTALACIÓN Y CONFIGURACIÓN DEL BACKEND (Node.js + Express + PostgreSQL)
# ==============================================

echo "=== Actualizando el sistema ==="
sudo apt update && sudo apt upgrade -y

echo "=== Instalando Node.js y npm ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "=== Instalando PostgreSQL ==="
sudo apt install -y postgresql postgresql-contrib

echo "=== Configurando PostgreSQL ==="
sudo -u postgres psql -c "CREATE DATABASE ekonsumo;"
sudo -u postgres psql -c "CREATE USER ekonsumo_user WITH PASSWORD '1234';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ekonsumo TO ekonsumo_user;"

echo "=== Instalando PM2 ==="
sudo npm install -g pm2

echo "=== Configurando el backend ==="
BACKEND_DIR="/var/www/daw-proyecto/backend"
cd $BACKEND_DIR
npm install

echo "=== Creando archivo .env para el backend ==="
cat > $BACKEND_DIR/.env <<EOL
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ekonsumo
DB_USER=ekonsumo_user
DB_PASSWORD=1234  # Cuando funcione crear contraseña segura
JWT_SECRET=1234        #  Cuando funcione crear contraseña segura
EOL

echo "=== Iniciando el backend con PM2 ==="
pm2 start $BACKEND_DIR/index.js --name "daw-backend"
pm2 save
pm2 startup

# ==============================================
# INSTALACIÓN Y CONFIGURACIÓN DEL FRONTEND (Vue.js)
# ==============================================

echo "=== Instalando dependencias para Vue.js ==="
sudo apt install -y nginx

echo "=== Configurando el frontend ==="
FRONTEND_DIR="/var/www/daw-proyecto/frontend"
cd $FRONTEND_DIR
npm install
npm run build

echo "=== Configurando Nginx para servir el frontend ==="
sudo rm /etc/nginx/sites-enabled/default
sudo cat > /etc/nginx/sites-available/daw-proyecto <<EOL
server {
    listen 80;
    server_name ekonsumo.duckdns.org;  # Replace with your domain or IP

    # Configuración para el frontend (Vue.js)
    root $FRONTEND_DIR/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Configuración para el backend (Proxy a Express)
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

sudo ln -s /etc/nginx/sites-available/daw-proyecto /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# ==============================================
# CONFIGURACIÓN DEL FIREWALL (UFW)
# ==============================================

echo "=== Configurando el firewall ==="
sudo apt install -y ufw
sudo ufw allow 22     # SSH
sudo ufw allow 80     # HTTP
sudo ufw allow 443    # HTTPS (always enable if Certbot is installed)
sudo ufw --force enable

# ==============================================
# INSTALACIÓN DE CERTBOT (HTTPS - Opcional)
# ==============================================

read -p "¿Deseas configurar HTTPS con Let's Encrypt? (y/n): " install_https
if [ "$install_https" = "y" ]; then
    echo "=== Instalando Certbot ==="
    sudo apt install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d ekonsumo.duckdns.org  # Cambiar por tu dominio
    sudo systemctl restart nginx
fi

echo "=== Instalación completada! ==="
echo "Frontend: http://ekonsumo.duckdns.org"
echo "Backend: http://ekonsumo.duckdns.org/api"


# ==============================================
# Subir código al servidor y arrancar
# ==============================================

sudo mkdir -p /var/www/daw-proyecto/backend
sudo mkdir -p /var/www/daw-proyecto/frontend

#Copiar el Backend
#Desde local, ejecuta:

# scp -r /ruta/local/backend eneko@ekonsumo.duckdns.org:/var/www/daw-proyecto/backend

# Copiar el Frontend
# Desde local, ejecuta:

# scp -r /ruta/local/frontend eneko@ekonsumo.duckdns.org:/var/www/daw-proyecto/frontend

# 3. Configurar Permisos
# Una vez copiados los archivos, asegúrate de que los permisos sean correctos en el servidor:

sudo chown -R eneko:eneko /var/www/daw-proyecto
sudo chmod -R 755 /var/www/daw-proyecto

# 4. Instalar Dependencias
# En el servidor, instala las dependencias del backend y frontend.

# Backend
cd /var/www/daw-proyecto/backend
npm install

# Frontend
cd /var/www/daw-proyecto/frontend
npm install
npm run build


#5. Iniciar el Backend
#Usa PM2 para iniciar el backend:

pm2 start /var/www/daw-proyecto/backend/index.js --name "daw-backend"
pm2 save
pm2 startup

# 6. Configurar Nginx
# Tu script ya incluye la configuración de Nginx para servir el frontend y hacer proxy al backend. Asegúrate de que el archivo de configuración de Nginx esté habilitado:
sudo ln -s /etc/nginx/sites-available/daw-proyecto /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
