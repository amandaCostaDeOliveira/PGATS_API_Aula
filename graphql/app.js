const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./types');
const resolvers = require('./resolvers');

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req })
});

async function startApollo() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
}

startApollo();

module.exports = app;
