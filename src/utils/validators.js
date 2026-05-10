// Validation utilities
module.exports = {
  // Valida email
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Valida CNPJ
  validateCNPJ(cnpj) {
    if (!cnpj || cnpj.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    let digits = cnpj.substring(size);
    let sum = 0;
    let pos = 0;

    for (let i = size - 1; i >= 0; i--) {
      sum += numbers.charAt(i) * ++pos;
    }

    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(0))) return false;

    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = 0;

    for (let i = size - 1; i >= 0; i--) {
      sum += numbers.charAt(i) * ++pos;
    }

    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    return result === parseInt(digits.charAt(1));
  },

  // Valida data
  validateDate(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  },

  // Valida caminho de arquivo
  validatePath(filePath) {
    return filePath && typeof filePath === 'string' && filePath.length > 0;
  },

  // Sanitiza string
  sanitizeString(str) {
    return str ? str.replace(/[<>]/g, '').trim() : '';
  }
};
