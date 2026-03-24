# Arquitetura adotada

## Stack escolhida
- Backend: Node.js + Express
- Frontend: HTML + CSS + JavaScript puro
- Banco de dados: SQLite

## Justificativa
Stack simples e adequada para laboratório acadêmico: fácil de rodar, pouca dependência externa e foco em modelagem e regras de negócio.

## Camadas do backend
- `routes`: mapeamento dos endpoints REST.
- `controller`: entrada/saída HTTP.
- `service`: regras de negócio.
- `repository`: persistência no SQLite.
- `model`: documentação e enums de domínio.
- `dto`: exemplos de payload.
- `config`, `exception`, `middleware`: infraestrutura e segurança.

## Subsistemas do enunciado
1. Gestão de pedidos e contratos (backend).
2. Construção dinâmica das páginas web (frontend).
