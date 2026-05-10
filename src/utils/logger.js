const fs = require('fs');
const path = require('path');
const config = require('../config/config');

const LogLevel = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

class Logger {
  constructor() {
    this.logsDir = path.join(config.paths.dataDir, 'logs');
    this.ensureLogsDir();
  }

  ensureLogsDir() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  getLogFile() {
    const date = new Date().toISOString().split('T')[0];
    return path.join(this.logsDir, `app-${date}.log`);
  }

  write(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;
    const fullMessage = data ? `${logMessage}\n${JSON.stringify(data, null, 2)}` : logMessage;

    // Console output
    if (config.debug || level === LogLevel.ERROR) {
      console[level === LogLevel.ERROR ? 'error' : 'log'](fullMessage);
    }

    // File output
    try {
      fs.appendFileSync(this.getLogFile(), fullMessage + '\n');
    } catch (error) {
      console.error('Error writing to log file:', error);
    }
  }

  error(message, data) { this.write(LogLevel.ERROR, message, data); }
  warn(message, data) { this.write(LogLevel.WARN, message, data); }
  info(message, data) { this.write(LogLevel.INFO, message, data); }
  debug(message, data) { this.write(LogLevel.DEBUG, message, data); }
}

module.exports = new Logger();
