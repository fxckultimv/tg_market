const express = require('express')
const router = express.Router()
const db = require('../db')
require('dotenv').config()
const { validate, sign, parse } = require('@telegram-apps/init-data-node')
const authMiddleware = require('../middleware/authMiddleware')
const { v4: uuidv4 } = require('uuid')

const token = process.env.BOT_TOKEN

router.use(authMiddleware)

router.get('/', async (req, res) => {
    const initData = res.locals.initData
    const user_id = initData.user.id
    const user_name = initData.user.firstName

    try {
        const result = await db.query(
            'SELECT user_id FROM users WHERE user_id = $1',
            [user_id]
        )
        if (result.rows.length === 0) {
            try {
                const userUuid = uuidv4()
                const addUser = await db.query(
                    'INSERT INTO users (user_id, username, user_uuid) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO NOTHING RETURNING *',
                    [user_id, user_name, userUuid]
                )
                if (addUser.rows.length > 0) {
                    // Новый пользователь добавлен
                    res.status(201).json({
                        message: 'User added successfully',
                        user: result.addUser[0],
                    })
                }
            } catch (err) {
                console.error(err)
                res.status(404).json({ error: 'Add user error' })
            }
        } else {
            // Пользователь уже существует
            res.status(200).json({ message: 'User already exists' })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error' })
    }
})

module.exports = router
