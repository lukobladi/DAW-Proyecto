-- Limpiar datos para permitir re-ejecucion del script
TRUNCATE TABLE
  notificacion,
  pago,
  pedido_periodico,
  familia_proveedor,
  detalle_pedido,
  pedido,
  producto,
  proveedor,
  usuario
RESTART IDENTITY CASCADE;

-- Insertar datos de prueba en la tabla usuario
INSERT INTO usuario (nombre, correo, pass, movil, rol, activo, saldo, familia)
VALUES
    ('Eneko', 'enekoloko7@hotmail.com', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '622019870', 'admin', TRUE, 100.00, 1),
    ('Ana Gómez', 'ana.gomez@example.com', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600654321', 'usuario', TRUE, 50.00, 2),
    ('Luis Martínez', 'luis.martinez@example.com', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600987654', 'usuario', TRUE, 75.00, 3),
    ('María López', 'maria.lopez@example.com', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600112233', 'usuario', FALSE, 0.00, 1);

-- Insertar datos de prueba en la tabla proveedor
INSERT INTO proveedor (nombre, contacto, telefono, movil, correo, metodo_pago, frecuencia_pedido_aproximada, envio_movil, envio_mail)
VALUES
    ('Frutas Frescas S.L.', 'Carlos Ruiz', '912345678', '600111222', 'info@frutasfrescas.com', 'transferencia', 'semanal', TRUE, TRUE),
    ('Carnes Selectas', 'Marta Sánchez', '913334445', '600222333', 'ventas@carneselectas.com', 'tarjeta', 'mensual', FALSE, TRUE),
    ('Bebidas del Norte', 'Jorge Fernández', '914445556', '600333444', 'contacto@bebidasnorte.com', 'efectivo', 'trimestral', TRUE, FALSE);

-- Asignar familias a proveedores
INSERT INTO familia_proveedor (id_familia, id_proveedor)
VALUES
    (1, 1), -- Familia 1 gestiona Frutas Frescas
    (2, 2), -- Familia 2 gestiona Carnes Selectas
    (3, 3); -- Familia 3 gestiona Bebidas del Norte

-- Insertar datos de prueba en la tabla producto
INSERT INTO producto (nombre, descripcion, precio, id_proveedor, imagen)
VALUES
    ('Manzanas', 'Manzanas ecológicas', 2.50, 1, '/uploads/manzanas.webp'),
    ('Naranjas', 'Naranjas de Valencia', 1.80, 1, '/uploads/naranjas.webp'),
    ('Filete de ternera', 'Filete de ternera de alta calidad', 8.00, 2, '/uploads/filete.webp'),
    ('Agua mineral', 'Agua mineral 1L', 0.50, 3, '/uploads/agua.webp'),
    ('Vino tinto', 'Vino tinto de la Rioja', 5.00, 3, '/uploads/vino.webp');

-- Insertar datos de prueba en la tabla pedido
INSERT INTO pedido (id_usuario_encargado, id_proveedor, fecha_apertura, fecha_cierre, fecha_entrega, estado)
VALUES
    (1, 1, '2026-03-01 08:00:00', '2026-03-01 18:00:00', '2026-03-02 12:00:00', 'entregado'),
    (2, 2, '2026-03-05 09:00:00', '2026-03-05 17:00:00', '2026-03-06 10:00:00', 'en proceso'),
    (3, 3, '2026-03-10 10:00:00', NULL, NULL, 'pendiente');

-- Insertar datos de prueba en la tabla detalle_pedido
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, id_usuario_comprador)
VALUES
    (1, 1, 10, 2.50, 1),
    (1, 2, 5, 1.80, 2),
    (2, 3, 2, 8.00, 3),
    (3, 4, 20, 0.50, 1),
    (3, 5, 5, 5.00, 2);

-- Insertar datos de prueba en la tabla pedido_periodico
INSERT INTO pedido_periodico (id_proveedor, fecha_inicio, fecha_fin, activo, periodicidad, dia_apertura, dia_cierre, dia_entrega)
VALUES
    (1, '2026-03-01 00:00:00', NULL, TRUE, 7, 1, 2, 3), -- Pedido semanal
    (2, '2026-03-01 00:00:00', NULL, TRUE, 30, 5, 6, 7), -- Pedido mensual
    (3, '2026-03-01 00:00:00', NULL, TRUE, 90, 10, 11, 12); -- Pedido trimestral

-- Insertar datos de prueba en la tabla pago
INSERT INTO pago (id_usuario_deudor, id_usuario_creditor, monto, fecha_pago, estado)
VALUES
    (1, 2, 50.00, '2026-03-01 12:00:00', 'completado'),
    (2, 3, 25.00, '2026-03-05 14:00:00', 'pendiente'),
    (3, 1, 10.00, '2026-03-10 16:00:00', 'completado');

-- Insertar datos de prueba en la tabla notificacion
INSERT INTO notificacion (id_usuario, mensaje, fecha, leida)
VALUES
    (1, 'Su pedido ha sido entregado.', '2026-03-02 12:30:00', TRUE),
    (2, 'Su pedido está en proceso.', '2026-03-05 17:30:00', FALSE),
    (3, 'Su pedido está pendiente.', '2026-03-10 10:30:00', FALSE);

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE 'Datos de prueba insertados correctamente.';
END $$;
