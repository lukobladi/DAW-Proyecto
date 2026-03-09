-- Add familia column to Pedido table
ALTER TABLE Pedido ADD COLUMN IF NOT EXISTS familia INTEGER;

-- Make familia the foreign key to Usuario (via familia column)
-- This allows orders to be assigned to a family instead of a specific user
