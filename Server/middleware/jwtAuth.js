const jwt = require('jsonwebtoken')
const db = require('../db')
const { error } = require('winston')

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'

const jwtAuth = async (req, res, next) => {
    const accessToken = req.cookies.ACCESS_TOKEN // Достаем access-токен из cookies
    const refreshToken = req.cookies.REFRESH_TOKEN // Достаем refresh-токен из cookies

    if (!accessToken || !refreshToken) {
        return res.status(401).json({ error: 'Not found cookies' })
    }

    try {
        const payload = jwt.verify(accessToken, JWT_SECRET) // Валидируем access-токен
        res.locals.userData = payload
        req.user = { _id: id, userId, username, role }
        next() // Если токен валиден — отправляем успешный ответ
    } catch {
        try {
            // Валидируем refresh-токен
            const { userId, username, id, role } = jwt.verify(
                refreshToken,
                JWT_SECRET
            )

            // Создаем новые access и refresh токены
            const newAccessToken = jwt.sign(
                { userId, username, id, role },
                JWT_SECRET, // Секрет для access-токена
                { expiresIn: '60m' } // Время жизни токена
            )

            const newRefreshToken = jwt.sign(
                { userId, username, id, role },
                JWT_SECRET, // Секрет для refresh-токена
                { expiresIn: '7d' } // Время жизни токена
            )

            // Опции для установки cookies
            const cookiesOptions = {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                path: '/',
            }

            // Устанавливаем токены в cookies
            res.cookie('ACCESS_TOKEN', newAccessToken, cookiesOptions)
            res.cookie('REFRESH_TOKEN', newRefreshToken, cookiesOptions)

            req.user = { _id: id, userId, username, role }
            next() // Отправляем успешный ответ
        } catch (err) {
            return res.status(401).json({
                message: 'Not found refresh Token',
                error: err.message,
            }) // Ошибка, если refresh-токен недействителен
        }
    }
}

module.exports = jwtAuth
