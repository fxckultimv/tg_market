const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/BalanceController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/balance', authMiddleware, balanceController.getBalance);
router.post('/replenish-balance', authMiddleware, balanceController.replenishBalance);
router.post('/handle-payment-notification', authMiddleware, balanceController.handlePaymentNotification);

module.exports = router;
