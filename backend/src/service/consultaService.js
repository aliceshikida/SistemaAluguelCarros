const userRepository = require('../repository/userRepository');
const contratoRepository = require('../repository/contratoRepository');

function listarClientes() {
  return userRepository.listClients();
}

function listarAgentes() {
  return userRepository.listAgents();
}

function listarContratos() {
  return contratoRepository.listAll();
}

module.exports = { listarClientes, listarAgentes, listarContratos };
