# Deploy en VPS Debian 13 (Ekonsumo)

Guia actualizada para desplegar el monorepo (`backend` + `frontend`) en un VPS con Debian 13.

## 1. Resumen de estrategia

- Backend Node/Express en `PM2` (puerto interno 3000).
- Frontend Vue/Vite compilado en `frontend/dist`.
- `Nginx` sirve frontend y hace proxy de `/api` al backend.
- `PostgreSQL` local en el VPS.

## 2. Requisitos

- VPS Debian 13 limpio.
- Dominio o subdominio (ejemplo: `ekonsumo.duckdns.org`).
- Acceso SSH al servidor.
- Variables secretas definidas para backend (`DB_PASSWORD`, `JWT_SECRET`, etc.).

## 3. Preparar servidor (instalacion base)

En el VPS (root o sudo):

```bash
git clone <tu_repo> /tmp/daw-proyecto
cd /tmp/daw-proyecto

DOMAIN=ekonsumo.duckdns.org \
DB_PASSWORD='cambia_esta_password' \
JWT_SECRET='cambia_este_secret' \
EMAIL_USER='correo@dominio.com' \
EMAIL_PASS='password_correo' \
scripts/instalar-backend-vps.sh
```

Notas:

- El script crea estructura en `/var/www/daw-proyecto`.
- Deja creado `backend/.env` (si no existe).
- Configura Nginx y UFW.
- Si defines `DUCKDNS_DOMAIN` y `DUCKDNS_TOKEN`, configura actualizacion automatica de IP.

## 4. Subir codigo fuente desde local

Desde tu maquina de desarrollo:

```bash
cd /home/mcl/Proyects/DAW-Proyecto
scripts/subir_codigo_fuente.sh eneko@ekonsumo.duckdns.org /var/www/daw-proyecto
```

El script sincroniza:

- `backend/`
- `frontend/`
- `scripts/`
- `docs/`

Y excluye `node_modules`, `dist`, `coverage`, `.env`, `.git`.

## 5. Instalar dependencias y arrancar app

En el VPS:

```bash
cd /var/www/daw-proyecto/backend
npm ci --omit=dev

cd /var/www/daw-proyecto/frontend
npm ci
npm run build

sudo -u ekonsumo pm2 start /var/www/daw-proyecto/backend/index.js --name ekonsumo-backend
sudo -u ekonsumo pm2 save

sudo systemctl reload nginx
```

## 6. Verificaciones post-deploy

```bash
curl -I http://ekonsumo.duckdns.org
curl -I http://ekonsumo.duckdns.org/api/test

sudo -u ekonsumo pm2 list
sudo -u ekonsumo pm2 logs ekonsumo-backend --lines 100

sudo nginx -t
sudo systemctl status nginx
```

## 7. HTTPS (recomendado en esta fase)

Aunque el hardening completo puede ir en otra iteracion, **si recomiendo habilitar HTTPS ya**.

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ekonsumo.duckdns.org
```

Probar renovacion:

```bash
sudo certbot renew --dry-run
```

## 8. Actualizacion de codigo (operativa diaria)

1. Local:

```bash
scripts/subir_codigo_fuente.sh eneko@ekonsumo.duckdns.org /var/www/daw-proyecto
```

2. VPS:

```bash
cd /var/www/daw-proyecto/backend && npm ci --omit=dev
cd /var/www/daw-proyecto/frontend && npm ci && npm run build
sudo -u ekonsumo pm2 restart ekonsumo-backend
sudo systemctl reload nginx
```

## 9. Variables de entorno backend recomendadas

`/var/www/daw-proyecto/backend/.env`

```env
PORT=3000
NODE_ENV=production
JWT_SECRET=<secreto_largo>
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=ekonsumo_user
DB_PASSWORD=<password_db>
DB_NAME=ekonsumo
EMAIL_USER=<correo>
EMAIL_PASS=<password>
FRONTEND_URL=https://ekonsumo.duckdns.org
```

## 10. Troubleshooting rapido

- `502 Bad Gateway`:
  - backend no arranco o cayo: `sudo -u ekonsumo pm2 logs ekonsumo-backend`
- frontend no refleja cambios:
  - no se ejecuto build: `cd frontend && npm run build`
- Nginx error de config:
  - `sudo nginx -t`
- API devuelve 401:
  - revisar `JWT_SECRET`, reloj del sistema y token en cliente.

## 11. Seguridad: ahora o despues

Recomendacion pragmatica:

- **Ahora (minimo obligatorio):** UFW + HTTPS + no exponer secretos + actualizaciones + usuario no root.
- **Despues (iteracion hardening):** Fail2ban, SSH hardening, cabeceras CSP estrictas, backup automatizado y monitorizacion.

Checklist detallado en: `docs/Securizar.md`.
