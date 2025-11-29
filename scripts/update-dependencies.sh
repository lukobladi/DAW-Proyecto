#!/bin/bash
echo "=== ACTUALIZANDO DEPENDENCIAS ==="

# Limpiar cache
npm cache clean --force

# Verificar dependencias obsoletas
npx npm-check-updates

echo ""
echo "Para actualizar todas las dependencias:"
echo "npx npm-check-updates -u && npm install"
echo ""
echo "Para actualizar una dependencia específica:"
echo "npm update nombre-paquete"
echo ""
echo "Para revisar vulnerabilidades:"
echo "npm audit"
echo ""
echo "Para arreglar vulnerabilidades automáticamente:"
echo "npm audit fix"
