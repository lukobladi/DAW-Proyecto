const pool = require('../db');

const Proveedor = {
  // Crear un nuevo proveedor
  async create(nombre, contacto, telefono, correo) {
    const query = `
      INSERT INTO Proveedor (Nombre, Contacto, Telefono, Correo)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [nombre, contacto, telefono, correo];
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
  async update(id, nombre, contacto, telefono, correo) {
    const query = `
      UPDATE Proveedor
      SET Nombre = $1, Contacto = $2, Telefono = $3, Correo = $4
      WHERE ID_Proveedor = $5
      RETURNING *;
    `;
    const values = [nombre, contacto, telefono, correo, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Eliminar un proveedor
  async delete(id) {
    const query = 'DELETE FROM Proveedor WHERE ID_Proveedor = $1;';
    await pool.query(query, [id]);
  },
};

module.exports = Proveedor;