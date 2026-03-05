#!/usr/bin/env bash
set -euo pipefail

# Instalacion base para VPS Debian 13 (backend + frontend).
# Prepara SO, Node, PostgreSQL, Nginx, PM2, UFW y estructura de app.
#
# Uso recomendado (como root o con sudo):
#   DOMAIN=ekonsumo.duckdns.org \
#   DB_PASSWORD='O&5Y9X}R9f2v' \
#   JWT_SECRET='bFUeXtDBV6lV6n3sLTJ3aWsgP5H1Wtyr1LkQYoAVTVU' \
#   EMAIL_USER='emartinmon6@educacion.navarra.es' EMAIL_PASS='3n3sh.fp' \
#   scripts/instalar-backend-vps.sh
#
# Opcional DuckDNS:
#   DUCKDNS_DOMAIN=ekonsumo DUCKDNS_TOKEN=5cee5aa6-77fa-4e3d-b1f1-ec3afea1c773 scripts/instalar-backend-vps.sh

if [[ "${EUID}" -ne 0 ]]; then
  echo "Este script debe ejecutarse como root (o con sudo)."
  exit 1
fi

APP_USER="${APP_USER:-ekonsumo}"
APP_GROUP="${APP_GROUP:-$APP_USER}"
APP_DIR="${APP_DIR:-/var/www/daw-proyecto}"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

DOMAIN="${DOMAIN:-ekonsumo.duckdns.org}"
PORT="${PORT:-3000}"
OVERWRITE_ENV="${OVERWRITE_ENV:-0}"

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-ekonsumo}"
DB_USER="${DB_USER:-ekonsumo_user}"
DB_PASSWORD="${DB_PASSWORD:-}"

JWT_SECRET="${JWT_SECRET:-}"
EMAIL_USER="${EMAIL_USER:-}"
EMAIL_PASS="${EMAIL_PASS:-}"
FRONTEND_URL="${FRONTEND_URL:-https://$DOMAIN}"

DUCKDNS_DOMAIN="${DUCKDNS_DOMAIN:-}"
DUCKDNS_TOKEN="${DUCKDNS_TOKEN:-}"

if [[ -z "$DB_PASSWORD" || -z "$JWT_SECRET" ]]; then
  echo "ERROR: Debes definir DB_PASSWORD y JWT_SECRET en variables de entorno."
  exit 1
fi

ensure_env_key() {
  local file="$1"
  local key="$2"
  local value="$3"

  if ! grep -q "^${key}=" "$file"; then
    printf '%s=%s\n' "$key" "$value" >> "$file"
  fi
}

echo "==> Actualizando sistema"
apt update
apt upgrade -y

echo "==> Instalando paquetes base"
apt install -y curl ca-certificates gnupg lsb-release git rsync unzip build-essential \
  nginx postgresql postgresql-contrib ufw cron

echo "==> Instalando Node.js 22 LTS"
if ! command -v node >/dev/null 2>&1 || ! node -v | grep -qE '^v22\.'; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt install -y nodejs
fi

echo "==> Instalando PM2"
npm install -g pm2

echo "==> Creando usuario del sistema si no existe"
if ! id -u "$APP_USER" >/dev/null 2>&1; then
  useradd -m -s /bin/bash "$APP_USER"
fi

echo "==> Creando estructura de carpetas"
mkdir -p "$BACKEND_DIR" "$FRONTEND_DIR" "$APP_DIR/logs"
chown -R "$APP_USER:$APP_GROUP" "$APP_DIR"

echo "==> Configurando PostgreSQL"
sudo -u postgres psql -v db_user="$DB_USER" -v db_password="$DB_PASSWORD" -v db_name="$DB_NAME" <<'SQL'
SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'db_user', :'db_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'db_user')\gexec

SELECT format('ALTER ROLE %I WITH LOGIN PASSWORD %L', :'db_user', :'db_password')\gexec

SELECT format('CREATE DATABASE %I OWNER %I', :'db_name', :'db_user')
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = :'db_name')\gexec
SQL

echo "==> Configurando backend/.env"
if [[ ! -f "$BACKEND_DIR/.env" || "$OVERWRITE_ENV" == "1" ]]; then
  cat > "$BACKEND_DIR/.env" <<EOF
PORT=$PORT
NODE_ENV=production
JWT_SECRET=$JWT_SECRET
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME
EMAIL_USER=$EMAIL_USER
EMAIL_PASS=$EMAIL_PASS
FRONTEND_URL=$FRONTEND_URL
EOF
  chown "$APP_USER:$APP_GROUP" "$BACKEND_DIR/.env"
  chmod 600 "$BACKEND_DIR/.env"
else
  ensure_env_key "$BACKEND_DIR/.env" "PORT" "$PORT"
  ensure_env_key "$BACKEND_DIR/.env" "NODE_ENV" "production"
  ensure_env_key "$BACKEND_DIR/.env" "JWT_SECRET" "$JWT_SECRET"
  ensure_env_key "$BACKEND_DIR/.env" "DB_HOST" "$DB_HOST"
  ensure_env_key "$BACKEND_DIR/.env" "DB_PORT" "$DB_PORT"
  ensure_env_key "$BACKEND_DIR/.env" "DB_USER" "$DB_USER"
  ensure_env_key "$BACKEND_DIR/.env" "DB_PASSWORD" "$DB_PASSWORD"
  ensure_env_key "$BACKEND_DIR/.env" "DB_NAME" "$DB_NAME"
  ensure_env_key "$BACKEND_DIR/.env" "EMAIL_USER" "$EMAIL_USER"
  ensure_env_key "$BACKEND_DIR/.env" "EMAIL_PASS" "$EMAIL_PASS"
  ensure_env_key "$BACKEND_DIR/.env" "FRONTEND_URL" "$FRONTEND_URL"
  chown "$APP_USER:$APP_GROUP" "$BACKEND_DIR/.env"
  chmod 600 "$BACKEND_DIR/.env"
fi

echo "==> Configurando Nginx"
cat > /etc/nginx/sites-available/ekonsumo <<EOF
server {
  listen 80;
  server_name $DOMAIN;

  root $FRONTEND_DIR/dist;
  index index.html;

  location / {
    try_files \$uri \$uri/ /index.html;
  }

  location /api/ {
    proxy_pass http://127.0.0.1:$PORT;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }

  location = /api-docs {
    proxy_pass http://127.0.0.1:$PORT/api-docs;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }

  location ^~ /api-docs/ {
    proxy_pass http://127.0.0.1:$PORT/api-docs/;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }

  location /uploads/ {
    alias $BACKEND_DIR/uploads/;
    autoindex off;
  }
}
EOF

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/ekonsumo /etc/nginx/sites-enabled/ekonsumo
nginx -t
systemctl enable nginx
systemctl restart nginx

echo "==> Configurando UFW"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "==> Activando servicios"
systemctl enable postgresql
systemctl restart postgresql
systemctl enable cron
systemctl restart cron

echo "==> Configurando PM2 startup para $APP_USER"
pm2 startup systemd -u "$APP_USER" --hp "/home/$APP_USER" || true

if [[ -n "$DUCKDNS_DOMAIN" && -n "$DUCKDNS_TOKEN" ]]; then
  echo "==> Configurando actualizacion DuckDNS"
  cat > /usr/local/bin/duckdns-update <<EOF
#!/usr/bin/env bash
curl -fsS "https://www.duckdns.org/update?domains=$DUCKDNS_DOMAIN&token=$DUCKDNS_TOKEN&ip=" \
  -o /var/log/duckdns.log
EOF
  chmod 700 /usr/local/bin/duckdns-update
  if ! crontab -l 2>/dev/null | grep -q duckdns-update; then
    (crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/duckdns-update >/dev/null 2>&1") | crontab -
  fi
fi

cat <<EOF

Instalacion base completada.

Siguientes pasos:
1) Subir codigo: scripts/subir_codigo_fuente.sh <usuario@host> $APP_DIR
2) En VPS:
   cd $BACKEND_DIR && npm ci --omit=dev
   cd $FRONTEND_DIR && npm ci && npm run build
   sudo -u $APP_USER pm2 start $BACKEND_DIR/index.js --name ekonsumo-backend --cwd $BACKEND_DIR --time
   sudo -u $APP_USER pm2 save
   systemctl reload nginx

Opcional ahora (recomendado): HTTPS con Certbot
  apt install -y certbot python3-certbot-nginx
  certbot --nginx -d $DOMAIN

EOF
