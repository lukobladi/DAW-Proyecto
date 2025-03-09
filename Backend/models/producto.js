const pool = require('../db');

const Producto = {
  // Crear un nuevo producto
  async create(nombre, descripcion, precio, id_proveedor) {
    const query = `
      INSERT INTO Producto (Nombre, Descripcion, Precio, ID_Proveedor)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [nombre, descripcion, precio, id_proveedor];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Obtener todos los productos
  async findAll() {
    const query = 'SELECT * FROM Producto;';
    const { rows } = await pool.query(query);
    return rows;
  },

  // Obtener un producto por ID
  async findById(id) {
    const query = 'SELECT * FROM Producto WHERE ID_Producto = $1;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Actualizar un producto
  async update(id, nombre, descripcion, precio, id_proveedor) {
    const query = `
      UPDATE Producto
      SET Nombre = $1, Descripcion = $2, Precio = $3, ID_Proveedor = $4
      WHERE ID_Producto = $5
      RETURNING *;
    `;
    const values = [nombre, descripcion, precio, id_proveedor, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Eliminar un producto
  async delete(id) {
    const query = 'DELETE FROM Producto WHERE ID_Producto = $1;';
    await pool.query(query, [id]);
  },
};

module.exports = Producto;