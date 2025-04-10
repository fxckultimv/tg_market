const express = require('express')
const router = express.Router()
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/AdminMiddleware')
const productsController = require('../controllers/productsController')
const jwtAuth = require('../middleware/jwtAuth')

router.use(jwtAuth)

//Получение продуктов
router.get('/', productsController.products)

//Получение моих продуктов
router.get('/my', productsController.myProducts)

//Поиск продуктов
router.get('/search', productsController.searchProducts)

//Поиск продуктов
router.get('/user', productsController.userProducts)

//Получение продукта
router.get('/details/:id', productsController.productDetails)

//Просмотр занятых дат
router.get('/busy_day/:id', productsController.busyDayProducts)

// Добавление нового продукта
router.post('/add', productsController.addProduct)

// Редактирование продукта
router.patch('/edit', productsController.editProduct)

//Удаление продукта
router.delete('/', productsController.deleteProduct)

//Постановка на паузу
router.patch('/:id', productsController.pauseProduct)

//Получение продукта
router.get('/:id', productsController.product)

//Подтверждение размещения
router.get('/confirmation/:id', productsController.confirmation)

//Получение похожих товаров
router.post('/similar', productsController.similarProduct)

module.exports = router
