
const pool = require('../config/db');
const FamiliaProveedor = require('./FamiliaProveedor');

const validFrecuencias = [
  'semanal',
  'mensual',
  'bimestral',
  'trimestral',
  'semestral',
  'anual',
  'sin determinar',
];

const Proveedor = {
  // Crear un nuevo proveedor (sin familia)
  async create(
    nombre,
    contacto,
    telefono,
    movil,
    correo,
    metodo_pago,
    frecuencia_pedido_aproximada,
    envio_movil,
    envio_mail
  ) {
    if (
      !frecuencia_pedido_aproximada ||
      !validFrecuencias.includes(frecuencia_pedido_aproximada)
    ) {
      throw new Error('Valor de frecuencia_pedido_aproximada invalido');
    }
    const query = `
      INSERT INTO proveedor (nombre, contacto, telefono, movil, correo, metodo_pago, frecuencia_pedido_aproximada, envio_movil, envio_mail, fecha_modificacion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const values = [
      nombre,
      contacto,
      telefono,
      movil,
      correo,
      metodo_pago,
      frecuencia_pedido_aproximada,
      envio_movil,
      envio_mail,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Obtener todos los proveedores con su familia asignada
  async findAll() {
    const query = `
      SELECT p.*, fp.id_familia as familia
      FROM proveedor p
      LEFT JOIN familia_proveedor fp ON p.id_proveedor = fp.id_proveedor
      ORDER BY p.id_proveedor;
    `;
    const { rows } = await pool.query(query);
    return rows;
  },

  // Obtener un proveedor por ID con su familia
  async findById(id) {
    const query = `
      SELECT p.*, fp.id_familia as familia
      FROM proveedor p
      LEFT JOIN familia_proveedor fp ON p.id_proveedor = fp.id_proveedor
      WHERE p.id_proveedor = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  // Obtener proveedor por familia gestora
  async findByFamilia(familia) {
    return FamiliaProveedor.findProveedoresByFamilia(familia);
  },

  // Actualizar un proveedor (sin familia)
  async update(
    id,
    nombre,
    contacto,
    telefono,
    movil,
    correo,
    metodo_pago,
    frecuencia_pedido_aproximada,
    envio_movil,
    envio_mail
  ) {
    if (!validFrecuencias.includes(frecuencia_pedido_aproximada)) {
      throw new Error('Valor de frecuencia_pedido_aproximada invalido');
    }
    const query = `
      UPDATE proveedor
      SET nombre = $1, contacto = $2, telefono = $3, movil = $4, correo = $5, metodo_pago = $6, frecuencia_pedido_aproximada = $7, envio_movil = $8, envio_mail = $9, fecha_modificacion = CURRENT_TIMESTAMP
      WHERE id_proveedor = $10
      RETURNING *;
    `;
    const values = [
      nombre,
      contacto,
      telefono,
      movil,
      correo,
      metodo_pago,
      frecuencia_pedido_aproximada,
      envio_movil,
      envio_mail,
      id,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Eliminar un proveedor
  async delete(id) {
    const query = 'DELETE FROM proveedor WHERE id_proveedor = $1;';
    await pool.query(query, [id]);
  },

  // Activar o desactivar un proveedor
  async toggleActiveStatus(id, isActive) {
    const query = `
      UPDATE proveedor
      SET activo = $1, fecha_modificacion = CURRENT_TIMESTAMP
      WHERE id_proveedor = $2
      RETURNING *;
    `;
    const values = [isActive, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
};

module.exports = Proveedor;

