const db = require('../db')

class formatsController {
    async formats(req, res) {
        try {
            const result = await db.query('SELECT * FROM publication_formats')
            res.json(result.rows)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }
}

module.exports = new formatsController()
