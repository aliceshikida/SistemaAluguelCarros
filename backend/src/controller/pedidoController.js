const pedidoService = require('../service/pedidoService');

async function criar(req, res, next) {
  try {
    const result = await pedidoService.criarPedido(req.usuario, req.body);
    res.status(201).json({ sucesso: true, dados: result });
  } catch (error) {
    next(error);
  }
}

async function listar(req, res, next) {
  try {
    const result = await pedidoService.listarPedidos(req.usuario);
    res.status(200).json({ sucesso: true, dados: result });
  } catch (error) {
    next(error);
  }
}

async function atualizar(req, res, next) {
  try {
    const result = await pedidoService.modificarPedido(req.usuario, Number(req.params.id), req.body);
    res.status(200).json({ sucesso: true, dados: result });
  } catch (error) {
    next(error);
  }
}

async function cancelar(req, res, next) {
  try {
    const result = await pedidoService.cancelarPedido(req.usuario, Number(req.params.id));
    res.status(200).json({ sucesso: true, dados: result });
  } catch (error) {
    next(error);
  }
}

async function avaliar(req, res, next) {
  try {
    const result = await pedidoService.avaliarPedido(req.usuario, Number(req.params.id), req.body);
    res.status(200).json({ sucesso: true, dados: result });
  } catch (error) {
    next(error);
  }
}

async function executarContrato(req, res, next) {
  try {
    const result = await pedidoService.executarContrato(req.usuario, Number(req.params.id));
    res.status(201).json({ sucesso: true, dados: result });
  } catch (error) {
    next(error);
  }
}

module.exports = { criar, listar, atualizar, cancelar, avaliar, executarContrato };
