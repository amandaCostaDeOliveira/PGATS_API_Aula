//bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');
//aplicação
const app = require ('../../app');

//testes

describe('Transfer Controller', () => {
    describe('POST /transfer', () => {
        it('Quando informo remetente e destinatário inexistentes, o retorno será 400', async () => {
            const resposta = await request(app)
                .post('/transfer')
                .send({
                    "remetente": "Amanda",
                    "destinatario": "Julio",
                    "valor": 100
                });
                
                expect(resposta.status).to.equal(400);
                expect(resposta.body).to.have.property('error','Usuário não encontrado')
        });

    });
    describe('GET /transfer', () => {
        //its ficam aqui
    });
});