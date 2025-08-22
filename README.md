# API de Transferências e Usuários

Esta API permite registrar usuários, realizar login, consultar usuários e efetuar transferências, com regras básicas de negócio para aprendizado de testes e automação de API.

## Instalação

1. Instale as dependências:
   ```powershell
   npm install express swagger-ui-express
   ```
2. Inicie o servidor:
   ```powershell
   node server.js
   ```

## Endpoints

- `POST /register`: Registra novo usuário. Campos obrigatórios: `username`, `password`. Opcional: `favorecidos` (array de usernames).
- `POST /login`: Realiza login. Campos obrigatórios: `username`, `password`.
- `GET /users`: Lista todos os usuários cadastrados.
- `POST /transfer`: Realiza transferência. Campos obrigatórios: `remetente`, `destinatario`, `valor`.
- `GET /transfers`: Lista todas as transferências realizadas.
- `GET /api-docs`: Documentação Swagger da API.

## Regras de Negócio

- Não é permitido registrar usuários duplicados.
- Login exige informar usuário e senha.
- Transferências para destinatários não favorecidos só podem ser feitas se o valor for menor que R$ 5.000,00.

## Testes

Para testar a API com Supertest, importe o arquivo `app.js` em seu teste sem executar o método `listen()`.

## Observações

- O banco de dados é em memória, os dados são perdidos ao reiniciar o servidor.
- A documentação completa dos endpoints está disponível em `/api-docs` via Swagger.
