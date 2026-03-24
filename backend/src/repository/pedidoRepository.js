const { run, all, get } = require('./baseRepository');

function createPedido(data) {
  return run(
    `INSERT INTO rental_requests
    (cliente_id, automovel_id, periodo_inicio, periodo_fim, tipo_contrato, status, detalhes)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.cliente_id, data.automovel_id, data.periodo_inicio, data.periodo_fim, data.tipo_contrato, data.status, data.detalhes || null]
  );
}

function findById(id) {
  return get('SELECT * FROM rental_requests WHERE id = ?', [id]);
}

function listByCliente(clienteId) {
  return all(
    `SELECT p.*, c.marca, c.modelo, c.placa
     FROM rental_requests p
     JOIN cars c ON c.id = p.automovel_id
     WHERE cliente_id = ?
     ORDER BY p.id DESC`,
    [clienteId]
  );
}

function listAllWithParties() {
  return all(
    `SELECT p.*, c.marca, c.modelo, u.nome AS cliente_nome
     FROM rental_requests p
     JOIN cars c ON c.id = p.automovel_id
     JOIN users u ON u.id = p.cliente_id
     ORDER BY p.id DESC`
  );
}

function updatePedido(id, fields) {
  return run(
    `UPDATE rental_requests
     SET automovel_id = COALESCE(?, automovel_id),
         periodo_inicio = COALESCE(?, periodo_inicio),
         periodo_fim = COALESCE(?, periodo_fim),
         tipo_contrato = COALESCE(?, tipo_contrato),
         detalhes = COALESCE(?, detalhes)
     WHERE id = ?`,
    [fields.automovel_id, fields.periodo_inicio, fields.periodo_fim, fields.tipo_contrato, fields.detalhes, id]
  );
}

function updateStatusAndAnalysis(id, status, analise, avaliadoPor) {
  return run(
    `UPDATE rental_requests
     SET status = ?, analise_financeira = ?, avaliado_por = ?
     WHERE id = ?`,
    [status, analise, avaliadoPor, id]
  );
}

function cancelPedido(id) {
  return run('UPDATE rental_requests SET status = ? WHERE id = ?', ['CANCELADO', id]);
}

module.exports = {
  createPedido,
  findById,
  listByCliente,
  listAllWithParties,
  updatePedido,
  updateStatusAndAnalysis,
  cancelPedido
};
