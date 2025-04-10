const express = require('express')
const router = express.Router()
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/AdminMiddleware')
const categoriesController = require('../controllers/categoriesController')

// Получение всех категорий
router.get('/', categoriesController.categories)

module.exports = router
