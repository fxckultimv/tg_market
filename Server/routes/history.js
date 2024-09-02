const express = require('express')
const router = express.Router()
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/AdminMiddleware')
const historyController = require('../controllers/historyController')

router.use(authMiddleware)

// Получение истории
router.get('/', historyController.history)

module.exports = router
