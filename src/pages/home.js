// Definindo as datas
  var date = new Date();
  var ontem = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString().slice(0, 10);
  var hoje = new Date().toLocaleDateString().slice(0, 10);
  
  var primeiroDia_MesAnterior = new Date(date.getFullYear(), (date.getMonth()-1), 1).toLocaleDateString();
  var ultimoDia_MesAnterior = new Date(date.getFullYear(), (date.getMonth()-1) + 1, 0).toLocaleDateString();
  
  // Inserindo as datas padrões dos inputs
  inicial.defaultValue=primeiroDia_MesAnterior;
  final.defaultValue=ultimoDia_MesAnterior;

  // Criando os estados das datas
  periodo.addEventListener('change', function handleChange(event) {
      let selecionado = event.target.value;
      
      if(selecionado == "ultimomes")
      {
        inicial.value = primeiroDia_MesAnterior;
        final.value = ultimoDia_MesAnterior;
      }
      else if(selecionado == "ontem")
      {
        inicial.value = ontem;
        final.value = ontem;
      }
      else if(selecionado == "hoje")
      {
        inicial.value = hoje;
        final.value = hoje;
      }
      else if(selecionado == "definir")
      {
        inicial.value = "";
        final.value = "";
      }
  })

  // Mascara da Data
  const mascara = (elm) => {
  elm.addEventListener('keypress', (e) => {
    if(e.keyCode < 47 || e.keyCode > 57) {
      e.preventDefault();
    }
    
    var len = elm.value.length;
    
    if(len !== 1 || len !== 3) {
      if(e.keyCode == 47) {
        e.preventDefault();
      }
    }
    
    if(len === 2) {
      elm.value += '/';
    }

    if(len === 5) {
      elm.value += '/';
    }
  });
};
  
mascara(inicial);
mascara(final);

// Armazenando os dados no LocalStorage
setInterval( _ => {
  const data = {
    inicial: inicial.value,
    final: final.value
  }
  window.localStorage.setItem('home', JSON.stringify(data))

// Configurando o IPC
const home = JSON.parse(localStorage.getItem('home'))
const ajustes = JSON.parse(localStorage.getItem('ajustes'))
const avancado = JSON.parse(localStorage.getItem('avancado'))
const smtp = JSON.parse(localStorage.getItem('smtp'))

const ipc = {
  home: home,
  ajustes: ajustes,
  avancado: avancado,
  email: smtp
}
require('electron').ipcRenderer.send('database', ipc);

}, 1000)

