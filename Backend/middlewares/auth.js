const jwt = require('jsonwebtoken');
const SECRET_KEY = 'tu_clave_secreta'; // Usa la misma clave secreta que en el controlador

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send('Acceso denegado. No se proporcionó un token.');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Agrega los datos del usuario al objeto `req`
    next();
  } catch (err) {
    res.status(401).send('Token inválido o expirado.');
  }
};

module.exports = authMiddleware;