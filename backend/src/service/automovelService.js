const automovelRepository = require('../repository/automovelRepository');
const { Roles, TipoProprietario } = require('../model/enums');
const AppError = require('../exception/AppError');

async function cadastrarAutomovel(usuario, payload) {
  if (![Roles.CLIENTE, Roles.EMPRESA, Roles.BANCO].includes(usuario.role)) {
    throw new AppError('Perfil sem permissão para cadastrar automóveis.', 403);
  }

  let ownerType = payload.owner_type || TipoProprietario.EMPRESA;
  if (!Object.values(TipoProprietario).includes(ownerType)) {
    throw new AppError('Tipo de proprietário inválido.', 400);
  }

  let ownerId = payload.owner_id || usuario.id;

  // Quando o cadastro é feito por cliente, a propriedade sempre pertence ao próprio cliente.
  if (usuario.role === Roles.CLIENTE) {
    ownerType = TipoProprietario.CLIENTE;
    ownerId = usuario.id;
  }

  const result = await automovelRepository.createCar({ ...payload, owner_type: ownerType, owner_id: ownerId });
  return { id: result.id, mensagem: 'Automóvel cadastrado com sucesso.' };
}

function listarAutomoveis() {
  return automovelRepository.listCars();
}

module.exports = { cadastrarAutomovel, listarAutomoveis };
