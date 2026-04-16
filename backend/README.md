# Backend — Sistema de Aluguel de Carros

API **Micronaut 4** (Java 17), **MVC** em `com.example.aluguel`, com **JWT** (`/api/auth/login`), papéis **CLIENTE / EMPRESA / BANCO** e CRUD de **automóveis**.

## Executar

Defina `JAVA_HOME` para **JDK 17** e, na pasta deste módulo:

```powershell
.\mvnw.bat mn:run
```

Variável opcional para o segredo JWT (recomendado fora do repositório):

```powershell
$env:JWT_SECRET = "um-segredo-longo-e-aleatorio-para-desenvolvimento"
.\mvnw.bat mn:run
```

Perfil PostgreSQL (após `docker compose up -d` na raiz):

```powershell
$env:MICRONAUT_ENVIRONMENTS = "postgres"
.\mvnw.bat mn:run
```

Após mudanças de modelo (Etapa 2 em diante), apague a pasta `backend/data/` se usar H2 em arquivo, para o Hibernate recriar tabelas (`Usuario`, pedidos, contratos, etc.).

## Testes

```powershell
.\mvnw.bat test
```

Documentação completa e tabela de endpoints: [README.md](../README.md) na raiz do repositório.
