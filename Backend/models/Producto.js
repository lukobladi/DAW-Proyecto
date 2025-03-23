const pool = require('../db');

const Producto = {
  // Crear un nuevo producto
  async create(nombre, descripcion, precio, id_proveedor, imagen) {
    const query = `
      INSERT INTO producto (nombre, descripcion, precio, id_proveedor, imagen)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [nombre, descripcion, precio, id_proveedor, imagen];
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
  async update(id, nombre, descripcion, precio, id_proveedor, imagen) {
    const query = `
      UPDATE producto
      SET nombre = $1, descripcion = $2, precio = $3, id_proveedor = $4, imagen = $5
      WHERE id = $6
      RETURNING *;
    `;
    const values = [nombre, descripcion, precio, id_proveedor, imagen, id];
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