#!/usr/bin/env bash
set -euo pipefail

# Sube código fuente del proyecto al servidor
# Usage: ./subir_codigo_fuente.sh [user@host] [destination_dir]

TARGET="${1:-ekonsumo@ekonsumo.duckdns.org}"
DEST_DIR="${2:-/var/www/daw-proyecto}"

LOCAL_BACKEND="/home/mcl/Proyects/DAW-Proyecto/backend"
LOCAL_FRONTEND="/home/mcl/Proyects/DAW-Proyecto/frontend"

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

  rsync -avz --delete   /home/mcl/Proyects/DAW-Proyecto/frontend/dist/   ekonsumo@ekonsumo.duckdns.org:/var/www/daw-proyecto/frontend/dist/

echo "==> Código subido correctamente"
