const fs = require("fs");
const glob = require("glob");
const path = require("path");
const moment = require("moment");
const convert = require("xml-js");
const db = require("../database.json");

const { homepath } = require("./controllers/mkdir");
const { copyFile } = require("./controllers/components/copy");
const { checkIfContainsSync } = require("./controllers/components/checkString");

var caminho = db.ajustes.caminho;
var destiny = homepath;

// Copia dos arquivos
function copia() {
  fs.readdirSync(caminho).forEach((file) => {
    if (path.extname(file) === ".xml") {
      copyFile(caminho, destiny, file);
    }
  });
}

// Separação por Tag
function tag() {
  fs.readdirSync(destiny).forEach((file) => {
    var archive = path.join(destiny, file);

    if (path.extname(file) === ".xml") {
      if (checkIfContainsSync(archive, "CFe") === true) {
        const cfeDir = path.join(destiny, "CFe");
        if (!fs.existsSync(cfeDir)) {
          fs.mkdirSync(cfeDir, { recursive: true });
        }

        var xml = require("fs").readFileSync(archive, "utf8");
        var result = convert.xml2json(xml, { compact: true, spaces: 4 });
        const filename = JSON.parse(result).CFe.infCFe._attributes.Id;
        const datefile = JSON.parse(result).CFe.infCFe.ide.dEmi._text;
        const datefileptbr =
          datefile.substring(6, 8) +
          "." +
          datefile.substring(4, 6) +
          "." +
          datefile.substring(0, 4);
        const fileraw = `${datefileptbr} - ${filename}`;
        const rearchive = path.join(destiny, "CFe", fileraw);
        fs.renameSync(archive, `${rearchive}.xml`);
      } else if (checkIfContainsSync(archive, "NFe") === true) {
        const nfeDir = path.join(destiny, "NFe");
        if (!fs.existsSync(nfeDir)) {
          fs.mkdirSync(nfeDir, { recursive: true });
        }

        var xml = require("fs").readFileSync(archive, "utf8");
        var result = convert.xml2json(xml, { compact: true, spaces: 4 });
        const filename = JSON.parse(result).NFe.infNFe._attributes.Id;
        const datefile = JSON.parse(result).NFe.infNFe.ide.dhEmi._text;
        const datefileptbr =
          datefile.substring(8, 10) +
          "." +
          datefile.substring(5, 7) +
          "." +
          datefile.substring(0, 4);
        const fileraw = `${datefileptbr} - ${filename}`;
        const rearchive = path.join(destiny, "NFe", fileraw);
        fs.renameSync(archive, `${rearchive}.xml`);
      } else {
        console.log("Erro no nome do Arquivo");
      }
    }
  });
}

// Separação por Ano/Mês/Dia
function calendar(type) {
  const baseDir = path.join(destiny, type);
  const arquivos = fs.readdirSync(baseDir);

  const informacoesArquivos = arquivos.map((arquivo) => {
    // Divida a string pelo caractere "-"
    const partes = arquivo.split(" - ");

    // A primeira parte é a data, a segunda é o nome do arquivo
    const data = partes[0];
    const nome = partes[1];

    // Divida a string de data pelo caractere "."
    const partesData = data.split(".");

    // A primeira parte é o dia, a segunda é o mês, a terceira é o ano
    const dia = partesData[0];
    const mes = partesData[1];
    const ano = partesData[2];

    // Divida a string de nome para obter a Tag CFe || NFe
    const tag = nome.slice(0, 3);

    // Gera a pasta
    const folder = path.join(destiny, tag, ano, mes, dia);

    // Pasta com arquivo
    const filename = path.join(destiny, tag, ano, mes, dia, nome);

    // Arquivo Atual
    const primaryFile = path.join(
      destiny,
      tag,
      `${dia}.${mes}.${ano} - ${nome}`
    );

    return {
      ano: ano,
      mes: mes,
      dia: dia,
      nome: nome,
      pasta: folder,
      atual: primaryFile,
      arquivo: filename,
    };
  });

  informacoesArquivos.forEach((info) => {
    console.log("Criando as pastas");
    if (!fs.existsSync(info.pasta)) {
      fs.mkdirSync(info.pasta, { recursive: true });
    }
    console.log("Salvando os arquivos em pastas");
    fs.renameSync(info.atual, info.arquivo);
  });

  //const resultado = arquivos.filter(arquivo => arquivo.includes('10.2020')); fs.mkdirSync(pasta, { recursive: true });
}

function package() {
  const { home, avancado } = require("../database.json");

  var inicial = home.inicial.replace(/\//g, ".");
  var final = home.final.replace(/\//g, ".");
  const separar = avancado.subpastas;

  // Lê o conteúdo do diretório atual
  const pathin = path.join(destiny, "CFe");

  // Obtém a lista de arquivos
  glob(`${pathin}/*`, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    
    filteredFiles = []
    files.forEach((file) => {
      const filename = path.basename(file);
      
      const regex = /^(\d{2}).(\d{2}).(\d{4}) - CFe(\d+)\.xml$/;
      const match = filename.match(regex);
      
      if (match) {
        const day = match[1];
        const month = match[2];
        const year = match[3];
        const cfeNumber = match[4];
        
        // Creating a Date object using the extracted date
        const fileDate = new Date(year, month - 1, day);
        
        
        inicial = inicial.split(".")[2] + "-" + inicial.split(".")[1] + "-" + inicial.split(".")[0];
        final = final.split(".")[2] + "-" + final.split(".")[1] + "-" + final.split(".")[0];
        
        // Defining the range of months to filter
        let startDate = new Date(inicial);
        let endDate = new Date(final);

        if (fileDate >= startDate && fileDate <= endDate) {
          console.log(fileDate);
        } else {
          //console.log("The date is not within the range");
        }
        
        //filteredFiles.push(new Date(startDate).toISOString().substring(0, 10));

                
      } else {
        console.log(`O arquivo ${filename} não corresponde ao formato esperado.`);
      }
    });
  });

  // fs.stat(file, (err, stats) => {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }

  //   const mtime = stats.mtime;

  //   // Verifica se a data de modificação está entre as datas inicial e final
  //   if (startDate <= mtime && mtime <= endDate) {
  //     // Adiciona o arquivo à lista de arquivos filtrados
  //     filteredFiles.push(file);
  //   }
  // });

  // const filteredFiles = files.filter((file) => {
  //   // Verifica se o nome do arquivo tem o formato correto
  //   const regex = /^(\d{2}).(\d{2}).(\d{4}) - CFe(\d+)\.xml$/;
  //   const match = file.match(regex);
  //   if (!match) {
  //     return true;
  //   }
  //   console.log(filteredFiles); // imprime os arquivos filtrados

  // });
}

setTimeout(package, 1000);
/*
console.log('Copiando os Arquivos.')
setTimeout(copia, 1000)

console.log('Separando os Arquivos.')
setTimeout(tag, 3000)

console.log('Segmentando os Arquivos º CFe')
setTimeout(calendar, 5000, 'CFe')

console.log('Segmentando os Arquivos º NFe')
setTimeout(calendar, 8000, 'NFe')
*/
