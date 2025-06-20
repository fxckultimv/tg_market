// controllers/webhookController.js
const fs = require('fs')
const { createHash, createHmac, timingSafeEqual } = require('node:crypto')
const db = require('../db')
const logger = require('../config/logging')
const { nanoTonToTon, tonToNanoTon } = require('../utils/tonConversion')
const UserBalance = require('../models/UserBalance')
const Transaction = require('../models/Transaction')
const CRYPTO_PAY_TOKEN = process.env.CRYPTO_PAY_TOKEN
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

// HMAC-ключ = SHA-256( TOKEN )
const HMAC_KEY = createHash('sha256').update(CRYPTO_PAY_TOKEN, 'utf8').digest() // Buffer

class WebHookController {
    async cryptoWebhook(req, res) {
        /* ---------- 1. Проверяем secret из URL ---------- */
        if (req.params.secret !== WEBHOOK_SECRET) {
            return res.sendStatus(404) // чужой запрос
        }
        console.log(req.params)

        /* ---------- 2. Проверяем HMAC-подпись ----------- */
        const signatureHex = req.headers['crypto-pay-api-signature']
        if (!signatureHex) {
            logger.warn('Missing webhook signature')
            return res.sendStatus(401)
        }

        const signature = Buffer.from(signatureHex, 'hex')
        const expectedHmac = createHmac('sha256', HMAC_KEY)
            .update(req.rawBody) // именно «сырое» тело!
            .digest() // Buffer

        if (
            signature.length !== expectedHmac.length ||
            !timingSafeEqual(signature, expectedHmac)
        ) {
            logger.warn('Bad webhook signature')
            return res.sendStatus(401)
        }

        /* ---------- 3. Обрабатываем payload ------------- */
        const update = req.body
        if (update.update_type !== 'invoice_paid') {
            return res.sendStatus(200) // другие типы нам не нужны
        }

        const invoice = update.payload // объект Invoice
        const invoiceId = invoice.invoice_id
        const userId = invoice.payload // вы передавали его в createInvoice
        const amount = parseFloat(invoice.paid_amount) * 0.97 // приходит строкой
        const amountTon = tonToNanoTon(parseFloat(invoice.paid_amount)) * 0.97 // приходит строкой
        const asset = invoice.asset // 'TON'

        let inTxn = false
        try {
            /* ---------- 4. Дедупликация ------------------- */
            const { rowCount } = await db.query(
                'SELECT 1 FROM crypto_bot WHERE invoice_id = $1',
                [invoiceId]
            )
            if (rowCount) {
                return res.sendStatus(200) // уже обработали
            }

            /* ---------- 5. Зачисляем баланс --------------- */
            await db.query('BEGIN')
            inTxn = true

            await db.query(
                'INSERT INTO crypto_bot (invoice_id, user_id, amount, asset) VALUES ($1,$2,$3,$4)',
                [invoiceId, userId, amount, asset]
            )
            console.log('userID: ', userId, 'amount: ', amountTon)
            const userBalance = await UserBalance.findOne({ userId })
            if (!userBalance) {
                return res
                    .status(404)
                    .json({ error: 'Баланс пользователя не найден' })
            }

            const success = await userBalance.addBalance(parseFloat(amount))
            if (!success) {
                return res
                    .status(500)
                    .json({ error: 'Не удалось обновить баланс' })
            }

            await db.query('COMMIT')
            inTxn = false

            return res.sendStatus(200) // Crypto Pay считает любой 2xx успехом
        } catch (err) {
            if (inTxn) await db.query('ROLLBACK')
            logger.error('Webhook error', { err })
            return res.sendStatus(500) // бот перешлёт ещё раз
        }
    }
}

module.exports = new WebHookController()
