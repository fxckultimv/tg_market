const { query } = require('express')
const db = require('../db')
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

class buyController {
    // async infoForBuy(req, res) {
    //     const initData = res.locals.initData
    //     const user_id = initData.user.id
    //     const { order_id } = req.query

    //     try {
    //         // Получение информации о цене заказа
    //         const result = await db.query(
    //             `SELECT total_price
    //             FROM orders
    //             WHERE order_id = $1 AND user_id = $2`,
    //             [order_id, user_id]
    //         )

    //         if (result.rowCount === 0) {
    //             return res.status(404).json({
    //                 error: 'Order not found or you are not authorized to view it',
    //             })
    //         }

    //         const orderInfo = result.rows[0]

    //         // Отправка информации о цене заказа
    //         res.status(200).json({
    //             // message: 'Order information retrieved successfully',
    //             total_price: orderInfo.total_price,
    //         })
    //     } catch (err) {
    //         console.error('Error retrieving order information:', err)
    //         res.status(500).json({
    //             error: 'Internal server error',
    //             details: err.message,
    //         })
    //     }
    // }

    async buyOrder(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        const { order_id } = req.body

        try {
            // Получение информации о заказе с валидацией
            const orderInfo = await db.query(
                `
                SELECT DISTINCT o.total_price, p.user_id
                FROM orders AS o
                JOIN orderitems oi ON oi.order_id = o.order_id
                JOIN products p ON p.product_id = oi.product_id
                WHERE o.order_id = $1 AND o.user_id = $2 AND o.status = 'pending_payment'
                `,
                [order_id, user_id]
            )

            if (orderInfo.rowCount === 0) {
                return res.status(404).json({
                    error: 'Order not found or not in pending_payment status',
                })
            }

            const orderRow = orderInfo.rows[0]
            const sellerId = orderRow.user_id
            const amount = orderRow.total_price

            // Начало логики проведения платежа
            const buyerId = user_id
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
                    details: { order_id, sellerId },
                }),
                Transaction.create({
                    userId: sellerId,
                    type: 'purchase',
                    amount,
                    fee: 0,
                    status: 'completed',
                    details: { order_id, buyerId },
                }),
            ])

            const feeSent = await sendFee(fee)
            if (!feeSent.success) {
                logger.error(
                    `Не удалось отправить комиссию рынка: ${feeSent.error}`
                )
            }

            // Логика обновления статуса заказа
            const result = await db.query(
                `UPDATE orders SET status = 'completed' WHERE order_id = $1 AND user_id = $2`,
                [order_id, user_id]
            )

            if (result.rowCount > 0) {
                try {
                    const buy_info = await db.query(
                        `SELECT p.user_id, oi.post_time, vc.channel_name, vc.channel_url, oi.order_id, oi.message_id, pf.format_name
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

                    res.status(200).json({
                        message:
                            'Order status updated successfully and POST request sent successfully',
                        buyerTransaction: buyerTransaction._id,
                        sellerTransaction: sellerTransaction._id,
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
