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
DROP TABLE IF EXISTS usuario_proveedor CASCADE;
DROP TABLE IF EXISTS Pedido_Periodico CASCADE;
DROP TABLE IF EXISTS Pago CASCADE;
DROP TABLE IF EXISTS Notificacion CASCADE;
DROP TABLE IF EXISTS Usuario CASCADE;

-- Crear las tablas
CREATE TABLE Usuario (
    id_usuario SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) UNIQUE NOT NULL,
    Pass VARCHAR(100) NOT NULL,
    Movil VARCHAR(20),
    Rol VARCHAR(50) NOT NULL CHECK (Rol IN ('admin', 'usuario')),
    Activo BOOLEAN DEFAULT FALSE,
    Saldo DECIMAL(10, 2) DEFAULT 0,
    Familia INTEGER,
    Fecha_Modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Proveedor (
    id_proveedor SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Contacto VARCHAR(100),
    Telefono VARCHAR(20),
    Movil VARCHAR(20),
    Correo VARCHAR(100),
    Metodo_Pago VARCHAR(100),
    Frecuencia_Pedido_Aproximada VARCHAR(50) CHECK (Frecuencia_Pedido_Aproximada IN ('semanal', 'mensual', 'bimestral', 'trimestral', 'semestral', 'anual', 'sin determinar')),
    Envio_Movil BOOLEAN DEFAULT FALSE,
    Envio_Mail BOOLEAN DEFAULT TRUE,
    Familia INTEGER,
    Activo BOOLEAN DEFAULT TRUE,
    Fecha_Modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Producto (
    ID_Producto SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Precio DECIMAL(10, 2) NOT NULL,
    id_proveedor INT REFERENCES Proveedor(id_proveedor) ON DELETE CASCADE,
    Fecha_Modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Activo BOOLEAN DEFAULT TRUE,
    Imagen VARCHAR(255) -- URL de la imagen
);

CREATE TABLE Pedido (
    ID_Pedido SERIAL PRIMARY KEY,
    id_usuario_Encargado INT REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    id_proveedor INT REFERENCES Proveedor(id_proveedor) ON DELETE CASCADE,
    Fecha_Modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    id_usuario_Comprador INT REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    Fecha_Modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuario_proveedor (
    id_usuario INT REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    id_proveedor INT REFERENCES Proveedor(id_proveedor) ON DELETE CASCADE,
    PRIMARY KEY (id_usuario, id_proveedor)
);

CREATE TABLE Pedido_Periodico (
    ID_Pedido_Periodico SERIAL PRIMARY KEY,
    id_proveedor INT REFERENCES Proveedor(id_proveedor) ON DELETE CASCADE,
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
    id_usuario_Deudor INT REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    id_usuario_Creditor INT REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    Monto DECIMAL(10, 2) NOT NULL,
    Fecha_Pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Estado VARCHAR(50) NOT NULL CHECK (Estado IN ('pendiente', 'completado')),
    Periodo DATE,
    Origen VARCHAR(50) NOT NULL DEFAULT 'manual',
    Concepto TEXT,
    Deudor_Reporta_Pagado BOOLEAN NOT NULL DEFAULT FALSE,
    Fecha_Reporte_Deudor TIMESTAMP,
    Fecha_Confirmacion_Receptor TIMESTAMP,
    Fecha_Modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pago_unico_periodo_origen UNIQUE (id_usuario_Deudor, id_usuario_Creditor, Periodo, Origen)
);

CREATE TABLE Notificacion (
    ID_Notificacion SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    Mensaje TEXT NOT NULL,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Leida BOOLEAN DEFAULT FALSE
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
