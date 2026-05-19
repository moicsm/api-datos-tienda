const environment = require('../config/environment');

module.exports = (err, req, res, next) => {
  console.error('[API ERROR] ❌ Error detectado:', err.stack || err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(environment.ENV === 'development' && { stack: err.stack })
  });
};
