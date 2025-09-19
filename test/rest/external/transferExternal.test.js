//bibliotecas
const request = require('supertest');
const { expect } = require('chai');

require('dotenv').config();

//testes
describe('Transfer Controller', () => {
    describe('POST /transfer', () => {
        it('Quando informo remetente e destinatário inexistentes, o retorno será 400', async () => {
            const postLogin = require('../fixture/requisicoes/login/postLogin.json')
            // 1) Capturar o Token - contando que Julio e Amanda já estão no banco de dados (register usuários)
            const respostaLogin = await request (process.env.BASE_URL_REST)
                .post('/login')
                .send(postLogin)
            // só para didática, não precisaria disso
            const token = respostaLogin.body.token;     
            
            const postTransfer = require('../fixture/requisicoes/transferencias/postTransfer.json')
            postTransfer.destinatario = "Usuário Nao Cadastrado"

            // 2) Realizar a transferência
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/transfer')
                .set('Authorization', `Bearer ${token}`)
                .send(postTransfer);

                expect(resposta.status).to.equal(400);
                expect(resposta.body).to.have.property('error','Usuário não encontrado')
        });
    });
});