const pool = require('../config/db');

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
    const query = 'SELECT * FROM producto;';
    const { rows } = await pool.query(query);
    return rows;
  },

  // Obtener un producto por ID
  async findById(id) {
    const query = 'SELECT * FROM producto WHERE id_producto = $1;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Obtener productos por proveedor
  async findByProveedor(id_proveedor) {
    const query = 'SELECT * FROM producto WHERE id_proveedor = $1;';
    const { rows } = await pool.query(query, [id_proveedor]);
    return rows;
  },

  // Actualizar el campo activo de un producto
  async updateActivo(id_producto, activo) {
    const query = `
      UPDATE producto
      SET activo = $1, fecha_modificacion = CURRENT_TIMESTAMP
      WHERE id_producto = $2
      RETURNING *;
    `;
    const values = [activo, id_producto];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async updateEstado(id_producto, activo) {
    return this.updateActivo(id_producto, activo);
  },

  async update(id_producto, nombre, descripcion, precio, id_proveedor, imagen, activo) {
    const query = `
      UPDATE producto
      SET nombre = $1, descripcion = $2, precio = $3, id_proveedor = $4, imagen = COALESCE($5, imagen), activo = COALESCE($6, activo), fecha_modificacion = CURRENT_TIMESTAMP
      WHERE id_producto = $7
      RETURNING *;
    `;
    const values = [nombre, descripcion, precio, id_proveedor, imagen, activo, id_producto];
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
