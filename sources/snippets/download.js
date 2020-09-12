module.exports.download = function(){

    
    const criaPasta = require ('./dirname')
    const copiaArquivos = require ('./filtered')
    

    const {baixar} = require ('../database/listener-avancado.json')
    
    if(baixar === true){

        criaPasta.estrutura()
        copiaArquivos.filtro()

        folder = `file:///C:/xmlsender/${pasta}.zip`

        var link = document.getElementById("armazenar");
        link.setAttribute("href", folder);
    }else{
        M.toast({html: "Desabilitado em Config. Avançadas"}),
        M.toast({html: "Habilite em: Ajustes -> Avançados -> • Baixar."})
        
    }
    
 
}