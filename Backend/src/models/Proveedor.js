const pool = require('../config/db');

const validFrecuencias = ['semanal', 'mensual', 'bimestral', 'trimestral', 'semestral', 'anual'];

const Proveedor = {
  // Crear un nuevo proveedor con Fecha_Modificacion
  async create(nombre, contacto, telefono, movil, correo, metodo_pago, frecuencia_pedido_aproximada, envio_movil, envio_mail) {
    if (!frecuencia_pedido_aproximada || !validFrecuencias.includes(frecuencia_pedido_aproximada)) {
      throw new Error('Invalid frecuencia_pedido_aproximada value');
    }
    const query = `
      INSERT INTO Proveedor (Nombre, Contacto, Telefono, Movil, Correo, Metodo_Pago, Frecuencia_Pedido_Aproximada, Envio_Movil, Envio_Mail, Fecha_Modificacion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const values = [nombre, contacto, telefono, movil, correo, metodo_pago, frecuencia_pedido_aproximada, envio_movil, envio_mail];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Obtener todos los proveedores
  async findAll() {
    const query = 'SELECT * FROM Proveedor;';
    const { rows } = await pool.query(query);
    return rows;
  },

  // Obtener un proveedor por ID
  async findById(id) {
    const query = 'SELECT * FROM Proveedor WHERE ID_Proveedor = $1;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Actualizar un proveedor
  async update(id, nombre, contacto, telefono, movil, correo, metodo_pago, frecuencia_pedido_aproximada, envio_movil, envio_mail) {
    if (!validFrecuencias.includes(frecuencia_pedido_aproximada)) {
      throw new Error('Invalid frecuencia_pedido_aproximada value');
    }
    const query = `
      UPDATE Proveedor
      SET Nombre = $1, Contacto = $2, Telefono = $3, Movil = $4, Correo = $5, Metodo_Pago = $6, Frecuencia_Pedido_Aproximada = $7, Envio_Movil = $8, Envio_Mail = $9, Fecha_Modificacion = CURRENT_TIMESTAMP
      WHERE ID_Proveedor = $10
      RETURNING *;
    `;
    const values = [nombre, contacto, telefono, movil, correo, metodo_pago, frecuencia_pedido_aproximada, envio_movil, envio_mail, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Eliminar un proveedor
  async delete(id) {
    const query = 'DELETE FROM Proveedor WHERE ID_Proveedor = $1;';
    await pool.query(query, [id]);
  },

  // Cambiar el estado activo/inactivo de un proveedor
  async toggleActiveStatus(id, isActive) {
    const query = `
      UPDATE Proveedor
      SET Activo = $1, Fecha_Modificacion = CURRENT_TIMESTAMP
      WHERE ID_Proveedor = $2
      RETURNING *;
    `;
    const values = [isActive, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }
};

module.exports = Proveedor;