const AdmZip = require("adm-zip");

async function createZipArchive() {
  const zip = new AdmZip();
  const outputFile = "test.zip";
  zip.addLocalFolder("./teste");
  zip.writeZip(outputFile);
  console.log(`Created ${outputFile} successfully`);
}

module.exports = {createZipArchive}