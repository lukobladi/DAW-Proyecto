-- Insertar 40 usuarios
INSERT INTO Usuario (Nombre, Correo, Contraseña, Rol) VALUES
('Usuario 1', 'usuario1@example.com', 'password1', 'admin'),
('Usuario 2', 'usuario2@example.com', 'password2', 'admin'),
('Usuario 3', 'usuario3@example.com', 'password3', 'admin'),
('Usuario 4', 'usuario4@example.com', 'password4', 'admin'),
('Usuario 5', 'usuario5@example.com', 'password5', 'admin'),
('Usuario 6', 'usuario6@example.com', 'password6', 'usuario'),
('Usuario 7', 'usuario7@example.com', 'password7', 'usuario'),
('Usuario 8', 'usuario8@example.com', 'password8', 'usuario'),
('Usuario 9', 'usuario9@example.com', 'password9', 'usuario'),
('Usuario 10', 'usuario10@example.com', 'password10', 'usuario'),
('Usuario 11', 'usuario11@example.com', 'password11', 'usuario'),
('Usuario 12', 'usuario12@example.com', 'password12', 'usuario'),
('Usuario 13', 'usuario13@example.com', 'password13', 'usuario'),
('Usuario 14', 'usuario14@example.com', 'password14', 'usuario'),
('Usuario 15', 'usuario15@example.com', 'password15', 'usuario'),
('Usuario 16', 'usuario16@example.com', 'password16', 'usuario'),
('Usuario 17', 'usuario17@example.com', 'password17', 'usuario'),
('Usuario 18', 'usuario18@example.com', 'password18', 'usuario'),
('Usuario 19', 'usuario19@example.com', 'password19', 'usuario'),
('Usuario 20', 'usuario20@example.com', 'password20', 'usuario'),
('Usuario 21', 'usuario21@example.com', 'password21', 'usuario'),
('Usuario 22', 'usuario22@example.com', 'password22', 'usuario'),
('Usuario 23', 'usuario23@example.com', 'password23', 'usuario'),
('Usuario 24', 'usuario24@example.com', 'password24', 'usuario'),
('Usuario 25', 'usuario25@example.com', 'password25', 'usuario'),
('Usuario 26', 'usuario26@example.com', 'password26', 'usuario'),
('Usuario 27', 'usuario27@example.com', 'password27', 'usuario'),
('Usuario 28', 'usuario28@example.com', 'password28', 'usuario'),
('Usuario 29', 'usuario29@example.com', 'password29', 'usuario'),
('Usuario 30', 'usuario30@example.com', 'password30', 'usuario'),
('Usuario 31', 'usuario31@example.com', 'password31', 'usuario'),
('Usuario 32', 'usuario32@example.com', 'password32', 'usuario'),
('Usuario 33', 'usuario33@example.com', 'password33', 'usuario'),
('Usuario 34', 'usuario34@example.com', 'password34', 'usuario'),
('Usuario 35', 'usuario35@example.com', 'password35', 'usuario'),
('Usuario 36', 'usuario36@example.com', 'password36', 'usuario'),
('Usuario 37', 'usuario37@example.com', 'password37', 'usuario'),
('Usuario 38', 'usuario38@example.com', 'password38', 'usuario'),
('Usuario 39', 'usuario39@example.com', 'password39', 'usuario'),
('Usuario 40', 'usuario40@example.com', 'password40', 'usuario');

-- Insertar 15 proveedores
INSERT INTO Proveedor (Nombre, Contacto, Telefono, Correo) VALUES
('Proveedor 1', 'Contacto 1', '+34 600 000 100', 'proveedor1@example.com'),
('Proveedor 2', 'Contacto 2', '+34 600 000 101', 'proveedor2@example.com'),
('Proveedor 3', 'Contacto 3', '+34 600 000 102', 'proveedor3@example.com'),
('Proveedor 4', 'Contacto 4', '+34 600 000 103', 'proveedor4@example.com'),
('Proveedor 5', 'Contacto 5', '+34 600 000 104', 'proveedor5@example.com'),
('Proveedor 6', 'Contacto 6', '+34 600 000 105', 'proveedor6@example.com'),
('Proveedor 7', 'Contacto 7', '+34 600 000 106', 'proveedor7@example.com'),
('Proveedor 8', 'Contacto 8', '+34 600 000 107', 'proveedor8@example.com'),
('Proveedor 9', 'Contacto 9', '+34 600 000 108', 'proveedor9@example.com'),
('Proveedor 10', 'Contacto 10', '+34 600 000 109', 'proveedor10@example.com'),
('Proveedor 11', 'Contacto 11', '+34 600 000 110', 'proveedor11@example.com'),
('Proveedor 12', 'Contacto 12', '+34 600 000 111', 'proveedor12@example.com'),
('Proveedor 13', 'Contacto 13', '+34 600 000 112', 'proveedor13@example.com'),
('Proveedor 14', 'Contacto 14', '+34 600 000 113', 'proveedor14@example.com'),
('Proveedor 15', 'Contacto 15', '+34 600 000 114', 'proveedor15@example.com');

-- Insertar 20 productos por proveedor (300 productos en total)
INSERT INTO Producto (Nombre, Descripcion, Precio, ID_Proveedor) VALUES
-- Productos del Proveedor 1
('Producto 1 - Proveedor 1', 'Descripción del producto 1 del proveedor 1', 10.50, 1),
('Producto 2 - Proveedor 1', 'Descripción del producto 2 del proveedor 1', 15.75, 1),
('Producto 3 - Proveedor 1', 'Descripción del producto 3 del proveedor 1', 20.00, 1),
('Producto 4 - Proveedor 1', 'Descripción del producto 4 del proveedor 1', 5.99, 1),
('Producto 5 - Proveedor 1', 'Descripción del producto 5 del proveedor 1', 12.30, 1),
('Producto 6 - Proveedor 1', 'Descripción del producto 6 del proveedor 1', 8.45, 1),
('Producto 7 - Proveedor 1', 'Descripción del producto 7 del proveedor 1', 18.90, 1),
('Producto 8 - Proveedor 1', 'Descripción del producto 8 del proveedor 1', 22.50, 1),
('Producto 9 - Proveedor 1', 'Descripción del producto 9 del proveedor 1', 7.80, 1),
('Producto 10 - Proveedor 1', 'Descripción del producto 10 del proveedor 1', 14.20, 1),
('Producto 11 - Proveedor 1', 'Descripción del producto 11 del proveedor 1', 9.99, 1),
('Producto 12 - Proveedor 1', 'Descripción del producto 12 del proveedor 1', 16.75, 1),
('Producto 13 - Proveedor 1', 'Descripción del producto 13 del proveedor 1', 11.50, 1),
('Producto 14 - Proveedor 1', 'Descripción del producto 14 del proveedor 1', 19.80, 1),
('Producto 15 - Proveedor 1', 'Descripción del producto 15 del proveedor 1', 6.50, 1),
('Producto 16 - Proveedor 1', 'Descripción del producto 16 del proveedor 1', 13.40, 1),
('Producto 17 - Proveedor 1', 'Descripción del producto 17 del proveedor 1', 17.90, 1),
('Producto 18 - Proveedor 1', 'Descripción del producto 18 del proveedor 1', 21.00, 1),
('Producto 19 - Proveedor 1', 'Descripción del producto 19 del proveedor 1', 10.00, 1),
('Producto 20 - Proveedor 1', 'Descripción del producto 20 del proveedor 1', 25.50, 1),

-- Productos del Proveedor 2
('Producto 1 - Proveedor 2', 'Descripción del producto 1 del proveedor 2', 9.50, 2),
('Producto 2 - Proveedor 2', 'Descripción del producto 2 del proveedor 2', 14.75, 2),
('Producto 3 - Proveedor 2', 'Descripción del producto 3 del proveedor 2', 19.00, 2),
('Producto 4 - Proveedor 2', 'Descripción del producto 4 del proveedor 2', 4.99, 2),
('Producto 5 - Proveedor 2', 'Descripción del producto 5 del proveedor 2', 11.30, 2),
('Producto 6 - Proveedor 2', 'Descripción del producto 6 del proveedor 2', 7.45, 2),
('Producto 7 - Proveedor 2', 'Descripción del producto 7 del proveedor 2', 17.90, 2),
('Producto 8 - Proveedor 2', 'Descripción del producto 8 del proveedor 2', 21.50, 2),
('Producto 9 - Proveedor 2', 'Descripción del producto 9 del proveedor 2', 6.80, 2),
('Producto 10 - Proveedor 2', 'Descripción del producto 10 del proveedor 2', 13.20, 2),
('Producto 11 - Proveedor 2', 'Descripción del producto 11 del proveedor 2', 8.99, 2),
('Producto 12 - Proveedor 2', 'Descripción del producto 12 del proveedor 2', 15.75, 2),
('Producto 13 - Proveedor 2', 'Descripción del producto 13 del proveedor 2', 10.50, 2),
('Producto 14 - Proveedor 2', 'Descripción del producto 14 del proveedor 2', 18.80, 2),
('Producto 15 - Proveedor 2', 'Descripción del producto 15 del proveedor 2', 5.50, 2),
('Producto 16 - Proveedor 2', 'Descripción del producto 16 del proveedor 2', 12.40, 2),
('Producto 17 - Proveedor 2', 'Descripción del producto 17 del proveedor 2', 16.90, 2),
('Producto 18 - Proveedor 2', 'Descripción del producto 18 del proveedor 2', 20.00, 2),
('Producto 19 - Proveedor 2', 'Descripción del producto 19 del proveedor 2', 9.00, 2),
('Producto 20 - Proveedor 2', 'Descripción del producto 20 del proveedor 2', 24.50, 2),

-- Repetir para los demás proveedores (Proveedor 3 a Proveedor 15)
-- ...

-- Insertar pedidos y detalles de pedidos
-- (Aquí puedes agregar manualmente los pedidos y detalles de pedidos)
-- Ejemplo:
INSERT INTO Pedido (Fecha, ID_Usuario, Estado) VALUES
('2023-10-01', 1, 'Completado'),
('2023-10-02', 2, 'Completado'),
('2023-10-03', 3, 'Completado');

INSERT INTO Detalle_Pedido (ID_Pedido, ID_Producto, Cantidad, Precio_Total) VALUES
(1, 1, 2, 21.00),
(1, 2, 1, 15.75),
(2, 3, 3, 60.00),
(2, 4, 2, 11.98),
(3, 5, 1, 12.30);

-- Continuar con más inserciones manuales...