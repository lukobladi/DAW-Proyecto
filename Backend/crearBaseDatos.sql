-- Crear el usuario para la base de datos (si no existe)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'ekonsumo_user') THEN
    CREATE USER ekonsumo_user WITH PASSWORD '1234';
  END IF;
END $$;

-- Crear la base de datos (si no existe)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ekonsumo') THEN
    CREATE DATABASE ekonsumo OWNER ekonsumo_user;
  END IF;
END $$;

-- Conectar a la base de datos
\c ekonsumo;

-- Crear la tabla Usuario
CREATE TABLE IF NOT EXISTS Usuario (
    ID_Usuario SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) UNIQUE NOT NULL,
    Contraseña VARCHAR(100) NOT NULL,
    Rol VARCHAR(50) NOT NULL
);

-- Crear la tabla Proveedor
CREATE TABLE IF NOT EXISTS Proveedor (
    ID_Proveedor SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Contacto VARCHAR(100),
    Telefono VARCHAR(20),
    Correo VARCHAR(100)
);

-- Crear la tabla Producto
CREATE TABLE IF NOT EXISTS Producto (
    ID_Producto SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Precio DECIMAL(10, 2) NOT NULL,
    ID_Proveedor INT REFERENCES Proveedor(ID_Proveedor) ON DELETE CASCADE
);

-- Crear la tabla Pedido
CREATE TABLE IF NOT EXISTS Pedido (
    ID_Pedido SERIAL PRIMARY KEY,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ID_Usuario INT REFERENCES Usuario(ID_Usuario) ON DELETE CASCADE,
    Estado VARCHAR(50) NOT NULL
);

-- Crear la tabla Detalle_Pedido
CREATE TABLE IF NOT EXISTS Detalle_Pedido (
    ID_Detalle SERIAL PRIMARY KEY,
    ID_Pedido INT REFERENCES Pedido(ID_Pedido) ON DELETE CASCADE,
    ID_Producto INT REFERENCES Producto(ID_Producto) ON DELETE CASCADE,
    Cantidad INT NOT NULL,
    Precio_Total DECIMAL(10, 2) NOT NULL
);

-- Conceder permisos al usuario ekonsumo_user
GRANT ALL PRIVILEGES ON DATABASE ekonsumo TO ekonsumo_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ekonsumo_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ekonsumo_user;

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE 'Base de datos y tablas creadas correctamente.';
END $$;