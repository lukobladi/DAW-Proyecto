// Validadores para las peticiones HTTP

const { body, param, query } = require('express-validator');

const validators = {
  // Validacion para crear un usuario
  crearUsuario: [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('correo').isEmail().withMessage('El correo no es valido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contrasena debe tener al menos 6 caracteres'),
    body('familia')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La familia debe ser un numero entero positivo'),
  ],
  // Validacion para crear un pedido
  crearPedido: [
    body('id_usuario_encargado')
      .isInt()
      .withMessage('El ID del usuario encargado debe ser un numero'),
    body('id_proveedor')
      .isInt()
      .withMessage('El ID del proveedor debe ser un numero'),
    body('fecha_apertura')
      .isISO8601()
      .withMessage('La fecha de apertura debe ser valida'),
    body('fecha_cierre')
      .isISO8601()
      .withMessage('La fecha de cierre debe ser valida'),
    body('fecha_entrega')
      .isISO8601()
      .withMessage('La fecha de entrega debe ser valida'),
    body('estado')
      .isIn(['pendiente', 'en proceso', 'entregado', 'repartido', 'cancelado'])
      .withMessage('Estado no valido'),
  ],
  // Validacion para paginacion
  paginacion: [
    query('pagina')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La pagina debe ser un numero mayor a 0'),
    query('limite')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El limite debe ser un numero mayor a 0'),
  ],
  // Validacion para crear un pago
  crearPago: [
    body('id_usuario_deudor')
      .isInt({ min: 1 })
      .withMessage('El ID del usuario deudor debe ser un numero valido'),
    body('id_usuario_creditor')
      .isInt({ min: 1 })
      .withMessage('El ID del usuario acreedor debe ser un numero valido'),
    body('monto')
      .isFloat({ gt: 0 })
      .withMessage('El monto debe ser mayor que 0'),
    body('estado')
      .optional()
      .isIn(['pendiente', 'completado'])
      .withMessage('El estado del pago debe ser pendiente o completado'),
    body('periodo')
      .optional({ nullable: true })
      .matches(/^\d{4}-\d{2}(-\d{2})?$/)
      .withMessage('El periodo debe tener formato YYYY-MM o YYYY-MM-DD'),
  ],
};

module.exports = validators;
