#!/bin/bash

# Actualizar el sistema
echo "Actualizando el sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar Node.js y npm
echo "Instalando Node.js y npm..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación de Node.js y npm
node -v
npm -v

# Instalar PostgreSQL
echo "Instalando PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Configurar PostgreSQL
echo "Configurando PostgreSQL..."
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Crear usuario y base de datos para la aplicación
echo "Creando usuario y base de datos en PostgreSQL..."
sudo -u postgres psql -c "CREATE USER ekonsumo_user WITH PASSWORD 'daw_password';"
sudo -u postgres psql -c "CREATE DATABASE ekonsumo OWNER ekonsumo_user;"
sudo -u postgres psql -c "ALTER USER ekonsumo_user CREATEDB;"

# Instalar Nginx
echo "Instalando Nginx..."
sudo apt install -y nginx

# Configurar Nginx
echo "Configurando Nginx..."
sudo tee /etc/nginx/sites-available/daw-proyecto <<EOF
server {
    listen 80;
    ekonsumo ekonsumo.duckdns.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /static/ {
        root /var/www/daw-proyecto;
    }

    error_page 404 /404.html;
}
EOF

# Activar configuración de Nginx
sudo ln -s /etc/nginx/sites-available/daw-proyecto /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Configurar UFW (Firewall)
echo "Configurando UFW..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Instalar PM2 para gestionar procesos de Node.js
echo "Instalando PM2..."
sudo npm install -g pm2

# Configurar PM2 para iniciar la aplicación en el arranque
echo "Configurando PM2..."
pm2 start /var/www/daw-proyecto/backend/index.js --name daw-proyecto
pm2 startup
pm2 save
