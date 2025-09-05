//bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const jwt = require('jsonwebtoken'); // 👈 adicionado

//aplicação
const app = require ('../../app');

//Mock
const transferService = require('../../service/transferService');


//testes
describe('Transfer Controller', () => {
  afterEach(() => {
    sinon.restore(); // garante limpeza dos stubs após cada teste
  });

  describe('POST /transfer', () => {
    it('Quando informo remetente e destinatário inexistentes, o retorno será 400', async () => {
      // mock do jwt para aceitar o token
      sinon.stub(jwt, 'verify').returns({ id: 1, username: 'Amanda' });

      const resposta = await request(app)
        .post('/transfer')
        .set('Authorization', 'Bearer fakeToken123')
        .send({
          "remetente": "Amanda",
          "destinatario": "Julio",
          "valor": 100
        });
      
      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.have.property('error', 'Usuário não encontrado');
    });

    it('Usando Mocks: Quando informo remetente e destinatário inexistentes, o retorno será 400', async () => {
      // mock do jwt para aceitar o token
      sinon.stub(jwt, 'verify').returns({ id: 1, username: 'Amanda' });

      // mock do service
      sinon.stub(transferService, 'transfer').throws(new Error('Usuário não encontrado'));

      const resposta = await request(app)
        .post('/transfer')
        .set('Authorization', 'Bearer fakeToken123')
        .send({
          "remetente": "Amanda",
          "destinatario": "Julio",
          "valor": 100
        });
      
      expect(resposta.status).to.equal(400);
      expect(resposta.body).to.have.property('error', 'Usuário não encontrado');
    });

    it('Usando Mocks: Quando informo valores válidos e tenho sucesso 201 Created na transferência', async () => {
      // mock do jwt para aceitar o token
      sinon.stub(jwt, 'verify').returns({ id: 1, username: 'Amanda' });

      // mock do service
      sinon.stub(transferService, 'transfer').returns({
        remetente: "Amanda",
        destinatario: "Julio",
        valor: 100,
        data: new Date()
      });

      const resposta = await request(app)
        .post('/transfer')
        .set('Authorization', 'Bearer fakeToken123')
        .send({
          "remetente": "Amanda",
          "destinatario": "Julio",
          "valor": 100
        });
      
      expect(resposta.status).to.equal(201);
      expect(resposta.body).to.have.property('remetente', 'Amanda');
      expect(resposta.body).to.have.property('destinatario', 'Julio');
      expect(resposta.body).to.have.property('valor', 100);
    });
  });

  describe('GET /transfer', () => {
    // seus futuros testes vão aqui
  });
});