#!/bin/bash

# Reiniciar el servicio de PostgreSQL
echo "Reiniciando PostgreSQL..."
if sudo systemctl restart postgresql; then
    echo "PostgreSQL reiniciado con éxito."
else
    echo "Error al reiniciar PostgreSQL." >&2
    exit 1
fi

# Arrancar el backend
echo "Iniciando el backend..."
cd ~/VisualStudioCodeProject/DAW-Proyecto/Backend/ || { echo "No se pudo acceder al directorio del backend." >&2; exit 1; }
node index.js &  # Ejecutar el backend en segundo plano
BACKEND_PID=$!   # Guardar el PID del proceso del backend
echo "Backend iniciado con éxito con PID $BACKEND_PID."

# Esperar un momento para asegurarse de que el backend esté listo
sleep 5

# Arrancar el frontend
echo "Iniciando el frontend..."
cd ~/VisualStudioCodeProject/DAW-Proyecto/frontend/ || { echo "No se pudo acceder al directorio del frontend." >&2; exit 1; }
if npm run serve; then
    echo "Frontend iniciado con éxito."
else
    echo "Error al iniciar el frontend." >&2
    exit 1
fi

