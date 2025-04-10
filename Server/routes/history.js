const express = require('express')
const router = express.Router()
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/AdminMiddleware')
const historyController = require('../controllers/historyController')

// Получение истории
router.get('/', historyController.history)

// Получении истории заказа
router.get('/:id', historyController.orderHistory)

module.exports = router
