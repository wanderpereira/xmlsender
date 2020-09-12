module.exports.core = function(){

    const criaPasta = require ('./dirname')
    const copiaArquivos = require ('./filtered')
    const criaSubpasta = require('./original')
    const enviaEmail = require ('./mailer')

    const {email, subpastas} = require ('../database/listener-avancado.json')
    
    if(email === true){
     criaPasta.estrutura()
     copiaArquivos.filtro()
     enviaEmail.email()
    }else{
        if(subpastas === true){
            criaSubpasta.gerar()
            M.toast({html: "Subpasta gerada na Raiz."})
        }
        M.toast({html: "O Envio para E-mail está Desabilitado"}),
        M.toast({html: "Habilite em: Ajustes -> Avançados -> • Email."})
        
    }

    

    
    
    
    
 
}