-- Uso recomendado:
-- psql -U postgres \
--   -v db_user='ekonsumo_user' \
--   -v db_password='cambia_esta_contrasena' \
--   -v db_name='ekonsumo' \
--   -f scripts/crearBaseDatos.sql

\if :{?db_user}
\else
\set db_user ekonsumo_user
\endif

\if :{?db_name}
\else
\set db_name ekonsumo
\endif

\if :{?db_password}
\else
\echo 'ERROR: debes pasar db_password con -v db_password=...'
\quit 1
\endif

-- Crear/actualizar usuario y base de datos sin usar DO para CREATE DATABASE.
SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'db_user', :'db_password')
WHERE NOT EXISTS (SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = :'db_user')\gexec

SELECT format('ALTER ROLE %I WITH LOGIN PASSWORD %L', :'db_user', :'db_password')\gexec

SELECT format('CREATE DATABASE %I OWNER %I', :'db_name', :'db_user')
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = :'db_name')\gexec

-- Conectar a la base de datos
\c :db_name

-- Eliminar tablas si existen
DROP TABLE IF EXISTS Detalle_Pedido CASCADE;
DROP TABLE IF EXISTS Pedido CASCADE;
DROP TABLE IF EXISTS Producto CASCADE;
DROP TABLE IF EXISTS Proveedor CASCADE;
DROP TABLE IF EXISTS familia_proveedor CASCADE;
DROP TABLE IF EXISTS Pedido_Periodico CASCADE;
DROP TABLE IF EXISTS Pago CASCADE;
DROP TABLE IF EXISTS Notificacion CASCADE;
DROP TABLE IF EXISTS Usuario CASCADE;

-- Crear las tablas
CREATE TABLE Usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    pass VARCHAR(100) NOT NULL,
    movil VARCHAR(20),
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('admin', 'usuario', 'gestor')),
    activo BOOLEAN DEFAULT FALSE,
    saldo DECIMAL(10, 2) DEFAULT 0,
    familia INTEGER,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Proveedor (
    id_proveedor SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    movil VARCHAR(20),
    correo VARCHAR(100),
    metodo_pago VARCHAR(100),
    frecuencia_pedido_aproximada VARCHAR(50) CHECK (frecuencia_pedido_aproximada IN ('semanal', 'mensual', 'bimestral', 'trimestral', 'semestral', 'anual', 'sin determinar')),
    envio_movil BOOLEAN DEFAULT FALSE,
    envio_mail BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Producto (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    id_proveedor INT REFERENCES Proveedor(id_proveedor) ON DELETE CASCADE,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    imagen VARCHAR(255) -- URL de la imagen
);

CREATE TABLE Pedido (
    id_pedido SERIAL PRIMARY KEY,
    id_usuario_encargado INT REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    id_proveedor INT REFERENCES Proveedor(id_proveedor) ON DELETE CASCADE,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_apertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_cierre TIMESTAMP,
    fecha_entrega TIMESTAMP,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('pendiente', 'en proceso', 'entregado', 'repartido', 'cancelado'))
);

CREATE TABLE Detalle_Pedido (
    id_detalle SERIAL PRIMARY KEY,
    id_pedido INT REFERENCES Pedido(id_pedido) ON DELETE CASCADE,
    id_producto INT REFERENCES Producto(id_producto) ON DELETE CASCADE,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    id_usuario_comprador INT REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE familia_proveedor (
    id_familia INTEGER NOT NULL,
    id_proveedor INT REFERENCES Proveedor(id_proveedor) ON DELETE CASCADE,
    PRIMARY KEY (id_familia, id_proveedor)
);

CREATE TABLE Pedido_Periodico (
    id_pedido_periodico SERIAL PRIMARY KEY,
    id_proveedor INT REFERENCES Proveedor(id_proveedor) ON DELETE CASCADE,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    periodicidad INT,
    dia_apertura INT,
    dia_cierre INT,
    dia_entrega INT
);

CREATE TABLE Pago (
    id_pago SERIAL PRIMARY KEY,
    id_usuario_deudor INT REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    id_usuario_creditor INT REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    monto DECIMAL(10, 2) NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) NOT NULL CHECK (estado IN ('pendiente', 'completado')),
    periodo DATE,
    origen VARCHAR(50) NOT NULL DEFAULT 'manual',
    concepto TEXT,
    deudor_reporta_pagado BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_reporte_deudor TIMESTAMP,
    fecha_confirmacion_receptor TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pago_unico_periodo_origen UNIQUE (id_usuario_deudor, id_usuario_creditor, periodo, origen)
);

CREATE TABLE Notificacion (
    id_notificacion SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    mensaje TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leida BOOLEAN DEFAULT FALSE
);

-- Conceder permisos al usuario de aplicacion
SELECT format('GRANT ALL PRIVILEGES ON DATABASE %I TO %I', :'db_name', :'db_user')\gexec
SELECT format('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO %I', :'db_user')\gexec
SELECT format('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO %I', :'db_user')\gexec
SELECT format(
  'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO %I',
  :'db_user'
)\gexec
SELECT format(
  'ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO %I',
  :'db_user'
)\gexec

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE 'Base de datos y tablas creadas correctamente.';
END $$;
