const { transfers } = require('../model/transferModel');
const { getUser } = require('./userService');

function transfer({ remetente, destinatario, valor }) {
  const remetenteUser = getUser(remetente);
  const destinatarioUser = getUser(destinatario);

  if (!remetenteUser || !destinatarioUser) {
    throw new Error('Usuário não encontrado');
  }

  // Verifica saldo disponível
  if (remetenteUser.saldo < valor) {
    throw new Error('Saldo insuficiente');
  }

  const isFavorecido = remetenteUser.favorecidos?.includes(destinatario) || false;

  if (!isFavorecido && valor >= 5000) {
    throw new Error('Transferências acima de R$ 5.000,00 só para favorecidos');
  }

  // Deduz valor do remetente e adiciona ao destinatário
  remetenteUser.saldo -= valor;
  destinatarioUser.saldo = (destinatarioUser.saldo || 0) + valor;

  const transferObj = {
    remetente,
    destinatario,
    valor,
    data: new Date().getTime().toString(),
  };

  transfers.push(transferObj);

  return transferObj;
}

function getTransfers() {
  return transfers;
}

module.exports = { transfer, getTransfers };
