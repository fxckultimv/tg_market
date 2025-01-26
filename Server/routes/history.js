const express = require('express')
const router = express.Router()
const db = require('../db')
const authMiddleware = require('../middleware/AuthMiddleware')
const historyController = require('../controllers/historyController')

router.use(authMiddleware)

// Получение истории
router.get('/', historyController.history)

// Получении истории заказа
router.get('/:id', historyController.orderHistory)

module.exports = router
