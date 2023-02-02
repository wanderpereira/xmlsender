const fs = require("fs");
var convert = require("xml-js");
const { checkIfContainsSync } = require("./components/checkString");
const { homepath } = require("./mkdir");
const { createZipArchive } = require("./components/zippath");

// Separação por Tag
fs.readdirSync(destiny).forEach((file) => {
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


// Compactando as Pastas/Arquivos
createZipArchive()
// Removendo os Arquivos XML
fs.readdirSync(destiny).forEach((file) => {
  if (path.extname(file) === ".xml") {
      fs.unlinkSync(destiny+file)
}

});
*/