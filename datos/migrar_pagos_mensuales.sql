-- Migra la tabla Pago para soportar liquidacion mensual y doble confirmacion.
-- Ejecutar con: psql -U postgres -d ekonsumo -f scripts/migrar_pagos_mensuales.sql

ALTER TABLE Pago
  ADD COLUMN IF NOT EXISTS Periodo DATE,
  ADD COLUMN IF NOT EXISTS Origen VARCHAR(50) NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS Concepto TEXT,
  ADD COLUMN IF NOT EXISTS Deudor_Reporta_Pagado BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS Fecha_Reporte_Deudor TIMESTAMP,
  ADD COLUMN IF NOT EXISTS Fecha_Confirmacion_Receptor TIMESTAMP,
  ADD COLUMN IF NOT EXISTS Fecha_Modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'pago_unico_periodo_origen'
  ) THEN
    ALTER TABLE Pago
      ADD CONSTRAINT pago_unico_periodo_origen
      UNIQUE (ID_Usuario_Deudor, ID_Usuario_Creditor, Periodo, Origen);
  END IF;
END $$;

UPDATE Pago
SET Origen = 'manual'
WHERE Origen IS NULL;
