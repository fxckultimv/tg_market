const express = require('express')
const router = express.Router()
const balanceController = require('../controllers/BalanceController')
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
    '/top-up',
    authMiddleware,
    balanceController.handleTonTopUp.bind(balanceController)
)
router.post(
    '/purchase',
    authMiddleware,
    balanceController.handlePurchase.bind(balanceController)
)
// router.post(
//     '/withdraw',
//     authMiddleware,
//     balanceController.handleWithdrawal.bind(balanceController)
// )
// router.post('/handle-payment-notification', balanceController.handlePaymentNotification.bind(balanceController));

module.exports = router
