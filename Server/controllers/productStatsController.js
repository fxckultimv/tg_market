const db = require('../db')

class ProductStats {
    async order(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        const { id } = req.query.channel_id

        try {
            const result = await db.query(
                `SELECT * FROM orders AS o
	            JOIN orderitems oi ON o.order_id = oi.order_id
	            JOIN products p ON p.product_id = oi.product_id
	            WHERE oi.product_id = 53 AND o.status = 'completed' AND p.user_id = $1`,
                [user_id]
            )
            if (result.rows.length > 0) {
                res.json(result.rows)
            } else {
                res.status(404).json({ error: 'Product not found' })
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }
}

module.exports = new ProductStats()
