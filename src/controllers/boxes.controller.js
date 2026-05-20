const cacheService = require('../services/cache.service');

module.exports = {
  getAllCajas(req, res) {
    const list = cacheService.getCajas();
    return res.status(200).json(list);
  },

  getBoxDashboard(req, res) {
    const { cajaId } = req.params;
    const data = cacheService.getDatosCaja(cajaId);
    if (!data) {
      return res.status(404).json({ success: false, message: `Caja con ID '${cajaId}' no encontrada` });
    }
    return res.status(200).json(data.dashboard);
  },

  getBoxProducts(req, res) {
    const { cajaId } = req.params;
    const data = cacheService.getDatosCaja(cajaId);
    if (!data) {
      return res.status(404).json({ success: false, message: `Caja con ID '${cajaId}' no encontrada` });
    }
    return res.status(200).json(data.productos);
  },

  getBoxSales(req, res) {
    const { cajaId } = req.params;
    const data = cacheService.getDatosCaja(cajaId);
    if (!data) {
      return res.status(404).json({ success: false, message: `Caja con ID '${cajaId}' no encontrada` });
    }
    return res.status(200).json(data.ventas);
  },

  getBoxClients(req, res) {
    const { cajaId } = req.params;
    const data = cacheService.getDatosCaja(cajaId);
    if (!data) {
      return res.status(404).json({ success: false, message: `Caja con ID '${cajaId}' no encontrada` });
    }
    return res.status(200).json(data.clientes);
  },

  getBoxMovements(req, res) {
    const { cajaId } = req.params;
    const data = cacheService.getDatosCaja(cajaId);
    if (!data) {
      return res.status(404).json({ success: false, message: `Caja con ID '${cajaId}' no encontrada` });
    }
    return res.status(200).json(data.movimientos);
  },

  getBoxProviders(req, res) {
    const { cajaId } = req.params;
    const data = cacheService.getDatosCaja(cajaId);
    if (!data) {
      return res.status(404).json({ success: false, message: `Caja con ID '${cajaId}' no encontrada` });
    }
    return res.status(200).json(data.proveedores || []);
  },

  getBoxInvoices(req, res) {
    const { cajaId } = req.params;
    const data = cacheService.getDatosCaja(cajaId);
    if (!data) {
      return res.status(404).json({ success: false, message: `Caja con ID '${cajaId}' no encontrada` });
    }
    return res.status(200).json(data.facturas || []);
  }
};
