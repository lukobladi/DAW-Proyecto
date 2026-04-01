// Validadores para las peticiones HTTP
// Incluye sanitización XSS y validación de datos

const { body, param, query } = require('express-validator');

const validators = {
  // Validación para login
  login: [
    body('correoOMovil')
      .notEmpty()
      .withMessage('El correo o móvil es obligatorio')
      .trim()
      .escape(),
    body('password')
      .notEmpty()
      .withMessage('La contraseña es obligatoria'),
  ],

  // Validación para crear/registrar usuario
  crearUsuario: [
    body('nombre')
      .notEmpty()
      .withMessage('El nombre es obligatorio')
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .trim()
      .escape(),
    body('correo')
      .notEmpty()
      .withMessage('El correo es obligatorio')
      .isEmail()
      .withMessage('El correo no es válido')
      .normalizeEmail()
      .trim(),
    body('password')
      .isLength({ min: 6, max: 100 })
      .withMessage('La contraseña debe tener entre 6 y 100 caracteres')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('La contraseña debe contener mayúsculas, minúsculas y números'),
    body('rol')
      .optional()
      .isIn(['admin', 'usuario', 'gestor'])
      .withMessage('El rol debe ser admin, usuario o gestor'),
    body('movil')
      .optional({ nullable: true })
      .custom((value) => {
        if (value === null || value === undefined || value === '') return true;
        if (!/^[0-9]{9,15}$/.test(value)) {
          throw new Error('El móvil debe ser un número válido (9-15 dígitos)');
        }
        return true;
      }),
  ],

  // Validación para actualizar usuario
  actualizarUsuario: [
    body('nombre')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .trim()
      .escape(),
    body('correo')
      .optional()
      .isEmail()
      .withMessage('El correo no es válido')
      .normalizeEmail()
      .trim(),
    body('rol')
      .optional()
      .isIn(['admin', 'usuario', 'gestor'])
      .withMessage('El rol debe ser admin, usuario o gestor'),
    body('movil')
      .optional()
      .matches(/^[0-9]{9,15}$/)
      .withMessage('El móvil debe ser un número válido')
      .trim(),
  ],

  // Validación para crear producto
  crearProducto: [
    body('nombre')
      .notEmpty()
      .withMessage('El nombre del producto es obligatorio')
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .trim()
      .escape(),
    body('descripcion')
      .optional()
      .isLength({ max: 500 })
      .withMessage('La descripción no puede exceder 500 caracteres')
      .trim()
      .escape(),
    body('precio')
      .notEmpty()
      .withMessage('El precio es obligatorio')
      .isFloat({ min: 0.01, max: 999999.99 })
      .withMessage('El precio debe ser mayor que 0 y menor que 1,000,000'),
    body('id_proveedor')
      .notEmpty()
      .withMessage('El proveedor es obligatorio')
      .isInt({ min: 1 })
      .withMessage('El ID del proveedor debe ser un número entero positivo'),
    body('activo')
      .optional()
      .isBoolean()
      .withMessage('El campo activo debe ser true o false'),
  ],

  // Validación para actualizar producto
  actualizarProducto: [
    body('nombre')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .trim()
      .escape(),
    body('descripcion')
      .optional()
      .isLength({ max: 500 })
      .withMessage('La descripción no puede exceder 500 caracteres')
      .trim()
      .escape(),
    body('precio')
      .optional()
      .isFloat({ min: 0.01, max: 999999.99 })
      .withMessage('El precio debe ser mayor que 0 y menor que 1,000,000'),
    body('id_proveedor')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del proveedor debe ser un número entero positivo'),
    body('activo')
      .optional()
      .isBoolean()
      .withMessage('El campo activo debe ser true o false'),
  ],

  // Validación para crear proveedor
  crearProveedor: [
    body('nombre')
      .notEmpty()
      .withMessage('El nombre del proveedor es obligatorio')
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .trim()
      .escape(),
    body('contacto')
      .optional()
      .isLength({ max: 100 })
      .withMessage('El contacto no puede exceder 100 caracteres')
      .trim()
      .escape(),
    body('telefono')
      .optional()
      .matches(/^[0-9]{9,15}$/)
      .withMessage('El teléfono debe ser un número válido')
      .trim(),
    body('movil')
      .optional()
      .matches(/^[0-9]{9,15}$/)
      .withMessage('El móvil debe ser un número válido')
      .trim(),
    body('correo')
      .optional()
      .isEmail()
      .withMessage('El correo no es válido')
      .normalizeEmail()
      .trim(),
    body('metodo_pago')
      .optional()
      .isLength({ max: 100 })
      .withMessage('El método de pago no puede exceder 100 caracteres')
      .trim()
      .escape(),
    body('frecuencia_pedido_aproximada')
      .notEmpty()
      .withMessage('La frecuencia de pedido es obligatoria')
      .isIn(['semanal', 'mensual', 'bimestral', 'trimestral', 'semestral', 'anual', 'sin determinar'])
      .withMessage('Frecuencia no válida'),
    body('envio_movil')
      .optional()
      .isBoolean()
      .withMessage('El campo envio_movil debe ser true o false'),
    body('envio_mail')
      .optional()
      .isBoolean()
      .withMessage('El campo envio_mail debe ser true o false'),
  ],

  // Validación para actualizar proveedor
  actualizarProveedor: [
    body('nombre')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres')
      .trim()
      .escape(),
    body('contacto')
      .optional()
      .isLength({ max: 100 })
      .withMessage('El contacto no puede exceder 100 caracteres')
      .trim()
      .escape(),
    body('telefono')
      .optional()
      .matches(/^[0-9]{9,15}$/)
      .withMessage('El teléfono debe ser un número válido')
      .trim(),
    body('movil')
      .optional()
      .matches(/^[0-9]{9,15}$/)
      .withMessage('El móvil debe ser un número válido')
      .trim(),
    body('correo')
      .optional()
      .isEmail()
      .withMessage('El correo no es válido')
      .normalizeEmail()
      .trim(),
    body('metodo_pago')
      .optional()
      .isLength({ max: 100 })
      .withMessage('El método de pago no puede exceder 100 caracteres')
      .trim()
      .escape(),
    body('frecuencia_pedido_aproximada')
      .optional()
      .isIn(['semanal', 'mensual', 'bimestral', 'trimestral', 'semestral', 'anual', 'sin determinar'])
      .withMessage('Frecuencia no válida'),
    body('envio_movil')
      .optional()
      .isBoolean()
      .withMessage('El campo envio_movil debe ser true o false'),
    body('envio_mail')
      .optional()
      .isBoolean()
      .withMessage('El campo envio_mail debe ser true o false'),
    body('activo')
      .optional()
      .isBoolean()
      .withMessage('El campo activo debe ser true o false'),
  ],

  // Validación para crear pedido
  crearPedido: [
    body('id_proveedor')
      .notEmpty()
      .withMessage('El proveedor es obligatorio')
      .isInt({ min: 1 })
      .withMessage('El ID del proveedor debe ser un número entero positivo'),
    body('fecha_apertura')
      .notEmpty()
      .withMessage('La fecha de apertura es obligatoria')
      .isISO8601()
      .withMessage('La fecha de apertura debe ser una fecha válida'),
    body('fecha_cierre')
      .notEmpty()
      .withMessage('La fecha de cierre es obligatoria')
      .isISO8601()
      .withMessage('La fecha de cierre debe ser una fecha válida')
      .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.fecha_apertura)) {
          throw new Error('La fecha de cierre debe ser posterior a la fecha de apertura');
        }
        return true;
      }),
    body('fecha_entrega')
      .optional({ nullable: true })
      .isISO8601()
      .withMessage('La fecha de entrega debe ser una fecha válida'),
    body('estado')
      .notEmpty()
      .withMessage('El estado es obligatorio')
      .isIn(['pendiente', 'en proceso', 'entregado', 'repartido', 'cancelado'])
      .withMessage('Estado no válido'),
  ],

  // Validación para actualizar pedido
  actualizarPedido: [
    body('id_proveedor')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del proveedor debe ser un número entero positivo'),
    body('fecha_apertura')
      .optional()
      .isISO8601()
      .withMessage('La fecha de apertura debe ser una fecha válida'),
    body('fecha_cierre')
      .optional()
      .isISO8601()
      .withMessage('La fecha de cierre debe ser una fecha válida'),
    body('fecha_entrega')
      .optional({ nullable: true })
      .isISO8601()
      .withMessage('La fecha de entrega debe ser una fecha válida'),
    body('estado')
      .optional()
      .isIn(['pendiente', 'en proceso', 'entregado', 'repartido', 'cancelado'])
      .withMessage('Estado no válido'),
  ],

  // Validación para cambiar estado de pedido
  cambiarEstadoPedido: [
    body('estado')
      .notEmpty()
      .withMessage('El estado es obligatorio')
      .isIn(['pendiente', 'en proceso', 'entregado', 'repartido', 'cancelado'])
      .withMessage('Estado no válido'),
  ],

  // Validación para crear detalle de pedido
  crearDetallePedido: [
    body('id_pedido')
      .notEmpty()
      .withMessage('El ID del pedido es obligatorio')
      .isInt({ min: 1 })
      .withMessage('El ID del pedido debe ser un número entero positivo'),
    body('id_producto')
      .notEmpty()
      .withMessage('El ID del producto es obligatorio')
      .isInt({ min: 1 })
      .withMessage('El ID del producto debe ser un número entero positivo'),
    body('cantidad')
      .notEmpty()
      .withMessage('La cantidad es obligatoria')
      .isInt({ min: 1, max: 1000 })
      .withMessage('La cantidad debe ser entre 1 y 1000'),
    body('precio_unitario')
      .notEmpty()
      .withMessage('El precio unitario es obligatorio')
      .isFloat({ min: 0.01, max: 999999.99 })
      .withMessage('El precio unitario debe ser mayor que 0'),
    body('id_usuario_comprador')
      .notEmpty()
      .withMessage('El ID del usuario comprador es obligatorio')
      .isInt({ min: 1 })
      .withMessage('El ID del usuario comprador debe ser un número entero positivo'),
  ],

  // Validación para crear pago
  crearPago: [
    body('id_usuario_deudor')
      .notEmpty()
      .withMessage('El usuario deudor es obligatorio')
      .isInt({ min: 1 })
      .withMessage('El ID del usuario deudor debe ser un número entero positivo'),
    body('id_usuario_creditor')
      .notEmpty()
      .withMessage('El usuario acreedor es obligatorio')
      .isInt({ min: 1 })
      .withMessage('El ID del usuario acreedor debe ser un número entero positivo'),
    body('monto')
      .notEmpty()
      .withMessage('El monto es obligatorio')
      .isFloat({ gt: 0, max: 999999.99 })
      .withMessage('El monto debe ser mayor que 0 y menor que 1,000,000'),
    body('estado')
      .optional()
      .isIn(['pendiente', 'completado'])
      .withMessage('El estado debe ser pendiente o completado'),
    body('periodo')
      .optional({ nullable: true })
      .matches(/^\d{4}-\d{2}(-\d{2})?$/)
      .withMessage('El periodo debe tener formato YYYY-MM o YYYY-MM-DD'),
    body('concepto')
      .optional()
      .isLength({ max: 500 })
      .withMessage('El concepto no puede exceder 500 caracteres')
      .trim()
      .escape(),
  ],

  // Validación para marcar pago
  marcarPago: [
    body('estado')
      .notEmpty()
      .withMessage('El estado es obligatorio')
      .isIn(['pendiente', 'completado'])
      .withMessage('El estado debe ser pendiente o completado'),
  ],

  // Validación para crear pedido periódico
  crearPedidoPeriodico: [
    body('id_proveedor')
      .notEmpty()
      .withMessage('El proveedor es obligatorio')
      .isInt({ min: 1 })
      .withMessage('El ID del proveedor debe ser un número entero positivo'),
    body('periodicidad')
      .notEmpty()
      .withMessage('La periodicidad es obligatoria')
      .isInt({ min: 1, max: 365 })
      .withMessage('La periodicidad debe ser entre 1 y 365 días'),
    body('dia_apertura')
      .optional()
      .isInt({ min: 1, max: 31 })
      .withMessage('El día de apertura debe ser entre 1 y 31'),
    body('dia_cierre')
      .optional()
      .isInt({ min: 1, max: 31 })
      .withMessage('El día de cierre debe ser entre 1 y 31'),
    body('dia_entrega')
      .optional()
      .isInt({ min: 1, max: 31 })
      .withMessage('El día de entrega debe ser entre 1 y 31'),
    body('activo')
      .optional()
      .isBoolean()
      .withMessage('El campo activo debe ser true o false'),
  ],

  // Validación para actualizar pedido periódico
  actualizarPedidoPeriodico: [
    body('id_proveedor')
      .optional()
      .isInt({ min: 1 })
      .withMessage('El ID del proveedor debe ser un número entero positivo'),
    body('periodicidad')
      .optional()
      .isInt({ min: 1, max: 365 })
      .withMessage('La periodicidad debe ser entre 1 y 365 días'),
    body('dia_apertura')
      .optional()
      .isInt({ min: 1, max: 31 })
      .withMessage('El día de apertura debe ser entre 1 y 31'),
    body('dia_cierre')
      .optional()
      .isInt({ min: 1, max: 31 })
      .withMessage('El día de cierre debe ser entre 1 y 31'),
    body('dia_entrega')
      .optional()
      .isInt({ min: 1, max: 31 })
      .withMessage('El día de entrega debe ser entre 1 y 31'),
    body('activo')
      .optional()
      .isBoolean()
      .withMessage('El campo activo debe ser true o false'),
  ],

  // Validación para asignar usuario a proveedor
  asignarUsuarioProveedor: [
    body('id_usuario')
      .notEmpty()
      .withMessage('El usuario es obligatorio')
      .isInt({ min: 1 })
      .withMessage('El ID del usuario debe ser un número entero positivo'),
    body('id_proveedor')
      .notEmpty()
      .withMessage('El proveedor es obligatorio')
      .isInt({ min: 1 })
      .withMessage('El ID del proveedor debe ser un número entero positivo'),
  ],

  // Validación para enviar notificación
  enviarNotificacion: [
    body('id_usuario')
      .notEmpty()
      .withMessage('El usuario es obligatorio')
      .isInt({ min: 1 })
      .withMessage('El ID del usuario debe ser un número entero positivo'),
    body('mensaje')
      .notEmpty()
      .withMessage('El mensaje es obligatorio')
      .isLength({ min: 1, max: 1000 })
      .withMessage('El mensaje debe tener entre 1 y 1000 caracteres')
      .trim()
      .escape(),
  ],

  // Validación para recuperar password
  recuperarPassword: [
    body('correoOMovil')
      .notEmpty()
      .withMessage('El correo o móvil es obligatorio')
      .trim()
      .escape(),
  ],

  // Validación para activar/desactivar usuario
  cambiarEstadoUsuario: [
    body('activo')
      .notEmpty()
      .withMessage('El estado es obligatorio')
      .isBoolean()
      .withMessage('El campo activo debe ser true o false'),
  ],

  // Validación para paginación
  paginacion: [
    query('pagina')
      .optional()
      .isInt({ min: 1 })
      .withMessage('La página debe ser un número mayor a 0'),
    query('limite')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('El límite debe ser entre 1 y 100'),
  ],

  // Validación de ID como parámetro
  idParam: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('El ID debe ser un número entero positivo'),
  ],

  idParamPedido: [
    param('id_pedido')
      .isInt({ min: 1 })
      .withMessage('El ID del pedido debe ser un número entero positivo'),
  ],
};

module.exports = validators;
