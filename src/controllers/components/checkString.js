const fs = require("fs");

function checkIfContainsSync(filename, str) {
  const contents = fs.readFileSync(filename, "utf-8");

  const result = contents.includes(str);

  return result;
}
module.exports = { checkIfContainsSync };