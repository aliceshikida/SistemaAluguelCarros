const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../exception/AppError');

function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    next(new AppError('Token não informado.', 401));
    return;
  }

  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) {
    next(new AppError('Formato de token inválido.', 401));
    return;
  }

  try {
    req.usuario = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    next(new AppError('Token inválido ou expirado.', 401));
  }
}

module.exports = { authRequired };
