const fs = require("fs");
const fsp = fs.promises;
const path = require("path");

async function copyFile(sourceDirPath, destDirPath, filename) {
  const sourceFilePath = path.join(sourceDirPath, filename);
  const destFilePath = path.join(destDirPath, filename);
  try {
    await fsp.access(sourceFilePath, fs.constants.R_OK);
    await fsp.access(destDirPath, fs.constants.W_OK);
    await fsp.copyFile(sourceFilePath, destFilePath);

  } catch (ex) {
    if (ex.errno === -2)
      console.error(`Arquivo "${sourceFilePath}" não existe.`);
    else if (ex.errno === -13)
      console.error(`Não foi possivel acessar "${path.resolve(destDirPath)}"`);
    else
      console.error(`Não foi possivel copiar "${sourceFilePath}" para "${destDirPath}"`);
  }
}

module.exports = { copyFile };