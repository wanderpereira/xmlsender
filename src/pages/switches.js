const memory = JSON.parse(localStorage.getItem('avancado'))

// Criando dados no Localstorage (Escape)
if(memory === null) localStorage.setItem('avancado', JSON.stringify({baixar: false, segmentar: false, subpastas: false, email: false, smtp: false}))

// Recompor dados do Localstorage
if (memory != null) {
  baixar.checked = memory.baixar,
  segmentar.checked = memory.segmentar,
  subpastas.checked = memory.subpastas,
  email.checked = memory.email,
  smtp.checked = memory.smtp
}

// Definindo os dados dos switches e preenchendo com os dados do Localstorage
const data = {baixar: memory.baixar,  segmentar: memory.segmentar,  subpastas: memory.subpastas,  email: memory.email,   smtp: memory.smtp}
localStorage.setItem('avancado', JSON.stringify(data))

baixar.addEventListener('change', () => { data["baixar"] = baixar.checked, localStorage.setItem("avancado", JSON.stringify(data))})
segmentar.addEventListener('change', () => { data["segmentar"] = segmentar.checked, localStorage.setItem("avancado", JSON.stringify(data))})
subpastas.addEventListener('change', () => { data["subpastas"] = subpastas.checked, localStorage.setItem("avancado", JSON.stringify(data))})
email.addEventListener('change', () => { data["email"] = email.checked, localStorage.setItem("avancado", JSON.stringify(data))})
smtp.addEventListener('change', () => { data["smtp"] = smtp.checked, localStorage.setItem("avancado", JSON.stringify(data))})

// Gerando data
const date = new Date();
const firstDay = new Date(date.getFullYear(), date.getMonth()+1, 1)

// Validando se Meu E-mail foi preenchido
email.addEventListener('change', () => {
  const validate = JSON.parse(localStorage.getItem('smtp'))
  if(validate === null)
  {
    alert('Meu-Email não configurado!')  
    email.checked = false
    message.hidden=true
  }
  else
  {
    // Ativando mensagem de E-mail Automático 
    message.textContent = `Pacote será entregue em: ${firstDay.toLocaleDateString()}` 
  }
  data.email === true ? message.hidden=false : message.hidden=true
})

// Verificando dados do Localstorage para mensagem de E-mail Automático & Meu-email
memory.email == true ? message.textContent = `Pacote será entregue em: ${firstDay.toLocaleDateString()}` : message.textContent=''

smtp.addEventListener('change', () => {
  const validate = JSON.parse(localStorage.getItem('smtp')).email
  validate === null ? dialog.hidden=true : dialog.textContent = `Enviando como: ${validate}`
})

if(JSON.parse(localStorage.getItem('smtp')).email != null){
  memory.smtp == true ?  dialog.textContent = `Enviando como: ${JSON.parse(localStorage.getItem('smtp')).email}` : message.textContent=''
}

/*


confbox.hidden=true
//
smtp.addEventListener('change', () => {data.smtp == true ? confbox.hidden=false : confbox.hidden=true})
*/