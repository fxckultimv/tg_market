const express = require('express')
const router = express.Router()
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/AdminMiddleware')

// Проверка что пользователь админ для входа в админ панель
router.get('/', adminMiddleware, async (req, res) => {
    try {
        res.json({ isAdmin: true })
    } catch (err) {
        console.error('Попытка входа в админ панель чужака')
        res.json({ isAdmin: false })
    }
})

module.exports = router
