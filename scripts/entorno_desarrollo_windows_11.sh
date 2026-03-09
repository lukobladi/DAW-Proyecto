<#
Instalador entorno dev Windows (PowerShell)
- Requisitos: Ejecutar como Administrador
- Variables opcionales (antes de ejecutar):
  $env:DEV_USER, $env:APP_DIR, $env:PORT, $env:DB_PASSWORD, $env:JWT_SECRET
#>

# Comprobar ejecución como administrador
If (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
  Write-Error "Ejecuta este script como Administrador."
  exit 1
}

# Variables por defecto
$DEV_USER = $env:DEV_USER
if ([string]::IsNullOrEmpty($DEV_USER)) { $DEV_USER = $env:USERNAME }
$APP_DIR_NAME = if ($env:APP_DIR) { $env:APP_DIR } else { "daw-proyecto" }
$PORT = if ($env:PORT) { $env:PORT } else { "3000" }
$DB_NAME = if ($env:DB_NAME) { $env:DB_NAME } else { "ekonsumo" }
$DB_USER = if ($env:DB_USER) { $env:DB_USER } else { "ekonsumo_user" }
$DB_PASSWORD = $env:DB_PASSWORD
$JWT_SECRET = $env:JWT_SECRET

if ([string]::IsNullOrEmpty($DB_PASSWORD) -or [string]::IsNullOrEmpty($JWT_SECRET)) {
  Write-Error "ERROR: Define DB_PASSWORD y JWT_SECRET en variables de entorno antes de ejecutar."
  exit 1
}

$USERPROFILE = [Environment]::GetFolderPath("UserProfile")
$PROJECTS_DIR = if ($env:PROJECTS_DIR) { $env:PROJECTS_DIR } else { Join-Path $USERPROFILE "projects" }
$APP_DIR = Join-Path $PROJECTS_DIR $APP_DIR_NAME
$BACKEND_DIR = Join-Path $APP_DIR "backend"
$FRONTEND_DIR = Join-Path $APP_DIR "frontend"

function Install-Choco {
  if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Output "==> Instalando Chocolatey"
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
  } else {
    Write-Output "Chocolatey ya instalado."
  }
}

function Choco-InstallIfMissing($pkg) {
  if (-not (choco list --localonly | Select-String "^$pkg ")) {
    choco install $pkg -y --no-progress
  } else {
    Write-Output "$pkg ya instalado."
  }
}

Write-Output "==> Instalar/actualizar herramientas via Chocolatey"
Install-Choco

# Actualizar choco y paquetes básicos
choco feature enable -n=allowGlobalConfirmation | Out-Null
choco upgrade chocolatey -y --no-progress

# Instalar herramientas esenciales
Choco-InstallIfMissing "git"
Choco-InstallIfMissing "nodejs-lts"   # Node 22 LTS package name on choco is nodejs-lts
Choco-InstallIfMissing "postgresql"   # instala y crea servicio; puede pedir reinicio
Choco-InstallIfMissing "vscode"
Choco-InstallIfMissing "wget"

# Asegurar que node/npm están en PATH en la sesión actual
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine")

Write-Output "==> Instalando PM2 global (opcional)"
try {
  npm install -g pm2 --no-progress
} catch {
  Write-Warning "No se pudo instalar pm2 global. Comprueba npm/Node."
}

Write-Output "==> Creando estructura de proyectos en $APP_DIR"
New-Item -ItemType Directory -Force -Path $BACKEND_DIR, $FRONTEND_DIR | Out-Null

# Configurar PostgreSQL: inicialmente Windows installer crea usuario postgres con contraseña vacía; usar createuser/db con psql
Write-Output "==> Configurando PostgreSQL (creando rol y base de datos)"
$psqlPath = (Get-ChildItem 'C:\Program Files\PostgreSQL' -Directory -ErrorAction SilentlyContinue | Sort-Object Name -Descending | Select-Object -First 1 | ForEach-Object { Join-Path $_.FullName 'bin\psql.exe' })
if (-not $psqlPath) {
  Write-Warning "No se encontró psql.exe automáticamente. Asegúrate de que PostgreSQL se instaló y añade a PATH."
} else {
  # Ejecutar comandos psql como usuario postgres; en Windows, el servicio corre bajo cuenta local; usaremos psql con trust (si no requiere contraseña)
  & "$psqlPath" -U postgres -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DB_USER') THEN CREATE ROLE $DB_USER LOGIN PASSWORD '$DB_PASSWORD'; ELSE ALTER ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD'; END IF; END\$\$;" 2>$null
  & "$psqlPath" -U postgres -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME') THEN CREATE DATABASE $DB_NAME OWNER $DB_USER; END IF; END\$\$;" 2>$null
}

Write-Output "==> Creando package.json si no existen"
if (-not (Test-Path (Join-Path $BACKEND_DIR "package.json"))) {
  npm init -y --prefix $BACKEND_DIR | Out-Null
}
if (-not (Test-Path (Join-Path $FRONTEND_DIR "package.json"))) {
  npm init -y --prefix $FRONTEND_DIR | Out-Null
}

Write-Output "==> Creando backend\.env"
$envPath = Join-Path $BACKEND_DIR ".env"
$envContent = @"
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
"@
$envContent | Out-File -Encoding utf8 -FilePath $envPath -Force

Write-Output "==> Añadiendo scripts npm útiles al backend"
# npm pkg set not siempre funciona en Windows; actualizar package.json manualmente si es necesario
$pkgJsonPath = Join-Path $BACKEND_DIR "package.json"
$pkg = Get-Content $pkgJsonPath | Out-String | ConvertFrom-Json
if (-not $pkg.scripts.start) { $pkg.scripts.start = "node index.js" }
$pkg.scripts.dev = "nodemon index.js"
$pkg | ConvertTo-Json -Depth 10 | Out-File -Encoding utf8 $pkgJsonPath

Write-Output "==> Creando index.js de ejemplo en backend"
$indexJsPath = Join-Path $BACKEND_DIR "index.js"
if (-not (Test-Path $indexJsPath)) {
  @"
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.get('/api/health', (req, res) => res.json({status: 'ok'}));
app.listen(port, () => console.log(`Backend listening on ${port}`));
"@ | Out-File -Encoding utf8 $indexJsPath
}

Write-Output "==> Creando frontend sencillo (index.html + src/main.js)"
$frontendSrc = Join-Path $FRONTEND_DIR "src"
New-Item -ItemType Directory -Force -Path $frontendSrc | Out-Null
$mainJs = Join-Path $frontendSrc "main.js"
if (-not (Test-Path $mainJs)) {
  @"
import { createApp } from 'vue';
const App = { template: '<div><h1>Frontend</h1><p>API: <a href=\"/api/health\">/api/health</a></p></div>' };
createApp(App).mount('#app');
"@ | Out-File -Encoding utf8 $mainJs
}
$indexHtml = Join-Path $FRONTEND_DIR "index.html"
if (-not (Test-Path $indexHtml)) {
  @"
<!doctype html>
<html>
  <head><meta charset='utf-8'><title>Frontend</title></head>
  <body><div id='app'></div><script type='module' src='/src/main.js'></script></body>
</html>
"@ | Out-File -Encoding utf8 $indexHtml
}

Write-Output "==> Instalando dependencias de ejemplo"
npm install express --prefix $BACKEND_DIR | Out-Null
npm install vue --prefix $FRONTEND_DIR | Out-Null

Write-Output "==> Resultado y siguientes pasos"
Write-Output "Estructura creada en: $APP_DIR"
Write-Output "Backend .env: $envPath"
Write-Output "Para ejecutar (como usuario normal):"
Write-Output "  cd $BACKEND_DIR"
Write-Output "  npm run dev   # requiere nodemon si quieres reinicio automático (npm i -g nodemon)"
Write-Output "  o: pm2 start index.js --name dev-backend --watch --cwd $BACKEND_DIR"
Write-Output "Frontend simple: sirve $FRONTEND_DIR con 'npx serve -s . -l 8080' o configura Vue CLI."
