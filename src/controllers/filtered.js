const fs = require('fs')
const util = require("util")
const zip = require('file-zip')

const { inicial, final } = require('../database/package-home.json')
const { caminho } = require('../database/package-ajustes.json')

module.exports.filtro = function () {

    const ini = require('./analyzer.js')
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

  fs.readdir(caminho, function (err, items) {

    arquivos = []
    for (let i = 0; i < items.length; i++) {
      filename = caminho + items[i]
      const stat = fs.statSync(filename);
      const mtime = new Date(util.inspect(stat.mtime));
      let modificacao = formatDate(mtime);
      obj = { arquivo: filename, data: modificacao }
      arquivos[i] = obj
    }

    let archive = arquivos.filter(o => o.data >= inicial && o.data <= final)

    zipCC = []
    for (let i = 0; i < archive.length; i++) {
      zipCC[i] = archive[i].arquivo
    }

    if(zipCC.length === 0){
      alert('Não existe XMLs para este periodo!')
    }else{
      zip.zipFile(zipCC, `c:/xmlsender/${pasta}.zip`, function (err) {
        if (err) {
          console.log('O Zip apresentou erro: ', err)
        } else {
          console.log('Zipado com Sucesso!');
        }
      });
    }


  });
}