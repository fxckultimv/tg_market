const express = require('express')
const router = express.Router()
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const adminController = require('../controllers/adminController')

router.use(authMiddleware, adminMiddleware)

//Общая статистика
router.get('/', adminController.stats)

//Получение всех пользователей
router.get('/users', adminController.users)

//Получение конкретного пользователя
router.get('/users/:id', adminController.user)

//Получение продуктов пользователя
router.get('/users/:id/products', adminController.userProducts)

//Получение категорий
router.get('/categories', adminController.categories)

//Добавление категории
router.post('/categories', adminController.addCategories)

//Удаление категории
router.delete('/categories', adminController.deleteCategories)

//Изменение категории
router.patch('/categories', adminController.patchCategories)

//Получение корзины пользователя
router.get('/cart/:id', adminController.cartUser)

//Получение заказов
router.get('/orders', adminController.orders)

//Получение конкретного заказа
router.get('/orders/:id', adminController.order)

//Получение деталей заказа
router.get('/orders/details/:id', adminController.orderDetails)

// Получение заказов пользователя
router.get('/orders/user/:id', adminController.orderUser)

//Удаление продукта
router.delete('/products/:product_id', adminController.deleteProduct)

module.exports = router
