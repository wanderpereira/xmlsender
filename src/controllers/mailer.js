const nodemailer = require('nodemailer')

const {estabelecimento, cnpj, email, telefone, contab} = require('../database/package-ajustes.json')
const {service, username, password} = require('../database/package-smtp.json')

console.log(username + password)

module.exports.email = function(){
    const ini = require('./analyzer.js')
    ini.analise()    
    
    let transporter = nodemailer.createTransport({
        service: service,
        auth: {user: username, pass: password}
    });
    
    
    transporter.sendMail({
        from: "XML Sender <"+username+">",
        to: contab,
        subject: "["+estabelecimento+"] "+"Arquivos Fiscais - "+ pasta,
           html: 
                 '<center><h1>>> XML <em>Sender<em></h1></center><br>' +
                 '<h3>Dados do Contribuinte </h3>' +
                 '<p> Olá, segue em anexo os arquivos fiscais qualquer duvida entre em contato com o responsável.</p>'+
                 '<fieldset>' +
                 '<h3>Nome do Estabelecimento: '+estabelecimento+
                 '</h3><h3>CNPJ: '+cnpj+
                 '</h3><h3>E-mail: '+email+
                 '</h3><h3>Contato: '+ telefone+
                 '</h3><h3>Contabilidade: '+ contab + '</h3>' +
                 '</fieldset>' +
                 '<hr>' +
                 '<p> XMLsender é um programa hibrido que realiza envios de pacotes XMLs.<br> Por favor não responda este e-mail, está é uma mensagem automática.'
                 ,
        
        attachments: {   
            path: 'C:/xmlsender/'+pasta+'.zip'
        }
    
           
    }).then(message => {
        M.toast({html: 'E-mail encaminhado com sucesso :)--'})
        console.log('E-mail encaminhado com sucesso :)--');
    }).catch(err => {
        M.toast({html: 'Não foi possível encaminhar!'});
        console.log(err)
    })
    
 
}