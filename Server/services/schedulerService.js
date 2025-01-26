const db = require('../db')
const logger = require('../config/logging')

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

module.exports = { clearUnpaidOrders }
