const db = require('../db')

class channelController {
    async verifiedChannels(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id

        try {
            const result = await db.query(
                `SELECT DISTINCT vc.channel_id, vc.channel_name, vc.channel_url, vc.subscribers_count, vc.views, vc.channel_tg_id
                FROM verifiedchannels AS vc
                WHERE vc.user_id = $1
                ORDER BY vc.subscribers_count DESC;
                `,
                [user_id]
            )

            res.status(200).json(result.rows)
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }
}

module.exports = new channelController()
