const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    username: String!
    favorecidos: [String]
  }

  type Transfer {
    remetente: String!
    destinatario: String!
    valor: Float!
    data: String!
  }

  type AuthPayload {
    user: User!
    token: String!
  }

  type Query {
    users: [User]
    transfers: [Transfer]
  }

  type Mutation {
    register(username: String!, password: String!, favorecidos: [String]): User
    login(username: String!, password: String!): AuthPayload
    transfer(remetente: String!, destinatario: String!, valor: Float!): Transfer
  }
`;

module.exports = typeDefs;
