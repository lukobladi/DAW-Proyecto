#!/usr/bin/env bash
set -euo pipefail

# Sube codigo fuente al VPS usando rsync.
# No sube node_modules, dist, coverage ni .env.
#
# Uso:
#   scripts/subir_codigo_fuente.sh <usuario@host> [ruta_remota]
#
# Ejemplo:
#   scripts/subir_codigo_fuente.sh eneko@ekonsumo.duckdns.org /var/www/daw-proyecto

if [[ $# -lt 1 ]]; then
  echo "Uso: $0 <usuario@host> [ruta_remota]"
  exit 1
fi

REMOTE="$1"
REMOTE_DIR="${2:-/var/www/daw-proyecto}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

SSH_OPTS="${SSH_OPTS:-}"
RSYNC_RSH="ssh"
if [[ -n "$SSH_OPTS" ]]; then
  RSYNC_RSH="ssh $SSH_OPTS"
fi

EXCLUDES=(
  --exclude=.git
  --exclude=.github
  --exclude=node_modules
  --exclude=dist
  --exclude=coverage
  --exclude=.env
  --exclude=.env.*
  --exclude=.DS_Store
)

echo "==> Verificando conectividad SSH"
if ! ssh $SSH_OPTS "$REMOTE" "echo 'SSH OK'" >/dev/null 2>&1; then
  cat <<EOF
No se pudo autenticar por SSH con $REMOTE.

Si usas clave no default, ejecuta con:
  SSH_OPTS='-i ~/.ssh/tu_clave' scripts/subir_codigo_fuente.sh $REMOTE $REMOTE_DIR
EOF
  exit 1
fi

echo "==> Creando directorios remotos"
ssh $SSH_OPTS "$REMOTE" "mkdir -p '$REMOTE_DIR/backend' '$REMOTE_DIR/frontend' '$REMOTE_DIR/docs' '$REMOTE_DIR/scripts'"

echo "==> Sincronizando backend"
rsync -az --delete -e "$RSYNC_RSH" "${EXCLUDES[@]}" \
  "$ROOT_DIR/backend/" "$REMOTE:$REMOTE_DIR/backend/"

echo "==> Sincronizando frontend"
rsync -az --delete -e "$RSYNC_RSH" "${EXCLUDES[@]}" \
  "$ROOT_DIR/frontend/" "$REMOTE:$REMOTE_DIR/frontend/"

echo "==> Sincronizando scripts y docs"
rsync -az --delete -e "$RSYNC_RSH" "${EXCLUDES[@]}" \
  "$ROOT_DIR/scripts/" "$REMOTE:$REMOTE_DIR/scripts/"
rsync -az --delete -e "$RSYNC_RSH" "${EXCLUDES[@]}" \
  "$ROOT_DIR/docs/" "$REMOTE:$REMOTE_DIR/docs/"

echo "==> Ajustando permisos basicos"
ssh $SSH_OPTS "$REMOTE" "chmod +x '$REMOTE_DIR/scripts/'*.sh || true"

cat <<EOF

Codigo actualizado en: $REMOTE_DIR

Siguientes pasos sugeridos en el VPS:
  cd $REMOTE_DIR/backend && npm ci --omit=dev
  cd $REMOTE_DIR/frontend && npm ci && npm run build
  pm2 restart ekonsumo-backend
  sudo systemctl reload nginx

EOF
