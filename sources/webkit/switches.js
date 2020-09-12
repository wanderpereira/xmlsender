const {baixar, subpastas, email, msmtp, cfe} = require('./database/listener-avancado.json')


function switches(status, id) {
  if(status === true){
    document.write(`<input type='checkbox' id='${id}' checked></input>, `);
  }else{
    document.write(`<input type='checkbox' id='${id}'></input>, `);
  }
}