const fs = require('fs');

module.exports.estrutura = function(){

try{
    fs.mkdirSync('C:/xmlsender');
    M.toast({html: 'XML-Sender criado com sucesso!'})
    console.log('XML-Sender criado com sucesso!');
}catch(err){
    if(err.code == 'EEXIST'){
        console.log('A pasta XML-Sender já existe');
    }else{
        console.log(err);
    }
}           

}   