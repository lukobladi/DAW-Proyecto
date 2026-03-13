// Middleware que intercepta la autenticacion JWT 
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.error('No se encuentra header Authorization'); // Log de depuracion
    return res
      .status(401)
      .json({ message: 'No se encuentra header Authorization' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error('No se encuentra token en header Authorization'); // Log de depuracion
    return res.status(401).json({ message: 'Token no encontrado' });
  }

  try {
    console.log('Verificando token:', token); // Log de depuracion
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token invalido:', err.message); // Log de depuracion
    return res.status(401).json({ message: 'Token invalido' });
  }
};
