-- Tabla para rastrear la última generación de pedidos periódicos
-- Permite saber cuándo se generó el último pedido para cada configuración periódica

CREATE TABLE IF NOT EXISTS Pedido_Periodico_Generacion (
    id_pedido_periodico INTEGER REFERENCES Pedido_Periodico(id_pedido_periodico) ON DELETE CASCADE,
    ultimo_pedido_generado DATE NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY (id_pedido_periodico)
);

-- Comentarios para documentación
COMMENT ON TABLE Pedido_Periodico_Generacion IS 'Almacena la fecha de última generación de pedidos para cada configuración periódica';
COMMENT ON COLUMN Pedido_Periodico_Generacion.id_pedido_periodico IS 'FK a Pedido_Periodico';
COMMENT ON COLUMN Pedido_Periodico_Generacion.ultimo_pedido_generado IS 'Fecha del último pedido generado automáticamente';
