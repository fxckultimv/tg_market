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
    const userUuid = uuidv4()
    const initData = res.locals.initData

    // Создание и подписание данных
    const signedData = sign(
        {
            canSendAfter: 10000,
            chat: {
                id: 1,
                type: 'group',
                username: 'my-chat',
                title: 'chat-title',
                photoUrl: 'chat-photo',
            },
            chatInstance: '888',
            chatType: 'sender',
            queryId: 'QUERY',
            receiver: {
                addedToAttachmentMenu: false,
                allowsWriteToPm: true,
                firstName: 'receiver-first-name',
                id: 991,
                isBot: false,
                isPremium: true,
                languageCode: 'ru',
                lastName: 'receiver-last-name',
                photoUrl: 'receiver-photo',
                username: 'receiver-username',
            },
            startParam: 'debug',
            user: {
                addedToAttachmentMenu: false,
                allowsWriteToPm: false,
                firstName: 'user-first-name',
                id: 222,
                isBot: true,
                isPremium: false,
                languageCode: 'en',
                lastName: 'user-last-name',
                photoUrl: 'user-photo',
                username: 'user-username',
            },
        },
        token,
        new Date(1000) // Здесь можно использовать любую дату, в данном случае это пример
    )

    // console.log('Signed Init Data:', signedData)
    const user_id = initData.user.id
    const user_name = initData.user.firstName

    try {
        const result = await db.query(
            'INSERT INTO users (user_id, username, user_uuid) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO NOTHING RETURNING *',
            [user_id, user_name, userUuid]
        )
        if (result.rows.length > 0) {
            // Новый пользователь добавлен
            res.status(201).json({
                message: 'User added successfully',
                user: result.rows[0],
            })
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
