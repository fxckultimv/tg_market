const adminMiddleware = (req, res, next) => {
    const initData = res.locals.initData
    const userId = initData.user.id

    // Массив идентификаторов администраторов
    const adminUserIds = [801541001] // замените значениями id администраторов

    if (!adminUserIds.includes(userId)) {
        return res.status(403).json({ message: 'Forbidden: Access is denied' })
    }

    next()
}

module.exports = adminMiddleware
