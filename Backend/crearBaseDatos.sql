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

-- Eliminar tablas si existen
DROP TABLE IF EXISTS Detalle_Pedido CASCADE;
DROP TABLE IF EXISTS Pedido CASCADE;
DROP TABLE IF EXISTS Producto CASCADE;
DROP TABLE IF EXISTS Proveedor CASCADE;
DROP TABLE IF EXISTS Usuario_Proveedor CASCADE;
DROP TABLE IF EXISTS Pedido_Periodico CASCADE;
DROP TABLE IF EXISTS Pago CASCADE;
DROP TABLE IF EXISTS Notificacion CASCADE;
DROP TABLE IF EXISTS Usuario CASCADE;

-- Crear las tablas
CREATE TABLE Usuario (
    ID_Usuario SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) UNIQUE NOT NULL,
    Pass VARCHAR(100) NOT NULL,
    Movil VARCHAR(20),
    Rol VARCHAR(50) NOT NULL CHECK (Rol IN ('admin', 'usuario')),
    Activo BOOLEAN DEFAULT FALSE,
    Saldo DECIMAL(10, 2) DEFAULT 0
);

CREATE TABLE Proveedor (
    ID_Proveedor SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Contacto VARCHAR(100),
    Telefono VARCHAR(20),
    Movil VARCHAR(20),
    Correo VARCHAR(100),
    Metodo_Pago VARCHAR(100),
    Frecuencia_Pedido_Aproximada VARCHAR(50) CHECK (Frecuencia_Pedido_Aproximada IN ('semanal', 'mensual', 'bimestral', 'trimestral', 'semestral')),
    Envio_Movil BOOLEAN DEFAULT FALSE,
    Envio_Mail BOOLEAN DEFAULT TRUE
);

CREATE TABLE Producto (
    ID_Producto SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Precio DECIMAL(10, 2) NOT NULL,
    ID_Proveedor INT REFERENCES Proveedor(ID_Proveedor) ON DELETE CASCADE,
    Imagen VARCHAR(255) -- Urlk de kla imagen
);

CREATE TABLE Pedido (
    ID_Pedido SERIAL PRIMARY KEY,
    ID_Usuario_Encargado INT REFERENCES Usuario(ID_Usuario) ON DELETE CASCADE,
    ID_Proveedor INT REFERENCES Proveedor(ID_Proveedor) ON DELETE CASCADE,
    Fecha_Apertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Fecha_Cierre TIMESTAMP,
    Fecha_Entrega TIMESTAMP,
    Estado VARCHAR(50) NOT NULL CHECK (Estado IN ('pendiente', 'en proceso', 'entregado', 'repartido', 'cancelado'))
);

CREATE TABLE Detalle_Pedido (
    ID_Detalle SERIAL PRIMARY KEY,
    ID_Pedido INT REFERENCES Pedido(ID_Pedido) ON DELETE CASCADE,
    ID_Producto INT REFERENCES Producto(ID_Producto) ON DELETE CASCADE,
    Cantidad INT NOT NULL,
    Precio_Unitario DECIMAL(10, 2) NOT NULL,
    ID_Usuario_Comprador INT REFERENCES Usuario(ID_Usuario) ON DELETE CASCADE
);

CREATE TABLE Usuario_Proveedor (
    ID_Usuario INT REFERENCES Usuario(ID_Usuario) ON DELETE CASCADE,
    ID_Proveedor INT REFERENCES Proveedor(ID_Proveedor) ON DELETE CASCADE,
    PRIMARY KEY (ID_Usuario, ID_Proveedor)
);

CREATE TABLE Pedido_Periodico (
    ID_Pedido_Periodico SERIAL PRIMARY KEY,
    ID_Proveedor INT REFERENCES Proveedor(ID_Proveedor) ON DELETE CASCADE,
    Fecha_Inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Fecha_Fin TIMESTAMP,
    Activo BOOLEAN DEFAULT TRUE,
    Periodicidad INT,
    Dia_Apertura INT,
    Dia_Cierre INT,
    Dia_Entrega INT
);

CREATE TABLE Pago (
    ID_Pago SERIAL PRIMARY KEY,
    ID_Usuario_Deudor INT REFERENCES Usuario(ID_Usuario) ON DELETE CASCADE,
    ID_Usuario_Creditor INT REFERENCES Usuario(ID_Usuario) ON DELETE CASCADE,
    Monto DECIMAL(10, 2) NOT NULL,
    Fecha_Pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Estado VARCHAR(50) NOT NULL CHECK (Estado IN ('pendiente', 'completado'))
);

CREATE TABLE Notificacion (
    ID_Notificacion SERIAL PRIMARY KEY,
    ID_Usuario INT REFERENCES Usuario(ID_Usuario) ON DELETE CASCADE,
    Mensaje TEXT NOT NULL,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Leida BOOLEAN DEFAULT FALSE
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