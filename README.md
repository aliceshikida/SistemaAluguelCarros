# Sistema de Aluguel de Carros

Projeto acadêmico completo para apoio à gestão de aluguéis de automóveis, com cadastro, autenticação, criação e avaliação de pedidos, execução de contratos e associação opcional de crédito.

## Autores
- Alice Shikida
- Matheus Felipe Correa

## Objetivo do sistema
Permitir que clientes criem, consultem, modifiquem e cancelem pedidos de aluguel pela Internet, enquanto agentes (empresas e bancos) analisam financeiramente os pedidos, aprovam/reprovam e executam contratos.

## Tecnologias utilizadas
- Backend: Node.js + Express
- Frontend: HTML, CSS e JavaScript puro
- Banco de dados: SQLite

## Estrutura de pastas
```text
SistemaAluguelCarros/
├── backend/
├── frontend/
├── docs/
├── diagramas/
└── README.md
```

## Principais funcionalidades
### Cliente
- cadastro
- login
- criar pedido de aluguel
- consultar pedidos
- modificar pedido
- cancelar pedido

### Agente (Empresa e Banco)
- login
- visualizar pedidos
- modificar pedido
- avaliar pedido
- registrar análise financeira
- aprovar ou reprovar pedido
- executar contrato quando aprovado

### Banco
- associar contrato de crédito ao aluguel

### Sistema
- cadastrar e listar automóveis
- registrar propriedade do automóvel
- armazenar até 3 rendimentos por cliente
- armazenar empregadores do cliente

## Regras de negócio implementadas
- ninguém pode usar o sistema sem cadastro prévio
- somente clientes podem criar/cancelar seus pedidos
- agentes podem modificar e avaliar pedidos
- somente bancos podem conceder contrato de crédito
- cada cliente pode ter no máximo 3 rendimentos cadastrados
- um pedido só pode gerar contrato se for aprovado
- um contrato de crédito é opcional
- o automóvel pode pertencer a cliente, empresa ou banco
- usuários criados no cadastro escolhem sua própria senha
- usuários de exemplo (seed) usam senha igual ao CPF apenas para facilitar testes

## Descrição dos atores
- Cliente: solicita e acompanha aluguel.
- Empresa: agente que analisa/aprova pedidos e executa contratos.
- Banco: agente que analisa pedidos, executa contratos e pode conceder crédito.

## Descrição dos subsistemas
1. Gestão de pedidos e contratos (backend).
2. Construção dinâmica das páginas web (frontend).

## Endpoints principais
- `/api/auth/register`
- `/api/auth/login`
- `/api/clientes`
- `/api/agentes`
- `/api/pedidos`
- `/api/contratos`
- `/api/creditos`
- `/api/automoveis`

## Dados de exemplo (seed)
Criados automaticamente na primeira execução:
- 2 clientes
- 1 empresa
- 1 banco
- 3 automóveis
- pedidos com status diferentes

Credenciais iniciais de exemplo (seed):
- Cliente 1: CPF `11111111111` | Senha `11111111111`
- Cliente 2: CPF `22222222222` | Senha `22222222222`
- Empresa: CPF `33333333333` | Senha `33333333333`
- Banco: CPF `44444444444` | Senha `44444444444`

## Instruções para rodar localmente
1. Acesse o backend:
   ```bash
   cd backend
   ```
2. Instale dependências:
   ```bash
   npm install
   ```
3. Execute:
   ```bash
   npm start
   ```
4. Abra no navegador:
   - Frontend: http://localhost:3000
   - API health: http://localhost:3000/api/health

## Arquitetura adotada (resumo)
Arquitetura em camadas (`routes`, `controller`, `service`, `repository`) para separar responsabilidades, facilitar manutenção e apresentação acadêmica.
