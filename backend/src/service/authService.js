const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repository/userRepository');
const financeRepository = require('../repository/financeRepository');
const { Roles } = require('../model/enums');
const AppError = require('../exception/AppError');
const env = require('../config/env');

async function register(payload) {
  const { role, nome, cpf, rg, endereco, profissao, password, rendimentos = [] } = payload;

  if (!Object.values(Roles).includes(role)) {
    throw new AppError('Perfil inválido. Use CLIENTE, EMPRESA ou BANCO.', 400);
  }

  if (!password || String(password).trim().length < 4) {
    throw new AppError('Informe uma senha válida com pelo menos 4 caracteres.', 400);
  }

  const existing = await userRepository.findByCpf(cpf);
  if (existing) {
    throw new AppError('CPF já cadastrado.', 409);
  }

  if (role === Roles.CLIENTE && rendimentos.length > 3) {
    throw new AppError('O cliente pode ter no máximo 3 rendimentos.', 400);
  }

  const hash = await bcrypt.hash(password, 10);
  const userId = await userRepository.createUser({ role, nome, cpf, rg, endereco, profissao, password: hash });

  if (role === Roles.CLIENTE && rendimentos.length) {
    for (const renda of rendimentos) {
      let employer = await financeRepository.findEmployerByName(renda.empregador);
      if (!employer) {
        const created = await financeRepository.createEmployer(renda.empregador);
        employer = { id: created.id };
      }
      await financeRepository.linkClientEmployer(userId, employer.id);
      await financeRepository.createIncome(userId, employer.id, renda.valor);
    }
  }

  return { id: userId, nome, cpf, role };
}

async function login(payload) {
  const { cpf, password } = payload;
  const user = await userRepository.findByCpf(cpf);

  if (!user) {
    throw new AppError('Usuário não encontrado.', 404);
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new AppError('Senha inválida.', 401);
  }

  const token = jwt.sign({ id: user.id, nome: user.nome, role: user.role }, env.jwtSecret, { expiresIn: '8h' });
  return { token, usuario: { id: user.id, nome: user.nome, cpf: user.cpf, role: user.role } };
}

module.exports = { register, login };
