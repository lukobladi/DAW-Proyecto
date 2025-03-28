const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.error('Authorization header missing'); // Debugging log
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error('Token missing in Authorization header'); // Debugging log
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    console.log('Verifying token:', token); // Debugging log
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Invalid token:', err.message); // Debugging log
    return res.status(401).json({ message: 'Invalid token' });
  }
};