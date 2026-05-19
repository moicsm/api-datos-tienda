const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Permitir payloads grandes de datos

// Rutas locales de caché de archivos
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const CAJAS_FILE = path.join(DATA_DIR, 'cajas.json');

// Caché en memoria para velocidad y fiabilidad
let cache = {
  cajas: [],       // Lista central de cajas registradas
  datosCajas: {}   // Datos detallados de cada caja: { [cajaId]: { productos, ventas, clientes, movimientos, dashboard } }
};

// Cargar datos persistidos del disco al iniciar el servidor
function cargarDatosDesdeDisco() {
  try {
    if (fs.existsSync(CAJAS_FILE)) {
      cache.cajas = JSON.parse(fs.readFileSync(CAJAS_FILE, 'utf8'));
      console.log(`[Backend] Cargadas ${cache.cajas.length} cajas registradas desde el disco.`);
    }

    // Cargar archivos individuales de cada caja si existen
    for (const caja of cache.cajas) {
      const cajaFile = path.join(DATA_DIR, `caja_${caja.id}.json`);
      if (fs.existsSync(cajaFile)) {
        cache.datosCajas[caja.id] = JSON.parse(fs.readFileSync(cajaFile, 'utf8'));
        console.log(`[Backend] Datos de la caja ${caja.id} cargados desde el disco.`);
      }
    }
  } catch (err) {
    console.error('[Backend] Error al cargar caché desde disco:', err);
  }
}

cargarDatosDesdeDisco();

// Guardar datos en el disco de forma asíncrona
function guardarCajaEnDisco(cajaId) {
  try {
    fs.writeFileSync(CAJAS_FILE, JSON.stringify(cache.cajas, null, 2), 'utf8');
    if (cache.datosCajas[cajaId]) {
      const cajaFile = path.join(DATA_DIR, `caja_${cajaId}.json`);
      fs.writeFileSync(cajaFile, JSON.stringify(cache.datosCajas[cajaId], null, 2), 'utf8');
    }
  } catch (err) {
    console.error('[Backend] Error al persistir datos en disco:', err);
  }
}

// ==========================================
// ENDPOINTS DE LA API REST
// ==========================================

// Endpoint de Ping (Keep-Alive para evitar que Render se duerma)
app.get('/api/ping', (req, res) => {
  res.status(200).json({ status: 'active', message: 'pong', timestamp: new Date().toISOString() });
});

// Endpoint de Sincronización (POST) - Usado por la App de Escritorio
app.post('/api/sync', (req, res) => {
  const { cajaId, hostnamePC, ipLocal, productos, ventas, clientes, movimientos, dashboard } = req.body;

  if (!cajaId) {
    return res.status(400).json({ success: false, message: 'Falta el cajaId identificador' });
  }

  console.log(`[Backend] 📥 Sincronización recibida de caja: ${cajaId} (IP: ${ipLocal})`);

  // 1. Actualizar el registro global central de cajas
  const indice = cache.cajas.findIndex(c => c.id === cajaId);
  const datosRegistroCaja = {
    id: cajaId,
    nombrePC: hostnamePC,
    ip: ipLocal,
    ultimaConexion: new Date().toISOString()
  };

  if (indice !== -1) {
    cache.cajas[indice] = datosRegistroCaja;
  } else {
    cache.cajas.push(datosRegistroCaja);
  }

  // 2. Actualizar los datos detallados en memoria
  cache.datosCajas[cajaId] = {
    productos: productos || [],
    ventas: ventas || [],
    clientes: clientes || [],
    movimientos: movimientos || [],
    dashboard: dashboard || {}
  };

  // 3. Persistir los datos de forma segura en disco
  guardarCajaEnDisco(cajaId);

  res.status(200).json({
    success: true,
    message: 'Sincronización completada exitosamente',
    timestamp: new Date().toISOString()
  });
});

// GET: Obtener lista de cajas registradas
app.get('/api/cajas', (req, res) => {
  res.status(200).json(cache.cajas);
});

// GET: Obtener el dashboard de estadísticas de una caja
app.get('/api/cajas/:cajaId/dashboard', (req, res) => {
  const { cajaId } = req.params;
  const datos = cache.datosCajas[cajaId];
  if (!datos) {
    return res.status(404).json({ message: `Caja con ID ${cajaId} no encontrada o sin sincronizaciones` });
  }
  res.status(200).json(datos.dashboard);
});

// GET: Obtener productos de una caja
app.get('/api/cajas/:cajaId/productos', (req, res) => {
  const { cajaId } = req.params;
  const datos = cache.datosCajas[cajaId];
  if (!datos) {
    return res.status(404).json({ message: `Caja con ID ${cajaId} no encontrada` });
  }
  res.status(200).json(datos.productos);
});

// GET: Obtener ventas de una caja
app.get('/api/cajas/:cajaId/ventas', (req, res) => {
  const { cajaId } = req.params;
  const datos = cache.datosCajas[cajaId];
  if (!datos) {
    return res.status(404).json({ message: `Caja con ID ${cajaId} no encontrada` });
  }
  res.status(200).json(datos.ventas);
});

// GET: Obtener clientes de una caja
app.get('/api/cajas/:cajaId/clientes', (req, res) => {
  const { cajaId } = req.params;
  const datos = cache.datosCajas[cajaId];
  if (!datos) {
    return res.status(404).json({ message: `Caja con ID ${cajaId} no encontrada` });
  }
  res.status(200).json(datos.clientes);
});

// GET: Obtener movimientos de inventario de una caja
app.get('/api/cajas/:cajaId/movimientos', (req, res) => {
  const { cajaId } = req.params;
  const datos = cache.datosCajas[cajaId];
  if (!datos) {
    return res.status(404).json({ message: `Caja con ID ${cajaId} no encontrada` });
  }
  res.status(200).json(datos.movimientos);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`[Backend] 🚀 Servidor API REST corriendo en puerto ${PORT}`);
});
