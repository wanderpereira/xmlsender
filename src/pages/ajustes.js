const { ipcRenderer, remote, shell } = require('electron');
const { dialog } = remote;

// Recompor dados do Localstorage
const data = JSON.parse(localStorage.getItem('ajustes'))
if (data != null) {
    estabelecimento.defaultValue = data.estabelecimento
    cnpj.defaultValue = data.cnpj,
    email.defaultValue = data.email,
    telefone.defaultValue = data.telefone,
    contab.defaultValue = data.contab,
    caminho.defaultValue = 'C:\meuapp'
}



// Mascara do CNPJ
const maskCNPJ = (elm) => {
  elm.addEventListener('keypress', (e) => {
    var x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);
    e.target.value = !x[2] ? x[1] : x[1] + '.' + x[2] + '.' + x[3] + '/' + x[4] + (x[5] ? '-' + x[5] : '');
  })
}

// Mascara do Telefone/Celular
const maskPhone = (elm) => {
  elm.addEventListener('keypress', (e) => {
    var x = e.target.value.replace(/\D/g, '');
    x = x.replace(/^(\d{2})(\d)/g, '($1) $2');
    x = x.replace(/(\d)(\d{3})$/, '$1-$2');
    e.target.value = x;
  })
}

//Atribuindo as máscaras
maskCNPJ(cnpj)
maskPhone(telefone)

// Botão Encontrar
ipcRenderer.on('did-finish-load', () => {
    
});

ipcRenderer.on('processing-did-succeed', (event, html) => {
    shell.openExternal(`file://${html}`);
});

ipcRenderer.on('processing-did-fail', (event, error) => {
    console.error(error);
    alert('Failed :\'(');
});

source.addEventListener('click', () => {
  const directory = dialog.showOpenDialog({
      properties: ['openDirectory'],
  });
  console.log(directory)
});

// Botão Salvar
save.addEventListener("click", (e) => {
  e.preventDefault()
  if (confirm('Deseja salvar os dados?')) {
    const data = {
      estabelecimento: estabelecimento.value,
      cnpj: cnpj.value,
      email: email.value,
      telefone: telefone.value,
      contab: contab.value,
      caminho: caminho.value
    }
    window.localStorage.setItem('ajustes', JSON.stringify(data))
    M.toast({ html: 'Os dados foram salvos com sucesso!' })
  }
  else
    M.toast({ html: 'Os dados não foram salvos!' })
});

// Botão Limpar
clear.addEventListener("click", (e) => {
  e.preventDefault();
  if (confirm('Deseja limpar todos os campos?'))
  {
    window.localStorage.clear('ajustes');
    estabelecimento.value = ""
    cnpj.value = "",
    email.value = "",
    telefone.value = "",
    contab.value = "",
    caminho.value = ""
  }
  else
    M.toast({ html: 'Os campos não foram limpos!' })
});