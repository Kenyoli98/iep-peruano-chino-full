const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado.' });
  }

  const token = authHeader.substring(7);

  try {
    const jwtSecret = process.env.JWT_SECRET || 'CLAVE_SECRETA_SUPERSEGURA';
    const decoded = jwt.verify(token, jwtSecret);
    // Auth middleware working correctly
    req.usuario = decoded;
    next();
  } catch (error) {
    // Auth middleware error logged
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
}

module.exports = verificarToken;
