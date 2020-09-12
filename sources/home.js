// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const fs = require ('fs');

const dateinicial = document.getElementById("inicial")
const datefinal = document.getElementById("final")

dateinicial.addEventListener('keyup', () => {
    const value = dateinicial.value;
    
    if(value.length === 10){
        M.toast({html: 'Data Inicial: ' + value})
    }
    
    const data = JSON.parse(fs.readFileSync('./sources/database/package-home.json'));
    valueInicial = value.split("/").reverse().join("-");
    data.inicial = valueInicial
    fs.writeFileSync('./sources/database/package-home.json', JSON.stringify(data, null, 4));
    
})

datefinal.addEventListener('keyup', () => {
    const value = datefinal.value;
    
    if(value.length === 10){
        M.toast({html: 'Data Final: ' + value})
    }
    
    const data = JSON.parse(fs.readFileSync('./sources/database/package-home.json'));
    valueFinal = value.split("/").reverse().join("-");
    data.final = valueFinal
    fs.writeFileSync('./sources/database/package-home.json', JSON.stringify(data, null, 4));
    
})

const form = document.querySelector('form');

const inputs = {
    inicial: form.querySelector('input[name="inicial"]'),
    final: form.querySelector('input[name="final"]'),

};

const buttons = {
    encaminha: form.querySelector('button[name="encaminha"]'),
    baixar: form.querySelector('a[name="baixar"]'),
};

buttons.encaminha.addEventListener('click', () => {
    event.preventDefault();
    
    inicial = inputs.inicial.value,
    final = inputs.final.value

    
    final = final.split("/").reverse().join("-");
    
    if(inicial == ""){
        M.toast({html: 'Informe >> Data Inicial <<'})
    }
    else if(final == ""){
        M.toast({html: 'Informe >> Data Final <<'})
    }
    else{
        const core = require('./snippets/core')
        core.core(),
    
    function (err) {
        
        if (err) throw err;
        
    }
  }
});

buttons.baixar.addEventListener('click', () => {
    
    
    inicial = inputs.inicial.value,
    final = inputs.final.value

    if(inicial == ""){
        M.toast({html: 'Informe >> Data Inicial <<'})
        event.preventDefault();
    }
    else if(final == ""){
        M.toast({html: 'Informe >> Data Final <<'})
        event.preventDefault();
    }
    else{
        const storage = require('./snippets/download')
        storage.download(),
    
    function (err) {
        
        if (err) throw err;
        
    }
  }
    
});

