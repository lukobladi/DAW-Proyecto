#!/bin/bash
echo "=== RESETEANDO BASE DE DATOS EKONSUMO ==="

# Detener servicios que usan la BD
sudo systemctl stop postgresql 2>/dev/null || true
sudo systemctl start postgresql

# Recrear base de datos
sudo -u postgres psql -c "DROP DATABASE IF EXISTS ekonsumo;"
sudo -u postgres psql -c "CREATE DATABASE ekonsumo;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ekonsumo TO ekonsumo_user;"

# Ejecutar scripts SQL
if [ -f "" ]; then
    echo "Ejecutando CrearTablas.sql..."
    sudo -u postgres psql -d ekonsumo -f ""
fi

if [ -f "" ]; then
    echo "Ejecutando InsertarDatosDePrueba.sql..."
    sudo -u postgres psql -d ekonsumo -f ""
fi

echo "Base de datos reseteda correctamente"
