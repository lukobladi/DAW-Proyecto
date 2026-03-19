-- Script para añadir columna Familia a tablas existentes
-- Ejecutar si la BD ya existe sin la columna Familia

-- Añadir columna Familia a Usuario si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuario' AND column_name = 'familia'
    ) THEN 
        ALTER TABLE Usuario ADD COLUMN Familia INTEGER;
        RAISE NOTICE 'Columna Familia añadida a tabla Usuario';
    ELSE
        RAISE NOTICE 'Columna Familia ya existe en tabla Usuario';
    END IF;
END $$;

-- Añadir columna Familia a Proveedor si no existe
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'proveedor' AND column_name = 'familia'
    ) THEN 
        ALTER TABLE Proveedor ADD COLUMN Familia INTEGER;
        RAISE NOTICE 'Columna Familia añadida a tabla Proveedor';
    ELSE
        RAISE NOTICE 'Columna Familia ya existe en tabla Proveedor';
    END IF;
END $$;
