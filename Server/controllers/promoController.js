const db = require('../db')
const { error } = require('winston')

class promoController {
    async activate(req, res) {
        const user_id = req.user.userId
        const { code } = req.body

        if (!code || typeof code !== 'string' || code.trim() === '') {
            return res.status(400).json({ error: 'Promo code is required' })
        }

        try {
            // Поиск промокода
            const promoRes = await db.query(
                'SELECT id, max_activations, valid_days FROM promo_codes WHERE code = $1',
                [code.trim()]
            )

            if (promoRes.rows.length === 0) {
                return res.status(404).json({ error: 'Promo not found' })
            }

            const promo = promoRes.rows[0]

            // Проверка лимита активаций
            const activationRes = await db.query(
                'SELECT COUNT(*) FROM user_promo_codes WHERE promo_code_id = $1',
                [promo.id]
            )

            const activationCount = parseInt(activationRes.rows[0].count, 10)

            if (activationCount >= promo.max_activations) {
                return res
                    .status(400)
                    .json({ error: 'Promo code usage limit reached' })
            }

            // Проверка: активировал ли пользователь ранее
            const existingRes = await db.query(
                'SELECT 1 FROM user_promo_codes WHERE user_id = $1 AND promo_code_id = $2',
                [user_id, promo.id]
            )

            if (existingRes.rowCount > 0) {
                return res.status(400).json({
                    error: 'You have already activated this promo code',
                })
            }

            // Расчёт срока действия
            const now = new Date()
            const expiresAt = new Date(
                now.getTime() + promo.valid_days * 24 * 60 * 60 * 1000
            )

            // Активация
            await db.query(
                'INSERT INTO user_promo_codes (user_id, promo_code_id, expires_at) VALUES ($1, $2, $3)',
                [user_id, promo.id, expiresAt]
            )

            return res.status(200).json({
                message: 'Promo code activated',
                expires_at: expiresAt.toISOString(),
            })
        } catch (err) {
            console.error('Promo activation error:', err)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }

    async myLastPromo(req, res) {
        const user_id = req.user.userId

        try {
            const now = new Date()
            // Поиск промокода
            const result = await db.query(
                'SELECT * FROM user_promo_codes AS upc JOIN promo_codes pc ON pc.id = upc.promo_code_id WHERE upc.user_id = $1 AND upc.expires_at > $2 AND used = false ORDER BY upc.expires_at DESC LIMIT 1',
                [user_id, now]
            )
            if (result.rows.length === 0) {
                return res
                    .status(404)
                    .json({ error: 'No active promo code found' })
            }

            return res.status(200).json(result.rows[0])
        } catch (err) {
            console.error('Promo activation error:', err)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }
}

module.exports = new promoController()
