// Recompor dados do Localstorage
const data = JSON.parse(localStorage.getItem('smtp'))
if (data != null) {
    email.defaultValue = data.email
    senha.defaultValue = data.senha,
    email.defaultValue = data.email,
    document.querySelector(`input[name=service][value=${data.service}]`).checked = true
}


// Botão Salvar
save.addEventListener("click", (e) => {
  e.preventDefault()
  const type = document.querySelector("input[name='service']:checked").value
  if (confirm('Deseja salvar os dados?')) {
    const data = {
      email: email.value,
      senha: senha.value,
      service: type
    }
    window.localStorage.setItem('smtp', JSON.stringify(data))
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
    window.localStorage.clear('smtp');
    email.value = ""
    senha.value = ""
  }
  else
    M.toast({ html: 'Os campos não foram limpos!' })
});