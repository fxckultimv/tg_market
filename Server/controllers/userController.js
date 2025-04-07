const db = require('../db')

class userController {
    async user(req, res) {
        const { uuid } = req.params
        try {
            const result = await db.query(
                'SELECT username, rating, created_at  FROM users WHERE user_uuid = $1',
                [uuid]
            )
            if (result.rows.length > 0) {
                res.json(result.rows[0])
            } else {
                res.status(404).json({ error: 'User products not found' })
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async me(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id

        try {
            const result = await db.query(
                'SELECT username, rating, created_at, user_uuid  FROM users WHERE user_id = $1',
                [user_id]
            )
            if (result.rows.length > 0) {
                res.json(result.rows[0])
            } else {
                res.status(404).json({ error: 'User products not found' })
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }

    async userReviews(req, res) {
        const { uuid } = req.params

        try {
            const result = await db.query(
                'SELECT r.review_id, r.rating, r.comment, r.created_at FROM reviews AS r JOIN users u ON u.user_id = r.seller_id WHERE u.user_uuid = $1',
                [uuid]
            )
            if (result.rows.length > 0) {
                res.json(result.rows)
            } else {
                res.status(404).json({ error: 'Reviews not found' })
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }
}

module.exports = new userController()
