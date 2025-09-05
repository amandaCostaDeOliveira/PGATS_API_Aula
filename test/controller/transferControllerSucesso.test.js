//bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
const jwt = require('jsonwebtoken');

//aplicação
const app = require ('../../app');

//Mock
const transferService = require('../../service/transferService');

//testes
describe('Transfer Controller', () => {
  describe('POST /transfer', () => {
    it('Usando Mocks: Quando informo valores válidos e tenho sucesso 201 Created na transferência', async () => {
      // mockar apenas a função transfer do service
      const transferServiceMock = sinon.stub(transferService, 'transfer');
      transferServiceMock.returns({
        remetente: "Amanda",
        destinatario: "Julio",
        valor: 100,
        data: new Date()
      });

      // mockar jwt.verify para sempre aceitar o token
      const jwtMock = sinon.stub(jwt, 'verify').returns({ id: 1, username: 'Amanda' });

      const resposta = await request(app)
        .post('/transfer')
        .set('Authorization', 'Bearer fakeToken123') // não importa o valor, pois está mockado
        .send({
          "remetente": "Amanda",
          "destinatario": "Julio",
          "valor": 100
        });

      expect(resposta.status).to.equal(201);

      //Preparando os dados
      const respostaEsperada = require('../fixture/respostas/quandoInformoValoresValidosTenhoSucesso201Created.json')

      //Preparar a forma de ignorar os campos dinâmicos
      delete resposta.body.data;
      delete respostaEsperada.data;

      //Validação com um Fixture
      expect(resposta.body).to.deep.equal(respostaEsperada);

      //reset dos mocks
      sinon.restore();
    });
  });
});