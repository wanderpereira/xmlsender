const criaPasta = require ('./sources/snippets/dirname')
const copiaArquivos = require ('./sources/snippets/filtered')
const criaSubpasta = require('./sources/snippets/original')
const enviaEmail = require ('./sources/snippets/mailerconsole')

    const {email, subpastas} = require ('./sources/database/listener-avancado.json')
    
    if(email === true){
     criaPasta.estrutura()
     copiaArquivos.filtro()
     enviaEmail.email()
    }else{
        if(subpastas === true){
            criaSubpasta.gerar()
            console.log('Subpasta gerada na Raiz.')
        }
        console.log('O Envio para E-mail está Desabilitado'),
        console.log('Habilite em: Ajustes -> Avançados -> • Email.')
        
}