const express = require('express')
const router = express.Router()
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')
const buyController = require('../controllers/buyController')

router.use(authMiddleware)

// router.get('/', buyController.infoForBuy)

// Обработка нажатия на кнопку оплатить
router.post('/', buyController.buyOrder)

module.exports = router
