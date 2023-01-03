const fs = require ('fs')


const email = document.getElementById("email")
const senha = document.getElementById("senha")
const sh = document.getElementById("h");
const sr = document.getElementById("r");
const sa = document.getElementById("a");

email.addEventListener('keyup', () => {
    console.log(email.value)
    const data = JSON.parse(fs.readFileSync('./sources/database/package-smtp.json'));  
    data.username = email.value
    fs.writeFileSync('./sources/database/package-smtp.json', JSON.stringify(data, null, 4));
    
})

senha.addEventListener('keyup', () => {
    console.log(senha.value)
    const data = JSON.parse(fs.readFileSync('./sources/database/package-smtp.json'));  
    data.password = senha.value
    fs.writeFileSync('./sources/database/package-smtp.json', JSON.stringify(data, null, 4));
})

sh.addEventListener('click', () => {
    if (document.getElementById("h").checked) {
      const val = document.getElementById("h").value;
      console.log(val);
      const data = JSON.parse(fs.readFileSync('./sources/database/package-smtp.json'));  
      data.service = val
      fs.writeFileSync('./sources/database/package-smtp.json', JSON.stringify(data, null, 4));
    }
})

sr.addEventListener('click', () => {
    if (document.getElementById("r").checked) {
      const val = document.getElementById("r").value;
      console.log(val);
      const data = JSON.parse(fs.readFileSync('./sources/database/package-smtp.json'));  
      data.service = val
      fs.writeFileSync('./sources/database/package-smtp.json', JSON.stringify(data, null, 4));
    }
})

sa.addEventListener('click', () => {
    if (document.getElementById("a").checked) {
      const val = document.getElementById("a").value;
      console.log(val);
      const data = JSON.parse(fs.readFileSync('./sources/database/package-smtp.json'));  
      data.service = val
      fs.writeFileSync('./sources/database/package-smtp.json', JSON.stringify(data, null, 4));
    }
})