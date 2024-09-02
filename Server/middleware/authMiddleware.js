// authMiddleware.js
require('dotenv').config()
const { validate, parse } = require('@telegram-apps/init-data-node')

const token = process.env.BOT_TOKEN

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization')
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' })
    }

    const [authType, authData] = authHeader.split(' ')

    if (authType !== 'tma' || !authData) {
        return res.status(401).json({ message: 'Invalid authorization format' })
    }

    try {
        validate(authData, token, { expiresIn: 3600 })
        const initData = parse(authData)
        res.locals.initData = initData
        // console.log('Init data ', initData)
        // console.log(initData.user.id)

        next()
    } catch (error) {
        // Обработка ошибок типа unknown
        if (error) {
            console.log(error.message)
            return res
                .status(401)
                .json({ message: 'Invalid init data', error: error.message })
        }
        return res.status(401).json({ message: 'Invalid init data', error })
    }
}

module.exports = authMiddleware