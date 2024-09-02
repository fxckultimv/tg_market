const db = require('../db')

class categoriesController {
    async categories(req, res) {
        try {
            const result = await db.query('SELECT * FROM categories')
            res.json(result.rows)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }
}

module.exports = new categoriesController()
