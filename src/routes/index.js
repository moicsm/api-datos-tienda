const express = require('express');
const router = express.Router();

const syncRoutes = require('./sync.routes');
const boxesRoutes = require('./boxes.routes');

// Montar sub-rutas
router.use('/', syncRoutes);
router.use('/', boxesRoutes);

module.exports = router;
