const dotenv = require('dotenv');
const path = require('path');

// Cargar archivo .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  PORT: process.env.PORT || 10000,
  ENV: process.env.NODE_ENV || 'development',
  DATA_DIR: process.env.DATA_DIR || path.join(__dirname, '../../data')
};
