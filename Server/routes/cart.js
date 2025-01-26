const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/AuthMiddleware')
const cartController = require('../controllers/cartController')

router.use(authMiddleware)

// Получение всех продуктов
router.get('/', cartController.cart)

// Добавление нового товара в корзину
router.post('/add', cartController.addToCart)

//Удаление конкретного товара из корзины
router.delete('/', cartController.deleteItemCart)

//Удаление даты даты публикации
router.delete('/date-publication', cartController.deleteDateInCartItem)

//Удаление всех товаров из корзины
router.delete('/all', cartController.deleteAllItemsCart)

module.exports = router
