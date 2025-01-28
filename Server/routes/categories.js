const express = require('express')
const router = express.Router()
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')
const categoriesController = require('../controllers/categoriesController')

router.use(authMiddleware)

// Получение всех категорий
router.get('/', categoriesController.categories)

module.exports = router
