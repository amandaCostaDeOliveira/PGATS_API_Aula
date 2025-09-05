const userService = require('../service/userService');
const transferService = require('../service/transferService');
const { generateToken, verifyToken } = require('../service/authService');

const resolvers = {
  Query: {
    users: () => userService.getUsers(),
    transfers: () => transferService.getTransfers(),
  },
  Mutation: {
    register: (parent, { username, password, favorecidos }) => {
      return userService.registerUser({ username, password, favorecidos });
    },
    login: (parent, { username, password }) => {
      const user = userService.loginUser({ username, password });
      const token = generateToken(user);
      return { user, token };
    },
    transfer: (parent, { remetente, destinatario, valor }, context) => {
      const authHeader = context.req.headers['authorization'];
      if (!authHeader) throw new Error('Token não informado');
      const token = authHeader.split(' ')[1];
      if (!token) throw new Error('Token mal formatado');
      try {
        verifyToken(token);
      } catch (err) {
        throw new Error('Token inválido ou expirado');
      }
      return transferService.transfer({ remetente, destinatario, valor });
    },
  },
};

module.exports = resolvers;
