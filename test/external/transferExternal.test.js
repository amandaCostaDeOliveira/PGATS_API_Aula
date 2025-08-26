//bibliotecas
const request = require('supertest');
const { expect } = require('chai');

//testes
describe('Transfer Controller', () => {
    describe('POST /transfer', () => {
        it('Quando informo remetente e destinatário inexistentes, o retorno será 400', async () => {
            const resposta = await request('http://localhost:3000')
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
});