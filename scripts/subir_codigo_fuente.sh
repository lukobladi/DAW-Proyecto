#!/bin/bash

# Configuración
SERVER_USER="root"
SERVER_HOST="ekonsumo.duckdns.org"
BACKEND_LOCAL_DIR="/home/deck/VisualStudioCodeProject/DAW-Proyecto/Backend"
FRONTEND_LOCAL_DIR="/home/deck/VisualStudioCodeProject/DAW-Proyecto/frontend"
BACKEND_REMOTE_DIR="/var/www/daw-proyecto/backend"
FRONTEND_REMOTE_DIR="/var/www/daw-proyecto/frontend"

echo "=== Iniciando despliegue ==="

# Copiar archivos del backend
echo "=== Copiando archivos del backend al servidor ==="
scp -r $BACKEND_LOCAL_DIR/package.json $BACKEND_LOCAL_DIR/package-lock.json $BACKEND_LOCAL_DIR/index.js $BACKEND_LOCAL_DIR/.env $SERVER_USER@$SERVER_HOST:$BACKEND_REMOTE_DIR
scp -r $BACKEND_LOCAL_DIR/src $SERVER_USER@$SERVER_HOST:$BACKEND_REMOTE_DIR
scp -r $BACKEND_LOCAL_DIR/routes $SERVER_USER@$SERVER_HOST:$BACKEND_REMOTE_DIR
scp -r $BACKEND_LOCAL_DIR/controllers $SERVER_USER@$SERVER_HOST:$BACKEND_REMOTE_DIR
scp -r $BACKEND_LOCAL_DIR/models $SERVER_USER@$SERVER_HOST:$BACKEND_REMOTE_DIR
scp -r $BACKEND_LOCAL_DIR/middlewares $SERVER_USER@$SERVER_HOST:$BACKEND_REMOTE_DIR

# Copiar archivos del frontend
echo "=== Copiando archivos del frontend al servidor ==="
scp -r $FRONTEND_LOCAL_DIR/babel.config.js $FRONTEND_LOCAL_DIR/package.json $FRONTEND_LOCAL_DIR/package-lock.json $SERVER_USER@$SERVER_HOST:$FRONTEND_REMOTE_DIR
scp -r $FRONTEND_LOCAL_DIR/src $SERVER_USER@$SERVER_HOST:$FRONTEND_REMOTE_DIR
scp -r $FRONTEND_LOCAL_DIR/public $SERVER_USER@$SERVER_HOST:$FRONTEND_REMOTE_DIR

# Configurar permisos en el servidor
echo "=== Configurando permisos en el servidor ==="
ssh $SERVER_USER@$SERVER_HOST "sudo chown -R eneko:eneko $BACKEND_REMOTE_DIR && sudo chmod -R 755 $BACKEND_REMOTE_DIR"
ssh $SERVER_USER@$SERVER_HOST "sudo chown -R eneko:eneko $FRONTEND_REMOTE_DIR && sudo chmod -R 755 $FRONTEND_REMOTE_DIR"

echo "=== Despliegue completado ==="

