-- Datos de prueba para Ekonsumo
-- Uso: psql -U postgres -d ekonsumo -f datos/datosPrueba.sql
-- Contraseña de todos los usuarios: Ekonsumo123

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

-- Insertar datos de prueba en la tabla usuario (NO MODIFICAR)
INSERT INTO usuario (nombre, correo, pass, movil, rol, activo, saldo, familia)
VALUES
    ('Eneko', 'enekoloko7@hotmail.com', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '622019870', 'admin', TRUE, 100.00, 1),
    ('Ana Gómez', 'ana.gomez@example.com', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600654321', 'gestor', TRUE, 50.00, 2),
    ('Luis Martínez', 'luis.martinez@example.com', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600987654', 'gestor', TRUE, 75.00, 3),
    ('María López', 'maria.lopez@example.com', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600112233', 'usuario', FALSE, 0.00, 1);

-- Insertar proveedores
INSERT INTO proveedor (nombre, contacto, telefono, movil, correo, metodo_pago, frecuencia_pedido_aproximada, envio_movil, envio_mail, activo)
VALUES
    ('Frutas y Verduras El Campico', 'Carlos Ruiz', '948123456', '622019870', 'carlos@elcampico.com', 'transferencia', 'semanal', TRUE, TRUE, TRUE),
    ('Carnes José María', 'Marta Sánchez', '948234567', '622123456', 'marta@carnesjosemaría.com', 'efectivo', 'quincenal', FALSE, TRUE, TRUE),
    ('Panadería San Andrés', 'Ana García', '948345678', '622234567', 'ana@sanandres.com', 'tarjeta', 'semanal', TRUE, TRUE, TRUE),
    ('Huevos de Casa Eusebio', 'Pablo Fernández', '948456789', '622345678', 'pablo@huevoseusebio.com', 'efectivo', 'semanal', TRUE, FALSE, TRUE),
    ('Lácteos del Norte', 'Laura Rodríguez', '948567890', '622456789', 'laura@lacteosdelnorte.com', 'transferencia', 'mensual', FALSE, TRUE, TRUE),
    ('Vinos La Rivera', 'Javier López', '948678901', '622567890', 'javier@lavineradelarivera.com', 'transferencia', 'mensual', FALSE, TRUE, TRUE),
    ('Legumbres Teresa', 'Isabel Moro', '948789012', '622678901', 'isabel@legumbredisateresa.com', 'efectivo', 'mensual', TRUE, TRUE, TRUE),
    ('Productos Temporada', 'Roberto Gil', '948890123', '622789012', 'roberto@temporada.com', 'transferencia', 'quincenal', TRUE, TRUE, FALSE);

-- Asignar familias a proveedores (cada proveedor es gestionado por una familia)
INSERT INTO familia_proveedor (id_familia, id_proveedor)
VALUES
    (1, 1),   -- Familia 1 gestiona Frutas
    (1, 4),   -- Familia 1 gestiona Huevos
    (1, 7),   -- Familia 1 gestiona Legumbres
    (2, 2),   -- Familia 2 gestiona Carnes
    (2, 5),   -- Familia 2 gestiona Lácteos
    (3, 3),   -- Familia 3 gestiona Panadería
    (3, 6),   -- Familia 3 gestiona Vinos
    (3, 8);   -- Familia 3 gestiona Temporada

-- Insertar productos
INSERT INTO producto (nombre, descripcion, precio, id_proveedor, activo, imagen)
VALUES
    -- Frutas (proveedor 1)
    ('Manzanas Royal Gala', 'Manzanas ecológicas de temporada', 2.80, 1, TRUE, '/uploads/manzana-royal.webp'),
    ('Naranjas Valencia', 'Naranjas dulces', 2.20, 1, TRUE, '/uploads/naranja.webp'),
    ('Plátanos Canarias', 'Plátanos maduros', 1.90, 1, TRUE, '/uploads/platano.webp'),
    ('Tomates Raf', 'Tomates Raf de Almería', 3.50, 1, TRUE, '/uploads/tomate-raf.webp'),
    ('Lechuga Romana', 'Lechuga fresca', 1.20, 1, TRUE, '/uploads/lechuga.webp'),
    ('Espinacas frescas', 'Espinacas de temporada', 1.80, 1, TRUE, '/uploads/espinaca.webp'),
    ('Cebollas', 'Cebollas blancas', 1.10, 1, TRUE, '/uploads/cebolla.webp'),
    ('Ajos', 'Ajos blancos', 2.50, 1, TRUE, '/uploads/ajo.webp'),

    -- Carnes (proveedor 2)
    ('Filete de Ternera', 'Filete ternera gallega', 14.50, 2, TRUE, '/uploads/filete.webp'),
    ('Costilla Cerdo', 'Costilla cerdo ibérico', 8.90, 2, TRUE, '/uploads/costilla.webp'),
    ('Pollo de Caserio', 'Pollo campero entero', 7.50, 2, TRUE, '/uploads/pollo.webp'),
    ('Chuletón', 'Chuletón de vaca (por kg)', 22.00, 2, TRUE, '/uploads/chuleton.webp'),
    ('Picadillo Ternera', 'Picadillo mixto', 9.80, 2, TRUE, '/uploads/picadillo.webp'),

    -- Panadería (proveedor 3)
    ('Pan de Hogaza', 'Pan de pueblo artesanal', 2.80, 3, TRUE, '/uploads/hogaza.webp'),
    ('Pan de Centeno', 'Pan integral', 3.20, 3, TRUE, '/uploads/centeno.webp'),
    ('Bollos preñaos', 'Bollos con chorizo', 1.50, 3, TRUE, '/uploads/bollo.webp'),
    ('Magdalenas', 'Magdalenas caseras (docena)', 3.50, 3, TRUE, '/uploads/magdalena.webp'),

    -- Huevos (proveedor 4)
    ('Huevos camperos', 'Huevos gallinas felices (docena)', 4.50, 4, TRUE, '/uploads/huevo-campero.webp'),
    ('Huevos ecológicos', 'Huevos ecológicos (6 uds)', 3.80, 4, TRUE, '/uploads/huevo-ecologico.webp'),

    -- Lácteos (proveedor 5)
    ('Yogur natural', 'Yogur sin azúcar (4 uds)', 3.20, 5, TRUE, '/uploads/yogur.webp'),
    ('Queso semicurado', 'Queso vaca (por kg)', 12.50, 5, TRUE, '/uploads/queso.webp'),
    ('Leche fresca', 'Leche vaca (1L)', 1.40, 5, TRUE, '/uploads/leche.webp'),
    ('Mantequilla', 'Mantequilla artesanal (250g)', 4.20, 5, TRUE, '/uploads/mantequilla.webp'),

    -- Vinos (proveedor 6)
    ('Vino Tinto Roble', 'Vino tinto roble (botella)', 6.50, 6, TRUE, '/uploads/vino-tinto.webp'),
    ('Vino Blanco Verdejo', 'Vino blanco fresco (botella)', 5.80, 6, TRUE, '/uploads/vino-blanco.webp'),
    ('Vino Rosado', 'Vino rosado Navarra (botella)', 5.20, 6, TRUE, '/uploads/vino-rosado.webp'),
    ('Cava Brut', 'Cava brut nature (botella)', 8.90, 6, TRUE, '/uploads/cava.webp'),

    -- Legumbres (proveedor 7)
    ('Lentejas Pardinas', 'Lentejas 1kg', 2.80, 7, TRUE, '/uploads/lenteja.webp'),
    ('Garbanzos', 'Garbanzos Fuentesaúco 1kg', 3.20, 7, TRUE, '/uploads/garbanzo.webp'),
    ('Alubias Rojas', 'Alubias Navarra 1kg', 3.50, 7, TRUE, '/uploads/alubia.webp'),
    ('Arroz Bomba', 'Arroz Calasparra 1kg', 3.80, 7, TRUE, '/uploads/arroz.webp'),

    -- Temporada (proveedor 8)
    ('Fresas', 'Fresas de temporada', 4.50, 8, TRUE, '/uploads/fresa.webp'),
    ('Cerezas', 'Cerezas de Montoro', 6.90, 8, TRUE, '/uploads/cereza.webp'),
    ('Nísperos', 'Nísperos Callosa', 4.20, 8, TRUE, '/uploads/nispero.webp');

-- Pedidos históricos (creados por admin o gestores de las familias correspondientes)
INSERT INTO pedido (id_usuario_encargado, id_proveedor, fecha_apertura, fecha_cierre, fecha_entrega, estado, fecha_modificacion)
VALUES
    -- Pedidos frutas (proveedor 1) - creados por admin (familia 1)
    (1, 1, CURRENT_TIMESTAMP - INTERVAL '21 days', CURRENT_TIMESTAMP - INTERVAL '16 days', CURRENT_TIMESTAMP - INTERVAL '14 days', 'repartido', CURRENT_TIMESTAMP - INTERVAL '14 days'),
    (1, 1, CURRENT_TIMESTAMP - INTERVAL '14 days', CURRENT_TIMESTAMP - INTERVAL '9 days', CURRENT_TIMESTAMP - INTERVAL '7 days', 'repartido', CURRENT_TIMESTAMP - INTERVAL '7 days'),
    (1, 1, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_DATE, 'repartido', CURRENT_TIMESTAMP - INTERVAL '1 day'),

    -- Pedidos huevos (proveedor 4) - familia 1 también gestiona
    (1, 4, CURRENT_TIMESTAMP - INTERVAL '21 days', CURRENT_TIMESTAMP - INTERVAL '18 days', CURRENT_TIMESTAMP - INTERVAL '15 days', 'repartido', CURRENT_TIMESTAMP - INTERVAL '15 days'),
    (1, 4, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '2 days', 'repartido', CURRENT_TIMESTAMP - INTERVAL '2 days'),

    -- Pedidos carnes (proveedor 2) - Ana (familia 2) es gestora
    (2, 2, CURRENT_TIMESTAMP - INTERVAL '21 days', CURRENT_TIMESTAMP - INTERVAL '17 days', CURRENT_TIMESTAMP - INTERVAL '14 days', 'repartido', CURRENT_TIMESTAMP - INTERVAL '14 days'),
    (2, 2, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '1 day', 'repartido', CURRENT_TIMESTAMP - INTERVAL '1 day'),

    -- Pedidos panadería (proveedor 3) - Luis (familia 3) es gestor
    (3, 3, CURRENT_TIMESTAMP - INTERVAL '14 days', CURRENT_TIMESTAMP - INTERVAL '12 days', CURRENT_TIMESTAMP - INTERVAL '10 days', 'repartido', CURRENT_TIMESTAMP - INTERVAL '10 days'),
    (3, 3, CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '3 days', 'repartido', CURRENT_TIMESTAMP - INTERVAL '3 days');

-- Pedidos actualmente abiertos
INSERT INTO pedido (id_usuario_encargado, id_proveedor, fecha_apertura, fecha_cierre, fecha_entrega, estado, fecha_modificacion)
VALUES
    (1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '7 days', 'pendiente', CURRENT_TIMESTAMP),
    (1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '3 days', CURRENT_TIMESTAMP + INTERVAL '5 days', 'pendiente', CURRENT_TIMESTAMP),
    (2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '4 days', CURRENT_TIMESTAMP + INTERVAL '6 days', 'pendiente', CURRENT_TIMESTAMP),
    (3, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '2 days', CURRENT_TIMESTAMP + INTERVAL '4 days', 'pendiente', CURRENT_TIMESTAMP),
    (3, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '7 days', 'pendiente', CURRENT_TIMESTAMP);

-- Detalles de pedidos (productos elegidos por usuarios en cada pedido)
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, id_usuario_comprador, fecha_modificacion)
VALUES
    -- Detalles pedido 1 (frutas hace 21 días)
    (1, 1, 5, 2.80, 1, CURRENT_TIMESTAMP - INTERVAL '14 days'),
    (1, 2, 3, 2.20, 2, CURRENT_TIMESTAMP - INTERVAL '14 days'),
    (1, 3, 2, 1.90, 3, CURRENT_TIMESTAMP - INTERVAL '14 days'),
    (1, 4, 2, 3.50, 4, CURRENT_TIMESTAMP - INTERVAL '14 days'),
    -- Detalles pedido 2 (frutas hace 14 días)
    (2, 1, 4, 2.80, 1, CURRENT_TIMESTAMP - INTERVAL '7 days'),
    (2, 5, 2, 1.20, 2, CURRENT_TIMESTAMP - INTERVAL '7 days'),
    (2, 6, 1, 1.80, 3, CURRENT_TIMESTAMP - INTERVAL '7 days'),
    -- Detalles pedido 3 (frutas hace 7 días)
    (3, 1, 6, 2.80, 1, CURRENT_TIMESTAMP - INTERVAL '1 day'),
    (3, 2, 4, 2.20, 2, CURRENT_TIMESTAMP - INTERVAL '1 day'),
    (3, 7, 2, 1.10, 3, CURRENT_TIMESTAMP - INTERVAL '1 day'),
    -- Detalles pedido 4 (huevos hace 21 días)
    (4, 17, 2, 4.50, 1, CURRENT_TIMESTAMP - INTERVAL '15 days'),
    (4, 18, 1, 3.80, 2, CURRENT_TIMESTAMP - INTERVAL '15 days'),
    -- Detalles pedido 5 (huevos hace 7 días)
    (5, 17, 3, 4.50, 1, CURRENT_TIMESTAMP - INTERVAL '2 days'),
    (5, 18, 2, 3.80, 3, CURRENT_TIMESTAMP - INTERVAL '2 days'),
    -- Detalles pedido 6 (carnes hace 21 días)
    (6, 9, 1, 14.50, 1, CURRENT_TIMESTAMP - INTERVAL '14 days'),
    (6, 10, 2, 8.90, 2, CURRENT_TIMESTAMP - INTERVAL '14 days'),
    (6, 11, 1, 7.50, 3, CURRENT_TIMESTAMP - INTERVAL '14 days'),
    -- Detalles pedido 7 (carnes hace 7 días)
    (7, 9, 1, 14.50, 1, CURRENT_TIMESTAMP - INTERVAL '1 day'),
    (7, 12, 0.5, 22.00, 2, CURRENT_TIMESTAMP - INTERVAL '1 day'),
    -- Detalles pedido 8 (panadería hace 14 días)
    (8, 14, 2, 2.80, 1, CURRENT_TIMESTAMP - INTERVAL '10 days'),
    (8, 15, 1, 3.20, 2, CURRENT_TIMESTAMP - INTERVAL '10 days'),
    (8, 16, 4, 1.50, 3, CURRENT_TIMESTAMP - INTERVAL '10 days'),
    -- Detalles pedido 9 (panadería hace 7 días)
    (9, 14, 3, 2.80, 1, CURRENT_TIMESTAMP - INTERVAL '3 days'),
    (9, 16, 6, 1.50, 2, CURRENT_TIMESTAMP - INTERVAL '3 days'),
    -- Detalles pedidos abiertos
    (10, 1, 3, 2.80, 1, CURRENT_TIMESTAMP),
    (10, 2, 2, 2.20, 2, CURRENT_TIMESTAMP),
    (10, 3, 1, 1.90, 3, CURRENT_TIMESTAMP),
    (11, 17, 2, 4.50, 1, CURRENT_TIMESTAMP),
    (11, 18, 1, 3.80, 2, CURRENT_TIMESTAMP),
    (12, 9, 1, 14.50, 1, CURRENT_TIMESTAMP),
    (12, 10, 1, 8.90, 3, CURRENT_TIMESTAMP),
    (13, 14, 2, 2.80, 1, CURRENT_TIMESTAMP),
    (13, 15, 1, 3.20, 2, CURRENT_TIMESTAMP),
    (14, 22, 2, 6.50, 1, CURRENT_TIMESTAMP),
    (14, 23, 2, 5.80, 3, CURRENT_TIMESTAMP);

-- Pedidos periódicos
INSERT INTO pedido_periodico (id_proveedor, fecha_inicio, fecha_fin, activo, periodicidad, dia_apertura, dia_cierre, dia_entrega)
VALUES
    (1, CURRENT_TIMESTAMP - INTERVAL '6 months', NULL, TRUE, 7, 3, 5, 6),    -- Frutas semanal
    (4, CURRENT_TIMESTAMP - INTERVAL '3 months', NULL, TRUE, 7, 5, 6, 7),    -- Huevos semanal
    (3, CURRENT_TIMESTAMP - INTERVAL '2 months', NULL, TRUE, 7, 6, 0, 1),        -- Pan semanal
    (5, CURRENT_TIMESTAMP - INTERVAL '4 months', NULL, TRUE, 30, 25, 26, 27);  -- Lácteos mensual

-- Pagos
INSERT INTO pago (id_usuario_deudor, id_usuario_creditor, monto, fecha_pago, estado, periodo, origen, concepto, deudor_reporta_pagado, fecha_reporte_deudor, fecha_confirmacion_receptor, fecha_modificacion)
VALUES
    -- Pagos febrero completados
    (1, 2, 28.50, CURRENT_TIMESTAMP - INTERVAL '15 days', 'completado', '2026-02', 'liquidacion', 'Liquidación febrero - Carnes', TRUE, CURRENT_TIMESTAMP - INTERVAL '16 days', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '15 days'),
    (3, 2, 22.40, CURRENT_TIMESTAMP - INTERVAL '15 days', 'completado', '2026-02', 'liquidacion', 'Liquidación febrero - Carnes', TRUE, CURRENT_TIMESTAMP - INTERVAL '16 days', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '15 days'),
    -- Pagos pendientes marzo
    (2, 1, 15.80, NULL, 'pendiente', '2026-03', 'liquidacion', 'Liquidación marzo - Frutas', FALSE, NULL, NULL, CURRENT_TIMESTAMP),
    (3, 1, 12.40, NULL, 'pendiente', '2026-03', 'liquidacion', 'Liquidación marzo - Frutas', FALSE, NULL, NULL, CURRENT_TIMESTAMP),
    (1, 2, 22.50, NULL, 'pendiente', '2026-03', 'liquidacion', 'Liquidación marzo - Carnes', FALSE, NULL, NULL, CURRENT_TIMESTAMP),
    (3, 2, 18.90, NULL, 'pendiente', '2026-03', 'liquidacion', 'Liquidación marzo - Carnes', FALSE, NULL, NULL, CURRENT_TIMESTAMP),
    -- Pago manual
    (2, 1, 10.00, CURRENT_TIMESTAMP - INTERVAL '10 days', 'completado', '2026-03', 'manual', 'A cuenta pedido próximo', TRUE, CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '10 days');

-- Notificaciones
INSERT INTO notificacion (id_usuario, mensaje, fecha, leida)
VALUES
    (1, 'Tu pedido de Frutas ha sido repartido.', CURRENT_TIMESTAMP - INTERVAL '1 day', TRUE),
    (2, 'Tu pedido de Frutas ha sido repartido.', CURRENT_TIMESTAMP - INTERVAL '1 day', FALSE),
    (3, 'Tu pedido de Frutas ha sido repartido.', CURRENT_TIMESTAMP - INTERVAL '1 day', FALSE),
    (1, 'Tienes un pedido de Carnes abierto. Tienes 4 días para pedir.', CURRENT_TIMESTAMP, FALSE),
    (2, 'Tienes un pedido de Carnes abierto. Tienes 4 días para pedir.', CURRENT_TIMESTAMP, FALSE),
    (3, 'Tienes un pedido de Panadería abierto. Tienes 2 días para pedir.', CURRENT_TIMESTAMP, FALSE),
    (1, 'Tienes un pago pendiente de 15.80€ por la liquidación de marzo.', CURRENT_TIMESTAMP - INTERVAL '2 days', FALSE);

DO $$
BEGIN
  RAISE NOTICE 'Datos de prueba insertados correctamente.';
END $$;
