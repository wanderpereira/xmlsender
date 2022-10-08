const fs = require('fs')
const util = require("util")
const zip = require('file-zip')

const { inicial, final } = require('../database/package-home.json')
const { caminho } = require('../database/package-ajustes.json')


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
      arquivos[i] = filename
    }

    console.log(arquivos[4])

    fs.readFile('F:\\31210839253982000169550030000006501363912314.xml', 'utf-8', function(err, data){
      console.log(data);
    })

    //slet archive = arquivos.filter(o => o.data >= inicial && o.data <= final)


  });