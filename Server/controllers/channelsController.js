const db = require('../db')

class channelController {
    async verifiedChannels(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id

        try {
            const result = await db.query(
                `SELECT channel_id, channel_name, channel_url, subscribers_count, views, channel_tg_id FROM verifiedchannels WHERE user_id = $1`,
                [user_id]
            )
            res.json(result.rows)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }
}

module.exports = new channelController()
