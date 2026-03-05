# Securizacion de Ekonsumo en VPS (Debian 13)

Documento de hardening por fases. Complementa `docs/deploy-vps.md`.

## 1) Fase minima (hacer ya)

## 1.1 Red y transporte

- [ ] HTTPS activo con Certbot.
- [ ] Redireccion HTTP -> HTTPS.
- [ ] UFW activo permitiendo solo `OpenSSH` y `Nginx Full`.

## 1.2 Identidad y secretos

- [ ] No usar `root` para operar app.
- [ ] Secrets fuera de git (`.env` solo en servidor).
- [ ] `JWT_SECRET` largo y unico por entorno.
- [ ] Password DB robusta.

## 1.3 Sistema

- [ ] `apt update && apt upgrade` periodico.
- [ ] `npm audit` en backend/frontend antes de deploy.
- [ ] Logs activos (Nginx y PM2).

## 2) Fase recomendada (siguiente iteracion)

## 2.1 SSH hardening

- [ ] Deshabilitar login SSH por password (`PasswordAuthentication no`).
- [ ] Acceso SSH solo por clave.
- [ ] Cambiar `PermitRootLogin no`.
- [ ] Opcional: cambiar puerto SSH.

## 2.2 Defensa de host

- [ ] Instalar y configurar `fail2ban`.
- [ ] Limitar intentos de login SSH.
- [ ] Revisar servicios expuestos (`ss -tulpen`).

## 2.3 App/API

- [ ] Mantener rate-limit en API.
- [ ] Revisar CORS en produccion (solo dominio real frontend).
- [ ] Validar y sanitizar inputs en rutas criticas.
- [ ] Evitar mostrar stack traces en respuestas.

## 2.4 Nginx hardening

- [ ] Añadir cabeceras de seguridad:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Content-Security-Policy` (definir por app)
- [ ] Desactivar informacion de version (`server_tokens off`).

## 3) Fase avanzada

- [ ] Backup automatizado de PostgreSQL (`pg_dump`) con retencion.
- [ ] Backup de `backend/.env` y config Nginx.
- [ ] Monitorizacion (PM2 + alertas basicas).
- [ ] Rotacion de logs.
- [ ] Escaneo periodico (OWASP ZAP / Lynis / Trivy segun stack).

## 4) Snippets utiles

## 4.1 UFW

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo ufw status verbose
```

## 4.2 Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ekonsumo.duckdns.org
sudo certbot renew --dry-run
```

## 4.3 CORS backend (produccion)

Configurar origenes explicitos del frontend real.

## 5) Decisiones recomendadas para este proyecto

- Aplicar **fase minima ya** (no esperar).
- Planificar **fase recomendada** en siguiente entrega.
- Mantener fase avanzada como backlog tecnico.
