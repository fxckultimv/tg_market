// Server/routes/index.js
const express = require('express');
const router = express.Router();
const BalanceController = require('../controllers/BalanceController');

router.get('/balance', BalanceController.getBalance);
router.post('/balance/replenish', BalanceController.replenishBalance);

module.exports = router;