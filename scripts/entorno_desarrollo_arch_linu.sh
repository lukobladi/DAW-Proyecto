#!/bin/bash
# CONFIGURACIÓN MEJORADA PARA ARCH LINUX + VISUAL STUDIO CODE OSS
# ==============================================

echo "=== ACTUALIZANDO SISTEMA ARCH LINUX ==="
sudo pacman -Syu --noconfirm

# INSTALACIÓN Y CONFIGURACIÓN DEL BACKEND (Node.js + Express + PostgreSQL)
# ==============================================

echo "=== INSTALANDO NODE.JS Y NPM ==="
sudo pacman -S --noconfirm nodejs npm

echo "=== INSTALANDO POSTGRESQL ==="
sudo pacman -S --noconfirm postgresql

echo "=== CONFIGURANDO POSTGRESQL ==="
sudo -u postgres initdb -D /var/lib/postgres/data
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Esperar a que PostgreSQL esté listo
sleep 5

echo "=== CREANDO BASE DE DATOS Y USUARIO ==="
sudo -u postgres psql -c "CREATE DATABASE ekonsumo;"
sudo -u postgres psql -c "CREATE USER ekonsumo_user WITH PASSWORD '1234';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ekonsumo TO ekonsumo_user;"
sudo -u postgres psql -c "ALTER DATABASE ekonsumo OWNER TO ekonsumo_user;"

echo "=== INSTALANDO HERRAMIENTAS DE DESARROLLO ==="
sudo pacman -S --noconfirm git base-devel

# Instalar herramientas npm de forma más robusta
echo "=== INSTALANDO HERRAMIENTAS NPM GLOBALES ==="
sudo npm install -g npm@latest
npm install -g pm2 nodemon npm-check-updates

# Configuración específica para desarrollo en VS Code
echo "=== CONFIGURANDO ENTORNO DE DESARROLLO ==="
BACKEND_DIR="$HOME/Proyects/DAW-Proyecto/Backend"
FRONTEND_DIR="$HOME/Proyects/DAW-Proyecto/frontend"
SQL_DIR="$HOME/Proyects/DAW-Proyecto/sql"

# Crear directorios si no existen
mkdir -p $BACKEND_DIR
mkdir -p $FRONTEND_DIR
mkdir -p $SQL_DIR

pacman -S nvm
nvm install 19     
nvm use 19

# ==============================================
# EJECUCIÓN DE ARCHIVOS SQL
# ==============================================

echo "=== BUSCANDO Y EJECUTANDO ARCHIVOS SQL ==="

# Buscar archivos SQL en el proyecto
CREAR_TABLAS_SQL=$(find $HOME/Proyects/DAW-Proyecto/Backend/ -name "crearBaseDatos.sql" -o -name "crear_tablas.sql" -o -name "tablas.sql" | head -1)
INSERTAR_DATOS_SQL=$(find $HOME/Proyects/DAW-Proyecto/Backend/ -name "datosPrueba.sql" -o -name "insertar_datos.sql" -o -name "datos_prueba.sql" | head -1)

# Función para ejecutar archivos SQL
ejecutar_sql() {
    local archivo_sql=$1
    local descripcion=$2
    
    if [ -f "$archivo_sql" ]; then
        echo "=== EJECUTANDO: $descripción ==="
        echo "Archivo: $archivo_sql"
        
        # Copiar archivo a ubicación accesible para postgres
        TEMP_SQL="/tmp/$(basename $archivo_sql)"
        cp "$archivo_sql" "$TEMP_SQL"
        sudo chown postgres:postgres "$TEMP_SQL"
        
        # Ejecutar como usuario postgres
        if sudo -u postgres psql -d ekonsumo -f "$TEMP_SQL"; then
            echo "✅ $descripción ejecutado correctamente"
        else
            echo "❌ Error ejecutando $descripción"
            return 1
        fi
        
        # Limpiar archivo temporal
        rm -f "$TEMP_SQL"
    else
        echo "⚠️  No se encontró: $descripción"
        echo "Buscando en: $archivo_sql"
        
        # Mostrar archivos SQL disponibles
        echo "Archivos SQL disponibles:"
        find $HOME/Proyects/DAW-Proyecto -name "*.sql" -type f | while read sql_file; do
            echo "  - $sql_file"
        done
    fi
}

# Ejecutar archivos SQL
ejecutar_sql "$CREAR_TABLAS_SQL" "CrearTablas.sql"
ejecutar_sql "$INSERTAR_DATOS_SQL" "InsertarDatosDePrueba.sql"

# Verificar tablas creadas
echo "=== VERIFICANDO TABLAS EN LA BASE DE DATOS ==="
sudo -u postgres psql -d ekonsumo -c "
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
"

# ==============================================
# CONFIGURACIÓN DEL BACKEND
# ==============================================

echo "=== CONFIGURANDO BACKEND PARA DESARROLLO ==="
cd $BACKEND_DIR

# Si existe package.json, instalar dependencias de forma más robusta
if [ -f "package.json" ]; then
    echo "=== ACTUALIZANDO DEPENDENCIAS OBSOLETAS ==="
    
    # Verificar dependencias obsoletas
    echo "🔍 Revisando dependencias obsoletas..."
    npx npm-check-updates
    
    # Opcional: Actualizar automáticamente (descomenta si quieres)
    # npx npm-check-updates -u
    # npm install
    
    # Instalar dependencias limpiando cache
    npm cache clean --force
    npm install --legacy-peer-deps
    
    # Verificar vulnerabilidades
    echo "🔒 Revisando vulnerabilidades de seguridad..."
    npm audit --audit-level moderate
    
    echo "=== CREANDO ARCHIVO .env PARA DESARROLLO ==="
    cat > $BACKEND_DIR/.env <<EOL
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ekonsumo
DB_USER=ekonsumo_user
DB_PASSWORD=1234
JWT_SECRET=mi_clave_secreta_desarrollo_123
CORS_ORIGIN=http://localhost:8080
UPLOAD_DIR=$BACKEND_DIR/uploads
LOG_LEVEL=debug
EOL

    echo "=== INICIANDO BACKEND EN MODO DESARROLLO ==="
    echo "Para iniciar el backend en desarrollo:"
    echo "cd $BACKEND_DIR && npm run dev"
    
else
    echo "⚠️  No se encontró package.json en $BACKEND_DIR"
    echo "Creando estructura básica del backend..."
    
    # Crear package.json básico si no existe
    cat > $BACKEND_DIR/package.json <<EOL
{
  "name": "ekonsumo-backend",
  "version": "1.0.0",
  "description": "Backend para DAW Proyecto",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js",
    "test": "jest",
    "db:reset": "psql -U ekonsumo_user -d ekonsumo -f sql/reset_database.sql"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "pg": "^8.11.0",
    "dotenv": "^16.3.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
EOL

    npm install vue@latest vue-router@latest vuex@latest axios@latest bootstrap@latest bootstrap-vue-3@latest @popperjs/core@latest --save
    npm install @babel/core@latest @babel/eslint-parser@latest @vue/cli-plugin-babel@latest @vue/cli-plugin-eslint@latest @vue/cli-service@latest eslint@latest eslint-plugin-vue@latest vue-eslint-parser@latest --save-dev

    cd $BACKEND_DIR && npm install
fi

# ==============================================
# CONFIGURACIÓN DEL FRONTEND
# ==============================================

echo "=== CONFIGURANDO FRONTEND PARA DESARROLLO ==="
cd $FRONTEND_DIR

if [ -f "package.json" ]; then
    echo "=== INSTALANDO DEPENDENCIAS DEL FRONTEND ==="
    npm cache clean --force
    npm install --legacy-peer-deps
    
    echo "=== CREANDO ARCHIVO .env PARA FRONTEND ==="
    cat > $FRONTEND_DIR/.env.development <<EOL
NODE_ENV=development
VUE_APP_API_URL=http://localhost:3000/api
VUE_APP_TITLE=Ekonsumo - Desarrollo
VUE_APP_VERSION=1.0.0-dev
EOL

else
    echo "⚠️  No se encontró package.json en $FRONTEND_DIR"
fi

# ==============================================
# SCRIPTS ADICIONALES DE UTILIDAD
# ==============================================

echo "=== CREANDO SCRIPTS DE ADMINISTRACIÓN ==="

# Script para resetear la base de datos
cat > $SQL_DIR/reset_database.sh <<EOL
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
if [ -f "$CREAR_TABLAS_SQL" ]; then
    echo "Ejecutando CrearTablas.sql..."
    sudo -u postgres psql -d ekonsumo -f "$CREAR_TABLAS_SQL"
fi

if [ -f "$INSERTAR_DATOS_SQL" ]; then
    echo "Ejecutando InsertarDatosDePrueba.sql..."
    sudo -u postgres psql -d ekonsumo -f "$INSERTAR_DATOS_SQL"
fi

echo "✅ Base de datos reseteda correctamente"
EOL

chmod +x $SQL_DIR/reset_database.sh

# Script para gestión de dependencias
cat > $BACKEND_DIR/update-dependencies.sh <<EOL
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
EOL

chmod +x $BACKEND_DIR/update-dependencies.sh

# ==============================================
# VERIFICACIÓN FINAL
# ==============================================

echo "=== VERIFICACIÓN FINAL ==="

# Verificar servicios
echo "1. ✅ PostgreSQL status:"
sudo systemctl is-active postgresql

echo "2. ✅ Node.js version:"
node --version

echo "3. ✅ npm version:"
npm --version

echo "4. ✅ Base de datos:"
sudo -u postgres psql -d ekonsumo -c "
SELECT 
    COUNT(*) as tablas_creadas
FROM information_schema.tables 
WHERE table_schema = 'public';
"

echo "5. ✅ Estructura de proyecto:"
tree $HOME/Proyects/DAW-Proyecto -L 2 2>/dev/null || find $HOME/Proyects/DAW-Proyecto -type d | head -10

# ==============================================
# INSTRUCCIONES FINALES
# ==============================================

echo ""
echo "🎯 CONFIGURACIÓN COMPLETADA!"
echo ""
echo "📊 RESUMEN BASE DE DATOS:"
sudo -u postgres psql -d ekonsumo -c "
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as columnas
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;
"

echo ""
echo "🚀 PRÓXIMOS PASOS:"
echo "1. Iniciar backend: cd $BACKEND_DIR && npm run dev"
echo "2. Iniciar frontend: cd $FRONTEND_DIR && npm run serve"
echo "3. Acceder a la app: http://localhost:8080"
echo "4. API disponible en: http://localhost:3000/api"
echo ""
echo "🔧 HERRAMIENTAS DISPONIBLES:"
echo "   - Resetear BD: $SQL_DIR/reset_database.sh"
echo "   - Actualizar dependencias: $BACKEND_DIR/update-dependencies.sh"
echo ""
echo "📝 NOTAS:"
echo "   - Las advertencias 'deprecated' son normales en desarrollo"
echo "   - Usa 'npm audit fix' para vulnerabilidades críticas"
echo "   - Los archivos SQL se ejecutaron automáticamente"
echo ""
echo "¡Listo para desarrollar! 🎉"
