function errorHandler(error, req, res, next) {
  const status = error.statusCode || 500;
  const message = error.message || 'Erro interno no servidor.';

  res.status(status).json({ sucesso: false, mensagem: message });
}

module.exports = errorHandler;
