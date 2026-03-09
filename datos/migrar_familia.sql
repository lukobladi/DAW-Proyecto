-- Script de migración: Añadir campo familia
-- Ejecutar este script para actualizar la estructura de la base de datos

-- 1. Añadir columna familia a Usuario (número de familia)
ALTER TABLE Usuario ADD COLUMN IF NOT EXISTS familia INT;

-- 2 familia. Añadir columna a Proveedor (familia gestora)
ALTER TABLE Proveedor ADD COLUMN IF NOT EXISTS familia INT;

-- 3. Los usuarios con la misma familia pueden gestionar el mismo proveedor
-- La relación usuario-proveedor se simplifica: 
-- ahora un proveedor tiene una familia Gestora, y TODOS los usuarios de esa familia pueden gestionar

-- Actualizar los números de familia basándose en los nombres (aproximado)
-- Familia 1: Álvaro - Irene
-- Familia 2: Elizabeth - Imanol
-- Familia 3: Cristina - Ramón
-- etc.

DO $$
DECLARE
    rec RECORD;
BEGIN
    -- Asignar familias basándose en nombres
    UPDATE Usuario SET familia = 1 WHERE nombre ILIKE '%álvaro%irene%' OR nombre ILIKE '%irene%álvaro%';
    UPDATE Usuario SET familia = 2 WHERE nombre ILIKE '%elizabeth%imanol%' OR nombre ILIKE '%imanol%elizabeth%';
    UPDATE Usuario SET familia = 3 WHERE nombre ILIKE '%cristina%ramón%' OR nombre ILIKE '%ramón%cristina%';
    UPDATE Usuario SET familia = 4 WHERE nombre ILIKE '%aitor%leyre%' OR nombre ILIKE '%leyre%aitor%';
    UPDATE Usuario SET familia = 5 WHERE nombre ILIKE '%monika%puska%' OR nombre ILIKE '%puska%monika%';
    UPDATE Usuario SET familia = 6 WHERE nombre = 'Montse';
    UPDATE Usuario SET familia = 7 WHERE nombre ILIKE '%david%ana%' OR nombre ILIKE '%ana%david%';
    UPDATE Usuario SET familia = 8 WHERE nombre ILIKE '%lentejo%amaia%' OR nombre ILIKE '%amaia%lentejo%';
    UPDATE Usuario SET familia = 9 WHERE nombre ILIKE '%andoni%amaia%' OR nombre ILIKE '%amaia%andoni%';
    UPDATE Usuario SET familia = 10 WHERE nombre ILIKE '%carmen%oskar%' OR nombre ILIKE '%oskar%carmen%';
    UPDATE Usuario SET familia = 11 WHERE nombre ILIKE '%gurutzi%endika%' OR nombre ILIKE '%endika%gurutzi%';
    UPDATE Usuario SET familia = 12 WHERE nombre ILIKE '%sergio%arantza%' OR nombre ILIKE '%arantza%sergio%';
    UPDATE Usuario SET familia = 13 WHERE nombre ILIKE '%diana%ciro%' OR nombre ILIKE '%ciro%diana%';
    UPDATE Usuario SET familia = 14 WHERE nombre ILIKE '%esther%dani%' OR nombre ILIKE '%dani%esther%';
    UPDATE Usuario SET familia = 15 WHERE nombre ILIKE '%mónica%eduardo%' OR nombre ILIKE '%eduardo%mónica%' OR nombre ILIKE '%monica%eduardo%';
    UPDATE Usuario SET familia = 16 WHERE nombre ILIKE '%idoia%jorge%' OR nombre ILIKE '%jorge%idoia%';
    UPDATE Usuario SET familia = 17 WHERE nombre ILIKE '%beatriz%juan%' OR nombre ILIKE '%juan%beatriz%';
    UPDATE Usuario SET familia = 18 WHERE nombre ILIKE '%prem%jairo%' OR nombre ILIKE '%jairo%prem%';
    UPDATE Usuario SET familia = 19 WHERE nombre = 'Juan Segovia';
    UPDATE Usuario SET familia = 20 WHERE nombre ILIKE '%alberto%cristina%' OR nombre ILIKE '%cristina%alberto%';
    UPDATE Usuario SET familia = 21 WHERE nombre ILIKE '%isabel%josu%' OR nombre ILIKE '%josu%isabel%';
    UPDATE Usuario SET familia = 22 WHERE nombre ILIKE '%silvia%iván%' OR nombre ILIKE '%iván%silvia%' OR nombre ILIKE '%silvia%ivan%';
    UPDATE Usuario SET familia = 23 WHERE nombre ILIKE '%jorge%laura%' OR nombre ILIKE '%laura%jorge%';
    UPDATE Usuario SET familia = 24 WHERE nombre ILIKE '%vanesa%gaizka%' OR nombre ILIKE '%gaizka%vanesa%';
    UPDATE Usuario SET familia = 25 WHERE nombre ILIKE '%ioseba%aurora%' OR nombre ILIKE '%aurora%ioseba%';
    UPDATE Usuario SET familia = 26 WHERE nombre ILIKE '%helena%eneko%' OR nombre ILIKE '%eneko%helena%';
    UPDATE Usuario SET familia = 27 WHERE nombre = 'Idoia Tirapu';
    UPDATE Usuario SET familia = 28 WHERE nombre ILIKE '%alicia%ion%' OR nombre ILIKE '%ion%alicia%';
    UPDATE Usuario SET familia = 29 WHERE nombre = 'Silvia Sanz';
    UPDATE Usuario SET familia = 30 WHERE nombre = 'Guillermo Bea';
    UPDATE Usuario SET familia = 31 WHERE nombre ILIKE '%amaia%rafa%' OR nombre ILIKE '%rafa%amaia%';
    UPDATE Usuario SET familia = 32 WHERE nombre ILIKE '%maría%jesús%' OR nombre ILIKE '%jesús%maría%' OR nombre ILIKE '%maria%jesus%';
    UPDATE Usuario SET familia = 33 WHERE nombre ILIKE '%alfredo%ana%' OR nombre ILIKE '%ana%alfredo%';
    UPDATE Usuario SET familia = 34 WHERE nombre = 'Marga';
    UPDATE Usuario SET familia = 35 WHERE nombre ILIKE '%nerea%gonzalo%' OR nombre ILIKE '%gonzalo%nerea%';
    UPDATE Usuario SET familia = 36 WHERE nombre ILIKE '%olaia%josu%' OR nombre ILIKE '%josu%olaia%';
    UPDATE Usuario SET familia = 37 WHERE nombre ILIKE '%christian%paula%' OR nombre ILIKE '%paula%christian%';
    UPDATE Usuario SET familia = 38 WHERE nombre ILIKE '%silvia%mikel%' OR nombre ILIKE '%mikel%silvia%';
    
    RAISE NOTICE 'Familias asignadas a usuarios';
END $$;

-- Asignar familias a proveedores (familia gestora)
-- Panadería: Familia 26 (Helena - Eneko)
-- Lácteos: Familia 10 (Carmen - Oskar)
-- Limpieza: Familia 28 (Alicia - Ion)
UPDATE Proveedor SET familia = 26 WHERE nombre ILIKE '%panader%' OR nombre ILIKE '%orrio%';
UPDATE Proveedor SET familia = 10 WHERE nombre ILIKE '%lácteo%' OR nombre ILIKE '%jauregia%' OR nombre ILIKE '%esneki%';
UPDATE Proveedor SET familia = 28 WHERE nombre ILIKE '%limpieza%' OR nombre ILIKE '%biopompa%';

DO $$
BEGIN
    RAISE NOTICE 'Migración completada';
    RAISE NOTICE 'Usuarios con familia: %', (SELECT COUNT(*) FROM Usuario WHERE familia IS NOT NULL);
    RAISE NOTICE 'Proveedores con familia: %', (SELECT COUNT(*) FROM Proveedor WHERE familia IS NOT NULL);
END $$;
