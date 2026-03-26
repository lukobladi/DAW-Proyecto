#!/usr/bin/env bash
set -euo pipefail

# Resetea la base de datos Ekonsumo
# Precaución: esto borra todos los datos

echo "=== RESETEANDO BASE DE DATOS EKONSUMO ==="

DB_NAME="${DB_NAME:-ekonsumo}"
DB_USER="${DB_USER:-ekonsumo_user}"

# Detener servicios que usan la BD
sudo systemctl stop postgresql 2>/dev/null || true
sudo systemctl start postgresql

# Recrear base de datos
sudo -u postgres psql -c "DROP DATABASE IF EXISTS $DB_NAME;"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Ejecutar scripts SQL
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/../datos/crearBaseDatos.sql" ]; then
    echo "Ejecutando crearBaseDatos.sql..."
    sudo -u postgres psql -d "$DB_NAME" -f "$SCRIPT_DIR/../datos/crearBaseDatos.sql"
else
    echo "AVISO: datos/crearBaseDatos.sql no encontrado, saltando..."
fi

if [ -f "$SCRIPT_DIR/../datos/datosPrueba.sql" ]; then
    echo "Ejecutando datosPrueba.sql..."
    sudo -u postgres psql -d "$DB_NAME" -f "$SCRIPT_DIR/../datos/datosPrueba.sql"
else
    echo "AVISO: datos/datosPrueba.sql no encontrado, saltando..."
fi

echo "Base de datos reseteada correctamente"
