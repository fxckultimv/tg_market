require('dotenv').config()
const { validate, parse } = require('@telegram-apps/init-data-node')
const User = require('../models/User')
// ЭТО ПИЗДЁЖ ЛОГИРОВАНИЯ НЕТ
// ЛОГИРОВАНИЕ НЕ СУЩЕСТВУЕТ
const logger = require('../config/logging')
const fs = require('fs')

const bot_token = fs.readFileSync('/run/secrets/bot_token', 'utf8').trim()

const token = bot_token

const authMiddleware = async (req, res, next) => {
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
        res.locals.initData = initData

        let user = await User.findOne({ telegramId: initData.user.id })
        if (!user) {
            user = new User({
                telegramId: initData.user.id,
                username: initData.user.username,
            })
            await user.save()
            logger.info(`New user created: ${user.telegramId}`)
        } else {
            if (user.username !== initData.user.username) {
                user.username = initData.user.username
                await user.save()
                logger.info(`Username updated for user: ${user.telegramId}`)
            }
        }

        req.user = user
        next()
    } catch (error) {
        logger.error(`Authentication error: ${error.message}`)
        return res
            .status(401)
            .json({ message: 'Invalid init data', error: error.message })
    }
}

module.exports = authMiddleware
