const request = require('supertest');
const { expect } = require('chai');

const graphqlUrl = 'http://localhost:4000/graphql';

describe('GraphQL Mutation: transfer', () => {
  let token;

  before(async () => {
    // Login para obter token do Julio
    const loginMutation = {
      query: `
        mutation {
          login(username: "Julio", password: "123456") {
            token
          }
        }
      `
    };
    const res = await request(graphqlUrl).post('').send(loginMutation);
    token = res.body.data.login.token;
    expect(token).to.be.a('string');
  });

  it('a) Realiza transferência com sucesso', async () => {
    const transferMutation = {
      query: `
        mutation {
          transfer(remetente: "Julio", destinatario: "Amanda", valor: 50) {
            remetente
            destinatario
            valor
            data
          }
        }
      `
    };
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
    const transferMutation = {
      query: `
        mutation {
          transfer(remetente: "Julio", destinatario: "Amanda", valor: 5001) {
            remetente
            destinatario
            valor
            data
          }
        }
      `
    };
    const res = await request(graphqlUrl)
      .post('')
      .set('Authorization', `Bearer ${token}`)
      .send(transferMutation);

    expect(res.status).to.equal(200);
    expect(res.body.errors).to.be.an('array');
    expect(res.body.errors[0].message).to.match(/favorecido/i);
  });

  it('c) Tenta transferência sem envio do token', async () => {
    const transferMutation = {
      query: `
        mutation {
          transfer(remetente: "Julio", destinatario: "Amanda", valor: 100) {
            remetente
            destinatario
            valor
            data
          }
        }
      `
    };
    const res = await request(graphqlUrl).post('').send(transferMutation);

    expect(res.status).to.equal(200);
    expect(res.body.errors).to.be.an('array');
    expect(res.body.errors[0].message).to.match(/token/i);
  });
});
