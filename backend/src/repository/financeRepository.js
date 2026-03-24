const { run, all, get } = require('./baseRepository');

function findEmployerByName(nome) {
  return get('SELECT * FROM employers WHERE nome = ?', [nome]);
}

function createEmployer(nome) {
  return run('INSERT INTO employers (nome) VALUES (?)', [nome]);
}

function linkClientEmployer(clientId, employerId) {
  return run('INSERT OR IGNORE INTO client_employers (client_id, employer_id) VALUES (?, ?)', [clientId, employerId]);
}

function createIncome(clientId, employerId, valor) {
  return run('INSERT INTO incomes (client_id, employer_id, valor) VALUES (?, ?, ?)', [clientId, employerId, valor]);
}

function listClientFinancialData(clientId) {
  return all(
    `SELECT i.id, i.valor, e.nome AS empregador
     FROM incomes i
     JOIN employers e ON e.id = i.employer_id
     WHERE i.client_id = ?`,
    [clientId]
  );
}

module.exports = {
  findEmployerByName,
  createEmployer,
  linkClientEmployer,
  createIncome,
  listClientFinancialData
};
