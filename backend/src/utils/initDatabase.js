const bcrypt = require('bcryptjs');
const { run, get } = require('../config/database');

async function createTables() {
  await run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cpf TEXT UNIQUE NOT NULL,
    rg TEXT NOT NULL,
    endereco TEXT NOT NULL,
    profissao TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('CLIENTE', 'EMPRESA', 'BANCO'))
  )`);

  await run(`CREATE TABLE IF NOT EXISTS employers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT UNIQUE NOT NULL
  )`);

  await run(`CREATE TABLE IF NOT EXISTS client_employers (
    client_id INTEGER NOT NULL,
    employer_id INTEGER NOT NULL,
    PRIMARY KEY (client_id, employer_id)
  )`);

  await run(`CREATE TABLE IF NOT EXISTS incomes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    employer_id INTEGER NOT NULL,
    valor REAL NOT NULL
  )`);

  await run(`CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matricula TEXT UNIQUE NOT NULL,
    ano INTEGER NOT NULL,
    marca TEXT NOT NULL,
    modelo TEXT NOT NULL,
    placa TEXT UNIQUE NOT NULL,
    owner_type TEXT NOT NULL CHECK(owner_type IN ('CLIENTE', 'EMPRESA', 'BANCO')),
    owner_id INTEGER
  )`);

  await run(`CREATE TABLE IF NOT EXISTS rental_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    automovel_id INTEGER NOT NULL,
    periodo_inicio TEXT NOT NULL,
    periodo_fim TEXT NOT NULL,
    tipo_contrato TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('PENDENTE', 'EM_ANALISE', 'APROVADO', 'REPROVADO', 'CANCELADO', 'CONTRATO_EXECUTADO')),
    detalhes TEXT,
    analise_financeira TEXT,
    avaliado_por INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  await run(`CREATE TABLE IF NOT EXISTS contracts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER UNIQUE NOT NULL,
    cliente_id INTEGER NOT NULL,
    automovel_id INTEGER NOT NULL,
    agente_id INTEGER NOT NULL,
    status TEXT NOT NULL,
    executado_em TEXT
  )`);

  await run(`CREATE TABLE IF NOT EXISTS credit_contracts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contrato_id INTEGER UNIQUE NOT NULL,
    banco_id INTEGER NOT NULL,
    valor REAL NOT NULL,
    juros REAL NOT NULL,
    parcelas INTEGER NOT NULL
  )`);
}

async function seedData() {
  const row = await get('SELECT COUNT(*) AS total FROM users');
  if (row && row.total > 0) return;

  const users = [
    { nome: 'João Cliente', cpf: '11111111111', rg: 'RG111', endereco: 'Rua 1, Centro', profissao: 'Analista', role: 'CLIENTE' },
    { nome: 'Maria Cliente', cpf: '22222222222', rg: 'RG222', endereco: 'Rua 2, Centro', profissao: 'Professora', role: 'CLIENTE' },
    { nome: 'Empresa Alpha', cpf: '33333333333', rg: 'RG333', endereco: 'Av. Comercial, 100', profissao: 'Locadora', role: 'EMPRESA' },
    { nome: 'Banco Beta', cpf: '44444444444', rg: 'RG444', endereco: 'Av. Financeira, 200', profissao: 'Instituição Financeira', role: 'BANCO' }
  ];

  // Apenas usuários de exemplo usam senha igual ao CPF.
  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.cpf, 10);
    await run(
      `INSERT INTO users (nome, cpf, rg, endereco, profissao, password, role) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user.nome, user.cpf, user.rg, user.endereco, user.profissao, passwordHash, user.role]
    );
  }

  await run("INSERT INTO employers (nome) VALUES ('Tech Soluções'), ('Escola Futuro'), ('Loja Central')");
  await run("INSERT INTO client_employers (client_id, employer_id) VALUES (1,1),(1,3),(2,2)");
  await run("INSERT INTO incomes (client_id, employer_id, valor) VALUES (1,1,6500),(1,3,1200),(2,2,4300)");

  await run(
    `INSERT INTO cars (matricula, ano, marca, modelo, placa, owner_type, owner_id) VALUES
    ('MAT-1001', 2022, 'Toyota', 'Corolla', 'ABC1D23', 'EMPRESA', 3),
    ('MAT-1002', 2021, 'Honda', 'Civic', 'EFG4H56', 'EMPRESA', 3),
    ('MAT-1003', 2020, 'Volkswagen', 'T-Cross', 'IJK7L89', 'BANCO', 4)`
  );

  await run(
    `INSERT INTO rental_requests (cliente_id, automovel_id, periodo_inicio, periodo_fim, tipo_contrato, status, detalhes, analise_financeira, avaliado_por) VALUES
    (1, 1, '2026-03-30', '2026-04-05', 'PADRAO', 'PENDENTE', 'Viagem a trabalho', NULL, NULL),
    (2, 2, '2026-04-01', '2026-04-10', 'COM_CREDITO', 'APROVADO', 'Uso familiar', 'Capacidade de pagamento confirmada.', 3),
    (1, 3, '2026-04-02', '2026-04-07', 'PADRAO', 'REPROVADO', 'Solicitação urgente', 'Risco financeiro elevado.', 4)`
  );
}

async function initDatabase() {
  await createTables();
  await seedData();
}

module.exports = initDatabase;
