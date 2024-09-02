const express = require('express')
const router = express.Router()
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/AdminMiddleware')
const buyController = require('../controllers/buyController')

router.use(authMiddleware)

// Обработка нажатия на кнопку оплатить
router.post('/', buyController.buy)

module.exports = router
