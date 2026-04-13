## Deploy en VPS Debian 13 (Ekonsumo) — guía actualizada

Resumen breve y pasos concretos para desplegar el monorepo (backend + frontend) en un VPS Debian 13. Supone que ya tienes el script de instalación base (`scripts/instalar-backend-vps.sh`) y el script de subida (`scripts/subir_codigo_fuente.sh`).

## 1. Estrategia
- Backend: Node/Express ejecutado por PM2 (puerto interno 3000).
- Frontend: Vue/Vite compilado en frontend/dist y servido por Nginx.
- Nginx sirve el frontend estático y proxy /api al backend.
- PostgreSQL local en el VPS.
- HTTPS con Certbot (recommended).

## 2. Pre-requisitos
- VPS con Debian 13 (usuario con sudo).
- Dominio/subdominio apuntando al VPS (ej.: ekonsumo.duckdns.org).
- Clave SSH para acceso.
- Variables secretas disponibles: DB_PASSWORD, JWT_SECRET, EMAIL_USER, EMAIL_PASS, etc.

## 3. Preparar VPS (instalación base)
Ejecuta en el VPS (root o con sudo). Ajusta variables de entorno según tu entorno:

DOMAIN=ekonsumo.duckdns.org \
DB_PASSWORD='cambia_esta_password' \
JWT_SECRET='cambia_este_secret' \
EMAIL_USER='correo@dominio.com' \
EMAIL_PASS='password_correo' \
scripts/instalar-backend-vps.sh

Qué hace el script:
- Actualiza el sistema e instala Node 22, PostgreSQL, Nginx, PM2, UFW, etc.
- Crea usuario de aplicación (por defecto ekonsumo) y estructura en /var/www/daw-proyecto.
- Genera backend/.env (si no existe) con las variables que pases.
- Crea y habilita configuración Nginx, UFW y PM2 startup.
- Opcional: crea tarea DuckDNS si defines DUCKDNS_DOMAIN y DUCKDNS_TOKEN.

## 4. Subir código desde local
Desde tu máquina local sincroniza el repositorio:

scripts/subir_codigo_fuente.sh user@ekonsumo.duckdns.org /var/www/daw-proyecto

El script debe excluir node_modules, frontend/dist, .env y .git. Resultado: backend/ y frontend/ en /var/www/daw-proyecto con permisos del usuario de app.

## 5. Instalar dependencias y build (VPS)
En el VPS, como el usuario del sistema de la app (o con sudo donde corresponda):

cd /var/www/daw-proyecto/backend
npm ci --omit=dev

cd /var/www/daw-proyecto/frontend
npm ci
npm run build

Arrancar backend con PM2 (ejecutado por el usuario de la app, ej. ekonsumo):

sudo -u ekonsumo pm2 start /var/www/daw-proyecto/backend/index.js --name ekonsumo-backend --cwd /var/www/daw-proyecto/backend --time
sudo -u ekonsumo pm2 save

Recargar Nginx:

sudo systemctl reload nginx

## 6. Comprobaciones post-deploy
Comprobaciones rápidas:

curl -I http://ekonsumo.duckdns.org
curl -I http://ekonsumo.duckdns.org/api/health   # o ruta health de tu API

Revisar PM2:

sudo -u ekonsumo pm2 list
sudo -u ekonsumo pm2 logs ekonsumo-backend --lines 200

Revisar Nginx:

sudo nginx -t
sudo systemctl status nginx

Revisar PostgreSQL y conexión desde la app:

sudo -u postgres psql -c '\l'
# desde VPS: psql -h 127.0.0.1 -U ekonsumo_user -d ekonsumo

## 7. Habilitar HTTPS (recomendado inmediatamente)
Instalar Certbot y obtener certificados:

sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ekonsumo.duckdns.org

Comprobar renovación automática:

sudo certbot renew --dry-run

Si usas DuckDNS, asegúrate de que el dominio apunta correctamente antes de pedir certbot. Certbot modifica la config Nginx para redirigir a HTTPS por defecto.

## 8. Flujo de actualización de código (diario)
1) En local: subir cambios
   scripts/subir_codigo_fuente.sh user@ekonsumo.duckdns.org /var/www/daw-proyecto

2) En VPS:

cd /var/www/daw-proyecto/backend && npm ci --omit=dev
cd /var/www/daw-proyecto/frontend && npm ci && npm run build
sudo -u ekonsumo pm2 restart ekonsumo-backend
sudo systemctl reload nginx

(usar pm2 deploy o CI/CD si prefieres automatizar esto en el futuro)

## 9. Archivo .env recomendado (backend)
/var/www/daw-proyecto/backend/.env (permisos 600, propiedad app user)

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

Asegúrate de no incluir .env en el repo y de protegerlo con permisos restrictivos.

## 10. Troubleshooting rápido
- 502 Bad Gateway: backend no está escuchando → pm2 logs / pm2 status.
- 404/archivo estático faltante: asegúrate de que frontend/dist contiene index.html y que la root de Nginx apunta a frontend/dist.
- Nginx fallo config: sudo nginx -t y revisar /var/log/nginx/error.log.
- Certbot fallos: revisar que el puerto 80 está accesible y dominio apunta al VPS.
- API 401: revisar JWT_SECRET y que la hora del sistema sea correcta (timing en tokens).

## 11. Seguridad mínima obligatoria (ahora)
- UFW: permitir OpenSSH y Nginx Full (80/443) y bloquear lo demás.
- HTTPS con Certbot.
- Ejecutar la app con un usuario no root (ej.: ekonsumo).
- Mantener actualizaciones de seguridad: apt update && apt upgrade regularmente.
- No exponer puertos de base de datos públicamente (Postgres bind a 127.0.0.1).

## 12. Hardening (iteración futura)
- Fail2ban para proteger SSH.
- SSH key only + deshabilitar password auth y root login.
- CSP, HSTS y otras cabeceras de seguridad en Nginx.
- Rotación de secretos y gestión con vault/secret manager.
- Backups automáticos de base de datos y archivos de usuario.
- Monitorización (Prometheus/Alertmanager, logs centralizados).

## 13. Notas operativas y permisos
- Asegura que /var/www/daw-proyecto y subcarpetas son propiedad del usuario de la app:
  chown -R ekonsumo:ekonsumo /var/www/daw-proyecto
- PM2 startup fue configurado por el script; verifica con:
  sudo -u ekonsumo pm2 startup systemd --hp /home/ekonsumo
  sudo -u ekonsumo pm2 save

## 14. Jobs programados (cron)

El sistema tiene jobs automáticos configurados en el servidor:

### Liquidación mensual
- **Script**: `/usr/local/bin/ekonsumo-liquidacion-mensual`
- **Cron**: `10 2 1 * *` (día 1 de cada mes a las 02:10)
- **Función**: Genera las liquidaciones de pago mensuales entre usuarios
- **Log**: `/var/www/daw-proyecto/logs/liquidacion-mensual.log`

### Pedidos periódicos
- **Script**: `/usr/local/bin/ekonsumo-pedidos-periodicos`
- **Cron**: `0 2 * * *` (cada día a las 02:00)
- **Función**: Genera pedidos automáticamente según configuraciones de Pedido_Periodico
- **Log**: `/var/www/daw-proyecto/logs/pedidos-periodicos.log`
- **Tabla requerida**: `Pedido_Periodico_Generacion` (crear con SQL en `/var/www/daw-proyecto/datos/importar_datos_actuales/crear_tabla_pedido_periodico_generacion.sql`)

### Comandos útiles
```bash
# Ver executions de cron
sudo -u ekonsumo crontab -l

# Ejecutar job manualmente
sudo -u ekonsumo /usr/local/bin/ekonsumo-pedidos-periodicos

# Ver logs
cat /var/www/daw-proyecto/logs/pedidos-periodicos.log
tail -f /var/www/daw-proyecto/logs/pedidos-periodicos.log

# Simular sin ejecutar (dry-run)
cd /var/www/daw-proyecto/backend
sudo -u ekonsumo npm run pedidos:periodicos -- --dry-run
```

## 15. Checklist resumido antes de marcar como "en producción"
- [ ] DNS apuntando correctamente al VPS
- [ ] Certificado HTTPS válido
- [ ] PM2 proceso backend en ejecución y guardado
- [ ] Nginx sirviendo frontend y proxy /api
- [ ] Tabla Pedido_Periodico_Generacion creada
- [ ] Jobs de cron funcionando
- [ ] Backups DB configurados
- [ ] UFW configurado y SSH seguro
- [ ] Logs rotados/monitorizados

Si quieres, actualizo la guía para:
- incluir instrucciones para despliegue con systemd en lugar de PM2,
- añadir pasos de backup PostgreSQL automáticos,
- incluir comandos exactos para crear el usuario de sistema y ajustar permisos,
- o convertir esto en un checklist en docs/Deploy.md. ¿Cuál prefieres?