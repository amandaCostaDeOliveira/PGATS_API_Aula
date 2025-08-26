//bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const { expect } = require('chai');

//aplicação
const app = require ('../../app');

//Mock
const transferService = require('../../service/transferService');


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
        it('Usando Mocks: Quando informo remetente e destinatário inexistentes, o retorno será 400', async () => {
            // mockar apenas a função transfer do service
            
            const transferServiceMock = sinon.stub(transferService, 'transfer');
            transferServiceMock.throws(new Error('Usuário não encontrado'));

            const resposta = await request(app)
                .post('/transfer')
                .send({
                    "remetente": "Amanda",
                    "destinatario": "Julio",
                    "valor": 100
                });
                
                expect(resposta.status).to.equal(400);
                expect(resposta.body).to.have.property('error','Usuário não encontrado')

                //reset do mock
                sinon.restore();
        });
        it('Usando Mocks: Quando informo valores válidos e tenho sucesso 201 Created na transferência', async () => {
            // mockar apenas a função transfer do service
            
            const transferServiceMock = sinon.stub(transferService, 'transfer');
            transferServiceMock.returns({ 
                remetente: "Amanda",
                destinatario: "Julio",
                valor: 100, 
                data: new Date()
            });

            const resposta = await request(app)
                .post('/transfer')
                .send({
                    "remetente": "Amanda",
                    "destinatario": "Julio",
                    "valor": 100
                });
                
                expect(resposta.status).to.equal(201);
                expect(resposta.body).to.have.property('remetente','Amanda');
                expect(resposta.body).to.have.property('destinatario','Julio');
                expect(resposta.body).to.have.property('valor',100);

                //reset do mock
                sinon.restore();
        });

    });
    describe('GET /transfer', () => {
        //its ficam aqui
    });
});