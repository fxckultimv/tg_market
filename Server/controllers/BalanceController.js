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
                `Баланс пополнен для пользователя ${userId}: +${amount} nanoTON`
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
            const { tonAmount, UserAddress, TransactionBoc } = req.body
            const userId = req.user._id

            if (!tonAmount || !UserAddress || !TransactionBoc) {
                return res.status(400).json({
                    error: 'Отсутствует tonAmount или transactionHash',
                })
            }

            let verificationResult
            for (let attempt = 1; attempt <= 5; attempt++) {
                verificationResult = await verifyTonPayment(
                    tonAmount,
                    UserAddress
                )
                if (verificationResult.valid) break
                await new Promise((resolve) => setTimeout(resolve, 5000))
            }

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
                transactionHash: verificationResult.transactionHash,
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

            const buyerUpdate = await UserBalance.findOneAndUpdate(
                { userId: buyerId, balance: { $gte: totalAmount } },
                { $inc: { balance: -totalAmount } },
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
                    { $inc: { balance: totalAmount } }
                )
                return res
                    .status(500)
                    .json({ error: 'Не удалось обновить баланс продавца' })
            }

            const [buyerTransaction, sellerTransaction] = await Promise.all([
                Transaction.create({
                    userId: buyerId,
                    type: 'purchase',
                    amount: -totalAmount,
                    fee: fee,
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

            logger.info(
                `Покупка завершена. ID покупателя: ${buyerId}, ID продавца: ${sellerId}, Сумма: ${amount} nanoTON, Комиссия: ${fee} nanoTON`
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

            // Валидация amount
            if (
                !amount ||
                isNaN(amount) ||
                !Number.isInteger(Number(amount)) ||
                Number(amount) <= 0
            ) {
                return res
                    .status(400)
                    .json({ error: 'Некорректная сумма вывода' })
            }

            // Валидация адреса
            if (
                !toAddress ||
                typeof toAddress !== 'string' ||
                toAddress.length < 48
            ) {
                return res
                    .status(400)
                    .json({ error: 'Некорректный адрес получателя' })
            }

            const amountStr = amount.toString() // Всегда строка
            const userBalance = await UserBalance.findOne({ userId })
            if (!userBalance) {
                return res
                    .status(404)
                    .json({ error: 'Баланс пользователя не найден' })
            }

            const transaction = new Transaction({
                userId,
                type: 'withdrawal',
                amount: amountStr,
                fee: 0.1,
                status: 'pending',
                details: { toAddress },
            })

            try {
                const deducted = await userBalance.deductBalance(amount)
                if (!deducted) {
                    throw new Error('Не удалось вычесть баланс пользователя')
                }

                const sent = await sendTon(
                    MARKET_WALLET_ADDRESS,
                    toAddress,
                    amountStr
                )
                if (!sent.success) {
                    await userBalance.addBalance(amount)
                    throw new Error(`Не удалось отправить TON: ${sent.error}`)
                    error.statusCode = 500
                    throw error
                }

                transaction.status = 'completed'
                transaction.transactionHash = sent.transactionHash
                await transaction.save()

                logger.info(
                    `Вывод средств завершен. ID пользователя: ${userId}, Сумма: ${amount} nanoTON`
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
