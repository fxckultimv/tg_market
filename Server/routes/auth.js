const express = require('express')
const router = express.Router()
const db = require('../db')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { validate, parse } = require('@telegram-apps/init-data-node')
const { v4: uuidv4 } = require('uuid')
const User = require('../models/User')
const logger = require('../config/logging')

const token = process.env.BOT_TOKEN
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

router.post('/', async (req, res) => {
    const authHeader = req.header('Authorization')
    if (!authHeader) {
        logger.warn('Authorization header missing')
        return res.status(401).json({ message: 'Authorization header missing' })
    }

    const [authType, authData] = authHeader.split(' ')

    if (authType !== 'tma' || !authData) {
        logger.warn('Invalid authorization format')
        return res.status(401).json({ message: 'Invalid authorization format' })
    }

    try {
        validate(authData, token, { expiresIn: 3600 })
        const initData = parse(authData)

        const userId = initData.user.id
        const username = initData.user.username

        // Поиск или создание пользователя
        let result = await db.query('SELECT * FROM users WHERE user_id = $1', [
            userId,
        ])

        let user

        if (result.rows.length === 0) {
            const userUuid = uuidv4()
            const newUser = await db.query(
                'INSERT INTO users (user_id, username, user_uuid) VALUES ($1, $2, $3) RETURNING *',
                [userId, username, userUuid]
            )
            user = newUser.rows[0]
        } else {
            user = result.rows[0]
        }

        const role = user.role

        let id = await User.findOne({ telegramId: userId })
        if (!id) {
            id = new User({
                telegramId: userId,
                username: username,
            })
            await id.save()
            logger.info(`New user created: ${id.telegramId}`)
        } else {
            if (id.username !== username) {
                id.username = username
                await id.save()
                logger.info(`Username updated for user: ${id.telegramId}`)
            }
        }

        // Генерация токенов
        const accessToken = jwt.sign(
            { userId, username, id, role },
            JWT_SECRET,
            {
                expiresIn: '60m',
            }
        )
        const refreshToken = jwt.sign(
            { userId, username, id, role },
            JWT_SECRET,
            {
                expiresIn: '7d',
            }
        )

        // Опции для установки cookies
        const cookiesOptions = {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            path: '/',
        }

        // Устанавливаем токены в cookies
        res.cookie('ACCESS_TOKEN', accessToken, cookiesOptions)
        res.cookie('REFRESH_TOKEN', refreshToken, cookiesOptions)

        res.status(200).json({
            message: 'Авторизация прошла успешно',
            role: role,
        })
    } catch (err) {
        console.error(err)
        res.status(401).json({ error: 'Invalid initData' })
    }
})

module.exports = router
