# API de Transferências e Usuários

Esta API permite registrar usuários, realizar login, consultar usuários e efetuar transferências, com regras básicas de negócio para aprendizado de testes e automação de API.

## Instalação

1. Instale as dependências da API REST:
   ```powershell
   npm install express swagger-ui-express
   ```

2. Instale as dependências da API GraphQL:
   ```powershell
   npm install apollo-server-express@3 express@4 graphql jsonwebtoken
   ```

## Execução

Antes de seguir, crie um arquivo .env na raiz do projeto contendo as propriedades BASE_URL_REST e BASE_URL_GRAPHQL com a URL destes serviços.

### API REST
```powershell
node server.js
```

### API GraphQL
```powershell
node graphql/server.js
```

## Endpoints REST

- `POST /register`: Registra novo usuário. Campos obrigatórios: `username`, `password`. Opcional: `favorecidos` (array de usernames).
- `POST /login`: Realiza login. Campos obrigatórios: `username`, `password`.
- `GET /users`: Lista todos os usuários cadastrados.
- `POST /transfer`: Realiza transferência. Campos obrigatórios: `remetente`, `destinatario`, `valor`.
- `GET /transfers`: Lista todas as transferências realizadas.
- `GET /api-docs`: Documentação Swagger da API.

## Endpoints GraphQL

- Rode `npm run start-graphql` para executar a API do GraphQL 
- Playground: [http://localhost:4000/graphql](http://localhost:4000/graphql)
- Queries: `users`, `transfers`
- Mutations: `register`, `login`, `transfer` (autenticada via JWT)

## Regras de Negócio

- Não é permitido registrar usuários duplicados.
- Login exige informar usuário e senha.
- Transferências para destinatários não favorecidos só podem ser feitas se o valor for menor que R$ 5.000,00.

## Testes

Para testar a API com Supertest, importe o arquivo `app.js` (REST) ou `graphql/app.js` (GraphQL) sem executar o método `listen()`.

## Observações

- O banco de dados é em memória, os dados são perdidos ao reiniciar o servidor.
- A documentação completa dos endpoints REST está disponível em `/api-docs` via Swagger.
- Para transferências via GraphQL, envie o token JWT no header `Authorization: Bearer <token>`.
