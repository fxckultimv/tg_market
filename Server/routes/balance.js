const express = require('express')
const router = express.Router()
const { body, query, validationResult } = require('express-validator')
const BalanceController = require('../controllers/BalanceController')
const balanceController = new BalanceController()
const authMiddleware = require('../middleware/authMiddleware')

const validateInput = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}

router.get(
    '/balance',
    authMiddleware,
    query('id').isString().notEmpty(),
    validateInput,
    balanceController.getBalance.bind(balanceController)
)

router.post(
    '/replenish-balance',
    authMiddleware,
    query('id').isString().notEmpty(),
    body('amount').isNumeric().toFloat(),
    validateInput,
    balanceController.replenishBalance.bind(balanceController)
)

router.post(
    '/handle-payment-notification',
    body('userId').isString().notEmpty(),
    body('amount').isNumeric().toFloat(),
    validateInput,
    balanceController.handlePaymentNotification.bind(balanceController)
)

router.post(
    '/handle-ton-payment',
    authMiddleware,
    body('userId').isString().notEmpty(),
    body('tonAmount').isNumeric().toFloat(),
    body('transactionHash').isString().notEmpty(),
    validateInput,
    balanceController.handleTonPayment.bind(balanceController)
)

module.exports = router
