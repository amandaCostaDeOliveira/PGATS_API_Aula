const jwt = require('jsonwebtoken');
const SECRET = 'segredo_super_secreto';

function generateToken(user) {
  return jwt.sign({ username: user.username }, SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    throw new Error('Token inválido ou expirado');
  }
}

module.exports = { generateToken, verifyToken, SECRET };
