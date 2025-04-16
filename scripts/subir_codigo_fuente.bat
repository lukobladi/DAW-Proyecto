@echo off

REM Configuración
set SERVER_USER=root
set SERVER_HOST=ekonsumo.duckdns.org
set BACKEND_LOCAL_DIR="C:\Users\Mc Lovin\Proyects\DAW-Proyecto\Backend"
set FRONTEND_LOCAL_DIR="C:\Users\Mc Lovin\Proyects\DAW-Proyecto\frontend"
set BACKEND_REMOTE_DIR="/var/www/daw-proyecto/backend"
set FRONTEND_REMOTE_DIR="/var/www/daw-proyecto/frontend"

echo === Iniciando despliegue ===

REM Copiar archivos del backend
echo === Copiando archivos del backend al servidor ===
pscp -r %BACKEND_LOCAL_DIR%\package.json %BACKEND_LOCAL_DIR%\package-lock.json %BACKEND_LOCAL_DIR%\index.js %BACKEND_LOCAL_DIR%\.env %SERVER_USER%@%SERVER_HOST%:%BACKEND_REMOTE_DIR%
pscp -r %BACKEND_LOCAL_DIR%\src %SERVER_USER%@%SERVER_HOST%:%BACKEND_REMOTE_DIR%
pscp -r %BACKEND_LOCAL_DIR%\routes %SERVER_USER%@%SERVER_HOST%:%BACKEND_REMOTE_DIR%
pscp -r %BACKEND_LOCAL_DIR%\controllers %SERVER_USER%@%SERVER_HOST%:%BACKEND_REMOTE_DIR%
pscp -r %BACKEND_LOCAL_DIR%\models %SERVER_USER%@%SERVER_HOST%:%BACKEND_REMOTE_DIR%
pscp -r %BACKEND_LOCAL_DIR%\middlewares %SERVER_USER%@%SERVER_HOST%:%BACKEND_REMOTE_DIR%

REM Copiar archivos del frontend
echo === Copiando archivos del frontend al servidor ===
pscp -r %FRONTEND_LOCAL_DIR%\babel.config.js %FRONTEND_LOCAL_DIR%\package.json %FRONTEND_LOCAL_DIR%\package-lock.json %SERVER_USER%@%SERVER_HOST%:%FRONTEND_REMOTE_DIR%
pscp -r %FRONTEND_LOCAL_DIR%\src %SERVER_USER%@%SERVER_HOST%:%FRONTEND_REMOTE_DIR%
pscp -r %FRONTEND_LOCAL_DIR%\public %SERVER_USER%@%SERVER_HOST%:%FRONTEND_REMOTE_DIR%

REM Configurar permisos en el servidor
echo === Configurando permisos en el servidor ===
plink %SERVER_USER%@%SERVER_HOST% "sudo chown -R eneko:eneko %BACKEND_REMOTE_DIR% && sudo chmod -R 755 %BACKEND_REMOTE_DIR%"
plink %SERVER_USER%@%SERVER_HOST% "sudo chown -R eneko:eneko %FRONTEND_REMOTE_DIR% && sudo chmod -R 755 %FRONTEND_REMOTE_DIR%"

echo === Despliegue completado ===