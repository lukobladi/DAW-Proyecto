-- Insertar datos de prueba en la tabla Usuario
INSERT INTO Usuario (Nombre, Correo, Contraseña, Movil, Rol, Activo, Saldo)
VALUES
    ('Juan Pérez', 'juan.perez@example.com', 'password123', '600123456', 'admin', TRUE, 100.00),
    ('Ana Gómez', 'ana.gomez@example.com', 'password456', '600654321', 'usuario', TRUE, 50.00),
    ('Luis Martínez', 'luis.martinez@example.com', 'password789', '600987654', 'usuario', TRUE, 75.00),
    ('María López', 'maria.lopez@example.com', 'password012', '600112233', 'usuario', FALSE, 0.00);

-- Insertar datos de prueba en la tabla Proveedor
INSERT INTO Proveedor (Nombre, Contacto, Telefono, Movil, Correo, Metodo_Pago, Frecuencia_Pedido_Aproximada, Envio_Movil, Envio_Mail)
VALUES
    ('Frutas Frescas S.L.', 'Carlos Ruiz', '912345678', '600111222', 'info@frutasfrescas.com', 'transferencia', 'semanal', TRUE, TRUE),
    ('Carnes Selectas', 'Marta Sánchez', '913334445', '600222333', 'ventas@carneselectas.com', 'tarjeta', 'mensual', FALSE, TRUE),
    ('Bebidas del Norte', 'Jorge Fernández', '914445556', '600333444', 'contacto@bebidasnorte.com', 'efectivo', 'trimestral', TRUE, FALSE);

-- Insertar datos de prueba en la tabla Producto
INSERT INTO Producto (Nombre, Descripcion, Precio, ID_Proveedor)
VALUES
    ('Manzanas', 'Manzanas ecológicas', 2.50, 1),
    ('Naranjas', 'Naranjas de Valencia', 1.80, 1),
    ('Filete de ternera', 'Filete de ternera de alta calidad', 8.00, 2),
    ('Agua mineral', 'Agua mineral 1L', 0.50, 3),
    ('Vino tinto', 'Vino tinto de la Rioja', 5.00, 3);

-- Insertar datos de prueba en la tabla Pedido
INSERT INTO Pedido (ID_Usuario_Encargado, ID_Proveedor, Fecha_Apertura, Fecha_Cierre, Fecha_Entrega, Estado)
VALUES
    (1, 1, '2023-10-01 08:00:00', '2023-10-01 18:00:00', '2023-10-02 12:00:00', 'entregado'),
    (2, 2, '2023-10-05 09:00:00', '2023-10-05 17:00:00', '2023-10-06 10:00:00', 'en proceso'),
    (3, 3, '2023-10-10 10:00:00', NULL, NULL, 'pendiente');

-- Insertar datos de prueba en la tabla Detalle_Pedido
INSERT INTO Detalle_Pedido (ID_Pedido, ID_Producto, Cantidad, Precio_Unitario, ID_Usuario_Comprador)
VALUES
    (1, 1, 10, 2.50, 1),
    (1, 2, 5, 1.80, 2),
    (2, 3, 2, 8.00, 3),
    (3, 4, 20, 0.50, 1),
    (3, 5, 5, 5.00, 2);

-- Insertar datos de prueba en la tabla Usuario_Proveedor
INSERT INTO Usuario_Proveedor (ID_Usuario, ID_Proveedor)
VALUES
    (1, 1),
    (2, 2),
    (3, 3);

-- Insertar datos de prueba en la tabla Pedido_Periodico
INSERT INTO Pedido_Periodico (ID_Proveedor, Fecha_Inicio, Fecha_Fin, Activo, Periodicidad, Dia_Apertura, Dia_Cierre, Dia_Entrega)
VALUES
    (1, '2023-10-01 00:00:00', NULL, TRUE, 7, 1, 2, 3), -- Pedido semanal
    (2, '2023-10-01 00:00:00', NULL, TRUE, 30, 5, 6, 7), -- Pedido mensual
    (3, '2023-10-01 00:00:00', NULL, TRUE, 90, 10, 11, 12); -- Pedido trimestral

-- Insertar datos de prueba en la tabla Pago
INSERT INTO Pago (ID_Usuario_Deudor, ID_Usuario_Creditor, Monto, Fecha_Pago, Estado)
VALUES
    (1, 2, 50.00, '2023-10-01 12:00:00', 'completado'),
    (2, 3, 25.00, '2023-10-05 14:00:00', 'pendiente'),
    (3, 1, 10.00, '2023-10-10 16:00:00', 'completado');

-- Insertar datos de prueba en la tabla Notificacion
INSERT INTO Notificacion (ID_Usuario, Mensaje, Fecha, Leida)
VALUES
    (1, 'Su pedido ha sido entregado.', '2023-10-02 12:30:00', TRUE),
    (2, 'Su pedido está en proceso.', '2023-10-05 17:30:00', FALSE),
    (3, 'Su pedido está pendiente.', '2023-10-10 10:30:00', FALSE);

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE 'Datos de prueba insertados correctamente.';
END $$;