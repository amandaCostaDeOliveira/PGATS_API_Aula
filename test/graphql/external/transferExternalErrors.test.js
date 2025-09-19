const request = require('supertest');
const chai = require('chai');
const chaiExclude = require('chai-exclude');

chai.use(chaiExclude);
const { expect } = chai;

require('dotenv').config();

describe ('Teste de Erros na Transferência', () => {

    before(async () => {
        const loginUser = require('../fixture/requisicoes/login/loginUser.json')
        const resposta = await request (process.env.BASE_URL_GRAPHQL)
            .post('')
            .send(loginUser)
        //console.log(resposta.body.data.login.token)
        token = resposta.body.data.login.token
    })

    const testesDeErrosDeNegocio = require('../fixture/requisicoes/transferencia/criarTransferenciaComErro.json');

    testesDeErrosDeNegocio.forEach(teste => {
        it(`Testando a regra de negócio: ${teste.nomeDoTeste}`, async () => {
            const respostaTransferencia = await request(process.env.BASE_URL_GRAPHQL)
            .post('')
            .set('Authorization', `Bearer ${token}`)
            .send(teste.createTransfer)
            
            expect(respostaTransferencia.status).to.equal(200);
            expect(respostaTransferencia.body.errors[0].message).to.equal(teste.mensagemEsperada);    
        });
    });
});