# Sistema de Aluguel de Carros

Projeto acadêmico completo para apoio à gestão de aluguéis de automóveis, com cadastro, autenticação, criação e avaliação de pedidos, execução de contratos e associação opcional de crédito.

## Autores
- Alice Shikida
- Matheus Felipe Correa

## Objetivo do sistema
Permitir que clientes criem, consultem, modifiquem e cancelem pedidos de aluguel pela Internet, enquanto agentes (empresas e bancos) analisam financeiramente os pedidos, aprovam/reprovam e executam contratos.

## Tecnologias utilizadas
- Backend: Java 17 + Micronaut 4 (Maven)
- Frontend: React + Vite + Tailwind
- Banco de dados: H2 (em memória, perfil dev)

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
- usuários de exemplo (seed) usam senha igual ao login apenas para facilitar testes

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
- Cliente 1: login `cliente1` | senha `cliente1`
- Cliente 2: login `cliente2` | senha `cliente2`
- Empresa: login `locadora` | senha `locadora`
- Banco: login `bancoexemplo` | senha `bancoexemplo`

## Instruções para rodar localmente

**Backend (Micronaut)** — execute sempre a partir da pasta `backend` (lá está o `mvnw.bat`):

1. Defina `JAVA_HOME` para um JDK 17 ou 21 (ex.: `C:\Program Files\Java\jdk-21.0.10` no Windows).
2. No PowerShell:
   ```powershell
   cd backend
   $env:JAVA_HOME = "C:\Program Files\Java\jdk-21.0.10"
   .\mvnw.bat mn:run
   ```
3. API: [http://localhost:8080](http://localhost:8080) (mensagem na raiz) e, por exemplo, [http://localhost:8080/api/clientes](http://localhost:8080/api/clientes).

**Frontend (Vite)** — em outro terminal:

```powershell
cd frontend
npm install
npm run dev
```

Abra o endereço que o Vite mostrar (geralmente [http://localhost:5173](http://localhost:5173)). O CORS do backend já permite essa origem.

## Arquitetura adotada (resumo)
Arquitetura em camadas (`routes`, `controller`, `service`, `repository`) para separar responsabilidades, facilitar manutenção e apresentação acadêmica.
