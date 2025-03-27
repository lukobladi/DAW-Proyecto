const jwt = require('jsonwebtoken');
const SECRET_KEY = '1234'; // Usa una clave secreta más segura

module.exports = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del encabezado Authorization
  if (!token) {
    return res.status(401).send('Acceso no autorizado: Token no proporcionado');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verificar el token
    req.user = decoded; // Agregar los datos del usuario al objeto `req`
    next();
  } catch (err) {
    res.status(401).send('Acceso no autorizado: Token inválido');
  }
};