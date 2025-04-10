const express = require('express')
const router = express.Router()
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')
const productStatsController = require('../controllers/productStatsController')

//Получение продуктов
router.get('/order', productStatsController.order)

module.exports = router
