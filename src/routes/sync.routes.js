const express = require('express');
const router = express.Router();
const syncController = require('../controllers/sync.controller');

router.get('/ping', syncController.handlePing);
router.post('/sync', syncController.handleSync);

module.exports = router;
