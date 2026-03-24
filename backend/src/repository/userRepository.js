const { get, run, all } = require('./baseRepository');

async function createUser(user) {
  const result = await run(
    `INSERT INTO users (nome, cpf, rg, endereco, profissao, password, role)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [user.nome, user.cpf, user.rg, user.endereco, user.profissao, user.password, user.role]
  );
  return result.id;
}

function findByCpf(cpf) {
  return get('SELECT * FROM users WHERE cpf = ?', [cpf]);
}

function listAgents() {
  return all(`SELECT id, nome, cpf, role FROM users WHERE role IN ('EMPRESA', 'BANCO') ORDER BY nome`);
}

function listClients() {
  return all(`SELECT id, nome, cpf, rg, endereco, profissao FROM users WHERE role = 'CLIENTE' ORDER BY nome`);
}

module.exports = { createUser, findByCpf, listAgents, listClients };
