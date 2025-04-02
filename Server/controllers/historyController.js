const db = require('../db')

class historyController {
    async history(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        const status = req.query.status
        const limit = parseInt(req.query.limit, 10) || 20 // Лимит по умолчанию 20
        const offset = parseInt(req.query.offset, 10) || 0 // Смещение по умолчанию 0

        let query = `
            SELECT DISTINCT o.order_id, o.total_price, o.status, o.created_at, p.product_id, 
                   p.title, p.description, vc.channel_title, vc.channel_tg_id, vc.channel_url
            FROM orders o
            LEFT JOIN orderitems oi ON o.order_id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.product_id
            LEFT JOIN verifiedchannels vc ON p.channel_id = vc.channel_id
            WHERE o.user_id = $1
        `

        const values = [user_id]
        if (status) {
            query += ` AND o.status = $2`
            values.push(status)
        }

        // Добавляем условия для пагинации
        query += ` ORDER BY o.created_at DESC LIMIT $${
            values.length + 1
        } OFFSET $${values.length + 2}`
        values.push(limit, offset)

        try {
            // Выполняем запрос к базе данных
            const result = await db.query(query, values)

            res.json(result.rows)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async orderHistory(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        const { id } = req.params

        try {
            const result = await db.query(
                `SELECT o.order_id,  o.total_price, o.status, o.created_at, 
	oi.product_id, oi.price,ARRAY_AGG(DISTINCT oi.post_time) as post_times, oi.format, oi.quantity, vc.channel_tg_id,
	vc.channel_url, vc.channel_title, r.review_id
FROM orders AS o
JOIN orderitems oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
JOIN verifiedchannels vc ON p.channel_id = vc.channel_id
LEFT JOIN reviews r ON o.order_id = r.order_id
WHERE o.order_id = $1 AND o.user_id = $2
GROUP BY o.order_id, o.total_price, o.status, o.created_at, 
	oi.product_id, oi.price, oi.format, oi.quantity, vc.channel_tg_id,
	vc.channel_url, vc.channel_title, r.review_id
                 `,
                [id, user_id]
            )

            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: "Order not found or you don't have permission to view it.",
                })
            }

            res.json(result.rows[0])
        } catch (err) {
            console.error('Error fetching order history:', err)
            // Generic error response
            res.status(500).json({
                error: 'An unexpected error occurred. Please try again later.',
            })
        }
    }
}

module.exports = new historyController()
