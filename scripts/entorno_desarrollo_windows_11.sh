# Script de Configuración para Windows 11 - DAW Proyecto
# Guardar como: configurar-entorno.ps1 y ejecutar como Administrador

Write-Host "=== CONFIGURACIÓN PARA WINDOWS 11 - EKONSUMO PROYECTO ===" -ForegroundColor Green
Write-Host "=== Ejecutar como Administrador ===" -ForegroundColor Yellow

# Verificar que se ejecuta como administrador
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ Este script requiere privilegios de administrador. Ejecuta PowerShell como Administrador." -ForegroundColor Red
    exit 1
}

# Función para verificar si un comando existe
function Test-CommandExists {
    param($command)
    return (Get-Command $command -ErrorAction SilentlyContinue)
}

# INSTALACIÓN DE SOFTWARE CON WINGET
# ==============================================

Write-Host "`n=== INSTALANDO SOFTWARE REQUERIDO CON WINGET ===" -ForegroundColor Green

# Lista de paquetes a instalar
$packages = @(
    "Git.Git",
    "OpenJS.NodeJS.LTS",
    "PostgreSQL.PostgreSQL",
    "Microsoft.VisualStudioCode",
    "Google.Chrome",
    "Mozilla.Firefox"
)

foreach ($package in $packages) {
    Write-Host "Instalando: $package" -ForegroundColor Cyan
    winget install --id $package --silent --accept-package-agreements --accept-source-agreements
}

# INSTALACIÓN DE EXTENSIONES DE VS CODE
# ==============================================

Write-Host "`n=== INSTALANDO EXTENSIONES VS CODE ===" -ForegroundColor Green

$vscodeExtensions = @(
    "ms-vscode.vscode-json",
    "ms-vscode.PowerShell",
    "octref.vetur",
    "vue.volar",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "eamodio.gitlens",
    "ms-azuretools.vscode-docker",
    "ckolkman.vscode-postgres"
)

foreach ($extension in $vscodeExtensions) {
    Write-Host "Instalando extensión: $extension" -ForegroundColor Cyan
    code --install-extension $extension --force
}

# CONFIGURACIÓN DE POSTGRESQL
# ==============================================

Write-Host "`n=== CONFIGURANDO POSTGRESQL ===" -ForegroundColor Green

# Intentar detectar la instalación de PostgreSQL
$postgresPath = Get-ChildItem "C:\Program Files\PostgreSQL" -Directory | Sort-Object Name -Descending | Select-Object -First 1

if ($postgresPath) {
    $postgresBin = Join-Path $postgresPath.FullName "bin"
    $postgresLib = Join-Path $postgresPath.FullName "lib"
    
    # Agregar PostgreSQL al PATH si no está
    $envPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
    if ($envPath -notlike "*$postgresBin*") {
        [Environment]::SetEnvironmentVariable("Path", $envPath + ";" + $postgresBin, "Machine")
        $env:Path += ";" + $postgresBin
    }
    
    Write-Host "PostgreSQL encontrado en: $($postgresPath.FullName)" -ForegroundColor Green
} else {
    Write-Host "❌ PostgreSQL no encontrado. Por favor instálalo manualmente." -ForegroundColor Red
}

# CONFIGURACIÓN DE SERVICIOS POSTGRESQL
# ==============================================

Write-Host "`n=== INICIANDO SERVICIO POSTGRESQL ===" -ForegroundColor Green

try {
    # Intentar iniciar el servicio PostgreSQL
    $postgresService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
    if ($postgresService) {
        Set-Service -Name $postgresService.Name -StartupType Automatic
        Start-Service -Name $postgresService.Name
        Write-Host "✅ Servicio PostgreSQL iniciado: $($postgresService.Name)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Servicio PostgreSQL no encontrado. Configuración manual requerida." -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error configurando PostgreSQL: $_" -ForegroundColor Red
}

# CONFIGURACIÓN DE BASE DE DATOS
# ==============================================

Write-Host "`n=== CONFIGURANDO BASE DE DATOS EKONSUMO ===" -ForegroundColor Green

# Esperar a que PostgreSQL esté listo
Start-Sleep -Seconds 5

# Script SQL para crear la base de datos
$createDBScript = @"
CREATE DATABASE ekonsumo;
CREATE USER ekonsumo_user WITH PASSWORD '1234';
GRANT ALL PRIVILEGES ON DATABASE ekonsumo TO ekonsumo_user;
ALTER DATABASE ekonsumo OWNER TO ekonsumo_user;
"@

try {
    # Guardar script temporalmente
    $tempSqlFile = Join-Path $env:TEMP "create_database.sql"
    $createDBScript | Out-File -FilePath $tempSqlFile -Encoding UTF8
    
    # Ejecutar con psql
    & "psql" "-U" "postgres" "-f" $tempSqlFile
    
    Write-Host "✅ Base de datos 'ekonsumo' creada correctamente" -ForegroundColor Green
    
    # Limpiar archivo temporal
    Remove-Item $tempSqlFile -Force
} catch {
    Write-Host "❌ Error creando base de datos: $_" -ForegroundColor Red
    Write-Host "💡 Puedes crear la base de datos manualmente con:" -ForegroundColor Yellow
    Write-Host "   psql -U postgres -c `"CREATE DATABASE ekonsumo;`""
}

# CONFIGURACIÓN DE DIRECTORIOS DEL PROYECTO
# ==============================================

Write-Host "`n=== CONFIGURANDO DIRECTORIOS DEL PROYECTO ===" -ForegroundColor Green

$projectDirectories = @(
    "$env:USERPROFILE\Proyects\DAW-Proyecto\Backend",
    "$env:USERPROFILE\Proyects\DAW-Proyecto\frontend", 
    "$env:USERPROFILE\Proyects\DAW-Proyecto\sql",
    "$env:USERPROFILE\Proyects\DAW-Proyecto\.vscode"
)

foreach ($dir in $projectDirectories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Directorio creado: $dir" -ForegroundColor Green
    }
}

# INSTALACIÓN DE HERRAMIENTAS NPM GLOBALES
# ==============================================

Write-Host "`n=== INSTALANDO HERRAMIENTAS NPM GLOBALES ===" -ForegroundColor Green

$globalNpmPackages = @(
    "npm-check-updates",
    "nodemon",
    "pm2"
)

foreach ($package in $globalNpmPackages) {
    Write-Host "Instalando: $package" -ForegroundColor Cyan
    npm install -g $package
}

# CONFIGURACIÓN DE ARCHIVOS DE PROYECTO
# ==============================================

Write-Host "`n=== CREANDO ARCHIVOS DE CONFIGURACIÓN ===" -ForegroundColor Green

# Archivo .env para backend
$backendEnvContent = @"
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ekonsumo
DB_USER=ekonsumo_user
DB_PASSWORD=1234
JWT_SECRET=mi_clave_secreta_desarrollo_123
CORS_ORIGIN=http://localhost:8080
UPLOAD_DIR=$env:USERPROFILE\Proyects\DAW-Proyecto\Backend\uploads
LOG_LEVEL=debug
"@

$backendEnvContent | Out-File -FilePath "$env:USERPROFILE\Proyects\DAW-Proyecto\Backend\.env" -Encoding UTF8
Write-Host "✅ Archivo .env creado para backend" -ForegroundColor Green

# Archivo de configuración VS Code
$vscodeSettings = @"
{
    "files.autoSave": "afterDelay",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "eslint.validate": [
        "javascript",
        "typescript",
        "vue"
    ],
    "vetur.validation.template": true,
    "vetur.format.enable": true
}
"@

$vscodeSettings | Out-File -FilePath "$env:USERPROFILE\Proyects\DAW-Proyecto\.vscode\settings.json" -Encoding UTF8
Write-Host "✅ Configuración VS Code creada" -ForegroundColor Green

# Configuración de launch.json para debugging
$launchConfig = @"
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug Backend",
            "type": "node",
            "request": "launch",
            "program": "`${workspaceFolder}/Backend/index.js",
            "envFile": "`${workspaceFolder}/Backend/.env",
            "console": "integratedTerminal"
        },
        {
            "name": "Debug Frontend",
            "type": "chrome",
            "request": "launch",
            "url": "http://localhost:8080",
            "webRoot": "`${workspaceFolder}/frontend/src"
        }
    ]
}
"@

$launchConfig | Out-File -FilePath "$env:USERPROFILE\Proyects\DAW-Proyecto\.vscode\launch.json" -Encoding UTF8
Write-Host "✅ Configuración de debugging creada" -ForegroundColor Green

# SCRIPTS DE UTILIDAD PARA WINDOWS
# ==============================================

Write-Host "`n=== CREANDO SCRIPTS DE UTILIDAD ===" -ForegroundColor Green

# Script para ejecutar archivos SQL
$sqlRunnerScript = @"
@echo off
echo === EJECUTANDO ARCHIVOS SQL ===

set PROJECT_DIR=%USERPROFILE%\Proyects\DAW-Proyecto
set SQL_DIR=%PROJECT_DIR%\scripts

echo Buscando archivos SQL...

if exist "%SQL_DIR%\crearBaseDatos.sql" (
    echo Ejecutando crearBaseDatos.sql...
    psql -U ekonsumo_user -d ekonsumo -f "%SQL_DIR%\crearBaseDatos.sql"
) else (
    echo No se encontró crearBaseDatos.sql
)

if exist "%SQL_DIR%\datosPrueba.sql" (
    echo Ejecutando datosPrueba.sql...
    psql -U ekonsumo_user -d ekonsumo -f "%SQL_DIR%\datosPrueba.sql"
) else (
    echo No se encontró datosPrueba.sql
)

echo.
echo Verificando tablas creadas...
psql -U ekonsumo_user -d ekonsumo -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"

pause
"@

$sqlRunnerScript | Out-File -FilePath "$env:USERPROFILE\Proyects\DAW-Proyecto\scripts\ejecutar-sql.bat" -Encoding ASCII

# Script para iniciar el entorno de desarrollo
$startDevScript = @"
@echo off
echo === INICIANDO ENTORNO DE DESARROLLO EKONSUMO ===
echo.

echo 1. Iniciando PostgreSQL...
net start postgresql-x64-16

echo.
echo 2. Abriendo VS Code...
code "%USERPROFILE%\Proyects\DAW-Proyecto"

echo.
echo 3. Instrucciones:
echo    - Backend: Abrir terminal en Backend y ejecutar: npm run dev
echo    - Frontend: Abrir terminal en frontend y ejecutar: npm run serve
echo    - Backend: http://localhost:3000
echo    - Frontend: http://localhost:8080
echo.

echo Presiona cualquier tecla para abrir la carpeta del proyecto...
pause > nul
explorer "%USERPROFILE%\Proyects\DAW-Proyecto"
"@

$startDevScript | Out-File -FilePath "$env:USERPROFILE\Proyects\DAW-Proyecto\scripts\iniciar-desarrollo.bat" -Encoding ASCII

# Script para gestión de dependencias
$depsScript = @"
@echo off
echo === GESTION DE DEPENDENCIAS NPM ===
echo.

echo 1. Verificando dependencias obsoletas...
npx npm-check-updates

echo.
echo 2. Comandos utiles:
echo    - Actualizar todas: npx npm-check-updates -u && npm install
echo    - Actualizar una: npm update nombre-paquete
echo    - Ver vulnerabilidades: npm audit
echo    - Reparar: npm audit fix
echo.

echo 3. Limpiar cache y reinstalar:
echo    npm cache clean --force
echo    rm -rf node_modules package-lock.json
echo    npm install
echo.

pause
"@

$depsScript | Out-File -FilePath "$env:USERPROFILE\Proyects\DAW-Proyecto\scripts\gestionar-dependencias.bat" -Encoding ASCII

Write-Host "✅ Scripts de utilidad creados" -ForegroundColor Green

# VERIFICACIÓN FINAL
# ==============================================

Write-Host "`n=== VERIFICACIÓN FINAL ===" -ForegroundColor Green

Write-Host "1. Node.js: " -NoNewline
if (Test-CommandExists "node") {
    Write-Host "✅ $(node --version)" -ForegroundColor Green
} else {
    Write-Host "❌ No instalado" -ForegroundColor Red
}

Write-Host "2. npm: " -NoNewline
if (Test-CommandExists "npm") {
    Write-Host "✅ $(npm --version)" -ForegroundColor Green
} else {
    Write-Host "❌ No instalado" -ForegroundColor Red
}

Write-Host "3. Git: " -NoNewline
if (Test-CommandExists "git") {
    Write-Host "✅ $(git --version)" -ForegroundColor Green
} else {
    Write-Host "❌ No instalado" -ForegroundColor Red
}

Write-Host "4. PostgreSQL: " -NoNewline
if (Test-CommandExists "psql") {
    Write-Host "✅ Instalado" -ForegroundColor Green
} else {
    Write-Host "❌ No instalado" -ForegroundColor Red
}

Write-Host "5. VS Code: " -NoNewline
if (Test-CommandExists "code") {
    Write-Host "✅ Instalado" -ForegroundColor Green
} else {
    Write-Host "❌ No instalado" -ForegroundColor Red
}

# INSTRUCCIONES FINALES
# ==============================================

Write-Host "`n🎯 CONFIGURACIÓN COMPLETADA!" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan

Write-Host "`n📁 ESTRUCTURA DEL PROYECTO:" -ForegroundColor Yellow
Write-Host "   $env:USERPROFILE\Proyects\DAW-Proyecto\" -ForegroundColor White
Write-Host "   ├── Backend\" -ForegroundColor White
Write-Host "   ├── frontend\" -ForegroundColor White
Write-Host "   ├── sql\" -ForegroundColor White
Write-Host "   └── .vscode\" -ForegroundColor White

Write-Host "`n🚀 PARA COMENZAR:" -ForegroundColor Yellow
Write-Host "   1. Ejecuta: 'iniciar-desarrollo.bat'" -ForegroundColor White
Write-Host "   2. Coloca tus archivos SQL en la carpeta 'sql'" -ForegroundColor White
Write-Host "   3. Ejecuta: 'ejecutar-sql.bat' para crear tablas" -ForegroundColor White
Write-Host "   4. En VS Code:" -ForegroundColor White
Write-Host "      - Backend: cd Backend && npm run dev" -ForegroundColor White
Write-Host "      - Frontend: cd frontend && npm run serve" -ForegroundColor White

Write-Host "`n🌐 URLs DE DESARROLLO:" -ForegroundColor Yellow
Write-Host "   - Frontend: http://localhost:8080" -ForegroundColor White
Write-Host "   - Backend: http://localhost:3000" -ForegroundColor White
Write-Host "   - API Docs: http://localhost:3000/api-docs" -ForegroundColor White

Write-Host "`n🔧 HERRAMIENTAS DISPONIBLES:" -ForegroundColor Yellow
Write-Host "   - iniciar-desarrollo.bat: Inicia todo el entorno" -ForegroundColor White
Write-Host "   - ejecutar-sql.bat: Ejecuta archivos SQL" -ForegroundColor White
Write-Host "   - gestionar-dependencias.bat: Gestiona paquetes npm" -ForegroundColor White

Write-Host "`n📝 NOTAS IMPORTANTES:" -ForegroundColor Yellow
Write-Host "   - PostgreSQL puede requerir configuración manual de contraseña" -ForegroundColor White
Write-Host "   - Ejecuta los scripts .bat como Administrador si hay problemas" -ForegroundColor White
Write-Host "   - Las dependencias 'deprecated' son normales en desarrollo" -ForegroundColor White

Write-Host "`n¡Listo para desarrollar en Windows 11! 🎉" -ForegroundColor Green

# Abrir la carpeta del proyecto
$projectPath = "$env:USERPROFILE\Proyects\DAW-Proyecto"
Write-Host "`nAbriendo carpeta del proyecto: $projectPath" -ForegroundColor Cyan
Start-Process "explorer.exe" -ArgumentList $projectPath