const db = require('../db')

class historyController {
    async history(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        const status = req.query.status
        const limit = parseInt(req.query.limit, 10) || 20 // Лимит по умолчанию 20
        const offset = parseInt(req.query.offset, 10) || 0 // Смещение по умолчанию 0

        let query = `
            SELECT o.order_id, o.total_price, o.status, o.created_at, p.product_id, 
                   p.title, p.description, v.channel_tg_id, v.channel_url
            FROM orders o
            LEFT JOIN orderitems oi ON o.order_id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.product_id
            LEFT JOIN verifiedchannels v ON p.channel_id = v.channel_id
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
}

module.exports = new historyController()
