const { query } = require('express')
const db = require('../db')
const logger = require('../config/logging')
const UserBalance = require('../models/UserBalance')
const Transaction = require('../models/Transaction')
const User = require('../models/User')
const {
    verifyTonPayment,
    sendTon,
    sendFee,
    estimateTransactionFees,
} = require('../utils/tonUtils')

const MARKET_FEE_PERCENTAGE = 0.05 // 5%
const MARKET_WALLET_ADDRESS = process.env.MARKET_WALLET_ADDRESS
const FEE_WALLET_ADDRESS = process.env.FEE_WALLET_ADDRESS

async function getUserIdByTelegramId(telegramId) {
    try {
        const user = await User.findOne({ telegramId }) // Ищем пользователя по telegramId
        if (!user) {
            throw new Error('User not found')
        }
        return user._id.toString() // Возвращаем _id
    } catch (error) {
        console.error('Error fetching user by telegramId:', error.message)
        throw error
    }
}

class buyController {
    async buyOrder(req, res) {
        const user_id = req.user.userId
        const { order_id } = req.body

        try {
            // Получение информации о заказе с валидацией
            const orderInfo = await db.query(
                `
                SELECT DISTINCT o.total_price, p.user_id, oi.post_time, u.role
                FROM orders AS o
                JOIN orderitems oi ON oi.order_id = o.order_id
                JOIN products p ON p.product_id = oi.product_id
                JOIN users u ON u.user_id = p.user_id
                WHERE o.order_id = $1 AND o.user_id = $2 AND o.status = 'pending_payment'
                `,
                [order_id, user_id]
            )

            if (orderInfo.rowCount === 0) {
                return res.status(404).json({
                    error: 'Order not found or not in pending_payment status',
                })
            }

            const now = new Date()

            const hasExpiredItems = orderInfo.rows.some((item) => {
                const postTime = new Date(item.post_time)
                return postTime < now
            })

            if (hasExpiredItems) {
                return res
                    .status(400)
                    .json({ error: 'The order time has expired' })
            }

            const checkPromoCode = await db.query(
                'SELECT * FROM user_promo_codes AS upc JOIN promo_codes pc ON pc.id = upc.promo_code_id WHERE upc.user_id = $1 AND upc.expires_at > $2 AND used = false ORDER BY upc.expires_at DESC LIMIT 1',
                [user_id, now]
            )

            const orderRow = orderInfo.rows[0]
            const sellerId = await getUserIdByTelegramId(orderRow.user_id)
            const amount = orderRow.total_price
            const buyerId = await getUserIdByTelegramId(user_id)
            const isAdmin = orderRow.role === 'admin'

            // Начало логики проведения платежа
            const fee = isAdmin ? 0 : amount * MARKET_FEE_PERCENTAGE
            let totalAmount = Number(amount)

            if (checkPromoCode.rows.length > 0 && !isAdmin) {
                const discountPercent = parseInt(checkPromoCode.rows[0].percent)
                totalAmount = totalAmount * (1 - discountPercent / 100)
            }

            if (isNaN(totalAmount) || totalAmount <= 0) {
                return res
                    .status(400)
                    .json({ error: 'Invalid discounted amount' })
            }

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

            // const sellerUpdate = await UserBalance.findOneAndUpdate(
            //     { userId: sellerId },
            //     { $inc: { balance: amount } },
            //     { new: true, runValidators: true }
            // )

            // if (!sellerUpdate) {
            //     await UserBalance.findOneAndUpdate(
            //         { userId: buyerId },
            //         { $inc: { balance: totalAmount } }
            //     )
            //     return res
            //         .status(500)
            //         .json({ error: 'Не удалось обновить баланс продавца' })
            // }

            const [buyerTransaction] = await Promise.all([
                Transaction.create({
                    userId: buyerId,
                    type: 'purchase',
                    amount: -totalAmount,
                    fee: fee,
                    status: 'completed',
                    details: { order_id, sellerId },
                }),
            ])

            // Логика обновления статуса заказа
            const promoCodeId =
                checkPromoCode.rows.length > 0
                    ? checkPromoCode.rows[0].promo_code_id
                    : null
            const discounted_price = isAdmin ? null : totalAmount

            const result = await db.query(
                `UPDATE orders SET status = 'paid', discounted_price = $1, promo_code_id = $2 WHERE order_id = $3 AND user_id = $4`,
                [discounted_price, promoCodeId, order_id, user_id]
            )

            // И только если обновление заказа прошло успешно — обновляем used
            if (
                result.rowCount > 0 &&
                checkPromoCode.rows.length > 0 &&
                !isAdmin
            ) {
                await db.query(
                    `UPDATE user_promo_codes 
                    SET used = true 
                    WHERE user_id = $1 AND promo_code_id = $2`,
                    [user_id, checkPromoCode.rows[0].promo_code_id]
                )
            }

            if (result.rowCount > 0) {
                try {
                    const buy_info = await db.query(
                        `SELECT p.user_id, oi.post_time, vc.channel_name, vc.channel_title, vc.channel_url, oi.order_id, oi.message_id, oi.chat_id, pf.format_name
                        FROM orderitems AS oi
                        JOIN products p ON oi.product_id = p.product_id 
                        JOIN verifiedchannels vc ON p.channel_id = vc.channel_id
                        JOIN publication_formats pf ON pf.format_id = oi.format
                        WHERE oi.order_id = $1`,
                        [order_id]
                    )

                    if (buy_info.rows.length === 0) {
                        throw new Error(
                            'No data found for the provided order_id'
                        )
                    }

                    const post_time_list = buy_info.rows.map(
                        (row) => row.post_time
                    )
                    const first_row = buy_info.rows[0]

                    const requestBody = {
                        user_id: first_row.user_id,
                        order_id: first_row.order_id,
                        message_id: first_row.message_id,
                        post_time: post_time_list,
                        channel_name: first_row.channel_name,
                        channel_url: first_row.channel_url,
                        format: first_row.format_name,
                        chat_id: first_row.chat_id,
                    }

                    const response = await fetch('http://localhost:5001/buy', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody),
                    })

                    if (!response.ok) {
                        throw new Error(
                            `Error from POST request: ${response.statusText}`
                        )
                    }

                    const data = await response.json()

                    logger.info(
                        `Покупка завершена. ID покупателя: ${buyerId}, ID продавца: ${sellerId}, Сумма: ${amount} TON, Комиссия: ${fee} TON`
                    )

                    res.status(200).json({
                        message:
                            'Order status updated successfully and POST request sent successfully',
                        buyerTransaction: buyerTransaction._id,
                        // sellerTransaction: sellerTransaction._id,
                        externalServerData: data,
                    })
                } catch (error) {
                    console.error(
                        'Error sending POST request to local server:',
                        error
                    )
                    res.status(500).json({
                        message:
                            'Order status updated but failed to send POST request',
                        error: error.message,
                    })
                }
            } else {
                res.status(404).json({
                    message: 'Order not found or unauthorized',
                })
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Internal server error' })
        }
    }
}

module.exports = new buyController()
