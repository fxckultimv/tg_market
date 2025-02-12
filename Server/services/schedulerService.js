const db = require('../db')
const logger = require('../config/logging')
const UserBalance = require('../models/UserBalance')
const Transaction = require('../models/Transaction')
const User = require('../models/User')

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

const clearUnpaidOrders = async () => {
    try {
        // Удаляем устаревшие элементы корзины
        const query = `
            DELETE FROM orders
            WHERE status = 'pending_payment'
            AND EXISTS (
            SELECT 1
            FROM orderitems oi
            WHERE oi.order_id = orders.order_id
            AND oi.post_time < NOW()
            );`
        const result = await db.query(query)

        logger.info(`Cleaned ${result.rowCount} stale cart items.`)
    } catch (err) {
        logger.error('Error cleaning stale cart items:', err)
    }
}

const orderConfirmation = async () => {
    try {
        // Получаем заказы, которые нужно завершить
        const { rows: ordersForConfirmation } = await db.query(`
            SELECT o.order_id, o.total_price, o.user_id AS buyer_id, p.user_id AS seller_telegram_id
            FROM orders AS o
            JOIN orderitems AS oi ON o.order_id = oi.order_id
            JOIN products AS p ON p.product_id = oi.product_id
            WHERE o.status = 'paid'
            GROUP BY o.order_id, o.total_price, o.user_id, p.user_id
            HAVING MAX(oi.post_time) < NOW() - INTERVAL '24 hours';
        `)

        if (ordersForConfirmation.length === 0) {
            logger.info('Нет заказов для завершения.')
            return
        }

        logger.info(
            `Найдено ${ordersForConfirmation.length} заказов для завершения.`
        )

        for (const order of ordersForConfirmation) {
            const { order_id, total_price, seller_telegram_id, buyer_id } =
                order

            // Получаем user_id продавца по telegram_id
            const sellerId = await getUserIdByTelegramId(seller_telegram_id)
            if (!sellerId) {
                logger.error(
                    `Не найден user_id для telegram_id ${seller_telegram_id}`
                )
                continue
            }

            try {
                await db.query('BEGIN') // Начинаем транзакцию

                // Обновляем баланс продавца
                const sellerUpdate = await UserBalance.findOneAndUpdate(
                    { userId: sellerId },
                    { $inc: { balance: total_price } },
                    { new: true, runValidators: true }
                )

                if (!sellerUpdate) {
                    logger.error(
                        `Ошибка при обновлении баланса продавца ${sellerId}`
                    )
                    throw new Error('Не удалось обновить баланс продавца')
                }

                // Создаем запись о транзакции
                await Transaction.create({
                    userId: sellerId,
                    type: 'purchase',
                    amount: total_price,
                    fee: 0,
                    status: 'completed',
                    details: { order_id, buyer_id },
                })

                // Обновляем статус заказа
                await db.query(
                    `UPDATE orders SET status = 'completed' WHERE order_id = $1 AND status = 'paid'`,
                    [order_id]
                )

                await db.query('COMMIT') // Завершаем транзакцию
                logger.info(`Заказ ${order_id} успешно завершен.`)
            } catch (error) {
                await db.query('ROLLBACK') // Откатываем изменения при ошибке
                logger.error(`Ошибка при завершении заказа ${order_id}:`, error)
            } finally {
                await db.query('ROLLBACK') // Закрываем соединение
            }
        }
    } catch (err) {
        logger.error('Error cleaning stale cart items:', err)
    }
}

module.exports = { clearUnpaidOrders, orderConfirmation }
