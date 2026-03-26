#!/usr/bin/env bash
set -euo pipefail

# Recarga completa del frontend y reinicia el backend
# Usado después de subir código nuevo al servidor

APP_DIR="${APP_DIR:-/var/www/daw-proyecto}"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

echo "==> Reiniciando backend..."
cd "$BACKEND_DIR"
npm ci --omit=dev
pm2 restart ekonsumo-backend || pm2 start index.js --name ekonsumo-backend

echo "==> Compilando frontend..."
cd "$FRONTEND_DIR"
npm ci
npm run build

echo "==> Asignando permisos..."
chown -R www-data:www-data "$FRONTEND_DIR/dist"

echo "==> Recargando nginx..."
sudo systemctl reload nginx

echo "==> Recarga completada"
pm2 status
