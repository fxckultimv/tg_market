const express = require('express')
const router = express.Router()
const db = require('../db')
const authMiddleware = require('../middleware/AuthMiddleware')
const productStatsController = require('../controllers/productStatsController')

router.use(authMiddleware)

//Получение продуктов
router.get('/order', productStatsController.order)

module.exports = router
