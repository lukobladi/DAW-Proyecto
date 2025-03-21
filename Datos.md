
### **Tablas Principales**

#### 1. **Usuario**
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Usuario`     | `SERIAL`          | Clave primaria.                      |
| `Nombre`         | `VARCHAR(100)`    | Nombre del usuario.                  |
| `Correo`         | `VARCHAR(100)`    | Correo electrónico (único).          |
| `Contraseña`     | `VARCHAR(100)`    | Contraseña del usuario.              |
| `Movil`          | `VARCHAR(20)`     | Teléfono móvil del usuario.          |
| `Rol`            | `VARCHAR(50)`     | Rol del usuario (admin, gestor, usuario). |
| `Activo`         | `BOOLEAN`         | Indica si el usuario está activo.    |
| `Saldo`          | `DECIMAL(10, 2)`  | Saldo actual del usuario.            |

---

#### 2. **Proveedor**
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Proveedor`   | `SERIAL`          | Clave primaria.                      |
| `Nombre`         | `VARCHAR(100)`    | Nombre del proveedor.                |
| `Contacto`       | `VARCHAR(100)`    | Nombre de la persona de contacto.    |
| `Telefono`       | `VARCHAR(20)`     | Teléfono del proveedor.              |
| `Movil`          | `VARCHAR(20)`     | Teléfono móvil del proveedor.        |
| `Correo`         | `VARCHAR(100)`    | Correo electrónico del proveedor.    |
| `Envio_Movil`    | `BOOLEAN`         | Avisar mediante SMS o WhatsApp.      |
| `Envio_Mail`     | `BOOLEAN`         | Avisar mediante correo electrónico.  |

---

#### 3. **Producto**
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Producto`    | `SERIAL`          | Clave primaria.                      |
| `Nombre`         | `VARCHAR(100)`    | Nombre del producto.                 |
| `Descripcion`    | `TEXT`            | Descripción del producto.            |
| `Precio`         | `DECIMAL(10, 2)`  | Precio del producto.                 |
| `Frecuencia_Pedido` | `VARCHAR(50)`  | Frecuencia de pedido (semanal, mensual, etc.). |
| `ID_Proveedor`   | `INT`             | Clave foránea (relación con `Proveedor`). |
| `ID_Usuario_Gestor`   | `INT`             | Clave foránea (relación con `Usuario`). |

---

#### 4. **Pedido**
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Pedido`      | `SERIAL`          | Clave primaria.                      |
| `ID_Usuario_Encargado` | `INT`     | Clave foránea (relación con `Usuario`). |
| `ID_Proveedor`   | `INT`             | Clave foránea (relación con `Proveedor`). |
| `Fecha_Apertura` | `TIMESTAMP`       | Fecha y hora de apertura del pedido. |
| `Fecha_Cierre`   | `TIMESTAMP`       | Fecha límite para modificar el pedido. |
| `Fecha_Entrega`  | `TIMESTAMP`       | Fecha y hora de entrega.             |
| `Estado`         | `VARCHAR(50)`     | Estado del pedido (pendiente, en proceso, entregado, repartido, cancelado). |

---

#### 5. **Detalle_Pedido**
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Detalle`     | `SERIAL`          | Clave primaria.                      |
| `ID_Pedido`      | `INT`             | Clave foránea (relación con `Pedido`). |
| `ID_Producto`    | `INT`             | Clave foránea (relación con `Producto`). |
| `Cantidad`       | `INT`             | Cantidad del producto.               |
| `Precio_Total`   | `DECIMAL(10, 2)`  | Precio total del producto.           |
| `ID_Usuario_Comprador` | `INT`     | Clave foránea (relación con `Usuario`). |

---

#### 6. **Usuario_Proveedor** (Relación muchos a muchos)
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Usuario`     | `INT`             | Clave foránea (relación con `Usuario`). |
| `ID_Proveedor`   | `INT`             | Clave foránea (relación con `Proveedor`). |

---

#### 7. **Pedido_Periodico**
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Pedido_Periodico` | `SERIAL`    | Clave primaria.                      |
| `ID_Proveedor`   | `INT`             | Clave foránea (relación con `Proveedor`). |
| `Fecha_Inicio`   | `TIMESTAMP`       | Fecha de inicio del pedido periódico. |
| `Fecha_Fin`      | `TIMESTAMP`       | Fecha de fin del pedido periódico.   |
| `Activo`         | `BOOLEAN`         | Indica si el pedido está activo.     |
| `Periodicidad`   | `INT`             | Días entre pedidos.                  |
| `Dia_Apertura`   | `INT`             | Día de la semana en que se abre el pedido. |
| `Dia_Cierre`     | `INT`             | Día de la semana en que se cierra el pedido. |
| `Dia_Entrega`    | `INT`             | Día aproximado de entrega.           |

---

#### 8. **Pago** (Nueva)
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Pago`        | `SERIAL`          | Clave primaria.                      |
| `ID_Usuario_Deudor` | `INT`         | Clave foránea (relación con `Usuario`). |
| `ID_Usuario_Creditor` | `INT`      | Clave foránea (relación con `Usuario`). |
| `Monto`          | `DECIMAL(10, 2)`  | Monto del pago.                      |
| `Fecha_Pago`     | `TIMESTAMP`       | Fecha y hora del pago.               |
| `Estado`         | `VARCHAR(50)`     | Estado del pago (pendiente, completado). |

---

#### 9. **Notificacion** (Nueva)
| Columna          | Tipo de Dato      | Descripción                          |
|------------------|-------------------|--------------------------------------|
| `ID_Notificacion` | `SERIAL`         | Clave primaria.                      |
| `ID_Usuario`     | `INT`             | Clave foránea (relación con `Usuario`). |
| `Mensaje`        | `TEXT`            | Contenido de la notificación.        |
| `Fecha`          | `TIMESTAMP`       | Fecha y hora de la notificación.     |
| `Leida`          | `BOOLEAN`         | Indica si la notificación ha sido leída. |

---

## **Documentación Completa**

### **1. Flujo de Usuario: Realización del Pedido a los Proveedores**
1. **Pantalla de Dashboard**:
   - El usuario hace clic en **"Adquirir productos"**.

2. **Pantalla de Productos**:
   - El usuario selecciona un grupo de productos(proveedor).
   - Si el pedido a ese proveedor está abierto, estarán activados los botones para añadir productos.
   - El usuario selecciona productos y cantidades.
   - El usuario hace clic en **"Añadir al Pedido"**.

3. **Pantalla de dashboard - Cesta de Compras Mensual**:
   - La cesta se resetea mensualmente. Excepto productos no entragados. 
   - El usuario revisa y modifica los productos.
   - El usuario hace clic en **"Continuar con el Pedido"**.

4. **Notificación al Proveedor y usuario gesto**:
   - Cuando llega la fecha límite(fecha cierre de pedido), se notifica al proveedor y al usuario encargado de ese proveedor.
   - Los productos se marcan como **"En proceso"**.

5. **Seguimiento del Pedido**:
   - El usuario puede ver el estado del pedido en el **Dashboard** o **Historial de Pedidos**.
   - Estados: Pendiente, En reparto, Entregado, Repartido.

6. **Entrega del Pedido**:
   - El proveedor entrega los productos.
   - Puede que se haga el reparto de pedidos o no
   - El usuario confirma la entrega o reparto.
   - El sistema actualiza el estado del pedido a **"Entregado"** o **"Repartido"**.
  

---

### **2. Gestión de Pagos y Balances**
- Al final del mes, se calculan los saldos de los usuarios.
- Los usuarios que deben dinero realizan pagos a los usuarios que gestionan los proveedores.
- Se generan notificaciones para informar sobre los pagos pendientes.

---

### **3. Gestión de Usuarios y Proveedores**
- **Registro de Usuario**:
  - El usuario introduce sus datos y espera la confirmación del administrador.
- **Gestión de Usuarios**:
  - El administrador activa/desactiva usuarios y accede a su historial de pedidos.
- **Gestión de Proveedores**:
  - Los usuarios encargados gestionan los pedidos de los proveedores que tienen asignados.

---

### **4. Notificaciones**
- Los usuarios y proveedores reciben notificaciones sobre:
  - Nuevos pedidos.
  - Cambios en el estado de los pedidos.
  - Pagos pendientes.

---

### **5. Consultas SQL**

#### Crear Tablas
```sql
CREATE TABLE Usuario (
    ID_Usuario SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) UNIQUE NOT NULL,
    Contraseña VARCHAR(100) NOT NULL,
    Movil VARCHAR(20),
    Rol VARCHAR(50) NOT NULL CHECK (Rol IN ('admin', 'gestor', 'usuario')),
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
    Envio_Movil BOOLEAN DEFAULT FALSE,
    Envio_Mail BOOLEAN DEFAULT TRUE
);

CREATE TABLE Producto (
    ID_Producto SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Precio DECIMAL(10, 2) NOT NULL,
    Frecuencia_Pedido VARCHAR(50) CHECK (Frecuencia_Pedido IN ('semanal', 'mensual', 'bimestral', 'trimestral', 'semestral')),
    ID_Proveedor INT REFERENCES Proveedor(ID_Proveedor) ON DELETE CASCADE,
    ID_Usuario_Encargado INT REFERENCES Usuario(ID_Usuario) ON DELETE CASCADE,
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
    Precio_Total DECIMAL(10, 2) NOT NULL,
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
```
