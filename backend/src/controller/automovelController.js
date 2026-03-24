const automovelService = require('../service/automovelService');

async function cadastrar(req, res, next) {
  try {
    const result = await automovelService.cadastrarAutomovel(req.usuario, req.body);
    res.status(201).json({ sucesso: true, dados: result });
  } catch (error) {
    next(error);
  }
}

async function listar(req, res, next) {
  try {
    const result = await automovelService.listarAutomoveis();
    res.status(200).json({ sucesso: true, dados: result });
  } catch (error) {
    next(error);
  }
}

module.exports = { cadastrar, listar };
