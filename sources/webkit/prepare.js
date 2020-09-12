$( document ).ready(function() {

  const fs = require("fs");
  const moment = require("moment");
  const m_ano = moment().format('YYYY-MM');
  const m_ult = '0' + (moment().format('MM')-1);
  const hoje = moment().format('DD/MM/YYYY');
  const primeirodia = '01'+'/'+m_ult+'/'+moment().format('YYYY');
  const ultimodia = moment(m_ano, "YYYY-MM").daysInMonth()+'/'+m_ult+'/'+moment().format('YYYY');
  
  document.getElementById('inicial').value=primeirodia;
  document.getElementById('final').value=ultimodia;
  
  const data = JSON.parse(fs.readFileSync('./sources/database/package-home.json'));
  displayPrimeiro = primeirodia.split("/").reverse().join("-");
  displayUltimo = ultimodia.split("/").reverse().join("-");
  data.inicial = displayPrimeiro
  data.final = displayUltimo
  fs.writeFileSync('./sources/database/package-home.json', JSON.stringify(data, null, 4));
  
  $('select').change(() => {
  
      var d = document.getElementById('ddselect');
      var displaytext = d.options[d.selectedIndex].text;
  
      if(displaytext == 'Hoje'){
        document.getElementById('inicial').value=hoje;
        document.getElementById('final').value=hoje;
        
        const data = JSON.parse(fs.readFileSync('./sources/database/package-home.json'));
        displayHoje = hoje.split("/").reverse().join("-");
        data.inicial = displayHoje
        data.final = displayHoje
        fs.writeFileSync('./sources/database/package-home.json', JSON.stringify(data, null, 4));
  
      }else if(displaytext == 'Último mês'){
        document.getElementById('inicial').value=primeirodia;
        document.getElementById('final').value=ultimodia;
  
        const data = JSON.parse(fs.readFileSync('./sources/database/package-home.json'));
        displayPrimeiro = primeirodia.split("/").reverse().join("-");
        displayUltimo = ultimodia.split("/").reverse().join("-");
        data.inicial = displayPrimeiro
        data.final = displayUltimo
        fs.writeFileSync('./sources/database/package-home.json', JSON.stringify(data, null, 4));
  
      }else{
        document.getElementById('inicial').value='';
        document.getElementById('final').value='';
  
        const data = JSON.parse(fs.readFileSync('./sources/database/package-home.json'));
        data.inicial = ''
        data.final = ''
        fs.writeFileSync('./sources/database/package-home.json', JSON.stringify(data, null, 4));
  
      }
    
    })
  });