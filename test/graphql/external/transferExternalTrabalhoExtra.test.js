const request = require('supertest');
const { expect } = require('chai');

const graphqlUrl = 'http://localhost:4000/graphql';

describe('GraphQL Mutation: transfer', () => {
  let token;

  before(async () => {
    // Login para obter token do Julio
    const loginMutation = require('../fixture/requisicoes/login/loginUser.json')
    const res = await request(graphqlUrl).post('').send(loginMutation);
    token = res.body.data.login.token;
    expect(token).to.be.a('string');
  });

  it('a) Realiza transferência com sucesso', async () => {
    const transferMutation = require('../fixture/requisicoes/transferencia/createTransfer.json')
    transferMutation.variables.valor = 50
    const res = await request(graphqlUrl)
      .post('')
      .set('Authorization', `Bearer ${token}`)
      .send(transferMutation);

    expect(res.status).to.equal(200);
    expect(res.body).to.not.have.property('errors');
    expect(res.body.data.transfer).to.include({
      remetente: 'Julio',
      destinatario: 'Amanda',
      valor: 50
    });
    expect(res.body.data.transfer.data).to.be.a('string');
  });

  it('b) Tenta transferência acima de R$ 5.000 para não favorecido', async () => {
    const transferMutation = require('../fixture/requisicoes/transferencia/createTransfer.json')
    transferMutation.variables.valor = 6000
    const res = await request(graphqlUrl)
      .post('')
      .set('Authorization', `Bearer ${token}`)
      .send(transferMutation);

    expect(res.status).to.equal(200);
    expect(res.body.errors).to.be.an('array');
    expect(res.body.errors[0].message).to.match(/favorecido/i);
  });

  it('c) Tenta transferência sem envio do token', async () => {
    const transferMutation = require('../fixture/requisicoes/transferencia/createTransfer.json')
    const res = await request(graphqlUrl).post('').send(transferMutation);

    expect(res.status).to.equal(200);
    expect(res.body.errors).to.be.an('array');
    expect(res.body.errors[0].message).to.match(/token/i);
  });
});
