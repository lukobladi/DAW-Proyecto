<#
.SYNOPSIS
  Sube código fuente a un VPS usando rsync/ssh (versión PowerShell del script Bash).
.USAGE
  .\subir_codigo_fuente.ps1 <usuario@host> [solo_codigo: SI/NO] [ruta_remota]
EXAMPLE
  .\subir_codigo_fuente.ps1 eneko@ekonsumo.duckdns.org NO /var/www/daw-proyecto
#>

param(
  [Parameter(Mandatory=$true)][string]$Remote,
  [string]$OnlyCode = "NO",
  [string]$RemoteDir = "/var/www/daw-proyecto"
)

set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Opcional: permitir que el usuario pase opciones SSH por la variable de entorno SSH_OPTS
$sshOpts = $env:SSH_OPTS
if ([string]::IsNullOrEmpty($sshOpts)) { $sshOpts = "" }

# Resolver ruta raíz (asume que el script está en scripts\)
$scriptPath = $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Path (Join-Path (Split-Path $scriptPath -Parent) '..') -Resolve

# Construir lista de exclusiones para rsync
$excludes = @(
  "--exclude=.git",
  "--exclude=.github",
  "--exclude=node_modules",
  "--exclude=dist",
  "--exclude=coverage",
  "--exclude=.env",
  "--exclude=.env.*",
  "--exclude=.DS_Store"
)

# Determinar comando remoto para rsync si hay opciones SSH
if (-not [string]::IsNullOrEmpty($sshOpts)) {
  $rsyncRsh = "ssh $sshOpts"
} else {
  $rsyncRsh = "ssh"
}

Write-Output "==> Verificando conectividad SSH"
try {
  $sshCmd = if ($sshOpts) { "$rsyncRsh $Remote echo `'SSH OK`'" } else { "ssh $Remote echo 'SSH OK'" }
  # Ejecutar ssh directamente para comprobar conexión
  $proc = Start-Process -FilePath "ssh" -ArgumentList @($sshOpts, $Remote, "echo 'SSH OK'") -NoNewWindow -Wait -PassThru -ErrorAction Stop
  if ($proc.ExitCode -ne 0) { throw "SSH exit code $($proc.ExitCode)" }
} catch {
  Write-Error "No se pudo autenticar por SSH con $Remote.`nSi usas clave no default, ejecuta con:`n  $env:SSH_OPTS='-i C:\Users\tu_usuario\.ssh\tu_clave' .\subir_codigo_fuente.ps1 $Remote $OnlyCode $RemoteDir"
  exit 1
}

if ($OnlyCode -eq "NO") {
  Write-Output "==> Creando directorios remotos"
  $mkdirCmd = "mkdir -p '$RemoteDir/backend' '$RemoteDir/frontend' '$RemoteDir/docs' '$RemoteDir/scripts'"
  & ssh $sshOpts $Remote $mkdirCmd
}

function Run-Rsync {
  param(
    [string]$Source,
    [string]$Target
  )
  $args = @("-az", "--delete") + $excludes + @("-e", $rsyncRsh, "$Source", "$Remote:$Target")
  # Ejecutar rsync
  $proc = Start-Process -FilePath "rsync" -ArgumentList $args -NoNewWindow -Wait -PassThru -ErrorAction Stop
  if ($proc.ExitCode -ne 0) { throw "rsync falló ($Source -> $Target) con código $($proc.ExitCode)" }
}

Write-Output "==> Sincronizando backend"
Run-Rsync -Source (Join-Path $RootDir "backend/") -Target "$RemoteDir/backend/"

Write-Output "==> Sincronizando frontend"
Run-Rsync -Source (Join-Path $RootDir "frontend/") -Target "$RemoteDir/frontend/"

if ($OnlyCode -eq "NO") {
  Write-Output "==> Sincronizando scripts y docs"
  Run-Rsync -Source (Join-Path $RootDir "scripts/") -Target "$RemoteDir/scripts/"
  Run-Rsync -Source (Join-Path $RootDir "docs/") -Target "$RemoteDir/docs/"

  Write-Output "==> Ajustando permisos basicos"
  $chmodCmd = "chmod +x '$RemoteDir/scripts/'*.sh || true"
  & ssh $sshOpts $Remote $chmodCmd
}

Write-Output ""
Write-Output "Codigo actualizado en: $RemoteDir"
