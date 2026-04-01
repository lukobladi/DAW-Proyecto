-- Datos de prueba para Ekonsumo
-- Uso: psql -U postgres -d ekonsumo -f datos/datosPrueba.sql
-- Contraseña de todos los usuarios: 1234

-- Limpiar datos para permitir re-ejecucion del script
TRUNCATE TABLE
  notificacion,
  pago,
  pedido_periodico,
  detalle_pedido,
  pedido,
  producto,
  proveedor,
  usuario_proveedor,
  usuario
RESTART IDENTITY CASCADE;

-- Insertar usuarios (el saldo en la tabla ya no se usa para el calculo dinamico)
INSERT INTO usuario (nombre, correo, pass, movil, rol, activo, saldo)
VALUES
    ('Admin', 'admin@ekonsumo.com', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '111111111', 'admin', TRUE, 0),
    ('Usuario1', 'usuario1@ekonsumo.com', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '444444444', 'usuario', TRUE, 0),
    ('Gestor1', 'gestor1@ekonsumo.com', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '222222222', 'gestor', TRUE, 0),
    ('Gestor2', 'gestor2@ekonsumo.com', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '777777777', 'gestor', TRUE, 0),
    ('Gestor3', 'gestor3@ekonsumo.com', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '888888888', 'gestor', TRUE, 0),
    ('Usuario2', 'usuario2@ekonsumo.com', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '555555555', 'usuario', TRUE, 0),
    ('Usuario3', 'usuario3@ekonsumo.com', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '333333333', 'usuario', TRUE, 0),
    ('Usuario4', 'usuario4@ekonsumo.com', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '666666666', 'usuario', TRUE, 0);

-- Insertar proveedores
INSERT INTO proveedor (nombre, contacto, telefono, movil, correo, metodo_pago, frecuencia_pedido_aproximada, envio_movil, envio_mail, activo)
VALUES
    ('Frutas y Verduras El Campico', 'Carlos Ruiz', '948123456', '622019870', 'carlos@elcampico.com', 'transferencia', 'semanal', TRUE, TRUE, TRUE),
    ('Carnes José María', 'Marta Sánchez', '948234567', '622123456', 'marta@carnesjosemaría.com', 'efectivo', 'mensual', FALSE, TRUE, TRUE),
    ('Panadería San Andrés', 'Ana García', '948345678', '622234567', 'ana@sanandres.com', 'tarjeta', 'semanal', TRUE, TRUE, TRUE),
    ('Huevos de Casa Eusebio', 'Pablo Fernández', '948456789', '622345678', 'pablo@huevoseusebio.com', 'efectivo', 'semanal', TRUE, FALSE, TRUE),
    ('Lácteos del Norte', 'Laura Rodríguez', '948567890', '622456789', 'laura@lacteosdelnorte.com', 'transferencia', 'mensual', FALSE, TRUE, TRUE),
    ('Vinos La Rivera', 'Javier López', '948678901', '622567890', 'javier@lavineradelarivera.com', 'transferencia', 'mensual', FALSE, TRUE, TRUE),
    ('Legumbres Teresa', 'Isabel Moro', '948789012', '622678901', 'isabel@legumbredisateresa.com', 'efectivo', 'mensual', TRUE, TRUE, TRUE),
    ('Productos Temporada', 'Roberto Gil', '948890123', '622789012', 'roberto@temporada.com', 'transferencia', 'mensual', TRUE, TRUE, FALSE);

-- Asignar gestores a proveedores
INSERT INTO usuario_proveedor (id_usuario, id_proveedor)
VALUES
    (1, 1),
    (1, 2),
    (3, 3),
    (4, 4),
    (4, 5),
    (4, 6),
    (5, 7),
    (5, 8);

-- Insertar productos
INSERT INTO producto (nombre, descripcion, precio, id_proveedor, activo, imagen)
VALUES
    ('Manzanas Royal Gala', 'Manzanas ecológicas de temporada', 2.80, 1, TRUE, '/uploads/manzana-royal.webp'),
    ('Naranjas Valencia', 'Naranjas dulces', 2.20, 1, TRUE, '/uploads/naranja.webp'),
    ('Plátanos Canarias', 'Plátanos maduros', 1.90, 1, TRUE, '/uploads/platano.webp'),
    ('Tomates Raf', 'Tomates Raf de Almería', 3.50, 1, TRUE, '/uploads/tomate-raf.webp'),
    ('Lechuga Romana', 'Lechuga fresca', 1.20, 1, TRUE, '/uploads/lechuga.webp'),
    ('Espinacas frescas', 'Espinacas de temporada', 1.80, 1, TRUE, '/uploads/espinaca.webp'),
    ('Cebollas', 'Cebollas blancas', 1.10, 1, TRUE, '/uploads/cebolla.webp'),
    ('Ajos', 'Ajos blancos', 2.50, 1, TRUE, '/uploads/ajo.webp'),
    ('Filete de Ternera', 'Filete ternera gallega', 14.50, 2, TRUE, '/uploads/filete.webp'),
    ('Costilla Cerdo', 'Costilla cerdo ibérico', 8.90, 2, TRUE, '/uploads/costilla.webp'),
    ('Pollo de Caserio', 'Pollo campero entero', 7.50, 2, TRUE, '/uploads/pollo.webp'),
    ('Chuletón', 'Chuletón de vaca (por kg)', 22.00, 2, TRUE, '/uploads/chuleton.webp'),
    ('Picadillo Ternera', 'Picadillo mixto', 9.80, 2, TRUE, '/uploads/picadillo.webp'),
    ('Pan de Hogaza', 'Pan de pueblo artesanal', 2.80, 3, TRUE, '/uploads/hogaza.webp'),
    ('Pan de Centeno', 'Pan integral', 3.20, 3, TRUE, '/uploads/centeno.webp'),
    ('Bollos preñaos', 'Bollos con chorizo', 1.50, 3, TRUE, '/uploads/bollo.webp'),
    ('Magdalenas', 'Magdalenas caseras (docena)', 3.50, 3, TRUE, '/uploads/magdalena.webp'),
    ('Huevos camperos', 'Huevos gallinas felices (docena)', 4.50, 4, TRUE, '/uploads/huevo-campero.webp'),
    ('Huevos ecológicos', 'Huevos ecológicos (6 uds)', 3.80, 4, TRUE, '/uploads/huevo-ecologico.webp'),
    ('Yogur natural', 'Yogur sin azúcar (4 uds)', 3.20, 5, TRUE, '/uploads/yogur.webp'),
    ('Queso semicurado', 'Queso vaca (por kg)', 12.50, 5, TRUE, '/uploads/queso.webp'),
    ('Leche fresca', 'Leche vaca (1L)', 1.40, 5, TRUE, '/uploads/leche.webp'),
    ('Mantequilla', 'Mantequilla artesanal (250g)', 4.20, 5, TRUE, '/uploads/mantequilla.webp'),
    ('Vino Tinto Roble', 'Vino tinto roble (botella)', 6.50, 6, TRUE, '/uploads/vino-tinto.webp'),
    ('Vino Blanco Verdejo', 'Vino blanco fresco (botella)', 5.80, 6, TRUE, '/uploads/vino-blanco.webp'),
    ('Vino Rosado', 'Vino rosado Navarra (botella)', 5.20, 6, TRUE, '/uploads/vino-rosado.webp'),
    ('Cava Brut', 'Cava brut nature (botella)', 8.90, 6, TRUE, '/uploads/cava.webp'),
    ('Lentejas Pardinas', 'Lentejas 1kg', 2.80, 7, TRUE, '/uploads/lenteja.webp'),
    ('Garbanzos', 'Garbanzos Fuentesaúco 1kg', 3.20, 7, TRUE, '/uploads/garbanzo.webp'),
    ('Alubias Rojas', 'Alubias Navarra 1kg', 3.50, 7, TRUE, '/uploads/alubia.webp'),
    ('Arroz Bomba', 'Arroz Calasparra 1kg', 3.80, 7, TRUE, '/uploads/arroz.webp'),
    ('Fresas', 'Fresas de temporada', 4.50, 8, TRUE, '/uploads/fresa.webp'),
    ('Cerezas', 'Cerezas de Montoro', 6.90, 8, TRUE, '/uploads/cereza.webp'),
    ('Nísperos', 'Nísperos Callosa', 4.20, 8, TRUE, '/uploads/nispero.webp');

-- Pedidos históricos (cerrados, estado repartido/entregado/cancelado - NO aparecen en ComprasPage)
INSERT INTO pedido (id_proveedor, fecha_apertura, fecha_cierre, fecha_entrega, estado, fecha_modificacion)
VALUES
    -- Frutas: 3 pedidos cerrados repartidos (histórico)
    (1, '2026-03-01', '2026-03-08', '2026-03-10', 'repartido', '2026-03-10'),
    (1, '2026-03-08', '2026-03-15', '2026-03-17', 'repartido', '2026-03-17'),
    (1, '2026-03-15', '2026-03-22', '2026-03-24', 'repartido', '2026-03-24'),
    -- Carnes: 2 pedidos cerrados repartidos (histórico)
    (2, '2026-03-01', '2026-03-10', '2026-03-12', 'repartido', '2026-03-12'),
    (2, '2026-03-10', '2026-03-20', '2026-03-22', 'repartido', '2026-03-22'),
    -- Huevos: 2 pedidos cerrados repartidos (histórico)
    (4, '2026-03-01', '2026-03-07', '2026-03-09', 'repartido', '2026-03-09'),
    (4, '2026-03-10', '2026-03-16', '2026-03-18', 'repartido', '2026-03-18'),
    -- Panadería: 2 pedidos cerrados repartidos (histórico)
    (3, '2026-03-03', '2026-03-10', '2026-03-12', 'repartido', '2026-03-12'),
    (3, '2026-03-12', '2026-03-19', '2026-03-21', 'repartido', '2026-03-21'),
    -- Vinos: 1 pedido cerrado repartido (histórico)
    (6, '2026-03-01', '2026-03-15', '2026-03-18', 'repartido', '2026-03-18'),
    -- Lácteos: 1 pedido entregado (histórico)
    (5, '2026-02-20', '2026-03-01', '2026-03-03', 'entregado', '2026-03-03'),
    -- Legumbres: 1 pedido cancelado (histórico)
    (7, '2026-03-01', '2026-03-10', NULL, 'cancelado', '2026-03-08');

-- Pedidos pendientes de entrega (cerrados, estado pendiente o en proceso - SÍ aparecen en "Pendiente de entrega")
INSERT INTO pedido (id_proveedor, fecha_apertura, fecha_cierre, fecha_entrega, estado, fecha_modificacion)
VALUES
    -- Frutas: pedido cerrado pero pendiente (cerrado el 29/3, estado pendiente)
    (1, '2026-03-22', '2026-03-29', NULL, 'pendiente', '2026-03-29'),
    -- Carnes: pedido cerrado pero en proceso
    (2, '2026-03-22', '2026-03-30', NULL, 'en proceso', '2026-03-30'),
    -- Vinos: pedido cerrado y entregado (NO debe aparecer - entregado no es pendiente ni en proceso)
    (6, '2026-03-18', '2026-03-28', '2026-03-30', 'entregado', '2026-03-30');

-- Pedidos abiertos (fecha_cierre > hoy 1/4/2026, estado pendiente - aparecen en "Pedido abierto")
INSERT INTO pedido (id_proveedor, fecha_apertura, fecha_cierre, fecha_entrega, estado, fecha_modificacion)
VALUES
    -- Panadería: abre 27/3, cierra 5/4 (pendiente)
    (3, '2026-03-27', '2026-04-05', '2026-04-07', 'pendiente', '2026-03-27'),
    -- Huevos: abre 30/3, cierra 2/4 (pendiente, cierra mañana)
    (4, '2026-03-30', '2026-04-02', '2026-04-04', 'pendiente', '2026-03-30'),
    -- Lácteos: abre 28/3, cierra 6/4 (pendiente)
    (5, '2026-03-28', '2026-04-06', '2026-04-08', 'pendiente', '2026-03-28'),
    -- Vinos: abre 29/3, cierra 8/4 (pendiente)
    (6, '2026-03-29', '2026-04-08', '2026-04-10', 'pendiente', '2026-03-29'),
    -- Legumbres: abre 30/3, cierra 4/4 (pendiente)
    (7, '2026-03-30', '2026-04-04', '2026-04-06', 'pendiente', '2026-03-30'),
    -- Frutas: abre 29/3, cierra 3/4 (pendiente)
    (1, '2026-03-29', '2026-04-03', '2026-04-05', 'pendiente', '2026-03-29');

-- Detalles de pedidos históricos (productos elegidos por usuarios)
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, id_usuario_comprador, fecha_modificacion)
VALUES
    -- Detalles pedido 1 (frutas - repartido 10/3)
    (1, 1, 5, 2.80, 2, '2026-03-08'),
    (1, 2, 3, 2.20, 3, '2026-03-08'),
    (1, 3, 2, 1.90, 4, '2026-03-08'),
    -- Detalles pedido 2 (frutas - repartido 17/3)
    (2, 1, 4, 2.80, 2, '2026-03-15'),
    (2, 5, 2, 1.20, 3, '2026-03-15'),
    (2, 6, 1, 1.80, 4, '2026-03-15'),
    -- Detalles pedido 3 (frutas - repartido 24/3)
    (3, 1, 6, 2.80, 2, '2026-03-22'),
    (3, 2, 4, 2.20, 3, '2026-03-22'),
    (3, 7, 2, 1.10, 4, '2026-03-22'),
    -- Detalles pedido 4 (carnes - repartido 12/3)
    (5, 9, 1, 14.50, 2, '2026-03-10'),
    (5, 10, 2, 8.90, 3, '2026-03-10'),
    (5, 11, 1, 7.50, 4, '2026-03-10'),
    -- Detalles pedido 5 (carnes - repartido 22/3)
    (6, 9, 2, 14.50, 2, '2026-03-20'),
    (6, 12, 0.5, 22.00, 3, '2026-03-20'),
    -- Detalles pedido 6 (huevos - repartido 9/3)
    (7, 17, 2, 4.50, 2, '2026-03-07'),
    (7, 18, 1, 3.80, 3, '2026-03-07'),
    -- Detalles pedido 7 (huevos - repartido 18/3)
    (8, 17, 3, 4.50, 2, '2026-03-16'),
    (8, 18, 2, 3.80, 3, '2026-03-16'),
    -- Detalles pedido 8 (panadería - repartido 12/3)
    (9, 14, 2, 2.80, 2, '2026-03-10'),
    (9, 15, 1, 3.20, 3, '2026-03-10'),
    (9, 16, 4, 1.50, 4, '2026-03-10'),
    -- Detalles pedido 9 (panadería - repartido 21/3)
    (10, 14, 3, 2.80, 2, '2026-03-19'),
    (10, 16, 6, 1.50, 3, '2026-03-19'),
    -- Detalles pedido 10 (vinos - repartido 18/3)
    (11, 22, 2, 6.50, 2, '2026-03-15'),
    (11, 23, 2, 5.80, 3, '2026-03-15'),
    -- Detalles pedido 11 (lácteos - entregado 3/3)
    (12, 19, 4, 3.20, 2, '2026-03-01'),
    (12, 20, 0.5, 12.50, 3, '2026-03-01'),
    -- Detalles pedido 12 (legumbres - cancelado 8/3)
    (13, 26, 2, 2.80, 2, '2026-03-08'),
    (13, 27, 1, 3.20, 3, '2026-03-08');

-- Detalles pedidos pendientes de entrega (cerrados con estado pendiente/en proceso)
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, id_usuario_comprador, fecha_modificacion)
VALUES
    -- Pedido 13: frutas, cerrado 29/3, estado pendiente (pendiente de entrega)
    (13, 1, 4, 2.80, 2, '2026-03-29'),
    (13, 2, 3, 2.20, 3, '2026-03-29'),
    (13, 4, 2, 3.50, 4, '2026-03-29'),
    -- Pedido 14: carnes, cerrado 30/3, estado en proceso (pendiente de entrega)
    (14, 9, 1, 14.50, 2, '2026-03-30'),
    (14, 10, 2, 8.90, 3, '2026-03-30'),
    -- Pedido 15: vinos, cerrado 28/3, estado entregado (NO debe aparecer)
    (15, 22, 3, 6.50, 2, '2026-03-28');

-- Detalles pedidos abiertos
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, id_usuario_comprador, fecha_modificacion)
VALUES
    -- Pedido 16: panadería, cierra 5/4 (abierto)
    (16, 14, 2, 2.80, 2, '2026-03-27'),
    (16, 15, 1, 3.20, 3, '2026-03-27'),
    (16, 16, 3, 1.50, 4, '2026-03-27'),
    -- Pedido 17: huevos, cierra 2/4 (abierto)
    (17, 17, 3, 4.50, 2, '2026-03-30'),
    (17, 18, 2, 3.80, 3, '2026-03-30'),
    -- Pedido 18: lácteos, cierra 6/4 (abierto)
    (18, 19, 4, 3.20, 2, '2026-03-28'),
    (18, 20, 1, 12.50, 3, '2026-03-28'),
    (18, 21, 2, 1.40, 4, '2026-03-28'),
    -- Pedido 19: vinos, cierra 8/4 (abierto)
    (19, 22, 2, 6.50, 2, '2026-03-29'),
    (19, 23, 2, 5.80, 3, '2026-03-29'),
    -- Pedido 20: legumbres, cierra 4/4 (abierto)
    (20, 26, 3, 2.80, 2, '2026-03-30'),
    (20, 27, 2, 3.20, 3, '2026-03-30'),
    -- Pedido 21: frutas, cierra 3/4 (abierto)
    (21, 1, 5, 2.80, 2, '2026-03-29'),
    (21, 2, 4, 2.20, 3, '2026-03-29');

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
    (2, 1, 25.00, '2026-02-28', 'completado', '2026-02', 'liquidacion', 'Liquidación febrero - Frutas y Carnes', TRUE, '2026-02-27', '2026-02-28', '2026-02-28'),
    (3, 1, 30.00, '2026-02-28', 'completado', '2026-02', 'liquidacion', 'Liquidación febrero - Frutas y Carnes', TRUE, '2026-02-27', '2026-02-28', '2026-02-28'),
    -- Pagos pendientes marzo (deben pagarse a Admin por pedidos de Frutas y Carnes)
    (2, 1, 25.70, NULL, 'pendiente', '2026-03', 'liquidacion', 'Liquidación marzo - Frutas y Carnes', FALSE, NULL, NULL, '2026-03-29'),
    (3, 1, 24.40, NULL, 'pendiente', '2026-03', 'liquidacion', 'Liquidación marzo - Frutas y Carnes', FALSE, NULL, NULL, '2026-03-29'),
    (4, 1, 7.00, NULL, 'pendiente', '2026-03', 'liquidacion', 'Liquidación marzo - Frutas', FALSE, NULL, NULL, '2026-03-29');

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
