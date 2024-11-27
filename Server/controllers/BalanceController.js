const logger = require('../config/logging')
const UserBalance = require('../models/UserBalance')
const Transaction = require('../models/Transaction')
const {
    verifyTonPayment,
    sendTon,
    sendFee,
    estimateTransactionFees,
} = require('../utils/tonUtils')

const MARKET_FEE_PERCENTAGE = 0.05 // 5%
const MARKET_WALLET_ADDRESS = process.env.MARKET_WALLET_ADDRESS
const FEE_WALLET_ADDRESS = process.env.FEE_WALLET_ADDRESS

class BalanceController {
    async getBalance(req, res) {
        try {
            const userId = req.user._id
            let userBalance = await UserBalance.findOne({ userId })

            if (!userBalance) {
                userBalance = new UserBalance({ userId })
                await userBalance.save()
                logger.info(`Создан новый баланс для пользователя ${userId}`)
            }

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
            const { amount } = req.body
            const userId = req.user._id

            if (isNaN(amount) || amount <= 0) {
                return res.status(400).json({ error: 'Недопустимая сумма' })
            }

            let userBalance = await UserBalance.findOne({ userId })
            if (!userBalance) {
                userBalance = new UserBalance({ userId })
            }

            const success = await userBalance.addBalance(amount)
            if (!success) {
                return res
                    .status(500)
                    .json({ error: 'Не удалось обновить баланс' })
            }

            const transaction = new Transaction({
                userId,
                type: 'topup',
                amount,
                fee: 0,
                status: 'completed',
            })
            await transaction.save()

            logger.info(
                `Баланс пополнен для пользователя ${userId}: +${amount} TON`
            )
            res.json({
                message: 'Баланс успешно пополнен',
                balance: userBalance.balance,
            })
        } catch (error) {
            this.handleError(res, error)
        }
    }

    async handleTonTopUp(req, res) {
        try {
            const { tonAmount, transactionHash } = req.body
            const userId = req.user._id

            if (!tonAmount || !transactionHash) {
                return res.status(400).json({
                    error: 'Отсутствует tonAmount или transactionHash',
                })
            }

            const verificationResult = await verifyTonPayment(
                tonAmount,
                transactionHash
            )
            if (!verificationResult.valid) {
                logger.warn(
                    `Недействительный платеж TON для пользователя ${userId}: ${verificationResult.error}`
                )
                return res.status(400).json({
                    error: 'Недействительный платеж TON',
                    details: verificationResult.error,
                })
            }

            const userBalance = await UserBalance.findOne({ userId })
            if (!userBalance) {
                return res
                    .status(404)
                    .json({ error: 'Баланс пользователя не найден' })
            }

            const success = await userBalance.addBalance(parseFloat(tonAmount))
            if (!success) {
                return res
                    .status(500)
                    .json({ error: 'Не удалось обновить баланс' })
            }

            const transaction = new Transaction({
                userId,
                type: 'topup',
                amount: parseFloat(tonAmount),
                fee: 0,
                status: 'completed',
                transactionHash,
            })
            await transaction.save()

            res.json({
                message: 'Баланс успешно обновлен',
                balance: userBalance.balance,
                currency: userBalance.currency,
            })
        } catch (error) {
            this.handleError(res, error)
        }
    }

    async handlePurchase(req, res) {
        try {
            const { sellerId, amount, productId } = req.body
            const buyerId = req.user._id

            const fee = amount * MARKET_FEE_PERCENTAGE
            const totalAmount = amount + fee

            const feeEstimation = await estimateTransactionFees(
                MARKET_WALLET_ADDRESS,
                FEE_WALLET_ADDRESS,
                fee
            )
            if (!feeEstimation.success) {
                return res.status(500).json({
                    error: 'Не удалось оценить комиссию за транзакцию',
                    details: feeEstimation.error,
                })
            }

            const totalWithFees = totalAmount + parseFloat(feeEstimation.fees)

            const buyerUpdate = await UserBalance.findOneAndUpdate(
                { userId: buyerId, balance: { $gte: totalWithFees } },
                { $inc: { balance: -totalWithFees } },
                { new: true, runValidators: true }
            )

            if (!buyerUpdate) {
                return res.status(400).json({
                    error: 'Недостаточный баланс или обнаружено одновременное обновление',
                })
            }

            const sellerUpdate = await UserBalance.findOneAndUpdate(
                { userId: sellerId },
                { $inc: { balance: amount } },
                { new: true, runValidators: true }
            )

            if (!sellerUpdate) {
                await UserBalance.findOneAndUpdate(
                    { userId: buyerId },
                    { $inc: { balance: totalWithFees } }
                )
                return res
                    .status(500)
                    .json({ error: 'Не удалось обновить баланс продавца' })
            }

            const [buyerTransaction, sellerTransaction] = await Promise.all([
                Transaction.create({
                    userId: buyerId,
                    type: 'purchase',
                    amount: -totalWithFees,
                    fee: fee + parseFloat(feeEstimation.fees),
                    status: 'completed',
                    details: { productId, sellerId },
                }),
                Transaction.create({
                    userId: sellerId,
                    type: 'purchase',
                    amount,
                    fee: 0,
                    status: 'completed',
                    details: { productId, buyerId },
                }),
            ])

            const feeSent = await sendFee(fee)
            if (!feeSent.success) {
                logger.error(
                    `Не удалось отправить комиссию рынка: ${feeSent.error}`
                )
            }

            logger.info(
                `Покупка завершена. ID покупателя: ${buyerId}, ID продавца: ${sellerId}, Сумма: ${amount} TON, Комиссия: ${fee} TON`
            )
            res.json({
                message: 'Покупка успешно завершена',
                buyerTransaction: buyerTransaction._id,
                sellerTransaction: sellerTransaction._id,
            })
        } catch (error) {
            this.handleError(res, error)
        }
    }

    async handleWithdrawal(req, res) {
        try {
            const { amount, toAddress } = req.body
            const userId = req.user._id

            const userBalance = await UserBalance.findOne({ userId })
            if (!userBalance) {
                return res
                    .status(404)
                    .json({ error: 'Баланс пользователя не найден' })
            }

            const feeEstimation = await estimateTransactionFees(
                MARKET_WALLET_ADDRESS,
                toAddress,
                amount
            )
            if (!feeEstimation.success) {
                return res.status(500).json({
                    error: 'Не удалось оценить комиссию за транзакцию',
                    details: feeEstimation.error,
                })
            }

            const totalAmount =
                parseFloat(amount) + parseFloat(feeEstimation.fees)

            if (!userBalance.hasSufficientBalance(totalAmount)) {
                return res.status(400).json({ error: 'Недостаточный баланс' })
            }

            const transaction = new Transaction({
                userId,
                type: 'withdrawal',
                amount: -totalAmount,
                fee: parseFloat(feeEstimation.fees),
                status: 'pending',
                details: { toAddress },
            })

            try {
                const deducted = await userBalance.deductBalance(totalAmount)
                if (!deducted) {
                    throw new Error('Не удалось вычесть баланс пользователя')
                }

                const sent = await sendTon(
                    MARKET_WALLET_ADDRESS,
                    toAddress,
                    amount
                )
                if (!sent.success) {
                    await userBalance.addBalance(totalAmount)
                    throw new Error(`Не удалось отправить TON: ${sent.error}`)
                }

                transaction.status = 'completed'
                transaction.transactionHash = sent.transactionHash
                await transaction.save()

                logger.info(
                    `Вывод средств завершен. ID пользователя: ${userId}, Сумма: ${amount} TON`
                )
                res.json({
                    message: 'Вывод средств успешно завершен',
                    transaction: transaction._id,
                    transactionHash: sent.transactionHash,
                })
            } catch (error) {
                transaction.status = 'failed'
                await transaction.save()
                throw error
            }
        } catch (error) {
            this.handleError(res, error)
        }
    }

    handleError(res, error) {
        logger.error(`Ошибка обработки запроса: ${error.message}`)
        res.status(500).json({ error: 'Внутренняя ошибка сервера' })
    }
}

module.exports = new BalanceController()
