const db = require('../db')

class historyController {
    async history(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id

        try {
            // Получение всей истории заказов пользователя с элементами заказов
            const result = await db.query(
                `SELECT o.order_id, o.total_price, o.status, o.created_at, p.product_id, 
                        p.title, p.description, v.channel_tg_id, v.channel_url
                FROM orders o
                LEFT JOIN orderitems oi ON o.order_id = oi.order_id
                LEFT JOIN products p ON oi.product_id = p.product_id
                LEFT JOIN verifiedchannels v ON p.channel_id = v.channel_id
                WHERE o.user_id = $1
                ORDER BY o.created_at DESC`,
                [user_id]
            )

            res.json(result.rows)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }
}

module.exports = new historyController()
