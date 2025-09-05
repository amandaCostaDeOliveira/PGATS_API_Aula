const request = require('supertest');
const { expect } = require('chai');

const graphqlUrl = 'http://localhost:4000/graphql';

describe('GraphQL Mutation: transfer', () => {
  let token;

  before(async () => {
    // Cria Amanda com saldo inicial de 100000 para testes
    const registerAmanda = `
      mutation {
        register(username: "Amanda", password: "123456", saldo: 100000, favorecidos: ["Julio"]) {
          username
          saldo
        }
      }
    `;
    await request(graphqlUrl).post('').send({ query: registerAmanda });

    // Cria Julio como destinatário
    const registerJulio = `
      mutation {
        register(username: "Julio", password: "123456") {
          username
        }
      }
    `;
    await request(graphqlUrl).post('').send({ query: registerJulio });

    // Cria Carlos como destinatário que não é favorecido
    const registerCarlos = `
      mutation {
        register(username: "Carlos", password: "123456") {
          username
        }
      }
    `;
    await request(graphqlUrl).post('').send({ query: registerCarlos });

    // Login para obter token da Amanda
    const loginMutation = {
      query: `
        mutation {
          login(username: "Amanda", password: "123456") {
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
          transfer(remetente: "Amanda", destinatario: "Julio", valor: 50) {
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
      remetente: 'Amanda',
      destinatario: 'Julio',
      valor: 50
    });
    expect(res.body.data.transfer.data).to.be.a('string');
  });

  it('b) Tenta transferência acima de R$ 5.000 para não favorecido', async () => {
    const transferMutation = {
      query: `
        mutation {
          transfer(remetente: "Amanda", destinatario: "Carlos", valor: 6000) {
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

    console.log('Resposta tentativa para não favorecido:', JSON.stringify(res.body, null, 2));

    expect(res.status).to.equal(200);
    expect(res.body.errors).to.be.an('array');
    expect(res.body.errors[0].message).to.match(/favorecido/i);
  });

  it('c) Tenta transferência sem envio do token', async () => {
    const transferMutation = {
      query: `
        mutation {
          transfer(remetente: "Amanda", destinatario: "Julio", valor: 100) {
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
