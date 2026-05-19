const express = require('express');
const cors = require('cors');
const requestLogger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Soportar payloads grandes de sincronización
app.use(requestLogger);

// Montar Enrutador REST API
app.use('/api', routes);

// Middleware para rutas no encontradas (404)
app.use((req, res, next) => {
  const err = new Error(`Ruta ${req.originalUrl} no encontrada`);
  err.statusCode = 404;
  next(err);
});

// Capturador de errores global
app.use(errorHandler);

module.exports = app;
