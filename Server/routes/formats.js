const express = require('express')
const router = express.Router()
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/AdminMiddleware')
const formatsController = require('../controllers/formatsController')

// Получение всех категорий
router.get('/', formatsController.formats)

module.exports = router
