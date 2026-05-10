const path = require('path');
const fs = require('fs');
require('dotenv').config();

const config = {
  // PocketBase Configuration
  pocketbase: {
    url: process.env.POCKETBASE_URL || 'http://127.0.0.1:8090',
    adminEmail: process.env.POCKETBASE_ADMIN_EMAIL,
    adminPassword: process.env.POCKETBASE_ADMIN_PASSWORD,
  },

  // SMTP Configuration (Fallback)
  smtp: {
    service: process.env.SMTP_SERVICE || 'gmail',
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
  },

  // Email Settings
  email: {
    from: process.env.MAIL_FROM || 'XML Sender <xmlsender@example.com>',
    to: process.env.MAIL_TO,
  },

  // Application Paths
  paths: {
    dataDir: process.env.APP_DATA_DIR || path.join(__dirname, '../../data'),
    zipPath: process.env.DEFAULT_ZIP_PATH || './xmlfiles.zip',
    pbDir: process.env.POCKETBASE_DIR || path.join(__dirname, '../../pb'),
  },

  // Debug
  debug: process.env.DEBUG === 'true',

  // Validation
  validate() {
    const requiredFields = ['pocketbase.url', 'pocketbase.adminEmail', 'pocketbase.adminPassword'];
    const missingFields = [];

    requiredFields.forEach(field => {
      const [section, key] = field.split('.');
      if (!this[section][key]) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      throw new Error(`Missing required configuration: ${missingFields.join(', ')}`);
    }

    return true;
  },

  // Ensure data directory exists
  ensureDataDir() {
    if (!fs.existsSync(this.paths.dataDir)) {
      fs.mkdirSync(this.paths.dataDir, { recursive: true });
    }
    if (!fs.existsSync(this.paths.pbDir)) {
      fs.mkdirSync(this.paths.pbDir, { recursive: true });
    }
  }
};

module.exports = config;
