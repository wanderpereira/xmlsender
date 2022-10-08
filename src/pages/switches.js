// Recompor dados do Localstorage
const memory = JSON.parse(localStorage.getItem('avancado'))
if (memory != null) {
  baixar.checked = memory.baixar,
  segmentar.checked = memory.segmentar,
  subpastas.checked = memory.subpastas,
  email.checked = memory.email,
  smtp.checked = memory.smtp
}

// Criando data para popular, por padrão data é false
const data = {baixar: false, segmentar: false, subpastas: false, email: false,  smtp: false}

// Ordenando Map com as opções de data
const ops = [ baixar, segmentar, subpastas, email,  smtp ]

// Atribuindo estados a data
ops.map((select) => {
  select.addEventListener('change', () => {
    data[select.id] = select.checked
    window.localStorage.setItem('avancado', JSON.stringify(data))
  })
})

var date = new Date();
var firstDay = new Date(date.getFullYear(), date.getMonth()+1, 1)

memory.email == true ? message.textContent = `Pacote será entregue em: ${firstDay.toLocaleDateString()}` : message.textContent=''

memory.smtp == true ? confbox.hidden=false : confbox.hidden=true
memory.smtp == true ? dialog.hidden=false : dialog.hidden=true
memory.smtp == true ? dialog.textContent = `Enviando como: ${JSON.parse(localStorage.getItem('smtp')).email}` : dialog.textContent=''
smtp.addEventListener('change', () => {
  data.smtp == true ? confbox.hidden=false : confbox.hidden=true
  data.smtp == true ? dialog.textContent = `Enviando como: ${JSON.parse(localStorage.getItem('smtp')).email}` : dialog.textContent=''
})
