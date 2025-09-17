const request = require('supertest');
const chai = require('chai');
const chaiExclude = require('chai-exclude');

chai.use(chaiExclude);
const { expect } = chai;

describe ('Teste de Transferência', () => {

    before(async () => {
        const loginUser = require('../fixture/requisicoes/login/loginUser.json')
        const resposta = await request ('http://localhost:4000/graphql')
            .post('')
            .send(loginUser)
        //console.log(resposta.body.data.login.token)
        token = resposta.body.data.login.token
    })

    beforeEach(() => {
        createTransfer = require('../fixture/requisicoes/transferencia/createTransfer.json')
    })

    it('Validar que é possível transferir grana entre duas contas', async () => {
        const respostaEsperada = require('../fixture/respostas/transferencia/validarqueepossiveltransferirgranaentreduascontas.json')
        const respostaTransferencia = await request('http://localhost:4000/graphql')
        .post('')
        .set('Authorization', `Bearer ${token}`)
        .send(createTransfer)

        expect(respostaTransferencia.status).to.equal(200);
        //expect(respostaTransferencia.body).to.eql(respostaEsperada)        #não funciona devido o campo data
        expect(respostaTransferencia.body.data.transfer).excluding('data').to.deep.equal(respostaEsperada.data.transfer);    
    });

    it('Validar que é não é possível transferir mais de 5k para um contato não favorecido', async () => {
        createTransfer.variables.valor = 5001;
        const respostaTransferencia = await request('http://localhost:4000/graphql')
        .post('')
        .set('Authorization', `Bearer ${token}`)
        .send(createTransfer)

        expect(respostaTransferencia.status).to.equal(200);
        expect(respostaTransferencia.body.errors[0].message).to.equal('Transferências acima de R$ 5.000,00 só para favorecidos');    
    });
});