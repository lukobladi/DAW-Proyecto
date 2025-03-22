const { body, param, query } = require('express-validator');

const validators = {
  // Validación para crear un usuario
  crearUsuario: [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('correo').isEmail().withMessage('El correo no es válido'),
    body('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  // Validación para crear un pedido
  crearPedido: [
    body('id_usuario_encargado').isInt().withMessage('El ID del usuario encargado debe ser un número'),
    body('id_proveedor').isInt().withMessage('El ID del proveedor debe ser un número'),
    body('fecha_apertura').isISO8601().withMessage('La fecha de apertura debe ser válida'),
    body('fecha_cierre').isISO8601().withMessage('La fecha de cierre debe ser válida'),
    body('fecha_entrega').isISO8601().withMessage('La fecha de entrega debe ser válida'),
    body('estado').isIn(['pendiente', 'en proceso', 'entregado', 'repartido', 'cancelado']).withMessage('Estado no válido'),
  ],
  // Validación para paginación
  paginacion: [
    query('pagina').optional().isInt({ min: 1 }).withMessage('La página debe ser un número mayor a 0'),
    query('limite').optional().isInt({ min: 1 }).withMessage('El límite debe ser un número mayor a 0'),
  ],
};

module.exports = validators;
