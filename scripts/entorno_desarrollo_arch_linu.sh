#!/usr/bin/env bash
set -euo pipefail

# Instalación de entorno de desarrollo local (Arch Linux)
# - Node 22 LTS (nodejs LTS del repositorio)
# - PostgreSQL
# - Git, base-devel, curl, wget
# - Visual Studio Code (repositorio AUR via pacman-key + pacman; usa code-bin desde community si está disponible)
# - PM2 (opcional)
# - Estructura de proyecto: /home/<DEV_USER>/projects/<APP_DIR>
#
# Uso recomendado:
#   DEV_USER=devuser \
#   APP_DIR=daw-proyecto \
#   PORT=3000 \
#   DB_PASSWORD='MiPassDB' \
#   JWT_SECRET='secretolargo' \
#   sudo ./instalar-entorno-dev-arch.sh

DEV_USER="${DEV_USER:-dev}"
APP_DIR_NAME="${APP_DIR:-daw-proyecto}"
HOME_DIR="/home/$DEV_USER"
PROJECTS_DIR="${PROJECTS_DIR:-$HOME_DIR/projects}"
APP_DIR="$PROJECTS_DIR/$APP_DIR_NAME"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

PORT="${PORT:-3000}"
DB_NAME="${DB_NAME:-ekonsumo}"
DB_USER="${DB_USER:-ekonsumo_user}"
DB_PASSWORD="${DB_PASSWORD:-}"
JWT_SECRET="${JWT_SECRET:-}"
OVERWRITE_ENV="${OVERWRITE_ENV:-0}"

if [[ "$EUID" -ne 0 ]]; then
  echo "Ejecuta este script con sudo."
  exit 1
fi

if [[ -z "$DB_PASSWORD" || -z "$JWT_SECRET" ]]; then
  echo "ERROR: Define DB_PASSWORD y JWT_SECRET como variables de entorno."
  exit 1
fi

echo "==> Sincronizando mirrorlist y actualizando sistema"
pacman -Syu --noconfirm

echo "==> Instalando paquetes base"
pacman -S --noconfirm nodejs npm postgresql git base-devel curl wget unzip rsync

echo "==> Instalando Visual Studio Code (code) desde community si disponible"
if ! command -v code >/dev/null 2>&1; then
  if pacman -Si code >/dev/null 2>&1; then
    pacman -S --noconfirm code
  else
    echo "code no está en los repos oficiales. Instalando code via AUR (code-bin) temporalmente usando paru if available."
    if ! command -v paru >/dev/null 2>&1; then
      echo "Instalando paru (AUR helper) para instalar code-bin"
      cd /tmp
      git clone https://aur.archlinux.org/paru.git
      cd paru
      sudo -u "$SUDO_USER" makepkg -si --noconfirm
    fi
    paru -S --noconfirm code-bin || true
  fi
fi

echo "==> Instalando PM2 global (opcional)"
npm install -g pm2 || true

echo "==> Creando usuario de desarrollo si no existe: $DEV_USER"
if ! id -u "$DEV_USER" >/dev/null 2>&1; then
  useradd -m -s /bin/bash "$DEV_USER"
  echo "Usuario $DEV_USER creado."
fi

echo "==> Creando estructura de proyectos en $PROJECTS_DIR"
mkdir -p "$BACKEND_DIR" "$FRONTEND_DIR"
chown -R "$DEV_USER:$DEV_USER" "$PROJECTS_DIR"

echo "==> Inicializando y arrancando PostgreSQL (systemd)"
if ! sudo -u postgres test -d /var/lib/postgres; then
  echo "Inicializando base de datos PostgreSQL"
  sudo -u postgres initdb --locale $LANG -D /var/lib/postgres/data
fi
systemctl enable --now postgresql

echo "==> Configurando PostgreSQL: creando rol y base de datos"
sudo -u postgres psql -v db_user="$DB_USER" -v db_password="$DB_PASSWORD" -v db_name="$DB_NAME" <<'SQL'
SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'db_user', :'db_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'db_user')\gexec

SELECT format('ALTER ROLE %I WITH LOGIN PASSWORD %L', :'db_user', :'db_password')\gexec

SELECT format('CREATE DATABASE %I OWNER %I', :'db_name', :'db_user')
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = :'db_name')\gexec
SQL

echo "==> Inicializando package.json básicos (si no existen)"
sudo -u "$DEV_USER" bash -c "cd '$BACKEND_DIR' && if [[ ! -f package.json ]]; then npm init -y >/dev/null 2>&1; fi"
sudo -u "$DEV_USER" bash -c "cd '$FRONTEND_DIR' && if [[ ! -f package.json ]]; then npm init -y >/dev/null 2>&1; fi"

echo "==> Creando backend/.env"
BACKEND_ENV_FILE="$BACKEND_DIR/.env"
ensure_env_key() {
  local file="$1"
  local key="$2"
  local value="$3"
  if ! grep -q "^${key}=" "$file" 2>/dev/null; then
    printf '%s=%s\n' "$key" "$value" >> "$file"
  fi
}

if [[ ! -f "$BACKEND_ENV_FILE" || "$OVERWRITE_ENV" == "1" ]]; then
  cat > "$BACKEND_ENV_FILE" <<EOF
PORT=$PORT
NODE_ENV=development
JWT_SECRET=$JWT_SECRET
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME
EMAIL_USER=
EMAIL_PASS=
FRONTEND_URL=http://localhost:8080
EOF
  chown "$DEV_USER:$DEV_USER" "$BACKEND_ENV_FILE"
  chmod 600 "$BACKEND_ENV_FILE"
else
  ensure_env_key "$BACKEND_ENV_FILE" "PORT" "$PORT"
  ensure_env_key "$BACKEND_ENV_FILE" "NODE_ENV" "development"
  ensure_env_key "$BACKEND_ENV_FILE" "JWT_SECRET" "$JWT_SECRET"
  ensure_env_key "$BACKEND_ENV_FILE" "DB_HOST" "127.0.0.1"
  ensure_env_key "$BACKEND_ENV_FILE" "DB_PORT" "5432"
  ensure_env_key "$BACKEND_ENV_FILE" "DB_USER" "$DB_USER"
  ensure_env_key "$BACKEND_ENV_FILE" "DB_PASSWORD" "$DB_PASSWORD"
  ensure_env_key "$BACKEND_ENV_FILE" "DB_NAME" "$DB_NAME"
  chown "$DEV_USER:$DEV_USER" "$BACKEND_ENV_FILE"
  chmod 600 "$BACKEND_ENV_FILE"
fi

echo "==> Añadiendo scripts npm útiles al backend (start, dev)"
sudo -u "$DEV_USER" bash -c "cd '$BACKEND_DIR' && \
  if ! grep -q '\"start\"' package.json 2>/dev/null; then \
    npm pkg set scripts.start=\"node index.js\" >/dev/null 2>&1 || true; \
  fi; \
  npm pkg set scripts.dev=\"nodemon index.js\" >/dev/null 2>&1 || true"

echo "==> Creando ejemplo index.js en backend si no existe"
if [[ ! -f "$BACKEND_DIR/index.js" ]]; then
  cat > "$BACKEND_DIR/index.js" <<'JS'
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.get('/api/health', (req, res) => res.json({status: 'ok'}));
app.listen(port, () => console.log(`Backend listening on ${port}`));
JS
  chown "$DEV_USER:$DEV_USER" "$BACKEND_DIR/index.js"
fi

echo "==> Creando ejemplo Vue frontend básico (si no exista)"
if [[ ! -f "$FRONTEND_DIR/src/main.js" ]]; then
  sudo -u "$DEV_USER" bash -c "cd '$FRONTEND_DIR' && \
    npm pkg set scripts.dev=\"vue-cli-service serve\" >/dev/null 2>&1 || true"
  mkdir -p "$FRONTEND_DIR/src"
  cat > "$FRONTEND_DIR/src/main.js" <<'JS'
import { createApp } from 'vue';
const App = { template: '<div><h1>Frontend</h1><p>API: <a href="/api/health">/api/health</a></p></div>' };
createApp(App).mount('#app');
JS
  cat > "$FRONTEND_DIR/index.html" <<HTML
<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Frontend</title></head>
  <body><div id="app"></div><script type="module" src="/src/main.js"></script></body>
</html>
HTML
  chown -R "$DEV_USER:$DEV_USER" "$FRONTEND_DIR"
fi

echo "==> Instalando dependencias de ejemplo (puedes cambiar según tu stack)"
sudo -u "$DEV_USER" bash -c "cd '$BACKEND_DIR' && npm install express >/dev/null 2>&1 || true"
sudo -u "$DEV_USER" bash -c "cd '$FRONTEND_DIR' && npm install vue >/dev/null 2>&1 || true"

echo "==> Ajustando permisos"
chown -R "$DEV_USER:$DEV_USER" "$PROJECTS_DIR"

cat <<EOF

Instalación completada en Arch Linux.

Siguientes pasos sugeridos (como usuario $DEV_USER):

1) Backend:
   cd $BACKEND_DIR
   npm run dev
   # o con PM2:
   pm2 start index.js --name dev-backend --watch --cwd $BACKEND_DIR

2) Frontend:
   cd $FRONTEND_DIR
   # si usas Vue CLI: npm install -g @vue/cli && vue create .
   # o servir el index.html simple con:
   npx serve -s . -l 8080

3) Conectar a la BD:
   sudo -u postgres psql -d $DB_NAME -U $DB_USER

Notas:
- En Arch, code puede no estar en repos oficiales; script intenta instalar code desde community o AUR (code-bin).
- Para añadir nodemon, Vue CLI, o docker, dímelo y lo añado al script.

EOF
