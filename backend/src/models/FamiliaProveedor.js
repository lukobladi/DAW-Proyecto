const pool = require('../config/db');

const FamiliaProveedor = {
  // Asignar un proveedor a una familia
  async asignar(id_familia, id_proveedor) {
    const query = `
      INSERT INTO familia_proveedor (id_familia, id_proveedor)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id_familia, id_proveedor]);
    return rows[0];
  },

  // Desasignar un proveedor de una familia
  async desasignar(id_familia, id_proveedor) {
    const query = 'DELETE FROM familia_proveedor WHERE id_familia = $1 AND id_proveedor = $2;';
    await pool.query(query, [id_familia, id_proveedor]);
  },

  // Encontrar todas las asignaciones
  async findAll() {
    const query = 'SELECT * FROM familia_proveedor;';
    const { rows } = await pool.query(query);
    return rows;
  },

  // Encontrar proveedores por familia
  async findProveedoresByFamilia(id_familia) {
    const query = `
      SELECT p.* FROM Proveedor p
      JOIN familia_proveedor fp ON p.id_proveedor = fp.id_proveedor
      WHERE fp.id_familia = $1;
    `;
    const { rows } = await pool.query(query, [id_familia]);
    return rows;
  },

  // Encontrar familias por proveedor
  async findFamiliasByProveedor(id_proveedor) {
    const query = 'SELECT id_familia FROM familia_proveedor WHERE id_proveedor = $1;';
    const { rows } = await pool.query(query, [id_proveedor]);
    return rows.map(r => r.id_familia);
  },
};

module.exports = FamiliaProveedor;
