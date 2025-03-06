# Preparación para el Desarrollo de la Aplicación Web de Consumo Local y Ecológico

## 1. Configuración del Entorno de Desarrollo

### Herramientas y Tecnologías
- **Back-End**:
  - **Node.js**: Para el entorno de ejecución de JavaScript.
  - **Express**: Para crear la API RESTful.
  - **PostgreSQL**: Para la base de datos.
  
- **Front-End**:
  - **Vue.js**: Para construir la interfaz de usuario.
  - **Bootstrap**: Para el diseño responsivo y componentes de UI.

### Instalación
- **Instalar Node.js**: Asegúrate de tener la última versión de Node.js instalada.
- **Configurar PostgreSQL**: Instala y configura PostgreSQL en tu máquina local o en un servidor.
- **Crear Repositorio**: Configura un repositorio en GitHub o GitLab para el control de versiones.

## 2. Estructura del Proyecto

- **Organización de Carpetas**:
  - `/backend`: Contendrá el código del servidor y la API.
  - `/frontend`: Contendrá el código del cliente y la interfaz de usuario.
  - `/docs`: Documentación del proyecto.
  
- **Archivos Iniciales**:
  - `package.json`: Para gestionar dependencias de Node.js.
  - `README.md`: Para la documentación del proyecto.
  - `.gitignore`: Para excluir archivos y carpetas innecesarias del control de versiones.

## 4. Definición de Modelos de Datos

- **Identificar Entidades**:
  - **Usuario**: ID, nombre, correo electrónico, contraseña, rol (usuario/admin).
  - **Producto**: ID, nombre, descripción, precio, stock.
  - **Pedido**: ID, usuarioID, lista de productos, total, estado, fecha.

- **Crear Diagramas ER**: Utiliza herramientas como Lucidchart o Draw.io para crear diagramas de entidad-relación que representen las relaciones entre las entidades.

## 5. Planificación de la API

- **Definir Endpoints**:
  - **Usuarios**:
    - `POST /api/usuarios`: Crear un nuevo usuario.
    - `GET /api/usuarios`: Obtener todos los usuarios.
    - `GET /api/usuarios/:id`: Obtener un usuario específico.
    - `PUT /api/usuarios/:id`: Actualizar un usuario.
    - `DELETE /api/usuarios/:id`: Eliminar un usuario.
  
  - **Productos**:
    - `POST /api/productos`: Crear un nuevo producto.
    - `GET /api/productos`: Obtener todos los productos.
    - `GET /api/productos/:id`: Obtener un producto específico.
    - `PUT /api/productos/:id`: Actualizar un producto.
    - `DELETE /api/productos/:id`: Eliminar un producto.
  
  - **Pedidos**:
    - `POST /api/pedidos`: Crear un nuevo pedido.
    - `GET /api/pedidos`: Obtener todos los pedidos.
    - `GET /api/pedidos/:id`: Obtener un pedido específico.

## 6. Planificación del Desarrollo

- **Dividir el Trabajo**: Asigna tareas específicas a los miembros del equipo (si aplica).
- **Establecer Cronograma**: Define un cronograma con hitos y plazos para cada fase del desarrollo.
- **Revisiones de Código**: Planifica revisiones de código regulares para asegurar la calidad del código.

## 7. Documentación

- **Documentar la API**: Utiliza herramientas como Swagger o Postman para documentar los endpoints de la API.
- **Guía de Usuario**: Prepara una guía de usuario que explique cómo utilizar la aplicación.

## 8. Preparación para Pruebas

- **Definir Estrategia de Pruebas**: Planifica pruebas unitarias, de integración y de usabilidad.
- **Herramientas de Pruebas**: Selecciona herramientas para pruebas (por ejemplo, Jest para pruebas unitarias en JavaScript).

## 9. Despliegue

- **Seleccionar Servicio de Hosting**: Clouding.io.
- **Configurar Entorno de


Aquí tienes las instrucciones en formato **Markdown** para configurar y comenzar el desarrollo de tu proyecto en **Windows 11** y **Ubuntu**.

---

# Instrucciones para Configurar el Entorno de Desarrollo

## **Para Windows 11**

### 1. Instalar Visual Studio Code
1. Descarga Visual Studio Code desde [Visual Studio Code]([https://git-scm.com/](https://code.visualstudio.com/)).
2. Sigue las instrucciones del instalador.
3. Instalar extensiones:

### 2. Instalar Node.js
1. Descarga Node.js desde [nodejs.org](https://nodejs.org/).
2. Asegúrate de instalar la versión LTS (Long Term Support).
3. Verifica la instalación:
   ```en el propio terminal de Visual Studio Code
   node -v
   npm -v
   ```
### 3. Habilitar la ejecución de scripts
1. Abre PowerShell como administrador
2. Ejecutar: Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

### 4. Instalar PostgreSQL
1. Descarga PostgreSQL desde [postgresql.org](https://www.postgresql.org/download/windows/).
2. Sigue las instrucciones del instalador.
3. Configura una base de datos y un usuario para tu proyecto.

### 5. Clonar el Repositorio
1. Abre una terminal (CMD, PowerShell, o Git Bash).
2. Navega a la carpeta donde quieres clonar el repositorio.
3. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
   ```

---

## **Para Ubuntu**

### 1. Instalar Git
1. Abre una terminal.
2. Instala Git:
   ```bash
   sudo apt update
   sudo apt install git
   ```
3. Configura tu nombre y correo electrónico en Git:
   ```bash
   git config --global user.name "Tu Nombre"
   git config --global user.email "tu@email.com"
   ```

### 2. Instalar Node.js
1. Instala Node.js usando `nvm` (Node Version Manager):
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
   source ~/.bashrc
   nvm install --lts
   ```
2. Verifica la instalación:
   ```bash
   node -v
   npm -v
   ```

### 3. Instalar Visual Studio Code
1. Descarga Visual Studio Code desde [code.visualstudio.com](https://code.visualstudio.com/).
2. Instala el paquete `.deb`:
   ```bash
   sudo apt install ./<nombre-del-paquete>.deb
   ```
3. Instala las extensiones recomendadas para desarrollo en Node.js, Vue.js, y PostgreSQL.

### 4. Instalar PostgreSQL
1. Instala PostgreSQL:
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```
2. Configura una base de datos y un usuario para tu proyecto:
   ```bash
   sudo -u postgres psql
   CREATE DATABASE ekonsumo;
   CREATE USER tu_usuario WITH PASSWORD 'tu_contraseña';
   GRANT ALL PRIVILEGES ON DATABASE ekonsumo TO tu_usuario;
   ```

### 5. Clonar el Repositorio
1. Navega a la carpeta donde quieres clonar el repositorio.
2. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
   ```

---

# Configuración del Proyecto

### 1. Instalar Dependencias
1. Navega a la carpeta del proyecto:
   ```bash
   cd tu-repositorio
   ```
2. Instala las dependencias de Node.js:
   ```bash
   npm install
   ```
3. Crear proyecto:
   ```
   npm init -y.
   ```

5. Instala Express:
   ```
   npm install express.
   ```

6. Crea un archivo index.js con un ejemplo básico:
```
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hola, mundo!');
});

app.listen(port, () => {
  console.log(`API corriendo en http://localhost:${port}`);
});
```

7. Ejecuta:
   En VS Code: F5
   

8. Prueba:
   En navegador web: http://localhost:3000/

### 2. Configurar la Base de Datos
1. Crea un archivo `.env` en la raíz del proyecto con las credenciales de la base de datos:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=ekonsumo
   ```

### 3. Ejecutar Migraciones
1. Si estás utilizando un ORM como Sequelize, ejecuta las migraciones para crear las tablas en la base de datos:
   ```bash
   npx sequelize-cli db:migrate
   ```

### 4. Iniciar el Servidor
1. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```
2. Verifica que el servidor esté corriendo en `http://localhost:3000`.

---

# Desarrollo del Proyecto

### 1. Front-End (Vue.js)
- Crea los componentes necesarios para las pantallas de registro, inicio de sesión, gestión de productos
