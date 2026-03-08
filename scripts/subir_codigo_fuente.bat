@echo off
setlocal enabledelayedexpansion

REM Uso:
REM   scripts\subir_codigo_fuente.cmd usuario@host [solo_codigo: SI/NO] [ruta_remota]
REM Ejemplo:
REM   scripts\subir_codigo_fuente.cmd eneko@ekonsumo.duckdns.org NO /var/www/daw-proyecto

if "%~1"=="" (
  echo Uso: %~nx0 usuario@host [solo_codigo: SI/NO] [ruta_remota]
  exit /b 1
)

set "REMOTE=%~1"
set "ONLY_CODE=%~2"
if "%ONLY_CODE%"=="" set "ONLY_CODE=NO"
set "REMOTE_DIR=%~3"
if "%REMOTE_DIR%"=="" set "REMOTE_DIR=/var/www/daw-proyecto"

REM Ajusta estas rutas locales si ejecutas desde otra carpeta
set "ROOT_DIR=%~dp0\.."
REM Normalizar ruta (remueve la barra final si existe)
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"

REM Ejecutables (asume pscp y plink en PATH)
set "PSCP=pscp"
set "PLINK=plink"
set "SSH_OPTS="

echo ==> Verificando conectividad SSH
%PLINK% %SSH_OPTS% %REMOTE% echo SSH_OK >nul 2>&1
if errorlevel 1 (
  echo No se pudo autenticar por SSH con %REMOTE%.
  echo Si usas clave no default, ejecuta con:
  echo   set SSH_OPTS=-i C:\path\to\private_key
  echo   %~nx0 %REMOTE% %ONLY_CODE% %REMOTE_DIR%
  exit /b 1
)

REM Función para copiar directorio (excluye patrones simples)
REM pscp no tiene exclusiones avanzadas; usamos copia selectiva por patrones.
:copy_dir
REM args: 1=local_dir 2=remote_dir
set "LOCAL=%~1"
set "RDIR=%~2"

REM Si la carpeta no existe, salir sin error
if not exist "%LOCAL%" (
  echo Aviso: %LOCAL% no existe, se omite.
  goto :eof
)

REM Crear remoto (usando plink)
%PLINK% %SSH_OPTS% %REMOTE% "mkdir -p '%RDIR%'" >nul 2>&1

REM Copiar archivos y subdirectorios excepto los ignorados.
REM Copiamos archivos concretos y carpetas comunes; ajustar según repo.
for /f "delims=" %%F in ('dir /b /a-d "%LOCAL%" 2^>nul') do (
  set "fname=%%F"
  rem excluir .env, .env.* y .DS_Store
  echo !fname! | findstr /i /r "^\(.env\|\.DS_Store\)" >nul
  if errorlevel 1 (
    %PSCP% -r "%LOCAL%\%%F" %REMOTE%:"%RDIR%\" >nul 2>&1 || (
      echo Error copiando %LOCAL%\%%F
      exit /b 1
    )
  )
)

REM Copiar subdirectorios (excluyendo node_modules, dist, coverage, .git, .github)
for /f "delims=" %%D in ('dir /b /ad "%LOCAL%" 2^>nul') do (
  set "dname=%%D"
  echo !dname! | findstr /i /r "^\(node_modules\|dist\|coverage\|\.git\|\.github\)$" >nul
  if errorlevel 1 (
    %PSCP% -r "%LOCAL%\%%D" %REMOTE%:"%RDIR%\" >nul 2>&1 || (
      echo Error copiando %LOCAL%\%%D
      exit /b 1
    )
  ) else (
    echo Excluido: %LOCAL%\%%D
  )
)
goto :eof

REM --- Inicio principal ---

if /i "%ONLY_CODE%"=="NO" (
  echo ==> Creando directorios remotos
  %PLINK% %SSH_OPTS% %REMOTE% "mkdir -p '%REMOTE_DIR%/backend' '%REMOTE_DIR%/frontend' '%REMOTE_DIR%/docs' '%REMOTE_DIR%/scripts'" >nul 2>&1
)

echo ==> Sincronizando backend
call :copy_dir "%ROOT_DIR%\backend" "%REMOTE_DIR%/backend"

echo ==> Sincronizando frontend
call :copy_dir "%ROOT_DIR%\frontend" "%REMOTE_DIR%/frontend"

if /i "%ONLY_CODE%"=="NO" (
  echo ==> Sincronizando scripts y docs
  call :copy_dir "%ROOT_DIR%\scripts" "%REMOTE_DIR%/scripts"
  call :copy_dir "%ROOT_DIR%\docs" "%REMOTE_DIR%/docs"

  echo ==> Ajustando permisos basicos
  %PLINK% %SSH_OPTS% %REMOTE% "chmod +x '%REMOTE_DIR%/scripts/'*.sh || true" >nul 2>&1
)

echo.
echo Codigo actualizado en: %REMOTE_DIR%
endlocal
exit /b 0
