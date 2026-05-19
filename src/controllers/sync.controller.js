const syncService = require('../services/sync.service');

module.exports = {
  async handleSync(req, res, next) {
    try {
      const result = await syncService.processSync(req.body);
      return res.status(200).json({
        success: true,
        message: 'Sincronización de caja completada exitosamente',
        data: result
      });
    } catch (err) {
      next(err); // Enviar al middleware de error global
    }
  },

  handlePing(req, res) {
    return res.status(200).json({
      status: 'active',
      message: 'pong',
      timestamp: new Date().toISOString()
    });
  }
};
