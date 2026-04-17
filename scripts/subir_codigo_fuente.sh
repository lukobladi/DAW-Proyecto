#!/usr/bin/env bash
set -euo pipefail

# Usage: ./subir_codigo_fuente.sh [user@host] [destination_dir]

TARGET="${1:-ekonsumo@ekonsumo.duckdns.org}"
DEST_DIR="${2:-/var/www/daw-proyecto}"

# TODO hacer rutas relativas para no depender del sistema
LOCAL_BACKEND="/home/mcl/Proyects/DAW-Proyecto/backend"
LOCAL_FRONTEND="/home/mcl/Proyects/DAW-Proyecto/frontend"
LOCAL_DATOS="/home/mcl/Proyects/DAW-Proyecto/datos"


echo "==> Subiendo backend a $TARGET:$DEST_DIR/backend/"
rsync -avz --delete \
  --exclude '.env' \
  --exclude '.env.test' \
  --exclude '*.log' \
  --exclude 'coverage/' \
  --exclude '.git/' \
  --exclude '.vscode/' \
  --exclude 'package-lock.json' \
  "$LOCAL_BACKEND/" \
  "$TARGET:$DEST_DIR/backend/"

echo "==> Subiendo frontend a $TARGET:$DEST_DIR/frontend/"
rsync -avz --delete \
  --exclude '.env' \
  --exclude '.env.development' \
  --exclude '.env.production' \
  --exclude 'coverage/' \
  --exclude '.git/' \
  --exclude '.vscode/' \
  --exclude 'package-lock.json' \
  "$LOCAL_FRONTEND/" \
  "$TARGET:$DEST_DIR/frontend/"

  # Subir tambien scripts de base de datos
  rsync -avz --delete \
  "$LOCAL_DATOS/" \
  "$TARGET:$DEST_DIR/datos/"

echo "==> Código subido correctamente"
