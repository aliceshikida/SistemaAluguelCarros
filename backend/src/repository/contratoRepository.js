const { run, all, get } = require('./baseRepository');

function createContrato(data) {
  return run(
    `INSERT INTO contracts (pedido_id, cliente_id, automovel_id, agente_id, status, executado_em)
     VALUES (?, ?, ?, ?, ?, datetime('now'))`,
    [data.pedido_id, data.cliente_id, data.automovel_id, data.agente_id, data.status]
  );
}

function findByPedido(pedidoId) {
  return get('SELECT * FROM contracts WHERE pedido_id = ?', [pedidoId]);
}

function findById(id) {
  return get('SELECT * FROM contracts WHERE id = ?', [id]);
}

function listAll() {
  return all(
    `SELECT ct.*, u.nome AS cliente_nome, a.nome AS agente_nome
     FROM contracts ct
     JOIN users u ON u.id = ct.cliente_id
     JOIN users a ON a.id = ct.agente_id
     ORDER BY ct.id DESC`
  );
}

function createCredit(data) {
  return run(
    `INSERT INTO credit_contracts (contrato_id, banco_id, valor, juros, parcelas)
     VALUES (?, ?, ?, ?, ?)`,
    [data.contrato_id, data.banco_id, data.valor, data.juros, data.parcelas]
  );
}

function listCredits() {
  return all(
    `SELECT cc.*, b.nome AS banco_nome
     FROM credit_contracts cc
     JOIN users b ON b.id = cc.banco_id
     ORDER BY cc.id DESC`
  );
}

function findCreditByContratoId(contratoId) {
  return get('SELECT * FROM credit_contracts WHERE contrato_id = ?', [contratoId]);
}

module.exports = {
  createContrato,
  findByPedido,
  findById,
  listAll,
  createCredit,
  listCredits,
  findCreditByContratoId
};
