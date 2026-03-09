  cd /var/www/daw-proyecto/backend && npm ci --omit=dev
  cd /var/www/daw-proyecto/frontend && npm install --package-lock && npm ci && npm run build
  pm2 restart ekonsumo-backend
  sudo systemctl reload nginx
