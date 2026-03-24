const pedidoRepository = require('../repository/pedidoRepository');
const automovelRepository = require('../repository/automovelRepository');
const contratoRepository = require('../repository/contratoRepository');
const financeRepository = require('../repository/financeRepository');
const { Roles, PedidoStatus, TipoProprietario } = require('../model/enums');
const AppError = require('../exception/AppError');

async function criarPedido(usuario, payload) {
  if (usuario.role !== Roles.CLIENTE) {
    throw new AppError('Somente clientes podem criar pedidos.', 403);
  }

  const car = await automovelRepository.findCarById(payload.automovel_id);
  if (!car) {
    throw new AppError('Automóvel não encontrado.', 404);
  }

  const result = await pedidoRepository.createPedido({ ...payload, cliente_id: usuario.id, status: PedidoStatus.PENDENTE });
  return { id: result.id, mensagem: 'Pedido criado com sucesso.' };
}

async function listarPedidos(usuario) {
  if (usuario.role === Roles.CLIENTE) {
    return {
      pedidos: await pedidoRepository.listByCliente(usuario.id),
      financeiro: await financeRepository.listClientFinancialData(usuario.id)
    };
  }

  return { pedidos: await pedidoRepository.listAllWithParties() };
}

async function modificarPedido(usuario, pedidoId, payload) {
  const pedido = await pedidoRepository.findById(pedidoId);
  if (!pedido) {
    throw new AppError('Pedido não encontrado.', 404);
  }

  if (usuario.role === Roles.CLIENTE && pedido.cliente_id !== usuario.id) {
    throw new AppError('Cliente só pode modificar os próprios pedidos.', 403);
  }

  if (usuario.role === Roles.CLIENTE && ![PedidoStatus.PENDENTE, PedidoStatus.EM_ANALISE].includes(pedido.status)) {
    throw new AppError('Pedido não pode ser alterado neste status.', 400);
  }

  if (![Roles.CLIENTE, Roles.EMPRESA, Roles.BANCO].includes(usuario.role)) {
    throw new AppError('Perfil sem permissão para modificar pedido.', 403);
  }

  await pedidoRepository.updatePedido(pedidoId, payload);
  return { mensagem: 'Pedido atualizado com sucesso.' };
}

async function cancelarPedido(usuario, pedidoId) {
  if (usuario.role !== Roles.CLIENTE) {
    throw new AppError('Somente clientes podem cancelar pedidos.', 403);
  }

  const pedido = await pedidoRepository.findById(pedidoId);
  if (!pedido) {
    throw new AppError('Pedido não encontrado.', 404);
  }

  if (pedido.cliente_id !== usuario.id) {
    throw new AppError('Cliente só pode cancelar os próprios pedidos.', 403);
  }

  await pedidoRepository.cancelPedido(pedidoId);
  return { mensagem: 'Pedido cancelado com sucesso.' };
}

async function avaliarPedido(usuario, pedidoId, payload) {
  if (![Roles.EMPRESA, Roles.BANCO].includes(usuario.role)) {
    throw new AppError('Somente agentes podem avaliar pedidos.', 403);
  }

  const pedido = await pedidoRepository.findById(pedidoId);
  if (!pedido) {
    throw new AppError('Pedido não encontrado.', 404);
  }

  const status = payload.aprovado ? PedidoStatus.APROVADO : PedidoStatus.REPROVADO;
  await pedidoRepository.updateStatusAndAnalysis(pedidoId, status, payload.analise_financeira, usuario.id);
  return { mensagem: `Pedido ${payload.aprovado ? 'aprovado' : 'reprovado'} com sucesso.` };
}

async function executarContrato(usuario, pedidoId) {
  if (![Roles.EMPRESA, Roles.BANCO].includes(usuario.role)) {
    throw new AppError('Somente agentes podem executar contrato.', 403);
  }

  const pedido = await pedidoRepository.findById(pedidoId);
  if (!pedido) {
    throw new AppError('Pedido não encontrado.', 404);
  }

  if (pedido.status !== PedidoStatus.APROVADO) {
    throw new AppError('Somente pedidos aprovados podem gerar contrato.', 400);
  }

  const existing = await contratoRepository.findByPedido(pedidoId);
  if (existing) {
    throw new AppError('Já existe contrato para este pedido.', 409);
  }

  const result = await contratoRepository.createContrato({
    pedido_id: pedidoId,
    cliente_id: pedido.cliente_id,
    automovel_id: pedido.automovel_id,
    agente_id: usuario.id,
    status: 'EXECUTADO'
  });

  await pedidoRepository.updateStatusAndAnalysis(pedidoId, PedidoStatus.CONTRATO_EXECUTADO, pedido.analise_financeira, usuario.id);

  const ownerType = usuario.role === Roles.BANCO ? TipoProprietario.BANCO : TipoProprietario.EMPRESA;
  await automovelRepository.updateOwnership(pedido.automovel_id, ownerType, usuario.id);

  return { contrato_id: result.id, mensagem: 'Contrato executado com sucesso.' };
}

module.exports = { criarPedido, listarPedidos, modificarPedido, cancelarPedido, avaliarPedido, executarContrato };
