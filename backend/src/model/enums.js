const Roles = {
  CLIENTE: 'CLIENTE',
  EMPRESA: 'EMPRESA',
  BANCO: 'BANCO'
};

const PedidoStatus = {
  PENDENTE: 'PENDENTE',
  EM_ANALISE: 'EM_ANALISE',
  APROVADO: 'APROVADO',
  REPROVADO: 'REPROVADO',
  CANCELADO: 'CANCELADO',
  CONTRATO_EXECUTADO: 'CONTRATO_EXECUTADO'
};

const TipoProprietario = {
  CLIENTE: 'CLIENTE',
  EMPRESA: 'EMPRESA',
  BANCO: 'BANCO'
};

module.exports = { Roles, PedidoStatus, TipoProprietario };
