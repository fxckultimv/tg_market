const db = require('../db')

class ReferralController {
    async referral(req, res) {
        const user_id = req.user.userId

        try {
            // 1) Определяем количество рефералов (достаточно только count, а не все поля)
            const referralsResult = await db.query(
                `SELECT COUNT(*) as total
                   FROM referrals
                  WHERE referrer_id = $1`,
                [user_id]
            )

            const countReferral =
                parseInt(referralsResult.rows[0].total, 10) || 0

            // Если нет рефералов, возвращаем 404 (или можно вернуть 200 c count=0)
            if (countReferral === 0) {
                return res.status(200).json({
                    message: 'Referrer not found',
                    countReferral: 0,
                    turnover: 0,
                    payments: [],
                })
            }

            // 2) Суммарный "оборот" (сумма partner_commission)
            const turnoverResult = await db.query(
                `SELECT COALESCE(SUM(partner_commission), 0) AS total_sum
                   FROM referral_commissions
                  WHERE referrer_id = $1`,
                [user_id]
            )
            const turnover = parseFloat(turnoverResult.rows[0].total_sum) || 0

            // 3) Список всех выплат (добавляем поле id, если оно нужно)
            const paymentsResult = await db.query(
                `SELECT  partner_commission, created_at
                   FROM referral_commissions
                  WHERE referrer_id = $1`,
                [user_id]
            )
            const payments = paymentsResult.rows.map((payment, index) => ({
                id: index + 1, // безопасный порядковый номер, начиная с 1
                partner_commission: payment.partner_commission,
                created_at: payment.created_at,
            }))

            // Формируем общий ответ
            res.status(200).json({
                countReferral, // кол-во рефералов
                turnover, // суммарный оборот
                payments, // список выплат
            })
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: 'Database error' })
        }
    }
}

module.exports = new ReferralController()
