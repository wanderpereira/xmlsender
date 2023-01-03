const fs = require('fs')
const copyFile = require('fs-copy-file');
const path = require('path')
const util = require("util")


const {inicial, final} = require('../database/package-home.json')
const {caminho} = require('../database/package-ajustes.json')

const ini = require ('./analyzer')

module.exports.gerar = function(){
 ini.analise()

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }

    fs.mkdirSync('C:/xmlsender/'+ pasta +'/');
    
    fs.readdirSync(caminho).forEach(file => {
        if(path.extname(file) === '.xml'){ 
            fs.stat(caminho + file, function(err, stats){
                const mtime = new Date(util.inspect(stats.mtime));
                let modificacao =  formatDate(mtime);
                    if(modificacao >= inicial && modificacao <= final){
                        copyFile(caminho+file, 'c:/xmlsender/'+pasta+'/'+file, (err) => {
                            if (err)
                                throw err;
                            
                                console.log(
                                    'Origem: ' + caminho + file + '\n' +
                                    'Destinho: ' + 'c:/xmlsender/'+ pasta + '/' + file + '\n' +
                                    'Data Mod: ' + modificacao
                                    )
                        });
                    }
            })
        }
    });
   
    
}
