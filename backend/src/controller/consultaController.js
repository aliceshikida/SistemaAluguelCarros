const consultaService = require('../service/consultaService');

async function listarClientes(req, res, next) {
  try {
    const result = await consultaService.listarClientes();
    res.status(200).json({ sucesso: true, dados: result });
  } catch (error) {
    next(error);
  }
}

async function listarAgentes(req, res, next) {
  try {
    const result = await consultaService.listarAgentes();
    res.status(200).json({ sucesso: true, dados: result });
  } catch (error) {
    next(error);
  }
}

async function listarContratos(req, res, next) {
  try {
    const result = await consultaService.listarContratos();
    res.status(200).json({ sucesso: true, dados: result });
  } catch (error) {
    next(error);
  }
}

module.exports = { listarClientes, listarAgentes, listarContratos };
