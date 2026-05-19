const app = require('./app');
const environment = require('./config/environment');

app.listen(environment.PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 SERVIDOR REST API INICIADO EXITOSAMENTE`);
  console.log(`💻 Entorno: ${environment.ENV}`);
  console.log(`🔌 Puerto Activo: ${environment.PORT}`);
  console.log(`📂 Directorio de Datos: ${environment.DATA_DIR}`);
  console.log(`=======================================================`);
});
