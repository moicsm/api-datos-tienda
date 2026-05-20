const express = require('express');
const router = express.Router();
const boxesController = require('../controllers/boxes.controller');

router.get('/cajas', boxesController.getAllCajas);
router.get('/cajas/:cajaId/dashboard', boxesController.getBoxDashboard);
router.get('/cajas/:cajaId/productos', boxesController.getBoxProducts);
router.get('/cajas/:cajaId/ventas', boxesController.getBoxSales);
router.get('/cajas/:cajaId/clientes', boxesController.getBoxClients);
router.get('/cajas/:cajaId/movimientos', boxesController.getBoxMovements);
router.get('/cajas/:cajaId/proveedores', boxesController.getBoxProviders);
router.get('/cajas/:cajaId/facturas', boxesController.getBoxInvoices);

module.exports = router;
