const path = require('path');
const environment = require('../config/environment');
const fileSystem = require('../utils/fileSystem');

class CacheService {
  constructor() {
    this.dataDir = environment.DATA_DIR;
    this.cajasFile = path.join(this.dataDir, 'cajas.json');
    
    // Inicializar caché en memoria
    this.cajas = [];
    this.datosCajas = {};

    // Asegurar directorio existe
    fileSystem.ensureDir(this.dataDir);
    
    // Cargar datos al iniciar
    this.cargarDesdeDisco();
  }

  cargarDesdeDisco() {
    try {
      this.cajas = fileSystem.readJson(this.cajasFile, []);
      console.log(`[CACHE SERVICE] 📁 Cargadas ${this.cajas.length} cajas registradas desde el disco.`);

      for (const caja of this.cajas) {
        const cajaFile = path.join(this.dataDir, `caja_${caja.id}.json`);
        const datos = fileSystem.readJson(cajaFile, null);
        if (datos) {
          this.datosCajas[caja.id] = datos;
          console.log(`[CACHE SERVICE] 📁 Datos de la caja '${caja.id}' cargados con éxito.`);
        }
      }
    } catch (err) {
      console.error('[CACHE SERVICE] Error al cargar persistencia desde disco:', err.message);
    }
  }

  guardarCaja(cajaId, datosCompletos) {
    // 1. Guardar en memoria
    this.datosCajas[cajaId] = datosCompletos;

    // 2. Guardar en disco
    const cajaFile = path.join(this.dataDir, `caja_${cajaId}.json`);
    fileSystem.writeJson(cajaFile, datosCompletos);
  }

  registrarCaja(cajaId, hostnamePC, ipLocal) {
    const indice = this.cajas.findIndex(c => c.id === cajaId);
    const datosCaja = {
      id: cajaId,
      nombrePC: hostnamePC,
      ip: ipLocal,
      ultimaConexion: new Date().toISOString()
    };

    if (indice !== -1) {
      this.cajas[indice] = datosCaja;
    } else {
      this.cajas.push(datosCaja);
    }

    // Guardar lista central de cajas en disco
    fileSystem.writeJson(this.cajasFile, this.cajas);
    return datosCaja;
  }

  getCajas() {
    return this.cajas;
  }

  getDatosCaja(cajaId) {
    return this.datosCajas[cajaId] || null;
  }
}

// Exportar instancia única (Singleton)
module.exports = new CacheService();
