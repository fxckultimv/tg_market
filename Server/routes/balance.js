const express = require('express')
const router = express.Router()
const balanceController = require('../controllers/BalanceController')
const authMiddleware = require('../middleware/AuthMiddleware')

router.use(authMiddleware)

router.get('/balance', balanceController.getBalance.bind(balanceController))

router.post(
    '/replenish-balance',
    balanceController.replenishBalance.bind(balanceController)
)

router.post('/top-up', balanceController.handleTonTopUp.bind(balanceController))

router.post(
    '/purchase',
    balanceController.handlePurchase.bind(balanceController)
)
router.post(
    '/withdraw',
    balanceController.handleWithdrawal.bind(balanceController)
)
// router.post('/handle-payment-notification', balanceController.handlePaymentNotification.bind(balanceController));

module.exports = router
