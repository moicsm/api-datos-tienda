const fs = require('fs');
const path = require('path');

module.exports = {
  ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  },

  readJson(filePath, defaultValue = null) {
    try {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }
    } catch (err) {
      console.error(`[FS UTIL] Error al leer archivo ${filePath}:`, err.message);
    }
    return defaultValue;
  },

  writeJson(filePath, data) {
    try {
      this.ensureDir(path.dirname(filePath));
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (err) {
      console.error(`[FS UTIL] Error al escribir archivo ${filePath}:`, err.message);
      return false;
    }
  }
};
