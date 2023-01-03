// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer, remote, shell } = require('electron');
const { dialog } = remote;
const fs = require ('fs')
const upath = require ('upath');

const form = document.querySelector('form');

const inputs = {
    estabelecimento: form.querySelector('input[name="estabelecimento"]'),
    cnpj: form.querySelector('input[name="cnpj"]'),
    email: form.querySelector('input[name="email"]'),
    telefone: form.querySelector('input[name="telefone"]'),
    source: form.querySelector('input[name="source"]'),
    contabilidade: form.querySelector('input[name="contabilidade"]'),
};



const buttons = {
    source: document.getElementById('chooseSource'),
    limpar: form.querySelector('button[type="limpar"]'),
    submit: form.querySelector('button[type="submit"]'),
};

ipcRenderer.on('did-finish-load', () => {
    
});

ipcRenderer.on('processing-did-succeed', (event, html) => {
    shell.openExternal(`file://${html}`);
});

ipcRenderer.on('processing-did-fail', (event, error) => {
    console.error(error);
    alert('Failed :\'(');
});

buttons.source.addEventListener('click', () => {
    const directory = dialog.showOpenDialog({
        properties: ['openDirectory'],
    });
    if (directory) {
        inputs.source.value = directory;
    }
});


buttons.limpar.addEventListener('click', () => {
    event.preventDefault();

    const options = {
        type: 'warning',
        buttons: ['No', 'Yes'],
        title: 'XML Sender',
        message: 'Deseja limpar as informações contidas?',
        detail: 'Os campos serão limpados.',

      }
    
      dialog.showMessageBox(null, options, (response) => {
        if(response == 1){
    
            document.getElementById("ajustes").reset();

    fs.unlink('./sources/database/package-ajustes.json')
    fs.appendFile('./sources/database/package-ajustes.json',
    '{ \n' + 
    '"estabelecimento": "",\n'+
    '"cnpj": "",\n'+
    '"email": "",\n'+
    '"telefone": "",\n'+
    '"caminho": "",\n'+
    '"contab": ""\n' +
    '}',
    function (err) {
        if (err) throw err;
        const options = {
            type: 'question',
            buttons: ['ok'],
            title: 'XML Sender',
            message: 'As informações foram Limpadas',
          }

          dialog.showMessageBox(null, options, (response) => {
            console.log(response);
          });
      });

    }
    console.log(response);
  });       
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    estabelecimento = inputs.estabelecimento.value,
    cnpj = inputs.cnpj.value,
    email = inputs.email.value,
    telefone = inputs.telefone.value,
    caminho = inputs.source.value,
    contabilidade = inputs.contabilidade.value,

    caminho = upath.normalize(caminho)

    
    
    fs.unlink('./sources/database/package-ajustes.json')
    fs.appendFile('./sources/database/package-ajustes.json',
    '{ \n' + 
    '"estabelecimento": "'+ estabelecimento +'",\n'+
    '"cnpj": "' + cnpj +'",\n'+
    '"email": "' + email +'",\n'+
    '"telefone": "' + telefone +'",\n'+
    '"caminho": "' +caminho +'/",\n'+
    '"contab": "' + contabilidade +'"\n' +
    '}',

    function (err) {
      if (err) throw err;
      const options = {
        type: 'question',
        buttons: ['Ok'],
        title: 'XML Sender - Ajustes',
        detail: 'Ajustado com Sucesso!',
      };
    
      dialog.showMessageBox(null, options, (response) => {
        console.log(response);
      });

}
)
})