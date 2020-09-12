const fs = require('fs')
const {msmtp} = require('./database/listener-avancado.json')

if(msmtp === false){
    const data = JSON.parse(fs.readFileSync('./database/package-smtp.json'));  
    data.username = 'xmlsender@aol.com'
    data.password = 'apfbjofbxrfodxdn'
    data.service = 'aol'
    fs.writeFileSync('./database/package-smtp.json', JSON.stringify(data, null, 4));
    console.log('Atribuido XML Sender')
}else{
    const data = JSON.parse(fs.readFileSync('./database/package-smtp.json'));  
    data.username = ''
    data.password = ''
    data.service = ''
    fs.writeFileSync('./database/package-smtp.json', JSON.stringify(data, null, 4));
    console.log('Limpo !!!')
}
