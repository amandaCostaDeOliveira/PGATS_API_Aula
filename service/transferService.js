const { transfers } = require('../model/transferModel');
const { getUser } = require('./userService');

function transfer({ remetente, destinatario, valor }) {
  const remetenteUser = getUser(remetente);
  const destinatarioUser = getUser(destinatario);
  if (!remetenteUser || !destinatarioUser) throw new Error('Usuário, encontrado');
  const isFavorecido = remetenteUser.favorecidos.includes(destinatario);
  if (!isFavorecido && valor >= 5000) {
    throw new Error('Transferências acima de R$ 5.000,00 só para favorecidos');
  }
  const transferObj = { remetente, destinatario, valor, data: new Date() };
  transfers.push(transferObj);
  return transferObj;
}

function getTransfers() {
  return transfers;
}

module.exports = { transfer, getTransfers };
