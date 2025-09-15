const request = require('supertest');
const { expect } = require('chai');

describe ('Teste de Transferência', () => {
    it('Validar que é possível transferir grana entre duas contas', async () => {
        const resposta = await request ('http://localhost:4000/graphql')
            .post('')
            .send({
                query: `
                    mutation Login($username: String!, $password: String!) { 
                        login(username: $username, password: $password) { 
                            token
                        }   
                    }`,
                variables: {
                    username: 'Julio',
                    password: '123456'
                }
            })
        //console.log(resposta.body.data.login.token)

        const respostaTransferencia = await request('http://localhost:4000/graphql')
        .post('')
        .set('Authorization', `Bearer ${resposta.body.data.login.token}`)
        .send({
            query: `
                mutation Mutation($remetente: String!, $destinatario: String!, $valor: Float!) {
                    transfer(remetente: $remetente, destinatario: $destinatario, valor: $valor) {
                        remetente
                        destinatario
                        valor
                        data
                    }
                }
            `,
            variables: {
                remetente: 'Amanda',
                destinatario: 'Julio',
                valor: 10

            }
        })

        expect(respostaTransferencia.status).to.equal(200);    

    });

    it.only('Validar que é não é possível transferir mais de 5k para um contato não favorecido', async () => {
        const resposta = await request ('http://localhost:4000/graphql')
            .post('')
            .send({
                query: `
                    mutation Login($username: String!, $password: String!) { 
                        login(username: $username, password: $password) { 
                            token
                        }   
                    }`,
                variables: {
                    username: 'Julio',
                    password: '123456'
                }
            })
        //console.log(resposta.body.data.login.token)

        const respostaTransferencia = await request('http://localhost:4000/graphql')
        .post('')
        .set('Authorization', `Bearer ${resposta.body.data.login.token}`)
        .send({
            query: `
                mutation Mutation($remetente: String!, $destinatario: String!, $valor: Float!) {
                    transfer(remetente: $remetente, destinatario: $destinatario, valor: $valor) {
                        remetente
                        destinatario
                        valor
                        data
                    }
                }
            `,
            variables: {
                remetente: 'Julio',
                destinatario: 'Amanda',
                valor: 5001

            }
        })

        expect(respostaTransferencia.status).to.equal(200);
        expect(respostaTransferencia.body.errors[0].message).to.equal('Transferências acima de R$ 5.000,00 só para favorecidos');    
    });
});