const adminOrGestor = (req, res, next) => {
  if (req.user && (req.user.rol === 'admin' || req.user.rol === 'gestor')) {
    next();
  } else {
    res
      .status(403)
      .send('Acceso denegado. Se requiere rol de administrador o gestor.');
  }
};
module.exports = adminOrGestor;
