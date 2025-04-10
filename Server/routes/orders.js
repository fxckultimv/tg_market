const express = require('express')
const router = express.Router()
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/AdminMiddleware')
const ordersController = require('../controllers/ordersController')

// Получение моих заказов
router.get('/', ordersController.orders)

router.get('/status/:id', ordersController.orderStatus)

// Покупка всех товаров из корзины
router.post('/buy_all_cart', ordersController.buyAllItems)

// Покупка конкретного товара из корзины
router.post('/buy', ordersController.buyItem)

// Добавление отзыва
router.post('/review', ordersController.addReview)

module.exports = router
