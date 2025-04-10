const adminMiddleware = (req, res, next) => {
    const role = req.user.role
    if (role != 'admin') {
        return res.status(403).json({ message: 'Доступ запрещен' })
    }

    next()
}

module.exports = adminMiddleware
