#!/bin/bash

# Configuración
SERVER_USER="eneko"
SERVER_HOST="ekonsumo.duckdns.org"

BACKEND_LOCAL_DIR="$HOME/Proyects/DAW-Proyecto/Backend"
FRONTEND_LOCAL_DIR="$HOME/Proyects/DAW-Proyecto/frontend"
SQL_DIR="$HOME/Proyects/DAW-Proyecto/sql"

BACKEND_REMOTE_DIR="/var/www/daw-proyecto/backend"
FRONTEND_REMOTE_DIR="/var/www/daw-proyecto/frontend"

SSH_KEY="$HOME/.ssh/id_rsa"  # Ruta clave privada

echo "=== Iniciando despliegue ==="

echo "=== Configurando permisos en el servidor ==="
ssh $SERVER_USER@$SERVER_HOST "sudo chown -R eneko:eneko $BACKEND_REMOTE_DIR && sudo chmod -R 775 $BACKEND_REMOTE_DIR"
ssh $SERVER_USER@$SERVER_HOST "sudo chown -R eneko:eneko $FRONTEND_REMOTE_DIR && sudo chmod -R 775 $FRONTEND_REMOTE_DIR"


# Verificar si existe clave SSH
if [ ! -f "$SSH_KEY" ]; then
    echo "=== Generando clave SSH ==="
    ssh-keygen -t rsa -b 4096 -f "$SSH_KEY" -N ""
    echo "=== Copiando clave pública al servidor ==="
    ssh-copy-id -i "$SSH_KEY.pub" $SERVER_USER@$SERVER_HOST
fi

# Función para SCP con clave SSH
scp_ssh() {
    scp -i "$SSH_KEY" "$@"
}


# Copiar archivos del backend
echo "=== Copiando archivos del backend al servidor ==="
scp_ssh -r \
    $BACKEND_LOCAL_DIR/package.json \
    $BACKEND_LOCAL_DIR/index.js \
    $BACKEND_LOCAL_DIR/db.js \
    $BACKEND_LOCAL_DIR/swagger.js \
    $BACKEND_LOCAL_DIR/.env \
    $SERVER_USER@$SERVER_HOST:$BACKEND_REMOTE_DIR

scp_ssh -r $BACKEND_LOCAL_DIR/src $SERVER_USER@$SERVER_HOST:$BACKEND_REMOTE_DIR
scp_ssh -r $BACKEND_LOCAL_DIR/uploads $SERVER_USER@$SERVER_HOST:$BACKEND_REMOTE_DIR
scp_ssh -r $BACKEND_LOCAL_DIR/config $SERVER_USER@$SERVER_HOST:$BACKEND_REMOTE_DIR
scp_ssh -r $BACKEND_LOCAL_DIR/services $SERVER_USER@$SERVER_HOST:$BACKEND_REMOTE_DIR
scp_ssh -r $BACKEND_LOCAL_DIR/routes $SERVER_USER@$SERVER_HOST:$BACKEND_REMOTE_DIR
scp_ssh -r $BACKEND_LOCAL_DIR/controllers $SERVER_USER@$SERVER_HOST:$BACKEND_REMOTE_DIR
scp_ssh -r $BACKEND_LOCAL_DIR/models $SERVER_USER@$SERVER_HOST:$BACKEND_REMOTE_DIR
scp_ssh -r $BACKEND_LOCAL_DIR/middlewares $SERVER_USER@$SERVER_HOST:$BACKEND_REMOTE_DIR

# Copiar archivos del frontend
echo "=== Copiando archivos del frontend al servidor ==="
scp_ssh -r \
    $FRONTEND_LOCAL_DIR/babel.config.js \
    $FRONTEND_LOCAL_DIR/package.json \
    $SERVER_USER@$SERVER_HOST:$FRONTEND_REMOTE_DIR

scp_ssh -r $FRONTEND_LOCAL_DIR/src $SERVER_USER@$SERVER_HOST:$FRONTEND_REMOTE_DIR
scp_ssh -r $FRONTEND_LOCAL_DIR/public $SERVER_USER@$SERVER_HOST:$FRONTEND_REMOTE_DIR


# Configurar permisos en el servidor
echo "=== Configurando permisos en el servidor ==="
ssh $SERVER_USER@$SERVER_HOST "sudo chown -R www-data:www-data $BACKEND_REMOTE_DIR && sudo chmod -R 775 $BACKEND_REMOTE_DIR"
ssh $SERVER_USER@$SERVER_HOST "sudo chown -R www-data:www-data $FRONTEND_REMOTE_DIR && sudo chmod -R 775 $FRONTEND_REMOTE_DIR"

echo "=== Despliegue completado ==="

