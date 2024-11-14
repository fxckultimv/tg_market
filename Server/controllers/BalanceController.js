const logger = require('../config/logging')
const UserBalance = require('../models/UserBalance')
const { verifyTonPayment, convertTonToRub } = require('../utils/tonUtils')

class BalanceController {
    async getBalance(req, res) {
        try {
            const { id: telegramUserId } = req.query
            let userBalance = await UserBalance.findOne({ userId: telegramUserId })
            if (!userBalance) {
                userBalance = new UserBalance({
                    userId: telegramUserId,
                    currency: 'RUB',
                })
                await userBalance.save()
            }
            logger.info(`User balance retrieved for user ${telegramUserId}`)
            res.json({
                balance: userBalance.balance,
                currency: userBalance.currency,
            })
        } catch (error) {
            this.handleError(res, error)
        }
    }

    async replenishBalance(req, res) {
        try {
            const { id: telegramUserId } = req.query
            const { amount } = req.body
            const userBalance = await UserBalance.findOneAndUpdate(
                { userId: telegramUserId },
                { $inc: { balance: amount } },
                { new: true, upsert: true }
            )
            logger.info(`Balance replenished for user ${telegramUserId}`)
            res.json({
                balance: userBalance.balance,
                currency: userBalance.currency,
            })
        } catch (error) {
            this.handleError(res, error)
        }
    }

    async handlePaymentNotification(req, res) {
        try {
            const { userId, amount } = req.body
            const userBalance = await UserBalance.findOneAndUpdate(
                { userId },
                { $inc: { balance: amount } },
                { new: true, upsert: true }
            )
            logger.info(`Payment processed for user ${userId}`)
            res.json({
                balance: userBalance.balance,
                currency: userBalance.currency,
            })
        } catch (error) {
            this.handleError(res, error)
        }
    }

    async handleTonPayment(req, res) {
        try {
            const { userId, tonAmount, transactionHash } = req.body

            // Verify the TON payment
            const isValid = await verifyTonPayment(tonAmount, transactionHash)
            if (!isValid) {
                logger.warn(`Invalid TON payment for user ${userId}`)
                return res.status(400).json({ error: 'Invalid TON payment' })
            }

            // Convert TON to RUB
            const rubAmount = await convertTonToRub(tonAmount)

            // Update user balance
            const userBalance = await UserBalance.findOneAndUpdate(
                { userId },
                { $inc: { balance: rubAmount } },
                { new: true, upsert: true }
            )

            logger.info(`TON payment processed for user ${userId}. Amount: ${tonAmount} TON (${rubAmount} RUB)`)
            res.json({
                balance: userBalance.balance,
                currency: userBalance.currency,
                tonAmount,
                rubAmount
            })
        } catch (error) {
            this.handleError(res, error)
        }
    }

    handleError(res, error) {
        logger.error(`Error processing request: ${error.message}`)
        res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = BalanceController
