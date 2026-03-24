const creditoService = require('../service/creditoService');

async function associar(req, res, next) {
  try {
    const result = await creditoService.associarCredito(req.usuario, req.body);
    res.status(201).json({ sucesso: true, dados: result });
  } catch (error) {
    next(error);
  }
}

async function listar(req, res, next) {
  try {
    const result = await creditoService.listarCreditos();
    res.status(200).json({ sucesso: true, dados: result });
  } catch (error) {
    next(error);
  }
}

module.exports = { associar, listar };
