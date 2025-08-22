const { users } = require('../model/userModel');

function registerUser({ username, password, favorecidos = [] }) {
  if (users.find(u => u.username === username)) {
    throw new Error('Usuário já existe');
  }
  const user = { username, password, favorecidos };
  users.push(user);
  return user;
}

function loginUser({ username, password }) {
  if (!username || !password) throw new Error('Login e senha obrigatórios');
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) throw new Error('Usuário ou senha inválidos');
  return user;
}

function getUsers() {
  return users;
}

function getUser(username) {
  return users.find(u => u.username === username);
}

module.exports = { registerUser, loginUser, getUsers, getUser };
