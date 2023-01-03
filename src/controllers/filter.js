const fs = require("fs");
const path = require("path");
var convert = require("xml-js");

const {copyFile} = require('./components/copy')
const {checkIfContainsSync} = require('./components/checkString')
const {createZipArchive} = require('./components/zippath')

var caminho = '/Users/wandy/Downloads/xmlsender/src/controllers/teste'
var destiny = '/Users/wandy/xmlsender/'


// Copia dos arquivos
fs.readdirSync(caminho).forEach((file) => {
    if (path.extname(file) === ".xml") {
        copyFile(caminho, destiny, file);
  }
});

// Separação por Tag
fs.readdirSync(caminho).forEach((file) => {
    if (path.extname(file) === ".xml") {
        if (checkIfContainsSync(file, "CFe") === true) {
            var xml = require("fs").readFileSync(file, "utf8");
          
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
            fs.renameSync(file, `./${fileraw}.xml`);
          }
          
          if (checkIfContainsSync(file, "NFe") === true) {
            var xml = require("fs").readFileSync(file, "utf8");
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
            fs.renameSync(file, `./${fileraw}.xml`);
          }
  }
});

/*

// Categorização por Ano/Mês
// Compactando as Pastas/Arquivos
createZipArchive()
// Removendo os Arquivos XML
fs.readdirSync(destiny).forEach((file) => {
  if (path.extname(file) === ".xml") {
      fs.unlinkSync(destiny+file)
}

});
*/