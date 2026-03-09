-- Script de importación de datos desde CSV
-- Ejecutar en orden: USUARIOS -> PROVEEDORES -> PRODUCTOS

-- ============================================
-- 1. USUARIOS (Familias del grupo de consumo)
-- ============================================

TRUNCATE TABLE Notificacion, Pago, Pedido_Periodico, Usuario_Proveedor, Detalle_Pedido, Pedido, Producto, Proveedor, Usuario RESTART IDENTITY CASCADE;

INSERT INTO Usuario (Nombre, Correo, Pass, Movil, Rol, Activo, Saldo) VALUES
-- Contraseña: password123 (hash generado con bcrypt)
('Álvaro - Irene', 'alvaro.irene@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000001', 'usuario', TRUE, 0.00),
('Elizabeth - Imanol', 'elizabeth.imanol@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000002', 'usuario', TRUE, 0.00),
('Cristina - Ramón', 'cristina.ramon@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000003', 'usuario', TRUE, 0.00),
('Aitor - Leyre', 'aitor.leyre@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000004', 'usuario', TRUE, 0.00),
('Monika - Puska', 'monika.puska@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000005', 'usuario', TRUE, 0.00),
('Montse', 'montse@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000006', 'usuario', TRUE, 0.00),
('David - Ana', 'david.ana@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000007', 'usuario', TRUE, 0.00),
('Lentejo - Amaia', 'lentejo.amaia@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000008', 'usuario', TRUE, 0.00),
('Andoni - Amaia', 'andoni.amaia@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000009', 'usuario', TRUE, 0.00),
('Carmen - Oskar', 'carmen.oskar@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000010', 'usuario', TRUE, 0.00),
('Gurutzi - Endika', 'gurutzi.endika@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000011', 'usuario', TRUE, 0.00),
('Sergio - Arantza', 'sergio.arantza@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000012', 'usuario', TRUE, 0.00),
('Diana - Ciro', 'diana.ciro@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000013', 'usuario', TRUE, 0.00),
('Esther - Dani', 'esther.dani@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000014', 'usuario', TRUE, 0.00),
('Mónica - Eduardo', 'monica.eduardo@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000015', 'usuario', TRUE, 0.00),
('Idoia - Jorge', 'idoia.jorge@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000016', 'usuario', TRUE, 0.00),
('Beatriz - Juan', 'beatriz.juan@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000017', 'usuario', TRUE, 0.00),
('Prem - Jairo', 'prem.jairo@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000018', 'usuario', TRUE, 0.00),
('Juan Segovia', 'juan.segovia@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000019', 'usuario', TRUE, 0.00),
('Alberto - Cristina', 'alberto.cristina@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000020', 'usuario', TRUE, 0.00),
('Isabel - Josu', 'isabel.josu@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000021', 'usuario', TRUE, 0.00),
('Silvia - Iván', 'silvia.ivan@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000022', 'usuario', TRUE, 0.00),
('Jorge - Laura', 'jorge.laura@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000023', 'usuario', TRUE, 0.00),
('Vanesa - Gaizka', 'vanesa.gaizka@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000024', 'usuario', TRUE, 0.00),
('Ioseba - Aurora', 'ioseba.aurora@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000025', 'usuario', TRUE, 0.00),
('Helena - Eneko', 'helena.eneko@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000026', 'usuario', TRUE, 0.00),
('Idoia Tirapu', 'idoia.tirapu@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000027', 'usuario', TRUE, 0.00),
('Alicia - Ion', 'alicia.ion@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000028', 'usuario', TRUE, 0.00),
('Silvia Sanz', 'silvia.sanz@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000029', 'usuario', TRUE, 0.00),
('Guillermo Bea', 'guillermo.bea@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000030', 'usuario', TRUE, 0.00),
('Amaia - Rafa', 'amaia.rafa@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000031', 'usuario', TRUE, 0.00),
('María - Jesús', 'maria.jesus@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000032', 'usuario', TRUE, 0.00),
('Alfredo - Ana', 'alfredo.ana@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000033', 'usuario', TRUE, 0.00),
('Marga', 'marga@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000034', 'usuario', TRUE, 0.00),
('Nerea - Gonzalo', 'nerea.gonzalo@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000035', 'usuario', TRUE, 0.00),
('Olaia - Josu', 'olaia.josu@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000036', 'usuario', TRUE, 0.00),
('Christian - Paula', 'christian.paula@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000037', 'usuario', TRUE, 0.00),
('Silvia - Mikel', 'silvia.mikel@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000038', 'usuario', TRUE, 0.00),
-- Usuario administrador
('Admin', 'admin@ekonsumo.es', '$2b$10$FP8Biq1KkfFip1pqV.0xf.lRaUT6YrKZFhbmvNF5vh4ynkauKmgOW', '600000000', 'admin', TRUE, 0.00);

-- ============================================
-- 2. PROVEEDORES
-- ============================================

INSERT INTO Proveedor (Nombre, Contacto, Telefono, Movil, Correo, Metodo_Pago, Frecuencia_Pedido_Aproximada, Envio_Movil, Envio_Mail) VALUES
('Panadería Orrio', 'Patxi', '600332862', '675081796', 'rosaypatxi@yahoo.com', 'efectivo', 'semanal', TRUE, TRUE),
('Jauregia Esnekiak', 'Jauregia', '630390894', '675550960', 'jauregia.esnekiak@gmail.com', 'transferencia', 'semanal', TRUE, TRUE),
('Biopompas (Limpieza)', 'Alex y Sergio Fayanas', '686521332', '622789290', 'biopompaspamplona@gmail.com', 'efectivo', 'anual', FALSE, TRUE);

-- ============================================
-- 3. PRODUCTOS
-- ============================================

-- Productos Panadería (ID_Proveedor = 1)
INSERT INTO Producto (Nombre, Descripcion, Precio, ID_Proveedor, Activo) VALUES
('Pan de Trigo Molde', 'Pan de trigo molde 750g', 2.75, 1, TRUE),
('Pan de Trigo Hogaza Txiki', 'Pan de trigo hogaza 400g', 1.71, 1, TRUE),
('Pan con Semillas Molde', 'Pan con semillas molde 750g', 3.03, 1, TRUE),
('Pan con Semillas Hogaza Txiki', 'Pan con semillas hogaza 400g', 1.87, 1, TRUE),
('Pan de Cereales Molde', 'Pan de cereales molde 750g', 2.92, 1, TRUE),
('Pan de Cereales Panecillo', 'Pan de cereales panecillo 400g', 1.82, 1, TRUE),
('Pan de Espelta Molde', 'Pan de espelta molde 700g', 3.69, 1, TRUE),
('Pan de Espelta Hogaza Txiki', 'Pan de espelta hogaza 400g', 2.20, 1, TRUE),
('Pan de Kamut Molde', 'Pan de kamut molde 750g', 4.46, 1, TRUE),
('Pan de Kamut Hogaza Txiki', 'Pan de kamut hogaza 400g', 2.64, 1, TRUE),
('Pan Dulce con Pasas y Nueces', 'Pan dulce con pasas y nueces 300g', 3.58, 1, TRUE),
('Pan Dulce con Chocolate', 'Pan dulce con chocolate 300g', 4.02, 1, TRUE);

-- Productos Lácteos (ID_Proveedor = 2)
INSERT INTO Producto (Nombre, Descripcion, Precio, ID_Proveedor, Activo) VALUES
('Leche Pasteurizada', 'Leche pasteurizada 1L (caducidad 5 días)', 1.46, 2, TRUE),
('Yogurt', 'Yogurt 400g', 1.87, 2, TRUE),
('Yogur Batido con Azúcar', 'Yogur batido con azúcar 500ml', 2.31, 2, TRUE),
('Queso de Vaca', 'Queso de vaca 1kg', 13.62, 2, TRUE);

-- Productos Limpieza (ID_Proveedor = 3)
INSERT INTO Producto (Nombre, Descripcion, Precio, ID_Proveedor, Activo) VALUES
('Detergente Biobel 1.5L', 'Detergente biobel 1.5L', 7.84, 3, TRUE),
('Detergente Biobel 5L', 'Detergente biobel 5L', 20.40, 3, TRUE),
('Detergente Biobel 20L', 'Detergente biobel 20L', 84.80, 3, TRUE),
('Jabón Bebés y P. Delicadas Biobel 1.5L', 'Jabón bebés y ropa delicada biobel 1.5L', 7.76, 3, TRUE),
('Jabón Bebés y P. Delicadas Biobel 5L', 'Jabón bebés y ropa delicada biobel 5L', 20.55, 3, TRUE),
('Jabón Bebés y P. Delicadas Biobel 20L', 'Jabón bebés y ropa delicada biobel 20L', 84.00, 3, TRUE),
('Jabón Quitamanchas Biobel', 'Jabón quitamanchas biobel botella 750ml', 3.56, 3, TRUE),
('Jabón Pastilla Coco Biobel', 'Jabón pastilla coco biobel 240g', 3.44, 3, TRUE),
('Blanqueador Biobel 1kg', 'Blanqueador biobel 1kg', 6.16, 3, TRUE),
('Blanqueador Biobel 5kg', 'Blanqueador biobel 5kg', 27.32, 3, TRUE),
('Lavavajillas Biobel 1L', 'Lavavajillas biobel 1L', 4.28, 3, TRUE),
('Lavavajillas Biobel 5L', 'Lavavajillas biobel 5L', 20.40, 3, TRUE),
('Lavavajillas Biobel 20L', 'Lavavajillas biobel 20L', 88.88, 3, TRUE),
('Limpiahogar Biobel 1L', 'Limpiahogar biobel 1L', 4.95, 3, TRUE),
('Limpiahogar Biobel 5L', 'Limpiahogar biobel 5L', 21.68, 3, TRUE),
('Limpiahogar Biobel 20L', 'Limpiahogar biobel 20L', 85.28, 3, TRUE),
('Limpia Cristales Biobel Spray', 'Limpia cristales biobel spray 750ml', 4.36, 3, TRUE),
('Pastillas Lavavajillas Biobel', 'Pastillas lavavajillas biobel 30 uds', 7.56, 3, TRUE),
('Gel Vajillas Máquina 1L', 'Gel vajillas máquina 1L (novedad)', 5.30, 3, TRUE),
('Gel Vajillas Máquina 5L', 'Gel vajillas máquina 5L (novedad)', 35.60, 3, TRUE),
('Abrillantador Lavavajillas Biobel 1L', 'Abrillantador lavavajillas biobel 1L', 4.65, 3, TRUE),
('Sal Lavavajillas Automático Biobel 2kg', 'Sal lavavajillas automático biobel 2kg', 4.12, 3, TRUE),
('Papel Higiénico Renova Green', 'Papel higiénico 2 capas Renova Green 37.5m 6 uds', 3.50, 3, TRUE);

-- ============================================
-- 4. ASIGNACIONES USUARIO-PROVEEDOR (Gestores)
-- ============================================

INSERT INTO Usuario_Proveedor (ID_Usuario, ID_Proveedor) VALUES
-- El usuario 26 (Helena - Eneko) será gestor de Panadería
((SELECT ID_Usuario FROM Usuario WHERE Nombre LIKE '%Helena%' AND Nombre LIKE '%Eneko%'), 1),
-- El usuario 10 (Carmen - Oskar) será gestor de Lácteos
((SELECT ID_Usuario FROM Usuario WHERE Nombre LIKE '%Carmen%' AND Nombre LIKE '%Oskar%'), 2),
-- El usuario 28 (Alicia - Ion) será gestor de Limpieza
((SELECT ID_Usuario FROM Usuario WHERE Nombre LIKE '%Alicia%' AND Nombre LIKE '%Ion%'), 3);

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Importación completada correctamente';
  RAISE NOTICE 'Usuarios importados: %', (SELECT COUNT(*) FROM Usuario);
  RAISE NOTICE 'Proveedores importados: %', (SELECT COUNT(*) FROM Proveedor);
  RAISE NOTICE 'Productos importados: %', (SELECT COUNT(*) FROM Producto);
  RAISE NOTICE '========================================';
END $$;
