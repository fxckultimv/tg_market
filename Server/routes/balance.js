const express = require('express')
const router = express.Router()
const BalanceController = require('../controllers/BalanceController')
const balanceController = new BalanceController()
const authMiddleware = require('../middleware/authMiddleware')

router.get(
    '/balance',
    authMiddleware,
    balanceController.getBalance.bind(balanceController)
)
router.post(
    '/replenish-balance',
    authMiddleware,
    balanceController.replenishBalance.bind(balanceController)
)
router.post(
    '/handle-payment-notification',
    balanceController.handlePaymentNotification.bind(balanceController)
)

module.exports = router
