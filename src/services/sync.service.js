const cacheService = require('./cache.service');

class SyncService {
  async processSync(payload) {
    const { cajaId, hostnamePC, ipLocal, productos, ventas, clientes, movimientos, proveedores, facturas, dashboard } = payload;

    if (!cajaId) {
      throw new Error('Falta el parámetro crítico: cajaId');
    }

    // 1. Registrar caja en listado central
    cacheService.registrarCaja(cajaId, hostnamePC || 'Unknown', ipLocal || '127.0.0.1');

    // 2. Formatear y empaquetar datos detallados
    const datosCaja = {
      productos: productos || [],
      ventas: ventas || [],
      clientes: clientes || [],
      movimientos: movimientos || [],
      proveedores: proveedores || [],
      facturas: facturas || [],
      dashboard: dashboard || {}
    };

    // 3. Guardar datos en el cache
    cacheService.guardarCaja(cajaId, datosCaja);

    return {
      cajaId,
      cajasActivas: cacheService.getCajas().length,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new SyncService();
