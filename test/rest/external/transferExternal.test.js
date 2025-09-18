//bibliotecas
const request = require('supertest');
const { expect } = require('chai');

require('dotenv').config();

//testes
describe('Transfer Controller', () => {
    describe('POST /transfer', () => {
        it('Quando informo remetente e destinatário inexistentes, o retorno será 400', async () => {
            
            // 1) Capturar o Token - contando que Julio e Amanda já estão no banco de dados (register usuários)
            const respostaLogin = await request (process.env.BASE_URL_REST)
                .post('/login')
                .send({
                        username: 'Amanda',
                        password: '123456'
                })
            // só para didática, não precisaria disso
            const token = respostaLogin.body.token;     
            
            // 2) Realizar a transferência
            const resposta = await request(process.env.BASE_URL_REST)
                .post('/transfer')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    "remetente": "Amanda",
                    "destinatario": "UsuárioNaoCadastrado",
                    "valor": 100
                });
                
                expect(resposta.status).to.equal(400);
                expect(resposta.body).to.have.property('error','Usuário não encontrado')
        });
    });
});