const express = require('express')
const router = express.Router()
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')
const formatsController = require('../controllers/formatsController')

router.use(authMiddleware)

// Получение всех категорий
router.get('/', formatsController.formats)

module.exports = router
