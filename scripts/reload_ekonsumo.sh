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
