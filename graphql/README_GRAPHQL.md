# API GraphQL

Esta API GraphQL expõe os serviços de registro, login, consulta de usuários e transferências, com autenticação JWT nas mutações de transferência.

## Instalação de dependências

Execute:
```powershell
npm install apollo-server-express@3 express@4 graphql jsonwebtoken
```

## Execução

1. Para rodar a API GraphQL:
   ```powershell
   node graphql/server.js
   ```
2. Playground GraphQL disponível em:
   [http://localhost:4000/graphql](http://localhost:4000/graphql)

## Autenticação

- Para realizar transferências, obtenha o token JWT via login e envie no header `Authorization: Bearer <token>`.

## Estrutura
- `graphql/app.js`: Configuração do ApolloServer e schema.
- `graphql/server.js`: Inicialização do servidor.

## Observações
- Os dados são mantidos em memória.
- As queries e mutations refletem as operações da API Rest e os dados dos testes.
