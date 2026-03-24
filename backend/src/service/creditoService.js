const contratoRepository = require('../repository/contratoRepository');
const { Roles } = require('../model/enums');
const AppError = require('../exception/AppError');

async function associarCredito(usuario, payload) {
  if (usuario.role !== Roles.BANCO) {
    throw new AppError('Somente bancos podem conceder contrato de crédito.', 403);
  }

  const contrato = await contratoRepository.findById(payload.contrato_id);
  if (!contrato) {
    throw new AppError('Contrato não encontrado.', 404);
  }

  const existing = await contratoRepository.findCreditByContratoId(payload.contrato_id);
  if (existing) {
    throw new AppError('Contrato de crédito já registrado para este contrato.', 409);
  }

  const created = await contratoRepository.createCredit({ ...payload, banco_id: usuario.id });
  return { id: created.id, mensagem: 'Contrato de crédito associado com sucesso.' };
}

function listarCreditos() {
  return contratoRepository.listCredits();
}

module.exports = { associarCredito, listarCreditos };
