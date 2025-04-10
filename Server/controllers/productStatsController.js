const db = require('../db')

class ProductStats {
    async order(req, res) {
        const user_id = req.user.userId
        const id = req.query.channel_id

        try {
            const result = await db.query(
                `SELECT * FROM orders AS o
	            JOIN orderitems oi ON o.order_id = oi.order_id
	            JOIN products p ON p.product_id = oi.product_id
	            WHERE oi.product_id = $1 AND o.status IN ('completed', 'paid') AND p.user_id = $2`,
                [id, user_id]
            )

            if (result.rows.length > 0) {
                res.json(result.rows)
            } else {
                res.status(204).json({ error: 'Stats not found' })
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }
}

module.exports = new ProductStats()
