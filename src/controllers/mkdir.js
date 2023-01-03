const fs = require("fs");
const os = require("os");
const path = require("path");
const homepath = path.resolve(os.homedir(), "xmlsender");

function CriaPasta() {
  try {
    fs.mkdirSync(homepath);
    M.toast({ html: "A pasta XML Sender foi criada com sucesso!" });
  } catch (err) {
    if (err.code === "EEXIST")
      return M.toast({ html: "A pasta XML Sender já existe" });
  }
}

module.exports = { CriaPasta };
