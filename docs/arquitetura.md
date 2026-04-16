# Arquitetura do sistema

Documento resumido; detalhes de execução e rotas estão no [README.md](../README.md) na raiz do repositório.

## Stack

| Camada | Tecnologia |
| --- | --- |
| **Backend** | Java 17, Micronaut 4 (HTTP, JPA, Security JWT), Maven |
| **Frontend** | React 19, Vite 8, Tailwind CSS 4.2, Axios, React Router |
| **Banco (dev)** | H2 (arquivo) ou PostgreSQL via Docker Compose |
| **Banco (produção alvo)** | PostgreSQL gerenciado (recomendado) |

## Backend (pacote `com.example.aluguel`)

- **`controller`:** endpoints REST, validação de entrada, `@Secured` com `ROLE_CLIENTE`, `ROLE_EMPRESA`, `ROLE_BANCO`.
- **`service`:** regras de negócio e autorização usando `Authentication`.
- **`repository`:** Micronaut Data JPA.
- **`model`:** entidades Hibernate (`Usuario`, `Cliente`, `Empresa`, `Banco`, `Automovel`, `PedidoAluguel`, `Contrato`, `ContratoCredito`, etc.).
- **`dto`:** contratos JSON (Serde).
- **`security`:** login por usuário/senha, BCrypt, emissão de JWT.
- **`bootstrap`:** dados de demonstração opcionais no startup (`app.dev.seed.enabled`).

## Frontend (`frontend/src`)

- **`api/client.js`:** cliente HTTP com token Bearer.
- **`context/AuthContext.jsx`:** sessão e decodificação de papéis a partir do JWT.
- **`pages/`:** telas (login, cadastro, dashboards, pedidos, automóveis, contratos, créditos).
- **`components/`:** layout, sidebar, rotas protegidas, badges de status.

Em **desenvolvimento**, o Vite faz **proxy** de `/api` para o backend em `127.0.0.1:8080`. Em **produção no Vercel**, o build é estático; a API fica em **outro host** e o front usa a variável **`VITE_API_URL`**.

## Diagramas UML (PlantUML)

Arquivos em [Documentação/](Documentação/): classes, componentes, pacotes, implantação (desenvolvimento local **e** visão de produção com Vercel).

## Testes

- **Backend:** JUnit 5 + Micronaut Test (`backend/src/test`).
- **Frontend:** Vitest + Testing Library (`frontend`, `npm test`).
