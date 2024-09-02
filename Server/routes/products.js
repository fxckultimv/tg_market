const express = require('express')
const router = express.Router()
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/AdminMiddleware')
const productsController = require('../controllers/productsController')

router.use(authMiddleware)

//Получение продуктов
router.get('/', productsController.products)

//Получение продукта
router.get('/:id', productsController.product)

//Получение моих продуктов
router.get('/my', productsController.myProducts)

//Поиск продуктов
router.get('/search', productsController.searchProducts)

//Получение продукта
router.get('/details/:id', productsController.productDetails)

//Просмотр занятых дат
router.get('/busy_day/:id', productsController.busyDayProducts)

// Добавление нового продукта
router.post('/add', productsController.addProduct)

//Удаление продукта
router.delete('/', productsController.deleteProduct)

module.exports = router
