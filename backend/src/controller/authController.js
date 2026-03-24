const authService = require('../service/authService');

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ sucesso: true, dados: result });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({ sucesso: true, dados: result });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login };
