const form = document.querySelector('form');
const core = require('./snippets/core')
const storage = require('./snippets/download')


const buttons = {
    encaminha: form.querySelector('button[name="encaminha"]'),
    baixar: form.querySelector('a[name="baixar"]'),
};

buttons.encaminha.addEventListener('click', e => {
    e.preventDefault();

    const {inicial, final} = JSON.parse(localStorage.getItem('home'))
    
    if(inicial === ""){ M.toast({html: 'Informe >> Data Inicial <<'}) }
    else if(final == ""){ M.toast({html: 'Informe >> Data Final <<'}) }
    
    else if(inicial.length != 10 && final.length != 10){ M.toast({html: 'Informe Data Inicial e Final Corretamente <<'}) }
    else if(inicial.length != 10){ M.toast({html: 'Informe Data Inicial Corretamente <<'}) }
    else if(final.length != 10){ M.toast({html: 'Informe Data Final Corretamente <<'}) }
    else{
        M.toast({html: 'Certo'})
        //core.core()
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
        storage.download()
  }
    
});

