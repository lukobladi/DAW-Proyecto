:: filepath: c:\Users\Mc Lovin\Proyects\DAW-Proyecto\arrancar_daw.bat
@echo off
title DAW-Proyecto - Arrancar Backend y Frontend

:: Cambiar al directorio del backend
echo Iniciando el backend...
cd Backend
start cmd /k "npm install && npm start"

:: Cambiar al directorio del frontend
echo Iniciando el frontend...
cd ../frontend
start cmd /k "npm install && npm run serve"

:: Mensaje final
echo Backend y Frontend iniciados en ventanas separadas.
pause